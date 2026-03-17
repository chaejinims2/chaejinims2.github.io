#!/usr/bin/env python3
"""
words.csv(word 단일 컬럼) → voca-sample.json 형태(JSON)로 변환

입력 예:
  _data/cvoca/words.csv

출력 예(기본):
  _data/cvoca/voca.json

출력 스키마(템플릿: _data/template/voca-sample.json):
{
  "book_id": "...",
  "title": "...",
  "words": [
    { "term": "avert", "entries": [] },
    ...
  ]
}

사용법:
  python3 scripts/words_csv_to_voca_sample_json.py [csv_path] [out_json_path] [book_id] [title]
"""

import csv
import json
import sys
from pathlib import Path


def main() -> int:
    base = Path(__file__).parent.parent  # /.../chaejinims2.github.io
    csv_path = Path(sys.argv[1]) if len(sys.argv) > 1 else base / "_data" / "cvoca" / "words.csv"
    out_path = Path(sys.argv[2]) if len(sys.argv) > 2 else csv_path.parent / "voca.json"
    book_id = sys.argv[3] if len(sys.argv) > 3 else "IELTS_VOCA_20_30"
    title = sys.argv[4] if len(sys.argv) > 4 else "IELTS 영어 단어장"

    if not csv_path.exists():
        print(f"Error: {csv_path} not found")
        return 1

    terms: list[str] = []
    with open(csv_path, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames or "word" not in reader.fieldnames:
            print(f"Error: expected a 'word' column. got columns={reader.fieldnames}")
            return 1
        for row in reader:
            term = (row.get("word") or "").strip()
            if term:
                terms.append(term)

    payload = {
        "book_id": book_id,
        "title": title,
        "words": [{"term": t, "entries": []} for t in terms],
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(terms)} words to {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

