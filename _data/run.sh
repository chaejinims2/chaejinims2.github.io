#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"
TOOLS_DIR="${REPO_ROOT}/script/data"

usage() {
  cat <<'EOF'
Usage:
  ./_data/run.sh <mode>

Modes:
  1  words.csv + entries.csv + examples.csv -> words.json
  2  words.json -> words.csv + entries.csv + examples.csv
  3  collocations.json -> collocations.csv + collocation_examples.csv
  4  collocations.csv + collocation_examples.csv -> collocations.json
  5  subjects.json -> subjects.csv

Notes:
  - All paths are relative to repo root.
  - Output CSVs are written to _data/cvoca/output/
EOF
}

main() {
  if [[ $# -lt 1 ]]; then
    usage
    exit 1
  fi

  local mode="${1}"
  case "${mode}" in
    1)
      python3 "${TOOLS_DIR}/multi_csv_to_json.py" \
        --dir _data/cvoca/output \
        --base words \
        --legacy-words \
        --out _data/cvoca/words.json
      ;;
    2)
      python3 "${TOOLS_DIR}/json_to_multi_csv.py" \
        --in _data/cvoca/words.json \
        --out-dir _data/cvoca/output \
        --depth 2 \
        --legacy-words
      ;;
    3)
      python3 "${TOOLS_DIR}/json_to_multi_csv.py" \
        --in _data/cvoca/collocations.json \
        --out-dir _data/cvoca/output \
        --depth 2
      ;;
    4)
      python3 "${TOOLS_DIR}/multi_csv_to_json.py" \
        --dir _data/cvoca/output \
        --base collocations \
        --out _data/cvoca/collocations.json
      ;;
    -*|help|--help)
      usage
      ;;
    5)
      python3 "${TOOLS_DIR}/json_to_multi_csv.py" \
        --in _data/cvoca/subjects.json \
        --out-dir _data/cvoca/output \
        --depth 2
      ;;
    *)
      echo "Unknown mode: ${mode}" >&2
      usage
      exit 1
      ;;
  esac
}

main "$@"