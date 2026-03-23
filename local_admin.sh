#!/usr/bin/env bash
# 로컬에서 admin UI + custom.css 미리보기 (Git 푸시 없음)
# 사용: ./local_admin.sh   또는   bash local_admin.sh
# 브라우저: http://localhost:4010/admin/
#
# Node/npx 없이 동작 (serve@14는 Node 14+ 필요 — 구버전에서 실패함)
# Node 14+ 환경이면 대신: npm run admin:preview

set -euo pipefail
cd "$(dirname "$0")"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 가 필요합니다." >&2
  exit 1
fi

echo "CSS 미리보기 (로그인 없음) → http://localhost:4010/admin/preview.html"
echo "실제 Decap CMS     → http://localhost:4010/admin/"
echo "Stop: Ctrl+C"
exec python3 -m http.server 4010
