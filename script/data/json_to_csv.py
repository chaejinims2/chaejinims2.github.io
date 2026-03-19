#!/usr/bin/env python3
"""
Generic JSON -> CSV converter driven by a sample JSON schema.

You provide:
- --sample: a JSON file that represents the desired shape (schema example)
- --data:   a JSON file that contains actual data
- --out:    output CSV path

How columns are derived:
- We traverse the sample JSON recursively and collect paths to primitive values.
- For arrays, we only look at index 0 of the sample (schema example pattern).
  This matches the common "examples[0].text" style.

How rows are created:
- If data root is an array: each element becomes a CSV row.
- If data root is an object: a single-row CSV is produced.

Column naming:
- Path segments are joined with "__".
- Array index is represented as "__0__" (for index 0).
  Example: examples[0].text  ->  examples__0__text

Notes:
- If a value is missing, an empty string is written.
- Non-primitive values at a derived path are JSON-stringified.
"""

from __future__ import annotations

import argparse
import csv
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable, List, Sequence, Tuple, Union


Primitive = Union[str, int, float, bool, None]


@dataclass(frozen=True)
class Step:
    kind: str  # "key" | "idx"
    value: Union[str, int]


def read_json(path: Path) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def is_primitive(v: Any) -> bool:
    return v is None or isinstance(v, (str, int, float, bool))


def steps_to_colname(steps: Sequence[Step]) -> str:
    parts: List[str] = []
    for s in steps:
        if s.kind == "key":
            parts.append(str(s.value))
        else:
            parts.append(str(s.value))  # index
    return "__".join(parts)


def derive_paths_from_sample(sample: Any, base: Tuple[Step, ...] = ()) -> List[Tuple[Step, ...]]:
    """
    Returns list of paths (as Step tuples) to primitive leaves in the sample.
    For lists, only index 0 is considered.
    """
    if is_primitive(sample):
        return [base]

    if isinstance(sample, dict):
        out: List[Tuple[Step, ...]] = []
        for k, v in sample.items():
            out.extend(derive_paths_from_sample(v, base + (Step("key", str(k)),)))
        return out

    if isinstance(sample, list):
        if not sample:
            # empty list in sample: cannot infer, treat as leaf
            return [base]
        return derive_paths_from_sample(sample[0], base + (Step("idx", 0),))

    # unknown types -> leaf
    return [base]


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


def normalize_cell(v: Any) -> str:
    if v is None:
        return ""
    if isinstance(v, (str, int, float, bool)):
        return str(v)
    # dict/list -> stable JSON string
    try:
        return json.dumps(v, ensure_ascii=False)
    except Exception:
        return str(v)


def ensure_row_objects(data: Any) -> List[Any]:
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        return [data]
    # primitive root -> single row
    return [data]


def main() -> int:
    ap = argparse.ArgumentParser(description="Convert JSON to CSV using a sample JSON schema.")
    ap.add_argument("--sample", required=True, help="Path to sample JSON (schema example).")
    ap.add_argument("--data", required=True, help="Path to actual JSON data.")
    ap.add_argument("--out", required=True, help="Output CSV path.")
    args = ap.parse_args()

    sample_path = Path(args.sample)
    data_path = Path(args.data)
    out_path = Path(args.out)

    if not sample_path.exists():
        print(f"Not found: {sample_path}")
        return 1
    if not data_path.exists():
        print(f"Not found: {data_path}")
        return 1

    sample = read_json(sample_path)
    data = read_json(data_path)

    # If sample root is array, use its first item as schema basis.
    sample_basis = sample[0] if isinstance(sample, list) and sample else sample
    paths = derive_paths_from_sample(sample_basis)

    # Build columns (dedupe, keep order)
    seen = set()
    columns: List[Tuple[str, Tuple[Step, ...]]] = []
    for p in paths:
        name = steps_to_colname(p)
        if name in seen:
            continue
        seen.add(name)
        columns.append((name, p))

    rows = ensure_row_objects(data)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow([c[0] for c in columns])
        for r in rows:
            w.writerow([normalize_cell(get_by_steps(r, steps)) for _, steps in columns])

    print(f"Wrote {len(rows)} rows, {len(columns)} cols -> {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

