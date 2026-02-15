# WebCJIM (chaejinims2.github.io)

NVMe Host Driver / Embedded Linux / Automation Tools — 개인 사이트 및 문서 허브.

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **사이트명** | WebCJIM |
| **URL** | https://chaejinims2.github.io |
| **엔진** | Jekyll (테마 없음, app-shell 전용) |
| **배포** | GitHub Actions → GitHub Pages (`main` 푸시 시 빌드·배포) |
| **스타일** | `tokens.css` + `base.css` (테마/CSS 프레임워크 미사용) |

- **콘텐츠:** 메인(소개), Docs, Snippets, About/Leadership/Projects/Expertise 페이지.
- **구성:** Topbar + Sidebar(네비) + Content + Footer 로 고정된 **app-shell** 한 종만 사용.

---

## 프로젝트 구조

```
chaejinims2.github.io/
├── _config.yml              # 사이트 설정, collections, defaults, theme: null
├── _layouts/
│   ├── default.html         # app-shell (topbar, sidebar, content, footer)
│   ├── docs.html            # layout: default 래퍼
│   ├── snippets.html        # layout: default 래퍼
│   └── page.html            # layout: default 래퍼 (일반 페이지)
├── _includes/
│   ├── head.html            # meta charset, viewport, no-js
│   ├── scripts.html         # footer_scripts (선택)
│   └── cards/
│       ├── leadership-card.html
│       ├── project-card.html
│       └── expertise-card.html
├── _data/
│   ├── nav.yml              # 사이드바 네비게이션 (Docs / Snippets 그룹)
│   ├── projects.yml
│   ├── expertise.yml
│   └── leadership.yml
├── _docs/                   # collection: docs → /docs/:path/
│   ├── index.md
│   ├── linux/index.md
│   └── nvme/index.md
├── _snippets/               # collection: snippets → /snippets/:path/
│   ├── index.md
│   ├── bash/index.md
│   └── csharp/index.md
├── _pages/                  # collection: pages → /:path/
│   ├── about.md             # /about/
│   ├── leadership.md
│   ├── projects.md
│   └── expertise.md
├── index.md                 # 루트 (layout: default)
├── assets/
│   ├── css/
│   │   ├── tokens.css       # 디자인 토큰 (색, 간격 등)
│   │   └── base.css         # app-shell 레이아웃·기본 스타일
│   ├── js/                  # (레거시, app-shell에서는 미참조)
│   ├── scripts/
│   └── vocas/
├── .github/workflows/
│   └── pages.yml            # main 푸시 시 Jekyll 빌드 → GitHub Pages 배포
├── Gemfile                  # github-pages
└── _site/                   # 빌드 결과 (생성됨, 버전 관리 제외)
```

---

## 핵심 동작 요약

1. **레이아웃**
   - 모든 페이지는 `default` 계열 레이아웃 사용 (`docs`/`snippets`/`page`는 모두 `layout: default` + `{{ content }}`).
   - `_config.yml`의 `defaults`로 collection별 `layout`, `nav_group` 자동 지정.

2. **네비게이션**
   - Topbar: Docs, Snippets, About 링크.
   - Sidebar: `_data/nav.yml`의 `groups` → 현재 URL 기준 active 표시.

3. **스타일**
   - `_layouts/default.html`에서 `tokens.css` → `base.css` 순으로만 로드. SCSS/테마 미사용.

4. **배포**
   - `main` 브랜치 푸시 시 `.github/workflows/pages.yml`이 `bundle exec jekyll build` 후 `_site`를 GitHub Pages에 배포.

---

## 로컬 빌드

```bash
bundle install
bundle exec jekyll build
# 서버: bundle exec jekyll serve
```

---

## 참고

- **테마:** 사용하지 않음 (`theme: null`). 과거 cgit/테마 잔재 제거 후 app-shell만 유지.
- **플러그인:** jekyll-feed, jekyll-seo-tag (GitHub Pages 호환).
