#!/usr/bin/env python3
"""
Generic multi CSV -> JSON merger.

This is the inverse of script/data/json_to_multi_csv.py.

Given:
- root CSV: <base>.csv
- child CSVs: <singular_base>_<field>.csv
- grandchild CSVs: <singular_base>_<field>_<nestedField>.csv

Reconstructs a JSON array of objects with nested lists.

Keys:
- root id field is --id-field (default: id)
- parent id column in child CSV is <singular_base>_id
- index columns are <field>_idx and <nestedField>_idx

Notes:
- CSV cells are strings; numeric-looking values are converted to numbers by default.
  Disable with --no-auto-number.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
from pathlib import Path
from typing import Any, Dict, List, Tuple


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
DEFAULT_DIR = REPO_ROOT / "_data" / "cvoca" / "output"
DEFAULT_OUT = REPO_ROOT / "_data" / "cvoca" / "output" / "merged.json"


def read_csv(path: Path) -> List[Dict[str, str]]:
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)

def singularize(name: str) -> str:
    n = (name or "").strip()
    if n.endswith("ies") and len(n) > 3:
        return n[:-3] + "y"
    if n.endswith("s") and len(n) > 1:
        return n[:-1]
    return n


_RE_INT = re.compile(r"^[+-]?\d+$")
_RE_FLOAT = re.compile(r"^[+-]?(?:\d+\.\d*|\d*\.\d+)(?:[eE][+-]?\d+)?$|^[+-]?\d+[eE][+-]?\d+$")


def auto_number(v: Any) -> Any:
    if not isinstance(v, str):
        return v
    s = v.strip()
    if s == "":
        return ""
    if _RE_INT.match(s):
        try:
            return int(s)
        except Exception:
            return v
    if _RE_FLOAT.match(s):
        try:
            return float(s)
        except Exception:
            return v
    return v


def clean_cell(v: Any, no_auto_number: bool) -> Any:
    if v is None:
        return ""
    s = str(v)
    return s if no_auto_number else auto_number(s)


def main() -> int:
    ap = argparse.ArgumentParser(description="Merge <base>.csv + child CSVs into nested JSON.")
    ap.add_argument("--dir", default=str(DEFAULT_DIR), help="Directory containing CSVs")
    ap.add_argument("--base", required=True, help="Base name (e.g. collocations -> collocations.csv)")
    ap.add_argument("--out", default=str(DEFAULT_OUT), help="Output JSON path")
    ap.add_argument("--id-field", default="id", help="Root id field name (default: id)")
    ap.add_argument("--legacy-words", action="store_true", help="Use legacy words.csv/entries.csv/examples.csv naming")
    ap.add_argument("--no-auto-number", action="store_true", help="Do not auto-convert numeric-looking values")
    args = ap.parse_args()

    base = Path(args.dir)
    out_path = Path(args.out)

    base_name = args.base.strip()
    singular_base = singularize(base_name)
    parent_id_col = f"{singular_base}_id"

    root_csv = base / (f"{base_name}.csv")
    if args.legacy_words and base_name == "words":
        root_csv = base / "words.csv"

    if not root_csv.exists():
        print(f"Not found: {root_csv}")
        return 1

    root_rows = read_csv(root_csv)
    if not root_rows:
        out_list: List[Any] = []
    else:
        out_list = []
        for r in root_rows:
            obj: Dict[str, Any] = {}
            for k, v in r.items():
                if k is None:
                    continue
                obj[k] = clean_cell(v, args.no_auto_number)
            # ensure id field is numeric if possible
            if args.id_field in obj:
                obj[args.id_field] = clean_cell(obj[args.id_field], args.no_auto_number)
            out_list.append(obj)

    # index root objects by id
    root_by_id: Dict[Any, Dict[str, Any]] = {}
    for obj in out_list:
        if isinstance(obj, dict) and args.id_field in obj:
            root_by_id[obj[args.id_field]] = obj

    # discover child/grandchild CSVs
    # pattern: <singular_base>_*.csv (excluding root)
    csv_files = sorted(base.glob(f"{singular_base}_*.csv"))
    # legacy words support
    if args.legacy_words and base_name == "words":
        # entries.csv and examples.csv correspond to words_entries and words_entries_examples
        if (base / "entries.csv").exists():
            csv_files.append(base / "entries.csv")
        if (base / "examples.csv").exists():
            csv_files.append(base / "examples.csv")

    # First pass: attach children lists directly under root.
    # Second pass: attach grandchildren lists under child objects.
    child_objects: Dict[Tuple[Any, str, int], Dict[str, Any]] = {}  # (root_id, field, idx) -> child dict

    def parse_field_from_filename(p: Path) -> Tuple[str, List[str]]:
        name = p.stem
        if args.legacy_words and base_name == "words":
            if name == "entries":
                return "entries", []
            if name == "examples":
                return "entries", ["examples"]
        # strip singular base prefix
        prefix = singular_base + "_"
        rest = name[len(prefix):] if name.startswith(prefix) else name
        parts = rest.split("_")
        if len(parts) == 1:
            return parts[0], []
        return parts[0], parts[1:]

    # attach by processing in order of depth (children first)
    csv_files_sorted = sorted(csv_files, key=lambda p: len(p.stem.split("_")))
    for p in csv_files_sorted:
        field, nested = parse_field_from_filename(p)
        rows = read_csv(p)
        if not rows:
            continue

        if not nested:
            # child table
            idx_col = f"{field}_idx"
            if parent_id_col not in rows[0] or idx_col not in rows[0]:
                continue
            for r in rows:
                rid = clean_cell(r.get(parent_id_col), args.no_auto_number)
                if rid not in root_by_id:
                    continue
                idx = clean_cell(r.get(idx_col), args.no_auto_number)
                try:
                    idx_int = int(idx) if isinstance(idx, (int, float, str)) else 0
                except Exception:
                    idx_int = 0
                child: Dict[str, Any] = {}
                for k, v in r.items():
                    if k in (parent_id_col, idx_col) or k is None:
                        continue
                    child[k] = clean_cell(v, args.no_auto_number)
                root = root_by_id[rid]
                if field not in root or not isinstance(root.get(field), list):
                    root[field] = []
                root[field].append((idx_int, child))
                child_objects[(rid, field, idx_int)] = child
        else:
            # grandchild table: expects parent_id_col + field_idx + nestedField_idx
            nested_field = nested[0]
            idx_col = f"{field}_idx"
            nidx_col = f"{nested_field}_idx"
            if parent_id_col not in rows[0] or idx_col not in rows[0] or nidx_col not in rows[0]:
                continue
            for r in rows:
                rid = clean_cell(r.get(parent_id_col), args.no_auto_number)
                if rid not in root_by_id:
                    continue
                cidx = clean_cell(r.get(idx_col), args.no_auto_number)
                nidx = clean_cell(r.get(nidx_col), args.no_auto_number)
                try:
                    cidx_int = int(cidx)
                except Exception:
                    cidx_int = 0
                try:
                    nidx_int = int(nidx)
                except Exception:
                    nidx_int = 0
                parent_child = child_objects.get((rid, field, cidx_int))
                if parent_child is None:
                    # if child wasn't built yet, skip
                    continue
                gobj: Dict[str, Any] = {}
                for k, v in r.items():
                    if k in (parent_id_col, idx_col, nidx_col) or k is None:
                        continue
                    gobj[k] = clean_cell(v, args.no_auto_number)
                if nested_field not in parent_child or not isinstance(parent_child.get(nested_field), list):
                    parent_child[nested_field] = []
                parent_child[nested_field].append((nidx_int, gobj))

    # normalize: sort tuples and strip indices
    for obj in out_list:
        if not isinstance(obj, dict):
            continue
        for k, v in list(obj.items()):
            if isinstance(v, list) and v and isinstance(v[0], tuple):
                obj[k] = [child for _, child in sorted(v, key=lambda t: t[0])]

    for (_rid, _field, _idx), child in list(child_objects.items()):
        if not isinstance(child, dict):
            continue
        for k, v in list(child.items()):
            if isinstance(v, list) and v and isinstance(v[0], tuple):
                child[k] = [g for _, g in sorted(v, key=lambda t: t[0])]

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out_list, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(out_list)} items -> {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

