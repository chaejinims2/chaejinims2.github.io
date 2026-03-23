#!/usr/bin/env python3
"""
admin/config.yml의 pages.files 목록을 저장소 현재 상태에 맞게 재생성한다.

  python3 script/generate_admin_config.py           # admin/config.yml 덮어쓰기
  python3 script/generate_admin_config.py --stdout  # 결과만 출력
  python3 script/generate_admin_config.py --dry-run # 쓰기 없이 요약만

의존성: PyYAML (pip install pyyaml)
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def _repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def discover_layouts(layouts_dir: Path) -> list[str]:
    out: list[str] = []
    if not layouts_dir.is_dir():
        return out
    for p in layouts_dir.rglob("*.html"):
        rel = p.relative_to(layouts_dir).with_suffix("")
        out.append(str(rel).replace("\\", "/"))
    return sorted(out)


def segment_label(seg: str) -> str:
    if seg in ("lm11", "lnkn", "cvoca"):
        return seg.upper()
    return seg.replace("-", " ").title()


def path_to_label(rel: Path) -> str:
    """_pages/home/about/index.md -> Home › About"""
    parts = rel.parts
    if parts[0] != "_pages":
        return rel.as_posix()
    segs = [p for p in parts[1:-1] if p != "index.md"]
    if not segs:
        return rel.as_posix()
    return " › ".join(segment_label(s) for s in segs)


def path_to_name(rel: Path) -> str:
    """_pages/cases/foo/index.md -> cases-foo"""
    parts = rel.parts
    segs = [p for p in parts[1:-1] if p != "index.md"]
    return "-".join(segs) if segs else "index"


def fm_lines(md: Path) -> list[str]:
    text = md.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return []
    end = text.find("\n---", 3)
    if end == -1:
        return []
    return text[3:end].strip().splitlines()


def parse_simple_fm(md: Path) -> dict[str, str]:
    """최소 키:만 추출 (중첩 YAML 없음 가정)."""
    out: dict[str, str] = {}
    for line in fm_lines(md):
        if ":" not in line or line.strip().startswith("#"):
            continue
        key, _, rest = line.partition(":")
        key = key.strip()
        val = rest.strip().strip('"').strip("'")
        if key and val:
            out[key] = val
    return out


def is_section_index(rel: Path) -> bool:
    """_pages/foo/index.md (한 단계만)"""
    parts = rel.parts
    return (
        len(parts) == 3
        and parts[0] == "_pages"
        and parts[2] == "index.md"
    )


def classify_file(rel: Path) -> str:
    p = rel.as_posix()
    if p in ("_pages/startup/index.md", "_pages/cherry/index.md"):
        return "startup"
    if is_section_index(rel):
        if p == "_pages/settings/index.md":
            return "settings_index"
        return "section_index"
    if p.startswith("_pages/tests/") and p != "_pages/tests/index.md":
        return "tests_leaf"
    return "simple_page"


# --- 필드 빌더 (Decap CMS YAML 구조) ---


def field_string(label: str, name: str, *, required: bool = True) -> dict:
    return {"label": label, "name": name, "widget": "string", "required": required}


def field_optional_string(label: str, name: str) -> dict:
    """Permalink / Lead 등 — 기존 config와 같이 widget: string."""
    return {"label": label, "name": name, "widget": "string", "required": False}


def field_bool(label: str, name: str, default: bool) -> dict:
    return {"label": label, "name": name, "widget": "boolean", "default": default, "required": False}


def field_markdown() -> dict:
    return {"label": "Body", "name": "body", "widget": "markdown"}


def field_layout(layouts: list[str], default: str) -> dict:
    if default not in layouts:
        default = layouts[0] if layouts else "page"
    return {
        "label": "Layout",
        "name": "layout",
        "widget": "select",
        "options": layouts,
        "default": default,
    }


def field_layout_fixed(options: list[str], default: str) -> dict:
    """startup/cherry: 기존처럼 page / section / startup 만."""
    if default not in options:
        default = options[0] if options else "startup"
    return {
        "label": "Layout",
        "name": "layout",
        "widget": "select",
        "options": options,
        "default": default,
    }


def field_type_sidebar(default: str = "sidebar") -> dict:
    return {
        "label": "Type",
        "name": "type",
        "widget": "select",
        "options": [
            {"label": "Sidebar", "value": "sidebar"},
            {"label": "Topbar", "value": "topbar"},
            {"label": "Sidebar (footer)", "value": "sidebar_footer"},
        ],
        "default": default,
    }


def build_fields(profile: str, layouts: list[str], rel: Path) -> list[dict]:
    fm = parse_simple_fm(_repo_root() / rel)
    layout_default = fm.get("layout", "page")

    if profile == "startup":
        lo = ["page", "section", "startup"]
        def_l = layout_default if layout_default in lo else "startup"
        return [
            field_layout_fixed(lo, def_l),
            {"label": "Title", "name": "title", "widget": "string"},
            field_optional_string("Permalink", "permalink"),
            field_optional_string("Lead", "lead"),
            field_optional_string("Icon", "icon"),
            field_optional_string("Type", "type"),
            field_markdown(),
        ]

    if profile == "section_index":
        lo = [x for x in ["page", "section", "sections/techs", "sections/settings"] if x in layouts]
        rest = [x for x in layouts if x not in lo]
        opts = lo + rest
        return [
            field_layout(opts, layout_default if layout_default in opts else "section"),
            field_string("Title", "title", required=False),
            field_optional_string("Permalink", "permalink"),
            field_string("Icon", "icon", required=False),
            field_type_sidebar("sidebar"),
            field_markdown(),
        ]

    if profile == "settings_index":
        lo = [x for x in ["page", "section", "sections/settings"] if x in layouts]
        rest = [x for x in layouts if x not in lo]
        opts = lo + rest
        return [
            field_layout(opts, layout_default if layout_default in opts else "section"),
            field_string("Title", "title", required=False),
            field_optional_string("Permalink", "permalink"),
            field_string("Icon", "icon", required=False),
            field_type_sidebar("topbar"),
            field_bool("Hide", "hide", True),
            field_markdown(),
        ]

    if profile == "tests_leaf":
        opts = layouts[:] if layouts else ["page"]
        fields: list[dict] = [
            field_layout(opts, layout_default),
            field_string("Title", "title", required=False),
            field_optional_string("Permalink", "permalink"),
            field_string("Data", "data", required=False),
            field_string("Dataset", "dataset", required=False),
            field_markdown(),
        ]
        return fields

    # simple_page
    opts = layouts[:] if layouts else ["page"]
    return [
        field_layout(opts, layout_default),
        field_string("Title", "title", required=False),
        field_markdown(),
    ]


LABEL_OVERRIDE: dict[str, str] = {
    "_pages/startup/index.md": "Startup (랜딩)",
    "_pages/cherry/index.md": "Cherry",
    "_pages/op-soures/index.md": "Opensource Projects",
    "_pages/cases/nvme-mi-basic/index.md": "Cases › NVMe-MI Basic",
    "_pages/cases/nvme-spf-mpf/index.md": "Cases › NVMe SPF/MPF",
    "_pages/cases/wpf-img-3d-simulator/index.md": "Cases › WPF Img 3D Simulator",
    "_pages/cases/wpf-to-webapp/index.md": "Cases › WPF to WebApp",
}


def collect_index_files(pages_dir: Path) -> list[Path]:
    files = sorted(pages_dir.glob("**/index.md"))
    return [f.relative_to(pages_dir.parent) for f in files]


def build_posts_collection() -> dict:
    return {
        "name": "posts",
        "label": "Posts",
        "folder": "_posts",
        "create": True,
        "slug": "{{year}}-{{month}}-{{day}}-{{slug}}",
        "fields": [
            {"label": "Title", "name": "title", "widget": "string"},
            {"label": "Date", "name": "date", "widget": "datetime"},
            {
                "label": "Section",
                "name": "section",
                "widget": "select",
                "options": [
                    {"label": "Techs", "value": "techs"},
                    {"label": "표시 안 함", "value": ""},
                ],
                "default": "",
                "required": False,
            },
            {"label": "Categories", "name": "categories", "widget": "list", "required": False},
            {"label": "Tags", "name": "tags", "widget": "list", "required": False},
            {"label": "Body", "name": "body", "widget": "markdown"},
        ],
    }


def build_config(root: Path) -> dict:
    layouts = discover_layouts(root / "_layouts")
    index_files = collect_index_files(root / "_pages")

    files: list[dict] = []
    for rel in index_files:
        posix = rel.as_posix()
        profile = classify_file(rel)
        name = path_to_name(rel)
        label = LABEL_OVERRIDE.get(posix, path_to_label(rel))
        files.append(
            {
                "file": posix,
                "name": name,
                "label": label,
                "fields": build_fields(profile, layouts, rel),
            }
        )

    return {
        "backend": {"name": "git-gateway", "branch": "main"},
        "publish_mode": "editorial_workflow",
        "media_folder": "assets/uploads",
        "public_folder": "/assets/uploads",
        "collections": [build_posts_collection(), {"name": "pages", "label": "Pages", "files": files}],
    }


def _yaml_quote_string(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def _flow_value(val: object) -> str:
    """flow mapping / sequence 안에서 값만 직렬화 (문자열은 항상 쌍따옴표)."""
    if isinstance(val, bool):
        return "true" if val else "false"
    if isinstance(val, str):
        return _yaml_quote_string(val)
    if isinstance(val, (int, float)) and not isinstance(val, bool):
        return str(val)
    if isinstance(val, list):
        return "[" + ", ".join(_flow_value(x) for x in val) + "]"
    if isinstance(val, dict):
        inner = ", ".join(f"{k}: {_flow_value(v)}" for k, v in val.items())
        return "{ " + inner + " }"
    return str(val)


def _flow_mapping(field: dict) -> str:
    """단일 필드 정의: 키는 따옴표 없음, 값(문자열·중첩)은 쌍따옴표 규칙 적용."""
    inner = ", ".join(f"{k}: {_flow_value(v)}" for k, v in field.items())
    return "{ " + inner + " }"


def _fields_to_lines(fields: list[dict], indent_spaces: int) -> list[str]:
    pad = " " * indent_spaces
    return [f"{pad}- {_flow_mapping(f)}" for f in fields]


def dump_yaml(data: dict) -> str:
    """backend / collections 전체를 출력. fields 는 `- { ... }` flow 스타일 유지."""
    posts = data["collections"][0]
    pages = data["collections"][1]

    header = (
        "# 이 파일은 script/generate_admin_config.py 로 생성했습니다.\n"
        "# pages.files 목록을 바꾸려면 스크립트의 프로필/라벨을 수정한 뒤 다시 실행하세요.\n"
    )
    lines: list[str] = [header.rstrip(), ""]
    b = data["backend"]
    lines.append("backend:")
    lines.append(f"  name: {b['name']}")
    lines.append(f"  branch: {b['branch']}")
    lines.append("")
    lines.append(f"publish_mode: {data['publish_mode']}")
    lines.append("")
    lines.append(f'media_folder: "{data["media_folder"]}"')
    lines.append(f'public_folder: "{data["public_folder"]}"')
    lines.append("")
    lines.append("collections:")
    # --- posts ---
    lines.append('  - name: "posts"')
    lines.append('    label: "Posts"')
    lines.append('    folder: "_posts"')
    lines.append("    create: true")
    lines.append("    slug: '{{year}}-{{month}}-{{day}}-{{slug}}'")
    lines.append("    fields:")
    lines.extend(_fields_to_lines(posts["fields"], indent_spaces=6))
    # --- pages ---
    lines.append('  - name: "pages"')
    lines.append('    label: "Pages"')
    lines.append("    files:")
    for ent in pages["files"]:
        fp = ent["file"]
        if not (fp.startswith('"') and fp.endswith('"')):
            fp = '"' + fp.replace('"', '\\"') + '"'
        lines.append(f"      - file: {fp}")
        lines.append(f'        name: "{ent["name"]}"')
        lab = str(ent["label"]).replace('"', '\\"')
        lines.append(f'        label: "{lab}"')
        lines.append("        fields:")
        lines.extend(_fields_to_lines(ent["fields"], indent_spaces=10))
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    ap = argparse.ArgumentParser(description="admin/config.yml 동기화")
    ap.add_argument("--stdout", action="store_true", help="파일 대신 표준 출력")
    ap.add_argument("--dry-run", action="store_true", help="생성할 파일 수만 출력")
    args = ap.parse_args()
    root = _repo_root()
    data = build_config(root)
    files = data["collections"][1]["files"]
    if args.dry_run:
        print(f"_pages/**/index.md → {len(files)}개 엔트리")
        for f in files:
            print(f"  - {f['file']}")
        return
    out = dump_yaml(data)
    if args.stdout:
        print(out, end="")
        return
    out_path = root / "admin" / "config.yml"
    out_path.write_text(out, encoding="utf-8")
    print(f"Wrote {out_path} ({len(files)} page entries)")


if __name__ == "__main__":
    main()
