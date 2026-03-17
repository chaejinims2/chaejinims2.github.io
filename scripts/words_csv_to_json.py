#!/usr/bin/env python3
"""
words.csv(word 단일 컬럼) → words-only.json(문자열 배열) 변환

입력: _data/cvoca/words.csv
출력: (기본) 입력 파일과 같은 폴더의 words-only.json

사용법:
  python3 scripts/words_csv_to_json.py [csv_path] [out_json_path]
"""

import csv
import json
import sys
from pathlib import Path


def main() -> int:
    base = Path(__file__).parent.parent  # chaejinims2.github.io
    csv_path = Path(sys.argv[1]) if len(sys.argv) > 1 else base / "_data" / "cvoca" / "words.csv"
    out_path = Path(sys.argv[2]) if len(sys.argv) > 2 else csv_path.parent / "words-only.json"

    if not csv_path.exists():
        print(f"Error: {csv_path} not found")
        return 1

    words: list[str] = []
    with open(csv_path, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames or "word" not in reader.fieldnames:
            print(f"Error: expected a 'word' column. got columns={reader.fieldnames}")
            return 1
        for row in reader:
            w = (row.get("word") or "").strip()
            if w:
                words.append(w)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(words)} words to {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

