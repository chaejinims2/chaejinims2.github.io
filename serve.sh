#!/usr/bin/env bash
# 4000 포트 사용 중일 때 대신 4001로 서버 실행
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Avoid global gem/cache paths without sudo
export BUNDLE_USER_HOME="$PWD/.bundle"
export BUNDLE_APP_CONFIG="$PWD/.bundle"

bundle exec jekyll serve --port 4001
