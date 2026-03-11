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

# _data/.../log → _pages/.../log 덮어쓰기. 스크립트 중간에 실패해도 EXIT 시 실행되도록 초기에 등록
sync_logs_to_pages() {
  local dest="${REPO_ROOT}/_pages/labs/lm11/prac/log"
  mkdir -p "$dest"
  local n=0
  for f in "${LOG_DIR}"/*.log; do
    [ -f "$f" ] || continue
    cp -f "$f" "$dest/"
    n=$((n+1))
  done
  echo "Copied ${n} log(s) to ${dest}"
}
trap sync_logs_to_pages EXIT

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
    # 민감정보(토큰/Authorization/IP/이메일 등) 우발 출력 방지용 마스킹
    # 명령이 실패하더라도 로그 생성은 계속 진행
    # stdin은 /dev/null로 고정(예: env head, head 등이 while 입력을 먹지 않도록)
    (bash -c "$cmd" </dev/null 2>&1 || true) | sed -E \
      -e 's/(VSCODE_GIT_IPC_AUTH_TOKEN=)[^[:space:]]+/\1***REDACTED***/g' \
      -e 's/([Gg][Hh]_[Tt][Oo][Kk][Ee][Nn]=)[^[:space:]]+/\1***REDACTED***/g' \
      -e 's/(GITHUB_TOKEN=)[^[:space:]]+/\1***REDACTED***/g' \
      -e 's/(Authorization:)[[:space:]]*Bearer[[:space:]]+[^[:space:]]+/\1 Bearer ***REDACTED***/g' \
      -e 's/(Bearer)[[:space:]]+[^[:space:]]+/\1 ***REDACTED***/g' \
      -e 's/(github_pat_)[A-Za-z0-9_]+/\1***REDACTED***/g' \
      -e 's/(ghp_)[A-Za-z0-9]+/\1***REDACTED***/g' \
      -e 's/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/***REDACTED_EMAIL***/g' \
      -e 's#(/home/)[^/[:space:]]+#\1***REDACTED_USER***#g' \
      -e 's/(--remote-user=)[^[:space:]]+/\1***REDACTED_EMAIL***/g' \
      -e 's/(--local-user=)[^[:space:]]+/\1***REDACTED_USER***/g' \
      -e 's/(--on-host=)[^[:space:]]+/\1***REDACTED_HOST***/g' \
      -e 's#(/tmp/cursor-)[0-9a-fA-F-]+#\1***REDACTED***#g' \
      -e 's/([0-9]{1,3}\.){3}[0-9]{1,3}/***REDACTED_IP***/g' \
      -e 's/([0-9A-Fa-f]{0,4}:){2,7}[0-9A-Fa-f]{0,4}/***REDACTED_IP***/g'
    # echo "\`\`\`"
    :
  } > "$out_file"

  echo "Wrote ${out_file}"
  cnt=$((cnt+1))
}

while IFS=$'\t' read -r cmd title description || [ -n "${cmd:-}" ]; do
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