#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
JSON_FILE="${SCRIPT_DIR}/lm11-prac.json"

cmd=""
title=""
description=""
positional=()

usage() {
  cat <<'EOF'
Usage:
  ./lm11-prac-add.sh --cmd "ls -la" [--title "제목"] [--description "설명"] [--file path/to.json]
  ./lm11-prac-add.sh "ls -la"

Examples:
  ./lm11-prac-add.sh --cmd "df -h" --title "디스크 사용량" --description "디스크 사용량 확인"
  ./lm11-prac-add.sh --cmd "uname -a" --description "커널 정보 출력"
  ./lm11-prac-add.sh ls -la
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --cmd)
      cmd="${2:-}"; shift 2 ;;
    --title)
      title="${2:-}"; shift 2 ;;
    --description|--desc)
      description="${2:-}"; shift 2 ;;
    --file)
      JSON_FILE="${2:-}"; shift 2 ;;
    -h|--help)
      usage; exit 0 ;;
    --)
      shift
      while [[ $# -gt 0 ]]; do positional+=("$1"); shift; done
      ;;
    --*)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2 ;;
    -*)
      # Treat single-dash flags (e.g. -i, -la) as part of the command.
      positional+=("$1"); shift ;;
    *)
      positional+=("$1"); shift ;;
  esac
done

if [[ -z "$cmd" && ${#positional[@]} -gt 0 ]]; then
  cmd="${positional[*]}"
fi

if [[ -z "$cmd" ]]; then
  echo "--cmd is required" >&2
  usage >&2
  exit 2
fi

# If only command is provided, keep other fields empty ("").

tmp="$(mktemp)"
set +e
python3 - "$JSON_FILE" "$cmd" "$title" "$description" > "$tmp" <<'PY'
import json, sys

path, cmd, title, desc = sys.argv[1:5]

with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

if not isinstance(data, list):
    raise SystemExit("JSON root must be a list (array).")

for item in data:
    if isinstance(item, dict) and item.get("cmd") == cmd:
        raise SystemExit(10)

data.append({"cmd": cmd, "title": title, "description": desc})

print(json.dumps(data, ensure_ascii=False, indent=4))
PY
rc=$?
set -e

if [[ $rc -eq 10 ]]; then
  rm -f "$tmp"
  echo "Duplicate cmd; skipped: $cmd"
  exit 0
fi

if [[ $rc -ne 0 ]]; then
  rm -f "$tmp"
  echo "Failed to update JSON (exit=$rc)" >&2
  exit "$rc"
fi

mv "$tmp" "$JSON_FILE"
echo "Added 1 item to: $JSON_FILE"

# lm11-prac.sh 실행
./lm11-prac.sh