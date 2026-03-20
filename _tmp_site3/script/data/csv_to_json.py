#!/usr/bin/env python3
"""
Generic CSV -> JSON converter driven by a sample JSON schema.

This is the inverse of scripts/json2csv.py.

You provide:
- --sample: a JSON file that represents the desired shape (schema example)
- --csv:    an input CSV file whose headers are derived from the sample (a__0__b style)
- --out:    output JSON path

How JSON shape is derived:
- We traverse the sample JSON recursively and collect paths to primitive values.
- For arrays, we only look at index 0 of the sample (schema pattern).

How rows are converted:
- Each CSV row becomes one JSON object matching the sample shape.
- Empty cells become empty string by default (same behavior as json2csv).

Type casting:
- Optional: --cast will cast values based on sample leaf types (int/float/bool/null/string).
- Regardless of --cast, numeric-looking values are automatically converted to numbers
  (can be disabled with --no-auto-number).

Notes:
- Array indices in column names are numeric segments, e.g. examples__0__text.
- Missing columns are filled with sample defaults (deep-cloned from sample basis).
"""

from __future__ import annotations

import argparse
import csv
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Sequence, Tuple, Union


Primitive = Union[str, int, float, bool, None]


@dataclass(frozen=True)
class Step:
    kind: str  # "key" | "idx"
    value: Union[str, int]


def read_json(path: Path) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def deep_clone(obj: Any) -> Any:
    return json.loads(json.dumps(obj, ensure_ascii=False))


def is_primitive(v: Any) -> bool:
    return v is None or isinstance(v, (str, int, float, bool))


def derive_paths_from_sample(sample: Any, base: Tuple[Step, ...] = ()) -> List[Tuple[Step, ...]]:
    if is_primitive(sample):
        return [base]
    if isinstance(sample, dict):
        out: List[Tuple[Step, ...]] = []
        for k, v in sample.items():
            out.extend(derive_paths_from_sample(v, base + (Step("key", str(k)),)))
        return out
    if isinstance(sample, list):
        if not sample:
            return [base]
        return derive_paths_from_sample(sample[0], base + (Step("idx", 0),))
    return [base]


def steps_to_colname(steps: Sequence[Step]) -> str:
    parts: List[str] = []
    for s in steps:
        parts.append(str(s.value))
    return "__".join(parts)


def colname_to_steps(col: str) -> Tuple[Step, ...]:
    steps: List[Step] = []
    for part in (col or "").split("__"):
        if part == "":
            continue
        if part.isdigit():
            steps.append(Step("idx", int(part)))
        else:
            steps.append(Step("key", part))
    return tuple(steps)


def get_by_steps(obj: Any, steps: Sequence[Step]) -> Any:
    cur = obj
    for s in steps:
        if cur is None:
            return None
        if s.kind == "key":
            if isinstance(cur, dict):
                cur = cur.get(str(s.value))
            else:
                return None
        else:
            if isinstance(cur, list):
                idx = int(s.value)
                if 0 <= idx < len(cur):
                    cur = cur[idx]
                else:
                    return None
            else:
                return None
    return cur


def ensure_list_len(lst: List[Any], n: int) -> None:
    while len(lst) <= n:
        lst.append(None)


def set_by_steps(root: Any, steps: Sequence[Step], value: Any) -> Any:
    """
    Mutates root to set value at steps. Returns root.
    """
    if not steps:
        return value

    cur = root
    for i, s in enumerate(steps):
        is_last = i == len(steps) - 1
        nxt = steps[i + 1] if not is_last else None

        if s.kind == "key":
            if not isinstance(cur, dict):
                # overwrite shape if needed
                cur = {}
            if is_last:
                cur[str(s.value)] = value
                return root
            if str(s.value) not in cur or cur[str(s.value)] is None:
                cur[str(s.value)] = [] if (nxt and nxt.kind == "idx") else {}
            cur = cur[str(s.value)]
        else:
            if not isinstance(cur, list):
                cur = []
            idx = int(s.value)
            ensure_list_len(cur, idx)
            if is_last:
                cur[idx] = value
                return root
            if cur[idx] is None:
                cur[idx] = [] if (nxt and nxt.kind == "idx") else {}
            cur = cur[idx]
    return root


def cast_value(raw: str, sample_leaf: Any) -> Any:
    # Keep empty as empty string (matches json2csv missing handling)
    if raw is None:
        return ""
    s = str(raw)
    if s == "":
        return ""

    if isinstance(sample_leaf, bool):
        v = s.strip().lower()
        if v in ("true", "1", "yes", "y", "t"):
            return True
        if v in ("false", "0", "no", "n", "f"):
            return False
        return s
    if isinstance(sample_leaf, int) and not isinstance(sample_leaf, bool):
        try:
            return int(s)
        except ValueError:
            return s
    if isinstance(sample_leaf, float):
        try:
            return float(s)
        except ValueError:
            return s
    if sample_leaf is None:
        v = s.strip().lower()
        if v in ("null", "none"):
            return None
        return s
    return s


_RE_INT = re.compile(r"^[+-]?\d+$")
_RE_FLOAT = re.compile(r"^[+-]?(?:\d+\.\d*|\d*\.\d+)(?:[eE][+-]?\d+)?$|^[+-]?\d+[eE][+-]?\d+$")


def auto_number(v: Any) -> Any:
    """
    Convert numeric-looking strings to int/float.
    Leaves non-strings untouched. Empty string stays empty string.
    """
    if not isinstance(v, str):
        return v
    s = v.strip()
    if s == "":
        return v
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


def main() -> int:
    ap = argparse.ArgumentParser(description="Convert CSV to JSON using a sample JSON schema.")
    ap.add_argument("--sample", required=True, help="Path to sample JSON (schema example).")
    ap.add_argument("--csv", required=True, help="Path to input CSV.")
    ap.add_argument("--out", required=True, help="Output JSON path.")
    ap.add_argument("--cast", action="store_true", help="Cast values based on sample leaf types.")
    ap.add_argument("--no-auto-number", action="store_true", help="Do not auto-convert numeric-looking strings to numbers.")
    args = ap.parse_args()

    sample_path = Path(args.sample)
    csv_path = Path(args.csv)
    out_path = Path(args.out)

    if not sample_path.exists():
        print(f"Not found: {sample_path}")
        return 1
    if not csv_path.exists():
        print(f"Not found: {csv_path}")
        return 1

    sample = read_json(sample_path)
    sample_basis = sample[0] if isinstance(sample, list) and sample else sample

    sample_paths = derive_paths_from_sample(sample_basis)
    sample_leaf_by_col: Dict[str, Any] = {}
    for p in sample_paths:
        sample_leaf_by_col[steps_to_colname(p)] = get_by_steps(sample_basis, p)

    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            print("CSV has no header.")
            return 1

        rows_out: List[Any] = []
        for row in reader:
            obj = deep_clone(sample_basis)
            for col, raw_val in row.items():
                if col is None:
                    continue
                steps = colname_to_steps(col)
                if not steps:
                    continue
                if args.cast and col in sample_leaf_by_col:
                    v = cast_value(raw_val if raw_val is not None else "", sample_leaf_by_col[col])
                else:
                    v = "" if raw_val is None else str(raw_val)
                if not args.no_auto_number:
                    v = auto_number(v)
                set_by_steps(obj, steps, v)
            rows_out.append(obj)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(rows_out, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(rows_out)} items -> {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

