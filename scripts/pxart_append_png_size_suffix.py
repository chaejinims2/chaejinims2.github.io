#!/usr/bin/env python3
"""
PNG 파일명에 크기 접미사 _<H>x<W>를 붙입니다.

예:
  hats.png (480x323) -> hats_323x480.png

기본은 드라이런이며, --apply 를 주면 실제로 이름을 변경합니다.

사용:
  python3 scripts/pxart_append_png_size_suffix.py [file1.png file2.png ...]
  python3 scripts/pxart_append_png_size_suffix.py --apply [file...]
  python3 scripts/pxart_append_png_size_suffix.py --apply --dir path/to/dir

--dir 를 주면 해당 폴더의 *.png 전체에 적용합니다(파일 인자 없이).
"""

from __future__ import annotations

import argparse
import struct
import sys
from pathlib import Path


def png_size(p: Path) -> tuple[int, int]:
    with p.open("rb") as f:
        sig = f.read(8)
        if sig != b"\x89PNG\r\n\x1a\n":
            raise ValueError("not a PNG")
        while True:
            lb = f.read(4)
            if not lb:
                raise ValueError("IHDR not found")
            (ln,) = struct.unpack(">I", lb)
            ctype = f.read(4)
            data = f.read(ln)
            f.read(4)  # crc
            if ctype == b"IHDR":
                w, h = struct.unpack(">II", data[:8])
                return int(w), int(h)


def with_suffix_name(p: Path, w: int, h: int) -> Path:
    if p.suffix.lower() != ".png":
        return p
    stem = p.stem
    size_tag = f"{h}x{w}"
    if stem.endswith(f"_{size_tag}"):
        return p
    return p.with_name(f"{stem}_{size_tag}{p.suffix}")


def main() -> int:
    ap = argparse.ArgumentParser(description="Append _HxW suffix to PNG filenames")
    ap.add_argument("--apply", action="store_true", help="actually rename files")
    ap.add_argument("--dir", type=Path, default=None, help="apply to all *.png in directory")
    ap.add_argument("files", nargs="*", type=Path, help="png files to rename")
    args = ap.parse_args()

    targets: list[Path] = []
    if args.dir is not None:
        d = args.dir.resolve()
        if not d.is_dir():
            print(f"directory not found: {d}", file=sys.stderr)
            return 1
        targets = sorted([p for p in d.iterdir() if p.is_file() and p.suffix.lower() == ".png"])
    else:
        targets = [p.resolve() for p in args.files]

    if not targets:
        print("no targets (pass files or --dir)", file=sys.stderr)
        return 1

    used = {p.name for p in targets}
    skipped = 0
    for p in targets:
        if not p.exists():
            print(f"skip (missing): {p}", file=sys.stderr)
            skipped += 1
            continue
        try:
            w, h = png_size(p)
        except Exception as e:
            print(f"skip (not png/invalid): {p} ({e})", file=sys.stderr)
            skipped += 1
            continue

        to = with_suffix_name(p, w, h)
        if to == p:
            print(f"· {p.name} (already)")
            continue
        if to.exists() and to.name != p.name:
            print(f"skip (target exists): {p.name} -> {to.name}", file=sys.stderr)
            skipped += 1
            continue

        if args.apply:
            p.rename(to)
            used.discard(p.name)
            used.add(to.name)
            print(f"✓ {p.name}\n  -> {to.name}")
        else:
            print(f"· {p.name}\n  -> {to.name}")

    if not args.apply:
        print("\n(dry-run) add --apply to rename.")
    if skipped:
        print(f"skipped: {skipped}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

