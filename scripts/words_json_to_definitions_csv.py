#!/usr/bin/env python3
"""
words.json → definitions.csv, examples.csv, words.csv 변환 스크립트

입력: chaejinims2.github.io/_data/cvoca/words.json
출력: words_path와 같은 폴더에 definitions.csv, examples.csv, words.csv

사용법:
  python words_json_to_definitions_csv.py [words_path] [out_dir]
  - words_path 생략 시 _data/cvoca/words.json
  - out_dir 생략 시 words_path와 같은 폴더
"""
import csv
import json
import sys
from pathlib import Path

# pos 매핑: words.json → definitions.csv
POS_MAP = {
    "v.": "v",
    "n.": "n",
    "adj.": "a",
    "adv.": "adv",
    "prep.": "prep",
    "a.": "a",
}


def map_pos(pos):
    if pos is None:
        return "null"
    return POS_MAP.get(pos, pos.replace(".", "") if pos else "null")


def main():
    base = Path(__file__).parent.parent
    words_path = Path(sys.argv[1]) if len(sys.argv) > 1 else base / "_data" / "cvoca" / "words.json"
    out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else words_path.parent

    if not words_path.exists():
        print(f"Error: {words_path} not found")
        return 1

    with open(words_path, "r", encoding="utf-8") as f:
        words = json.load(f)

    out_dir.mkdir(parents=True, exist_ok=True)

    # --- definitions.csv ---
    def_rows = []
    for w in words:
        word_id = w["word_id"]
        for sense_no, defn in enumerate(w.get("definitions", [])):
            definition_id = word_id * 10 + sense_no
            meaning = defn.get("meaning", "").strip()
            pos = defn.get("pos")
            part_of_speech = map_pos(pos)
            def_rows.append({
                "word_id": word_id,
                "sense_no": sense_no,
                "definition_id": definition_id,
                "definition": meaning,
                "part_of_speech": part_of_speech,
            })

    def_path = out_dir / "definitions.csv"
    with open(def_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["word_id", "sense_no", "definition_id", "definition", "part_of_speech"],
            quoting=csv.QUOTE_MINIMAL,
        )
        writer.writeheader()
        writer.writerows(def_rows)
    print(f"Wrote {len(def_rows)} rows to {def_path}")

    # --- examples.csv ---
    ex_rows = []
    for w in words:
        word_id = w["word_id"]
        for sense_no, defn in enumerate(w.get("definitions", [])):
            definition_id = word_id * 10 + sense_no
            for ex_no, ex in enumerate(defn.get("examples", [])):
                example_id = definition_id * 10 + ex_no
                example_sentence = ex.get("example", "").strip()
                ex_rows.append({
                    "example_id": example_id,
                    "definition_id": definition_id,
                    "example_no": ex_no,
                    "example_sentence": example_sentence,
                })

    ex_path = out_dir / "examples.csv"
    with open(ex_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["example_id", "definition_id", "example_no", "example_sentence"],
            quoting=csv.QUOTE_MINIMAL,
        )
        writer.writeheader()
        writer.writerows(ex_rows)
    print(f"Wrote {len(ex_rows)} rows to {ex_path}")

    # --- words.csv ---
    word_no_per_day = {}
    word_rows = []
    for w in words:
        word_id = w["word_id"]
        day_no = w["day_no"]
        word_no_per_day[day_no] = word_no_per_day.get(day_no, 0) + 1
        word_no = word_no_per_day[day_no]
        word_rows.append({
            "word_id": word_id,
            "day_no": day_no,
            "word_no": word_no,
            "word": w.get("word", "").strip(),
        })

    words_path_out = out_dir / "words.csv"
    with open(words_path_out, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["word_id", "day_no", "word_no", "word"],
            quoting=csv.QUOTE_MINIMAL,
        )
        writer.writeheader()
        writer.writerows(word_rows)
    print(f"Wrote {len(word_rows)} rows to {words_path_out}")

    return 0


if __name__ == "__main__":
    exit(main())
