#!/usr/bin/env python3
"""
Generic JSON -> multi CSV splitter.

Given a JSON file whose root is an array of objects, this script writes:
- one root CSV (e.g. collocations.csv)
- one child CSV per "list of objects" field (e.g. collocation_examples.csv)

It supports nested lists up to depth=2 by default:
- root items
- children: root.listField[*]
- grandchildren: root.listField[*].nestedList[*]

File naming (default):
- root: <base>.csv
- child: <singular_base>_<field>.csv
- grandchild: <singular_base>_<field>_<nestedField>.csv

Keys:
- parent id column name is derived from base name: <singular_base>_id
- index columns are: <field>_idx, <nestedField>_idx ...

Example:
  collocations.json (items have id + examples[])
  -> collocations.csv
  -> collocation_examples.csv
"""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
DEFAULT_OUT_DIR = REPO_ROOT / "_data" / "cvoca" / "output"


def read_json(path: Path) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def s(v: Any) -> str:
    return "" if v is None else str(v)


def singularize(name: str) -> str:
    n = (name or "").strip()
    if n.endswith("ies") and len(n) > 3:
        return n[:-3] + "y"
    if n.endswith("s") and len(n) > 1:
        return n[:-1]
    return n


def is_primitive(v: Any) -> bool:
    return v is None or isinstance(v, (str, int, float, bool))


def collect_primitive_keys(obj: Dict[str, Any]) -> List[str]:
    keys: List[str] = []
    for k, v in obj.items():
        if is_primitive(v):
            keys.append(k)
    return keys


def list_object_fields(obj: Dict[str, Any]) -> List[str]:
    out: List[str] = []
    for k, v in obj.items():
        if isinstance(v, list) and v and all(isinstance(x, dict) for x in v):
            out.append(k)
    return out


def write_csv(path: Path, header: List[str], rows: Iterable[List[str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(header)
        for r in rows:
            w.writerow(r)


def main() -> int:
    ap = argparse.ArgumentParser(description="Split a nested JSON array into multiple CSVs.")
    ap.add_argument("--in", dest="in_path", required=True, help="Input JSON path (root must be an array of objects).")
    ap.add_argument("--out-dir", default=str(DEFAULT_OUT_DIR), help="Output directory for CSVs.")
    ap.add_argument("--id-field", default="id", help="Primary key field name in root objects (default: id).")
    ap.add_argument("--depth", type=int, default=2, help="Nested list depth to export (1 or 2). Default: 2.")
    ap.add_argument("--root-name", default="", help="Override base name used for output files (default: input filename stem).")
    ap.add_argument("--legacy-words", action="store_true", help="Use legacy words.csv/entries.csv/examples.csv naming when input is words.json.")
    args = ap.parse_args()

    in_path = Path(args.in_path)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    data = read_json(in_path)
    if not isinstance(data, list):
        print("Expected JSON array of objects.")
        return 1
    if not data:
        print("Empty JSON array.")
        return 0
    if not all(isinstance(x, dict) for x in data):
        print("Expected JSON array of objects.")
        return 1

    base = args.root_name.strip() or in_path.stem
    singular_base = singularize(base)
    parent_id_col = f"{singular_base}_id"

    # root csv
    root_keys = collect_primitive_keys(data[0])
    # ensure id field first if present
    if args.id_field in root_keys:
        root_keys = [args.id_field] + [k for k in root_keys if k != args.id_field]

    root_csv_name = f"{base}.csv"
    if args.legacy_words and base == "words":
        root_csv_name = "words.csv"

    root_csv = out_dir / root_csv_name
    write_csv(
        root_csv,
        root_keys,
        ([s(item.get(k)) for k in root_keys] for item in data),
    )
    print(f"Wrote: {root_csv}")

    # children (list-of-object fields)
    child_fields = list_object_fields(data[0])
    for field in child_fields:
        child_items: List[Tuple[Dict[str, Any], int, Dict[str, Any]]] = []
        for parent in data:
            pid = parent.get(args.id_field)
            lst = parent.get(field)
            if not isinstance(lst, list):
                continue
            for idx, child in enumerate(lst):
                if isinstance(child, dict):
                    child_items.append((parent, idx, child))

        if not child_items:
            continue

        child_keys = collect_primitive_keys(child_items[0][2])
        header = [parent_id_col, f"{field}_idx"] + child_keys

        child_csv_name = f"{singular_base}_{field}.csv"
        if args.legacy_words and base == "words" and field == "entries":
            child_csv_name = "entries.csv"
        child_csv = out_dir / child_csv_name

        write_csv(
            child_csv,
            header,
            (
                [s(parent.get(args.id_field)), str(idx)] + [s(child.get(k)) for k in child_keys]
                for parent, idx, child in child_items
            ),
        )
        print(f"Wrote: {child_csv}")

        if args.depth < 2:
            continue

        # grandchildren (nested list-of-object fields inside child)
        grand_fields = list_object_fields(child_items[0][2])
        for gfield in grand_fields:
            grand_items: List[Tuple[Dict[str, Any], int, int, Dict[str, Any]]] = []
            for parent, cidx, child in child_items:
                lst2 = child.get(gfield)
                if not isinstance(lst2, list):
                    continue
                for gidx, g in enumerate(lst2):
                    if isinstance(g, dict):
                        grand_items.append((parent, cidx, gidx, g))
            if not grand_items:
                continue
            gkeys = collect_primitive_keys(grand_items[0][3])
            gheader = [parent_id_col, f"{field}_idx", f"{gfield}_idx"] + gkeys

            g_csv_name = f"{singular_base}_{field}_{gfield}.csv"
            if args.legacy_words and base == "words" and field == "entries" and gfield == "examples":
                g_csv_name = "examples.csv"
            g_csv = out_dir / g_csv_name

            write_csv(
                g_csv,
                gheader,
                (
                    [s(parent.get(args.id_field)), str(cidx), str(gidx)] + [s(g.get(k)) for k in gkeys]
                    for parent, cidx, gidx, g in grand_items
                ),
            )
            print(f"Wrote: {g_csv}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

