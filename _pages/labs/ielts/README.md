---
published: false
title: IELTS Lab — 구현 메모
---

# IELTS Lab 페이지 (`/labs/ielts/`)

Preview Lab와 동일한 앱 셸(`app` / `main`)을 쓰되, **이 페이지에서만** 상단 탑바·IELTS 전용 스크립트/스타일이 적용되는 **CBT 스타일 리딩 연습 UI**입니다. 정적 Jekyll 빌드 + 클라이언트에서 지문/질문 HTML을 갈아끼우는 구조입니다.

---

## 관련 파일 맵

| 역할 | 경로 |
|------|------|
| 페이지 본문·탑바·`<template>`·인라인 스크립트 | `_pages/labs/ielts/index.md` |
| 앱 셸 래핑 | `_layouts/default.html` → `_layouts/app.html` |
| IELTS 전용 CSS | `assets/style.css` (`.ielts-lab-page` 스코프) |
| 공통 스크립트(사이드바 등) | `_includes/scripts.html` |
| 책·테스트·스킬·지문 메타 | `_data/ielts/manifest.yml` |
| 지문/질문 마크다운 (include 가능한 실제 파일) | `_includes/ielts/ielts18/test*/reading/*.md` |

`site.data.ielts.manifest`는 Jekyll이 `_data/ielts/manifest.yml`을 읽어 만든 객체입니다.

---

## 구현된 기능 요약

### 1. 레이아웃 · 콘텐츠 영역

- **`default` 레이아웃**: `app` 셸 + `_includes/scripts.html`; IELTS 마크업·스크립트는 `index.md`에 포함.
- **`body`에 `ielts-lab-page`**: 이 클래스로 스코프를 걸어 다른 페이지에 영향이 가지 않도록 함.
- **메인 영역 너비**: IELTS 페이지에서 `main-inner--ielts`는 **max-width 제한 없음** (와이드 CBT).
- **두 패널**: 좌 `#ielts-passage-body` (지문), 우 `#ielts-questions-body` (질문). 넓은 화면에서 나란히, 좁으면 세로 스택 (미디어쿼리·`data-view` 조합).

### 2. 탑바(사이드바 대체)

- **IELTS Lab에서만** 사이드바가 아니라 **항상 상단 탑바** 형태.
- **브레드크럼형 콤보**: Book / Test / Skill (`manifest` 기반).
- **Passage** 콤보: Passage 1–3 (고정 옵션).
- **콤보 스타일**: 화살표 숨김, 테두리 0, 모노 느낌, 뮤트 컬러 등 (`tokens.css` 내 `.ielts-lab-page` 규칙).
- **라벨 대문자** 표기.
- **콤보 너비**: 선택된 옵션 텍스트 너비에 맞춤 (`autoSizeSelect` / `autoSizeAllCombos`).

### 3. 데이터 · 지문/질문 로딩

- **`_data/ielts/manifest.yml`**: 책 → 테스트 → 스킬 → `passages[]`에 `include`(지문), `include_questions`(질문) 경로를 적을 수 있음.
- **지문/질문 본문**은 `_includes/ielts/...` 아래 마크다운. Jekyll **safe mode**에서는 include 대상이 **심볼릭 링크면 안 됨** → 일반 파일로 두는 것이 안전.
- **`index.md` 빌드 시**: 각 조합마다 `{% capture %}` + `{% include %}` + `markdownify`로 HTML을 만들고, `<template id="tpl-...">`에 넣어 **한 번에 프리로드**.
- **템플릿 ID 규칙** (클라이언트 스왑용):

  - 지문: `tpl-{bookKey}-{testKey}-{skillKey}-{passageKey}`  
    예: `tpl-ielts18-test1-reading-passage1`
  - 질문: 위 ID + `-questions`  
    예: `tpl-ielts18-test1-reading-passage1-questions`

- **JS `syncPassageContent()`**: 현재 콤보 값으로 위 ID를 조합해 `innerHTML`로 좌·우 패널을 갱신. **질문 템플릿이 없으면** 우측은 비움.

