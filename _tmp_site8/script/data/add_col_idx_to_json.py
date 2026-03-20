#!/usr/bin/env python3
"""
python3 script/json/add_col_idx.py <json_file> <column_name>
json 파일의 각 항목에 컬럼명에 해당하는 컬럼을 추가 (1부터 순서대로).
배열 인덱스 순서가 곧 컬럼값.
이미 해당 컬럼이 있는 경우 덮어씌움.
컬럼명이 없으면 기본으로 "idx" 컬럼을 추가.
"""
import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
JSON_PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else exit(1)
COLUMN_NAME = sys.argv[2] if len(sys.argv) > 2 else "idx"

def main():
    if not JSON_PATH.exists():
        print(f"Not found: {JSON_PATH}")
        return 1

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        items = json.load(f)

    if not isinstance(items, list):
        print("Expected JSON array")
        return 1

    for i, obj in enumerate(items):
        if isinstance(obj, dict):
            if COLUMN_NAME in obj:
                print(f"Warning: {COLUMN_NAME} already exists in {JSON_PATH} that was {obj[COLUMN_NAME]}")
            
            obj[COLUMN_NAME] = i + 1

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"Added {COLUMN_NAME} 1..{len(items)} to {len(items)} items in {JSON_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
