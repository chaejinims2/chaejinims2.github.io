#!/usr/bin/env python3
"""
assets/images/stardew 아래 파일명에서
1) `PC _ Computer - Stardew Valley - <카테고리> - ` 접두사를 제거하고
2) 이름(확장자 앞)에 있는 공백·연속 공백을 `-` 로 바꿉니다.

접두사가 없어도 공백이 있으면 2)만 적용됩니다.

사용:
  python3 scripts/stardew_rename_remove_prefix.py           (드라이런)
  python3 scripts/stardew_rename_remove_prefix.py --apply   (실제 이름 변경)

다른 디렉터리:
  python3 scripts/stardew_rename_remove_prefix.py --apply path/to/dir
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

# The Games Database / ripping convention used by these exports
PREFIX_RE = re.compile(
    r"^PC _ Computer - Stardew Valley - "
    r"(?:Miscellaneous|Non-Playable Characters|Playable Characters|Tilesets) - "
)


def default_target_dir() -> Path:
    return Path(__file__).resolve().parent.parent / "assets" / "images" / "stardew"


def compute_target_name(filename: str) -> str:
    base = PREFIX_RE.sub("", filename) if PREFIX_RE.match(filename) else filename
    p = Path(base)
    stem, suffix = p.stem, p.suffix
    # 평면 디렉터리만 처리 (이름에 구분자가 있으면 그대로 반환)
    if p.name != base or str(p) != base:
        return filename
    stem_hyphens = re.sub(r"\s+", "-", stem)
    return f"{stem_hyphens}{suffix}"


def main() -> int:
    parser = argparse.ArgumentParser(description="Stardew 리핑 파일명 접두사 제거 및 공백→하이픈")
    parser.add_argument(
        "directory",
        nargs="?",
        default=None,
        help=f"대상 폴더 (기본: {default_target_dir()})",
    )
    parser.add_argument("--apply", action="store_true", help="실제로 이름 변경 (없으면 드라이런)")
    args = parser.parse_args()

    target_dir = Path(args.directory).resolve() if args.directory else default_target_dir()

    if not target_dir.is_dir():
        print(f"디렉터리가 없습니다: {target_dir}", file=sys.stderr)
        return 1

    entries = list(target_dir.iterdir())
    pairs: list[tuple[str, str]] = []
    for ent in entries:
        if not ent.is_file():
            continue
        name = ent.name
        to_name = compute_target_name(name)
        if not to_name or to_name == name:
            continue
        pairs.append((name, to_name))

    if not pairs:
        print(f"변경할 파일이 없습니다: {target_dir}")
        return 0

    used = {e.name for e in entries if e.is_file()}
    skipped = 0
    mark = "✓" if args.apply else "·"

    for from_name, to_name in pairs:
        from_path = target_dir / from_name
        to_path = target_dir / to_name

        if to_name in used and to_name != from_name:
            print(f'건너뜀 (대상 이름 이미 존재): "{from_name}" → "{to_name}"', file=sys.stderr)
            skipped += 1
            continue

        if args.apply:
            from_path.rename(to_path)
            used.discard(from_name)
            used.add(to_name)

        print(f'{mark} "{from_name}"\n  → "{to_name}"')

    if not args.apply:
        print(f"\n총 {len(pairs)}개 (건너뜀 {skipped}개). 적용하려면 --apply 를 붙이세요.")
    else:
        print(f"\n완료: {len(pairs) - skipped}개 이름 변경, 건너뜀 {skipped}개")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
