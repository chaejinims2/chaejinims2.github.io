#!/usr/bin/env python3
"""
pxart-creator용 64×128 목업 스프라이트 시트 생성 (16×32 셀, 4열×4행 = 방향×프레임).

출력: assets/labs/pxart-creator/assets/{body,hair,shirt,hat}/{name}_01.png, _02.png

  pip install -r scripts/requirements-sprites.txt
  python3 scripts/pxart_generate_placeholder_sheets.py
"""

from __future__ import annotations

import colorsys
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError:
    print("Pillow 필요: pip install -r scripts/requirements-sprites.txt", file=sys.stderr)
    raise SystemExit(1) from None

ROOT = Path(__file__).resolve().parent.parent / "assets" / "labs" / "pxart-creator" / "assets"
FRAME_W, FRAME_H = 16, 32
COLS, ROWS = 4, 4
SHEET_W, SHEET_H = FRAME_W * COLS, FRAME_H * ROWS

# (layer, variant) -> base hue; each cell gets slight variation
SPECS: list[tuple[str, str, int]] = [
    ("body", "01", 200),
    ("body", "02", 40),
    ("hair", "01", 280),
    ("hair", "02", 320),
    ("shirt", "01", 120),
    ("shirt", "02", 160),
    ("hat", "01", 10),
    ("hat", "02", 350),
]


def cell_color(hue: int, frame: int, direction: int, alpha: int) -> tuple[int, int, int, int]:
    f = (frame + direction * 2) / 20.0
    r, g, b = colorsys.hsv_to_rgb((hue / 360.0 + f) % 1.0, 0.55, 0.85)
    return (int(r * 255), int(g * 255), int(b * 255), alpha)


def make_sheet(folder: str, variant: str, hue: int) -> None:
    im = Image.new("RGBA", (SHEET_W, SHEET_H), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    for row in range(ROWS):
        for col in range(COLS):
            x0, y0 = col * FRAME_W, row * FRAME_H
            rgba = cell_color(hue, col, row, 220)
            dr.rectangle([x0, y0, x0 + FRAME_W - 1, y0 + FRAME_H - 1], fill=rgba, outline=(255, 255, 255, 80))
            # small marker dot for direction corner
            dr.rectangle([x0 + 2, y0 + 2, x0 + 5, y0 + 5], fill=(255, 255, 255, 200))
    out_dir = ROOT / folder
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{folder}_{variant}.png"
    im.save(out_path, format="PNG")
    print(out_path)


def main() -> int:
    for folder, variant, hue in SPECS:
        make_sheet(folder, variant, hue)
    print("done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
