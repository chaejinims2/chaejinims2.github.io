#!/usr/bin/env bash
# 특정 폴더/파일(_pages, _posts, admin, _config.yml)만 대상 레포로 복사합니다. 대상의 .git 등은 건드리지 않습니다.

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../pages" && pwd)"

# 복사할 항목만 지정 (대상 레포의 그 외 파일/폴더는 유지)
COPY_ITEMS=("_pages" "_posts" "admin" "_config.yml")

echo "소스: $SCRIPT_DIR"
echo "대상: $PROJECT_ROOT"

for name in "${COPY_ITEMS[@]}"; do
  src="$SCRIPT_DIR/$name"
  dest="$PROJECT_ROOT/$name"
  if [ ! -e "$src" ]; then
    echo "건너뜀 (소스 없음): $name"
    continue
  fi
  if [ -e "$dest" ]; then
    echo "삭제: $dest"
    rm -rf "$dest"
  fi
  echo "복사: $name"
  cp -R "$src" "$dest"
done

# _pages: index.md 하나만 가진 폴더는 폴더를 제거하고 해당 이름으로 변환 (ex: _pages/home/about/index.md  -> _pages/home/about.md)
PAGES_ROOT="$PROJECT_ROOT/_pages"
if [ -d "$PAGES_ROOT" ]; then
  matching_dirs=()
  while IFS= read -r -d '' dir; do
    [ -d "$dir" ] || continue
    count_files=$(find "$dir" -maxdepth 1 -type f 2>/dev/null | wc -l | tr -d ' ')
    count_subdirs=$(find "$dir" -maxdepth 1 -mindepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
    if [ "$count_files" -eq 1 ] && [ -f "$dir/index.md" ] && [ "$count_subdirs" -eq 0 ]; then
      matching_dirs+=("$dir")
    fi
  done < <(find "$PAGES_ROOT" -type d -mindepth 1 -print0 2>/dev/null)
  # 깊은 경로부터 처리 (부모 폴더를 먼저 바꾸면 자식 경로가 깨지므로)
  while IFS= read -r dir; do
    [ -z "$dir" ] && continue
    [ -d "$dir" ] || continue
    parent="$(dirname "$dir")"
    base="$(basename "$dir")"
    mv "$dir/index.md" "$parent/$base.md"
    rmdir "$dir" 2>/dev/null || rm -rf "$dir"
    echo "  → $parent/$base.md"
  done < <(printf '%s\n' "${matching_dirs[@]}" | awk -F/ '{print NF"\t"$0}' | sort -rn | cut -f2-)
fi

echo "완료."
