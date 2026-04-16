#!/usr/bin/env python3
"""
스프라이트 시트 PNG를 격자(또는 한 줄 스트립)로 잘라 단일 프레임 PNG로 저장합니다.

기본 입력: assets/images/stardew/Book-Animation.png (1024×64 → 64×64 프레임 16장 가로)

사용:
  python3 scripts/sprite_sheet_slice.py --dry-run
  python3 scripts/sprite_sheet_slice.py

다른 시트:
  python3 scripts/sprite_sheet_slice.py path/to/sheet.png -o out/dir --cell 32

의존성:
  pip install -r scripts/requirements-sprites.txt
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print(
        "Pillow가 필요합니다: pip install -r scripts/requirements-sprites.txt",
        file=sys.stderr,
    )
    raise SystemExit(1) from None


def default_input_path() -> Path:
    return (
        Path(__file__).resolve().parent.parent
        / "assets"
        / "images"
        / "stardew"
        / "Book-Animation.png"
    )


def slug_filename(s: str) -> str:
    s = re.sub(r"\s+", "-", s.strip())
    s = re.sub(r"[^a-zA-Z0-9._-]+", "", s)
    return s or "frame"


def infer_strip_grid(w: int, h: int) -> tuple[int, int, int, int] | None:
    """
    한 줄(또는 한 열) 정사각형 셀 가정.
    가로 스트립: 높이 H인 정사각형 H×H, 열 수 = W // H (W % H == 0).
    세로 스트립: 너비 W인 정사각형 W×W, 행 수 = H // W (H % W == 0).
    반환: (frame_w, frame_h, cols, rows) 또는 불가 시 None.
    """
    if w >= h and h > 0 and w % h == 0:
        n = w // h
        if n >= 1:
            return h, h, n, 1
    if h > w and w > 0 and h % w == 0:
        n = h // w
        if n >= 1:
            return w, w, 1, n
    return None


def main() -> int:
    p = argparse.ArgumentParser(description="스프라이트 시트를 단일 이미지로 분할 저장")
    p.add_argument(
        "image",
        nargs="?",
        default=None,
        help=f"입력 PNG (기본: {default_input_path()})",
    )
    p.add_argument(
        "-o",
        "--out-dir",
        default=None,
        help="출력 폴더 (기본: 입력 파일과 같은 디렉터리에 <이름>-frames/)",
    )
    p.add_argument(
        "--cell",
        type=int,
        default=None,
        metavar="N",
        help="정사각형 셀 한 변 길이 N (지정 시 cols·rows는 이미지 크기로부터 계산)",
    )
    p.add_argument("--frame-width", type=int, default=None)
    p.add_argument("--frame-height", type=int, default=None)
    p.add_argument("--cols", type=int, default=None)
    p.add_argument("--rows", type=int, default=None)
    p.add_argument(
        "--auto-strip",
        action="store_true",
        help="한 줄/한 열 정사각형 스트립으로 자동 추론 (W%%H==0 또는 H%%W==0)",
    )
    p.add_argument(
        "--prefix",
        default="frame",
        help="저장 파일명 접두사 (기본: frame → frame_0000.png)",
    )
    p.add_argument(
        "--dry-run",
        action="store_true",
        help="파일을 쓰지 않고 잘라낼 영역만 출력",
    )
    args = p.parse_args()

    in_path = Path(args.image).resolve() if args.image else default_input_path()
    if not in_path.is_file():
        print(f"입력 파일이 없습니다: {in_path}", file=sys.stderr)
        return 1

    im = Image.open(in_path).convert("RGBA")
    W, H = im.size

    fw = fh = cols = rows = None

    if args.cell is not None:
        fw = fh = args.cell
        if W % fw or H % fh:
            print(
                f"셀 {fw}×{fh}이 이미지 {W}×{H}에 딱 맞지 않습니다.",
                file=sys.stderr,
            )
            return 1
        cols, rows = W // fw, H // fh
    elif args.frame_width and args.frame_height and args.cols and args.rows:
        fw, fh, cols, rows = args.frame_width, args.frame_height, args.cols, args.rows
        if cols * fw != W or rows * fh != H:
            print(
                f"cols*frame_width({cols}*{fw})={cols*fw}, rows*frame_height({rows}*{fh})={rows*fh} "
                f"가 이미지 {W}×{H}와 일치하지 않습니다.",
                file=sys.stderr,
            )
            return 1
    elif args.auto_strip or (not args.frame_width and not args.cell):
        inferred = infer_strip_grid(W, H)
        if inferred is None:
            print(
                "자동 스트립 추론 실패입니다. --cell N 또는 "
                "--frame-width --frame-height --cols --rows 를 지정하세요.",
                file=sys.stderr,
            )
            return 1
        fw, fh, cols, rows = inferred
        print(
            f"자동 스트립: {W}×{H} → 셀 {fw}×{fh}, 격자 {cols}×{rows}",
            file=sys.stderr,
        )
    else:
        print(
            "인자 조합이 부족합니다. --cell N, 또는 네 개 모두 "
            "(frame-width, frame-height, cols, rows), 또는 --auto-strip",
            file=sys.stderr,
        )
        return 1

    assert fw is not None and fh is not None and cols and rows

    out_dir = (
        Path(args.out_dir).resolve()
        if args.out_dir
        else in_path.parent / f"{slug_filename(in_path.stem)}-frames"
    )
    prefix = slug_filename(args.prefix)

    if not args.dry_run:
        out_dir.mkdir(parents=True, exist_ok=True)

    idx = 0
    for r in range(rows):
        for c in range(cols):
            x0, y0 = c * fw, r * fh
            box = (x0, y0, x0 + fw, y0 + fh)
            tile = im.crop(box)
            name = f"{prefix}_{idx:04d}.png"
            out_path = out_dir / name
            if args.dry_run:
                print(f"{name}  crop{box}")
            else:
                tile.save(out_path, format="PNG")
                print(f"wrote {out_path}")
            idx += 1

    if args.dry_run:
        print(f"\n(드라이런) 총 {idx}장 → 대상 폴더: {out_dir}", file=sys.stderr)
    else:
        print(f"\n완료: {idx}장 저장 → {out_dir}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