현재 **Reading** 위주로 템플릿이 깔려 있으며, Test 1·2는 질문 템플릿까지 연결. Test 3·4는 지문 위주(질문은 manifest/템플릿 추가 시 확장 가능).

### 4. 보기 모드 (READER 패널)

- **READER** 버튼 → **fixed** 위치 패널 (탑바 스크롤에 잘리지 않도록 버튼 기준으로 `left`/`top` 계산, `resize` 시 재배치).
- **View**: `AUTO` / `1PAGE` / `2PAGE` → `body`의 `data-view` + `localStorage` (`ielts-lab-view-mode`).
- **타이포**: Font(Sans/Serif/Mono), Size, Line height, Width → CSS 변수로 `#ielts-passage-body`에만 적용 + `localStorage` (`ielts-lab-reader`).
- **리셋**: Reader 패널의 Reset / 기본값 복구.

### 5. 타이포그래피(지문 + 질문 패널)

- 지문은 리더 설정용 변수(`--ielts-reader-font-size` 등)를 사용.
- **질문 패널**은 리더 폭 변수는 쓰지 않되, **문단·제목·목록·`pre`/`code`** 등 간격 규칙은 지문과 **동일 셀렉터로 공유**해 읽기 좋게 맞춤.

### 6. 임시 하이라이트 (저장 없음)

- **적용 범위**: `#ielts-passage-body` 안만.
- **추가**: **Ctrl 키를 누른 채** 드래그 후 마우스 업 → 선택 구간을 `<mark class="ielts-highlight">`로 감쌈. 터치는 `touchend` 시 `ctrlKey`가 있을 때만 동작(외부 키보드 조합 가정).
- **제거**:
  - 해당 하이라이트 **블록을 클릭** → 그 `mark`만 unwrap.
  - READER 패널 **Highlight → CLEAR** → 지문 안 하이라이트 전부 제거.
- **persist 없음** (`localStorage` 미사용). 지문 HTML이 템플릿으로 **다시 채워지면** 하이라이트는 함께 사라짐.

### 7. 로컬 개발 (`serve.sh`)

- `serve.sh`는 `--config "_config.yml,_config.local.yml"`로 실행.
- **`_config.local.yml`**: 로컬에서만 `jekyll-feed`를 빼서 **리젠 속도** 개선 (배포용 `_config.yml`과 분리).

---

## 콘텐츠 추가 시 체크리스트 (Reading)

1. `_includes/ielts/.../passageN.md` (및 필요 시 `passageN-questions.md`) 추가.
2. `_data/ielts/manifest.yml`에 `include` / `include_questions` 경로 반영.
3. `_pages/labs/ielts/index.md`에 해당 조합의 `{% capture %}`, `<template id="tpl-...">`, 필요 시 `-questions` 템플릿 추가.

템플릿 ID가 스크립트 규칙과 **정확히 일치**해야 스왑이 동작합니다.

---

## 알려진 제한 · 참고

- **Skill 콤보 옵션**은 빌드 시 **첫 번째 테스트(`test0`)의 스킬 목록**에서만 생성됨. 테스트를 바꿔도 스킬 목록이 동적으로 바뀌지는 않을 수 있음 (추후 manifest 기반으로 확장 가능).
- **Listening / Writing / Speaking**은 manifest에 항목을 넣을 수 있으나, Reading처럼 `<template>`·스왑이 모두 연결된 상태는 아닐 수 있음. 추가 시 위 ID 규칙을 동일하게 맞추면 됨.

---

## 문서 메타

- 이 파일은 **`published: false`** 로 두어 사이트 공개 페이지 목록에 올리지 않는 것을 의도함 (Jekyll 설정에 따라 동작이 다를 수 있음).
- 최종 수정 기준: IELTS Lab의 탑바·Reading 이패널·READER·하이라이트·manifest·로컬 feed 스킵까지 반영한 상태.
