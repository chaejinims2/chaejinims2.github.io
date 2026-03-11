#!/bin/bash

# 항목별로 개별 로그 파일 생성 (log/01.md, 02.md, ...)
set -euo pipefail

CODE_TYPE=${1:-"bash"}
CODE_PATH="cherry@rhombus"
SCRIPT_BASENAME="$(basename "$0" .sh)"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../../" && pwd)"
JSON_FILE="${REPO_ROOT}/_data/lm11/prac/lm11-prac.json"
LOG_DIR="${REPO_ROOT}/_data/lm11/prac/log"
mkdir -p "$LOG_DIR"

cnt=1
write_section_file() {
  local cmd="$1"
  local title="$2"
  local description="$3"
  local section_id="section-${cnt}"
  local out_file="${LOG_DIR}/$(printf "%02d.log" "$cnt")"

  {
    # echo "## ${cnt}. ${title} : \`${cmd}\`"
    # echo "{: #${section_id} }"
    # echo "\`\`\`${CODE_TYPE}"
    echo "${CODE_PATH}:~$ ${cmd}"
    bash -c "$cmd"
    # echo "\`\`\`"
    [ -n "$description" ]
  } > "$out_file"

  echo "Wrote ${out_file}"
  cnt=$((cnt+1))
}

while IFS=$'\t' read -r cmd title description; do
  write_section_file "$cmd" "$title" "$description"
done < <(
  python3 - <<'PY' "$JSON_FILE"
import json, sys

path = sys.argv[1]
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

for item in data:
    cmd = item.get("cmd", "")
    title = item.get("title") or item.get("description", "")
    desc = item.get("description", "")
    print(f"{cmd}\t{title}\t{desc}")
PY
)