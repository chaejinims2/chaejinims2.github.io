---
title: Dinner location questionnaire
---

<div class="exui-page" data-exui-naver-ncp-key-id="e30sqt28b3">
  <style>
    .exui-page {
      color-scheme: dark;
      --bg-0: #0c1426;
      --bg-1: #111d33;
      --bg-2: #162540;
      --body-bg: #0c1426;
      --border: #ffffff18;
      --text: #f0f4f8;
      --text-75: #e2e8f0;
      --text-85: #e2e8f0;
      --muted: #94a3b8;
      --accent: #00a1e4;
      --accent-bg: #00a1e428;
      --overlay-w-0a: #ffffff0a;
      --accent-bg-12: #00a1e41f;
      --app-border: #ffffff18;
      --tone-text: var(--text);
      --tone-text-75: var(--text-75);
      --tone-text-85: var(--text-85);
      --tone-muted: var(--muted);
      --tone-accent: var(--accent);
      --tone-accent-bg: var(--accent-bg);
      --app-bg: var(--bg-0);
      --app-panel: var(--bg-1);
      --app-panel-2: var(--bg-0);
      --app-nav-item-active-bg: var(--accent-bg-12);
      --focus-ring: var(--accent);
      --bg-base: var(--bg-0);
      --text-primary: var(--text-85);
      --text-muted: var(--muted);
      --tag-bg: #ffffff12;
      --tag-border: var(--border);
      --nav-hover: var(--overlay-w-0a);
      --space-4px: 4px;
      --space-6px: 6px;
      --space-8px: 8px;
      --space-10px: 10px;
      --space-12px: 12px;
      --space-16px: 16px;
      --space-20px: 20px;
      --space-24px: 24px;
      --space-32px: 32px;
      --radius-2: 0.375rem;
      --radius-4: 0.625rem;
      --radius-999px: 999px;
      --fs-2: 0.85rem;
      --fs-3: 0.875rem;
      --fs-4: 0.95rem;
      --fs-5: 1rem;
      --fs-6: 1.125rem;
      --fs-8: 1.5rem;
      --fw-700: 700;
      --fw-800: 800;
      --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans KR", sans-serif;
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }
    .exui-page, .exui-page * { box-sizing: border-box; }
    .exui-page { 
      min-height: 100%;
      background: var(--body-bg);
      color: var(--text-primary);
      font-family: var(--font-sans);
      font-size: 16px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .exui-page :focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 2px;
    }
    .exui-page .app { min-height: 100%; }
    .exui-page .main {
      min-height: 100%;
      background: var(--body-bg);
    }
    /* 결과 보기: 스크롤 없이 한 화면에 맞추기 */
    .exui-page.exui-mode-result .main-inner {
      height: 100vh;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .exui-page.exui-mode-result .page-intro {
      padding-bottom: clamp(6px, 1.2vh, var(--space-12px));
      margin-bottom: clamp(6px, 1.2vh, var(--space-12px));
    }
    .exui-page.exui-mode-result .exui-root {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .exui-page.exui-mode-result #exui-result.exui-panel {
      flex: 1 1 auto;
      min-height: 0;
      margin-bottom: 0;
      display: flex;
      flex-direction: column;
      gap: clamp(6px, 1.2vh, var(--space-12px));
      overflow: hidden;
    }
    .exui-page.exui-mode-result #exui-result .exui-map-panel {
      flex: 0 0 auto;
      min-height: 140px;
      height: clamp(160px, 32vh, 260px);
      display: flex;
      flex-direction: column;
    }
    /* 결과 화면 컨텐츠 폭을 1,2번 영역과 동일하게(추가 인셋 제거) */
    .exui-page.exui-mode-result #exui-map-panel {
      margin: 0 0 clamp(6px, 1.2vh, var(--space-12px));
      padding: 0;
      border: 0;
      background: transparent;
    }
    .exui-page.exui-mode-result #exui-map-canvas {
      border-radius: var(--radius-4);
    }
    .exui-page.exui-mode-result #exui-map-canvas {
      flex: 1 1 auto;
      min-height: 0;
    }
    .exui-page.exui-mode-result #exui-result table {
      font-size: 0.8125rem;
    }
    .exui-page.exui-mode-result .exui-result th,
    .exui-page.exui-mode-result .exui-result td {
      padding: 6px 8px;
    }
    .main-inner {
      max-width: 920px;
      margin: 0 auto;
      padding: var(--space-32px) var(--space-24px) 0px;
    }
    @media (max-width: 640px) {
      .main-inner { padding: var(--space-16px) var(--space-12px) 64px; }
    }
    .page-intro {
      padding-bottom: var(--space-24px);
      margin-bottom: var(--space-24px);
      border-bottom: 1px solid var(--border);
    }
    .page-intro .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 0;
      justify-content: space-between;
    }
    .page-intro .brand h1 { margin: 0; }
    .brand-logo {
      width: 28px;
      height: 28px;
      flex-shrink: 0;
      border-radius: 20%;
      color: var(--accent);
    }
    .page-intro .brand h1 {
      font-size: 1.75rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      line-height: 1.25;
      color: var(--text-primary);
    }
    .brand-description {
      color: var(--text-muted);
      font-size: 1rem;
      line-height: 1.55;
      margin: 0 0 8px;
    }
    .tag-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-8px);
      margin-top: 0;
      margin-left: auto;
      justify-content: flex-end;
    }
    .btn-tag {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      font-size: 12px;
      font-family: var(--font-mono);
      color: var(--text-muted);
      background: var(--tag-bg);
      border: 1px solid var(--tag-border);
      border-radius: 999px;
    }
    .exui-root {
      --exui-gap: var(--space-16px);
      --exui-r: var(--radius-4);
      --exui-shadow-soft: 0 6px 18px rgba(0,0,0,.10);
      max-width: 56rem;
      margin: 0 auto;
    }
    .exui-root .exui-panel {
      border: 1px solid var(--app-border);
      border-radius: calc(var(--exui-r) + 2px);
      padding: clamp(var(--space-12px), 2vw, var(--space-20px));
      margin-bottom: var(--exui-gap);
      background: linear-gradient(180deg, color-mix(in srgb, var(--app-panel) 92%, transparent) 0%, var(--app-panel) 100%);
      box-shadow: var(--exui-shadow-soft);
      backdrop-filter: saturate(1.05);
    }
    .exui-root h2 {
      font-size: clamp(var(--fs-6), 1.1vw + 0.95rem, var(--fs-8));
      margin: 0 0 var(--space-12px);
      font-weight: var(--fw-800);
      letter-spacing: -0.02em;
      color: var(--tone-text);
    }
    .exui-root h2 + .exui-hint { margin-top: -4px; }
    .exui-root p.exui-hint {
      color: var(--tone-muted);
      font-size: var(--fs-3);
      margin: 0 0 var(--space-12px);
      line-height: 1.55;
    }
    .exui-columns { display: grid; gap: var(--space-16px); margin-bottom: var(--space-0x);}
    @media (min-width: 720px) { .exui-columns.exui-2 { grid-template-columns: 1fr 1fr; } }
    .exui-list-title {
      display: inline-flex;
      align-items: center;
      gap: var(--space-6px);
      font-size: var(--fs-3);
      font-weight: var(--fw-700);
      margin-bottom: var(--space-8px);
      color: var(--tone-text-85);
    }
    .exui-pool-details {
      margin-top: var(--space-12px);
      /* details를 접어도 아래 후보 영역 높이를 예약해서 레이아웃 점프를 막음 */
      min-height: calc(28px + 56px + var(--space-8px));
    }
    .exui-pool-details > .exui-pool-summary {
      display: flex;
      align-items: center;
      gap: var(--space-6px);
      list-style: none;
      cursor: pointer;
      user-select: none;
      margin-bottom: var(--space-8px);
      width: max-content;
      max-width: 100%;
    }
    .exui-pool-details > .exui-pool-summary::-webkit-details-marker {
      display: none;
    }
    .exui-pool-details > .exui-pool-summary::marker {
      content: '';
    }
    .exui-pool-details > .exui-pool-summary::before {
      content: '▸';
      display: inline-block;
      color: var(--tone-muted);
      transition: transform 0.15s ease;
    }
    .exui-pool-details[open] > .exui-pool-summary::before {
      transform: rotate(90deg);
    }
    .exui-chip-btn-ico {
      width: 0.95rem;
      height: 0.95rem;
      display: block;
      pointer-events: none;
    }
    .exui-chip-btn-ico--flip {
      transform: scaleY(-1);
    }
    .exui-sortable {
      min-height: 0;
      border: 1px solid color-mix(in srgb, var(--app-border) 70%, transparent);
      border-radius: var(--radius-4);
      padding: var(--space-8px);
      display: flex;
      flex-direction: column;
      gap: var(--space-6px);
      background: var(--app-panel-2);
      transition: border-color .15s ease, box-shadow .15s ease, background-color .15s ease;
    }
    /* 후보 칸: 스크롤 없이 줄바꿈 */
    #exui-food-pool,
    #exui-loc-shed {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      align-content: flex-start;
      overflow: hidden;
      min-height: 56px;
    }
    .exui-sortable:focus-within {
      border-color: color-mix(in srgb, var(--tone-accent) 65%, var(--app-border));
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--tone-accent) 25%, transparent);
    }
    .exui-chip {
      padding: var(--space-8px) var(--space-12px);
      border-radius: var(--radius-4);
      border: 1px solid color-mix(in srgb, var(--app-border) 85%, transparent);
      background: linear-gradient(180deg, var(--app-bg) 0%, color-mix(in srgb, var(--app-bg) 85%, var(--app-panel)) 100%);
      cursor: grab;
      font-size: var(--fs-3);
      touch-action: manipulation;
      user-select: none;
      transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease, filter .12s ease;
    }
    .exui-chip:hover {
      border-color: color-mix(in srgb, var(--tone-accent) 35%, var(--app-border));
      box-shadow: 0 8px 20px rgba(0,0,0,.10);
      transform: translateY(-1px);
    }
    .exui-chip:active { cursor: grabbing; transform: translateY(0); }
    .exui-chip--loc { cursor: grab; }
    .exui-chip.exui-chip--ghost { opacity: 0.55; filter: saturate(.9); }
    /* 선호 상위 3개 칩: 배경을 조금 더 밝게 */
    #exui-food-ranked > .exui-chip:nth-child(-n+3),
    #exui-loc-ranked > .exui-chip:nth-child(-n+1) {
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--tone-accent) 10%, var(--app-bg)) 0%,
        color-mix(in srgb, var(--tone-accent) 6%, var(--app-panel)) 100%
      );
      border-color: color-mix(in srgb, var(--tone-accent) 22%, var(--app-border));
    }
    .exui-chip.exui-chip--food,
    .exui-chip.exui-chip--loc {
      padding: var(--space-6px) var(--space-8px);
    }
    /* 선호 칩: 스크롤 없이 줄바꿈 */
    #exui-food-ranked,
    #exui-loc-ranked {
      counter-reset: exui-pref-rank;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      align-content: flex-start;
      overflow: hidden;
      min-height: 56px;
    }
    #exui-food-ranked > .exui-chip,
    #exui-loc-ranked > .exui-chip {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: center;
      gap: var(--space-4px);
      flex: 0 0 auto;
      max-width: 100%;
    }
    #exui-food-ranked > .exui-chip > .exui-chip-row,
    #exui-loc-ranked > .exui-chip > .exui-chip-row {
      flex-direction: column;
      align-items: center;
      gap: var(--space-4px);
    }
    #exui-food-ranked > .exui-chip .exui-chip-order,
    #exui-loc-ranked > .exui-chip .exui-chip-order {
      align-self: center;
    }
    #exui-food-ranked > .exui-chip .exui-chip-label,
    #exui-loc-ranked > .exui-chip .exui-chip-label {
      flex: 0 0 auto;
      width: 100%;
      text-align: center;
    }
    #exui-food-ranked > .exui-chip::before,
    #exui-loc-ranked > .exui-chip::before {
      counter-increment: exui-pref-rank;
      content: counter(exui-pref-rank);
      flex-shrink: 0;
      width: max-content;
      min-width: 0;
      text-align: center;
      align-self: center;
      font-weight: var(--fw-700);
      font-variant-numeric: tabular-nums;
      font-size: var(--fs-2);
      line-height: 1.2;
      color: var(--tone-muted);
    }
    #exui-food-pool > .exui-chip,
    #exui-loc-shed > .exui-chip {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--space-8px);
      flex: 0 0 auto;
      max-width: min(260px, 70vw);
    }
    #exui-food-pool > .exui-chip::before,
    #exui-loc-shed > .exui-chip::before {
      content: "";
      flex-shrink: 0;
      min-width: 0;
      text-align: center;
      font-weight: var(--fw-700);
      font-size: var(--fs-2);
      line-height: 1.2;
      color: var(--tone-muted);
    }
    #exui-food-pool > .exui-chip .exui-chip-label,
    #exui-loc-shed > .exui-chip .exui-chip-label {
      color: var(--tone-muted);
      text-decoration: line-through;
      text-decoration-color: color-mix(in srgb, var(--tone-muted) 75%, transparent);
    }
    #exui-food-pool > .exui-chip .exui-chip-thumb {
      display: none;
    }
    .exui-chip-row {
      display: flex;
      align-items: center;
      gap: var(--space-8px);
      flex: 1;
      min-width: 0;
    }
    .exui-chip-row .exui-chip-label {
      flex: 1;
      min-width: 0;
      cursor: grab;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .exui-chip-thumb {
      width: clamp(75px, 9vw, 52px);
      height: clamp(75px, 9vw, 52px);
      border-radius: 999px;
      object-fit: cover;
      flex-shrink: 0;
      border: 1px solid color-mix(in srgb, var(--app-border) 75%, transparent);
      background: var(--app-panel-2);
    }
    .exui-chip-order {
      display: inline-flex;
      flex-shrink: 0;
      gap: 2px;
      align-items: center;
    }
    .exui-chip-order[hidden] { display: none !important; }
    .exui-chip-btn {
      appearance: none;
      margin: 0;
      box-sizing: border-box;
      width: 1.625rem;
      height: 1.625rem;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid color-mix(in srgb, var(--app-border) 80%, transparent);
      border-radius: calc(var(--radius-4) - 1px);
      background: color-mix(in srgb, var(--app-panel-2) 80%, transparent);
      color: var(--tone-text-85);
      font-size: 0.8125rem;
      line-height: 1;
      cursor: pointer;
      transition: border-color .12s ease, background-color .12s ease, opacity .12s ease;
    }
    .exui-chip-btn:hover:not(:disabled) {
      border-color: color-mix(in srgb, var(--tone-accent) 35%, var(--app-border));
      background: color-mix(in srgb, var(--tone-accent) 12%, var(--app-panel-2));
    }
    /* 순서 버튼 색상: up(따봉)=파랑, down(싫어요)=빨강 */
    .exui-chip-btn[data-exui-food-act="up"],
    .exui-chip-btn[data-exui-loc-act="up"] {
      background: color-mix(in srgb, #60A5FA 78%, var(--app-panel-2));
      border-color: color-mix(in srgb, #60A5FA 45%, var(--app-border));
      color: #eff6ff;
    }
    .exui-chip-btn[data-exui-food-act="down"],
    .exui-chip-btn[data-exui-loc-act="down"] {
      background: color-mix(in srgb, #f87171 78%, var(--app-panel-2));
      border-color: color-mix(in srgb, #f87171 45%, var(--app-border));
      color: #fef2f2;
    }
    .exui-chip-btn[data-exui-food-act="up"]:hover:not(:disabled),
    .exui-chip-btn[data-exui-loc-act="up"]:hover:not(:disabled) {
      background: color-mix(in srgb, #2563eb 88%, var(--app-panel-2));
    }
    .exui-chip-btn[data-exui-food-act="down"]:hover:not(:disabled),
    .exui-chip-btn[data-exui-loc-act="down"]:hover:not(:disabled) {
      background: color-mix(in srgb, #dc2626 88%, var(--app-panel-2));
    }
    .exui-chip-btn:disabled {
      opacity: 0.32;
      cursor: not-allowed;
    }
    .exui-cars {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-12px);
      margin: var(--space-12px) 0;
    }
    .exui-cars label {
      display: inline-flex;
      align-items: center;
      gap: var(--space-6px);
      cursor: pointer;
      font-size: var(--fs-4);
      padding: 6px 10px;
      border-radius: var(--radius-999px);
      border: 1px solid color-mix(in srgb, var(--app-border) 75%, transparent);
      background: color-mix(in srgb, var(--app-panel-2) 65%, transparent);
      transition: border-color .12s ease, background-color .12s ease, transform .12s ease;
    }
    .exui-cars label:hover {
      border-color: color-mix(in srgb, var(--tone-accent) 35%, var(--app-border));
      transform: translateY(-1px);
    }
    .exui-cars input { accent-color: var(--tone-accent); }
    .exui-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      gap: var(--space-12px);
      margin-top: var(--space-16px);
    }
    .exui-btn {
      appearance: none;
      border: 1px solid color-mix(in srgb, var(--app-border) 80%, transparent);
      background: linear-gradient(180deg, color-mix(in srgb, var(--app-nav-item-active-bg) 78%, transparent) 0%, var(--app-nav-item-active-bg) 100%);
      color: var(--tone-text);
      padding: 10px 14px;
      border-radius: var(--radius-4);
      font-size: var(--fs-4);
      font-weight: var(--fw-700);
      cursor: pointer;
      transition: transform .12s ease, box-shadow .12s ease, filter .12s ease, border-color .12s ease;
      box-shadow: 0 10px 22px rgba(0,0,0,.10);
    }
    .exui-btn:hover {
      filter: brightness(1.06);
      border-color: color-mix(in srgb, var(--tone-accent) 30%, var(--app-border));
      transform: translateY(-1px);
    }
    .exui-btn:active { transform: translateY(0); box-shadow: 0 6px 16px rgba(0,0,0,.10); }
    .exui-btn:focus-visible,
    .exui-chip-btn:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--tone-accent) 25%, transparent);
    }
    .exui-btn-secondary {
      background: transparent;
      color: var(--tone-muted);
      box-shadow: none;
    }
    .exui-btn-secondary:hover { background: color-mix(in srgb, var(--app-panel-2) 70%, transparent); }
    .exui-error {
      color: #f87171;
      font-size: var(--fs-3);
      margin-top: var(--space-8px);
      padding: 10px 12px;
      border-radius: var(--radius-4);
      border: 1px solid color-mix(in srgb, #f87171 40%, transparent);
      background: color-mix(in srgb, #f87171 10%, transparent);
    }
    .exui-result { margin-top: var(--space-24px); }
    .exui-result table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: var(--fs-3);
      overflow: hidden;
      border-radius: var(--radius-4);
    }
    .exui-result th, .exui-result td {
      border-bottom: 1px solid color-mix(in srgb, var(--app-border) 70%, transparent);
      padding: var(--space-8px) var(--space-10px);
      text-align: left;
      vertical-align: top;
    }
    .exui-result th {
      position: sticky;
      top: 0;
      z-index: 1;
      background: color-mix(in srgb, var(--app-panel-2) 92%, transparent);
      font-weight: var(--fw-700);
      backdrop-filter: blur(8px);
    }
    .exui-result tbody tr:nth-child(odd) td { background: color-mix(in srgb, var(--app-panel) 70%, transparent); }
    .exui-result tbody tr:hover td { background: color-mix(in srgb, var(--tone-accent-bg) 18%, var(--app-panel)); }
    .exui-result[hidden] { display: none !important; }
    .exui-result-link {
      color: var(--tone-accent);
      text-decoration: underline;
      text-decoration-color: color-mix(in srgb, var(--tone-accent) 45%, transparent);
      text-underline-offset: 2px;
    }
    .exui-result-link:hover { text-decoration-color: var(--tone-accent); }
    /* 음식점수 또는 장소점수 중 하나라도 0: 글씨만 어둡게(흐리게) */
    .exui-result tbody tr.exui-result-row--zero td {
      color: color-mix(in srgb, var(--tone-muted) 72%, #0f172a 28%);
    }
    .exui-result tbody tr.exui-result-row--zero .exui-result-link {
      color: color-mix(in srgb, var(--tone-muted) 82%, var(--tone-accent) 18%);
      text-decoration-color: color-mix(in srgb, var(--tone-muted) 50%, transparent);
    }
    .exui-result tbody tr.exui-result-row--zero:hover td {
      color: color-mix(in srgb, var(--tone-muted) 88%, var(--tone-text-85) 12%);
    }
    .exui-result tbody tr.exui-result-row--zero:hover .exui-result-link {
      color: var(--tone-accent);
      text-decoration-color: color-mix(in srgb, var(--tone-accent) 45%, transparent);
    }
    fieldset.exui-fieldset { border: none; margin: 0; padding: 0; }
    .exui-map-panel {
      margin: var(--space-16px) 0 var(--space-20px);
      padding: var(--space-12px);
      border-radius: var(--radius-4);
      border: 1px solid color-mix(in srgb, var(--app-border) 75%, transparent);
      background: color-mix(in srgb, var(--app-panel-2) 50%, transparent);
    }
    .exui-map-panel h3 {
      margin: 0 0 var(--space-8px);
      font-size: var(--fs-5);
      font-weight: var(--fw-700);
      color: var(--tone-text);
    }
    .exui-map-canvas {
      width: 100%;
      height: min(42vh, 360px);
      min-height: 240px;
      border-radius: var(--radius-4);
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--app-border) 60%, transparent);
      background: var(--bg-2);
    }
    .exui-map-fallback {
      margin: 0;
      padding: var(--space-12px);
      font-size: var(--fs-3);
      line-height: 1.55;
      color: var(--tone-muted);
      border-radius: var(--radius-4);
      border: 1px dashed color-mix(in srgb, var(--app-border) 80%, transparent);
    }
    .exui-map-fallback code {
      font-size: 0.9em;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--overlay-w-0a);
    }
  </style>

<div class="app">
  <main class="main">
    <div class="main-inner">
      <header class="page-intro" id="intro">
        <div class="brand">
          <svg class="brand-logo" aria-hidden="true"><use href="#i-yc-logo"/></svg>
          <h2>SSD_UI 회식 설문</h2>
          <div class="tag-row">
            <span class="btn-tag"># exicon</span>
            <span class="btn-tag"># ssd_ui</span>
            <span class="btn-tag"># 회식</span>
            <span class="btn-tag"># 4/9</span>
          </div>
        </div>
      </header>
      <div class="exui-root" id="exui-root">
        <form class="exui-panel" id="exui-form" autocomplete="on">
          <fieldset class="exui-fieldset">
            <legend><h3>1. 메뉴</h3></legend>
            <div class="exui-columns">
              <div>
                <p class="exui-hint"><strong>칩(이름)을 클릭</strong>하면 선호 ↔ 후보를 전환해요. 선호 칸에서는 <strong>엄지손가락 버튼</strong>으로 순서를 바꿀 수 있어요.</p>
                <div class="exui-sortable" id="exui-food-ranked" data-exui-drop="food"></div>
                <details class="exui-pool-details" open>
                  <summary class="exui-list-title exui-pool-summary">
                    후보
                  </summary>
                  <div class="exui-sortable" id="exui-food-pool" data-exui-drop="food"></div>
                </details>
              </div>
            </div>
          </fieldset>
          <fieldset class="exui-fieldset">
            <legend><h3>2. 위치</h3></legend>
            <div class="exui-cars">
              <label><input type="radio" name="exui_car" value="yes" id="exui-car-yes"> 차 있음 (O)</label>
              <label><input type="radio" name="exui_car" value="no" id="exui-car-no" checked> 차 없음 (X)</label>
            </div>
            <p class="exui-hint exui-car-hint-yes" hidden>차가 있으신가요? 그렇다면 주차 시간이 최소 2시간 보장된다는 전제 하에, 회식이 꺼려지는 장소는 아래쪽 「후보(=제외)」에 두고, 나머지만 상단으로 옮겨 선호 순서로 맞춰 주세요.</p>
            <p class="exui-hint exui-car-hint-no" hidden>대중교통으로 귀가하시나요? 집 가기 불편해 회식을 피하고 싶은 장소는 아래쪽 「후보(=제외)」에 두고, 나머지만 상단으로 옮겨 선호 순서로 맞춰주세요.</p>
            <div class="exui-columns" style="margin-top: var(--space-8px);">
              <div>
                <div class="exui-sortable exui-sortable--locations" id="exui-loc-ranked" data-exui-drop="loc"></div>
                <details class="exui-pool-details" open>
                  <summary class="exui-list-title exui-pool-summary">
                    후보
                  </summary>
                  <div class="exui-sortable exui-sortable--locations" id="exui-loc-shed" data-exui-drop="loc"></div>
                </details>
              </div>
            </div>
          </fieldset>
          <div class="exui-actions">
            <button type="button" class="exui-btn exui-btn-secondary" id="exui-reset">설문 초기화</button>
            <button type="submit" class="exui-btn" id="exui-submit">제출 · 결과 보기</button>
          </div>
          <div class="exui-error" id="exui-error" hidden></div>
        </form>
        <div class="exui-panel exui-result" id="exui-result" hidden>
          <div class="exui-map-panel" id="exui-map-panel">
            <div class="exui-map-fallback" id="exui-map-key-missing" hidden>
              이 영역에 네이버 지도를 띄우려면 페이지 최상단의 <code>data-exui-naver-ncp-key-id</code>에
              <a href="https://www.ncloud.com/product/applicationService/maps" target="_blank" rel="noopener noreferrer">네이버 클라우드 Maps</a>에서 발급한 Web 동적 지도용 <strong>ncpKeyId</strong>를 넣어 주세요.
            </div>
            <div class="exui-map-canvas" id="exui-map-canvas" hidden aria-label="선호 식당 위치 지도"></div>
            <p class="exui-hint" id="exui-map-empty" hidden style="margin-bottom: 0;">지도에 올릴 식당이 없습니다. 음식 선호와 식당의 메뉴 종류, 또는 장소 선호가 겹치는지 확인해 주세요.</p>
          </div>
          <div style="overflow: hidden;">
            <table id="exui-result-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>식당</th>
                  <th>종류</th>
                  <th>장소</th>
                  <th>음식점수</th>
                  <th>장소점수</th>
                  <th>합계</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <div class="exui-actions" style="margin: var(--space-8px);">
            <button type="button" class="exui-btn exui-btn-secondary" id="exui-copy">결과(텍스트) 복사</button>
            <span class="exui-hint" id="exui-copy-status" aria-live="polite"></span>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<!-- 지도: restaurants[].lat/.lng, 선택 marker_image. landmarks[]: label, lat, lng, 선택 note·url (역·회사 등 참고 지점). -->
<script type="application/json" id="exui-json-data">
{
  "food_types": [
    { "id": "pork_belly", "label": "삼겹살(돼지)", "image_url": "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250514_144%2F1747214264067fFb7W_JPEG%2F1000026943.jpg" },
    { "id": "chinese_lamb", "label": "중식/양꼬치", "image_url": "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20180411_15%2F1523458421369GdOE8_JPEG%2FVqP6HK0RPMH_IfX4CBLZ2WeJ.JPG.jpg" },
    { "id": "beef", "label": "소고기", "image_url": "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20180622_73%2F1529632086594CzKdF_JPEG%2F5rNegggYNKkaZElARIP0ymkG.jpg" },
    { "id": "jokbal_bossam", "label": "족발보쌈", "image_url": "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241203_295%2F17332024577956JYXc_PNG%2FIMG_6766.png" },
    { "id": "chicken", "label": "치킨", "image_url": "https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNjAzMTZfOTEg%2FMDAxNzczNjQ0MDI2ODQ0.hf7KvB7BlG9IMQ-zxuu0TxU68Pw5zt256npM1_kwGhQg.SQ9NlDQCZ8mMImvcr08WC88U-KFLdpIk2O4ASsTasb4g.JPEG%2F20260311_184206.jpg.jpg%3Ftype%3Dw1500_60_sharpen" },
    { "id": "shellfish_steam", "label": "조개찜", "image_url": "https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTA2MjJfMzcg%2FMDAxNzUwNTY5OTU3NDAx.Ni6eitIb-tDn6lPYwgv5nPfO-HGRBGCvSlApzX5LxPwg.D1LkkKVBvnZ0o4SKYR-KgkGSNdTqgEIrhkEv1tRnoI8g.JPEG%2F61B8DE90-A652-440A-BBF3-44A6F985214A.jpeg%3Ftype%3Dw1500_60_sharpen" },
    { "id": "gopchang_makchang", "label": "곱창/막창", "image_url": "https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNjAzMTBfOCAg%2FMDAxNzczMTE1NjU3ODg1.3xLSsEZRmwmhYlwIKGA838X-hW8sEfDeUf8U9jSyEQwg.qlTnjw-nL8e35UzZON-4IlEF25VsDQ_EIUYMxFKxVQIg.JPEG%2F20260307_185102.jpg%3Ftype%3Dw1500_60_sharpen" },
    { "id": "sashimi_seafood", "label": "회/해산물", "image_url": "https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTEwMTBfMjMy%2FMDAxNzYwMDYxOTYwMjMx.fyshp2myOseJE6N76etxU_wKBMDnS0rdktrRAq5x4vMg.nRS1muPyoZkiNsPTNfhNG_idXTdgs3P5s6_fMFX20KIg.JPEG%2FResized_20250425_182324_IMG_3802.jpeg.jpg%3Ftype%3Dw1500_60_sharpen" }
  ],
  "locations": [
    { "id": "pangyo_lotte_mart", "label": "판교역 2출구 롯데마트" },
    { "id": "pangyo_alphadome", "label": "판교역 4출구 알파돔 시티 판교" },
    { "id": "pangyo_eat_alley", "label": "판교역 1출구 먹자골목" },
    { "id": "pangyo_uspace_1_2", "label": "판교 유스페이스1/2" }
  ],
  "landmarks": [
    { "id": "pangyo_station", "label": "판교역", "lat": 37.39478, "lng": 127.11119, "note": "신분당선·경강선 등", "url": "https://map.naver.com/p/search/%ED%8C%90%EA%B5%90%EC%97%AD" },
    { "id": "office", "label": "회사", "lat": 37.405255, "lng": 127.099908, "note": "예시 좌표입니다. 실제 사옥으로 lat/lng를 바꿔 주세요." }
  ],
  "restaurants": [
    { "name": "동그리 솥뚜껑", "detail": "삼겹살", "url": "https://naver.me/xprpXmGb", "location_id": "pangyo_uspace_1_2", "food_ids": ["pork_belly"], "lat": 37.400839, "lng": 127.107021 },
    { "name": "원조부안집", "detail": "삼겹살", "url": "https://naver.me/GYC9P6aG", "location_id": "pangyo_uspace_1_2", "food_ids": ["pork_belly"], "lat": 37.400481, "lng": 127.107403 },
    { "name": "화포식당", "detail": "삼겹살", "url": "https://naver.me/xMjKZuJ4", "location_id": "pangyo_uspace_1_2", "food_ids": ["pork_belly"], "lat": 37.401199, "lng": 127.107184 },
    { "name": "미방", "detail": "양고기", "url": "https://naver.me/FxFtwZV7", "location_id": "pangyo_uspace_1_2", "food_ids": ["chinese_lamb"], "lat": 37.402389, "lng": 127.107496 },
    { "name": "양우 양꼬치", "detail": "양꼬치", "url": "https://naver.me/Fafyrb0w", "location_id": "pangyo_uspace_1_2", "food_ids": ["chinese_lamb"], "lat": 37.401211, "lng": 127.106493 },
    { "name": "양우정", "detail": "소고기", "url": "https://naver.me/5IS9zdHG", "location_id": "pangyo_alphadome", "food_ids": ["beef"], "lat": 37.395855, "lng": 127.109080 },
    { "name": "해가옥", "detail": "족발보쌈", "url": "https://naver.me/GSDAkEBq", "location_id": "pangyo_lotte_mart", "food_ids": ["jokbal_bossam"], "lat": 37.396154, "lng": 127.113642 },
    { "name": "홀썸치킨", "detail": "치킨", "url": "https://naver.me/FTXwfpn8", "location_id": "pangyo_lotte_mart", "food_ids": ["chicken"], "lat": 37.396154, "lng": 127.113642 },
    { "name": "찌마기", "detail": "조개찜", "url": "https://naver.me/IMyG0s4Q", "location_id": "pangyo_alphadome", "food_ids": ["shellfish_steam"], "lat": 37.395655, "lng": 127.108653 },
    { "name": "가장맛있는족발", "detail": "족발보쌈", "url": "https://naver.me/FvEgXnDC", "location_id": "pangyo_uspace_1_2", "food_ids": ["jokbal_bossam"], "lat": 37.401088, "lng": 127.107301 },
    { "name": "고대생막창", "detail": "곱창/막창", "url": "https://naver.me/5eUciiZW", "location_id": "pangyo_uspace_1_2", "food_ids": ["gopchang_makchang"], "lat": 37.402702, "lng": 127.107264 },
    { "name": "낚시꾼김춘복의도시어부", "detail": "회/해산물", "url": "https://naver.me/x8tQrhEd", "location_id": "pangyo_uspace_1_2", "food_ids": ["sashimi_seafood"], "lat": 37.400899, "lng": 127.107611 },
    { "name": "삼대곱창", "detail": "곱창/막창", "url": "https://naver.me/5fIpaP88", "location_id": "pangyo_uspace_1_2", "food_ids": ["gopchang_makchang"], "lat": 37.400452, "lng": 127.106927 },
    { "name": "인생곱창", "detail": "곱창/막창", "url": "https://naver.me/FXwGWqrX", "location_id": "pangyo_eat_alley", "food_ids": ["gopchang_makchang"], "lat": 37.397925, "lng": 127.111772 }
  ]
}
</script>

<script>
(function () {
  var root = document.getElementById('exui-root');
  if (!root) return;

  var data = {};
  try {
    data = JSON.parse(document.getElementById('exui-json-data').textContent);
  } catch (e) { console.error(e); return; }

  var foodPool = document.getElementById('exui-food-pool');
  var foodRanked = document.getElementById('exui-food-ranked');
  var locRanked = document.getElementById('exui-loc-ranked');
  var locShed = document.getElementById('exui-loc-shed');
  var carYes = document.getElementById('exui-car-yes');
  var carNo = document.getElementById('exui-car-no');
  var hintYes = root.querySelector('.exui-car-hint-yes');
  var hintNo = root.querySelector('.exui-car-hint-no');
  var errEl = document.getElementById('exui-error');
  var resultPanel = document.getElementById('exui-result');
  var formPanel = document.getElementById('exui-form');
  var resultBody = document.querySelector('#exui-result-table tbody');
  var copyBtn = document.getElementById('exui-copy');
  var copyStatus = document.getElementById('exui-copy-status');
  var lastSummary = '';
  var exuiNaverMap = null;
  var exuiMapMarkers = [];
  var exuiMapInfoWindow = null;
  var exuiMapRenderToken = 0;
  var exuiNaverMapScriptCallbacks = null;

  /* 칸마다 wireDrag 클로저를 두면 A칸→B칸 드롭 시 B의 dragged는 항상 null (Chrome 포함 전 브라우저) */
  var exuiDragged = null;
  document.addEventListener('dragend', function () {
    if (exuiDragged) {
      var src = exuiDragged;
      src.classList.remove('exui-chip--ghost');
      exuiDragged = null;
      src.dataset.exuiIgnoreToggleClick = '1';
      setTimeout(function () {
        delete src.dataset.exuiIgnoreToggleClick;
      }, 120);
    }
  });

  /* Chrome: dragover에서 preventDefault 안 하면 drop 불가로 보고 금지 커서(⛔) 표시. 힌트·여백 등 칸 밖을 지날 때도 막히지 않게 함 */
  document.addEventListener('dragover', function (e) {
    if (!exuiDragged) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });
  document.addEventListener('drop', function (e) {
    if (!exuiDragged) return;
    e.preventDefault();
  });

  function copyTextToClipboard(text) {
    if (!text) return Promise.reject(new Error('복사할 내용이 없습니다.'));
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        ta.style.top = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (ok) resolve();
        else reject(new Error('복사에 실패했습니다.'));
      } catch (e) {
        reject(e);
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      if (copyStatus) copyStatus.textContent = '';
      copyTextToClipboard(lastSummary)
        .then(function () { if (copyStatus) copyStatus.textContent = '복사 됨. 메일/메신저에 붙여넣기 하세요.'; })
        .catch(function (e) { if (copyStatus) copyStatus.textContent = '복사 실패: ' + (e && e.message ? e.message : e); });
    });
  }

  function locLabel(id) {
    var L = data.locations || [];
    for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i].label;
    return id;
  }

  function foodLabel(id) {
    var F = data.food_types || [];
    for (var i = 0; i < F.length; i++) if (F[i].id === id) return F[i].label;
    return id;
  }

  function restaurantHref(r) {
    var u = r.url != null ? String(r.url).trim() : '';
    if (u && /^https?:\/\//i.test(u)) return u;
    return 'https://map.naver.com/p/search/' + encodeURIComponent(r.name);
  }

  function updateFoodOrderButtons(ch) {
    var order = ch.querySelector('.exui-chip-order');
    if (!order) return;
    var inRanked = ch.parentNode === foodRanked;
    order.hidden = !inRanked;
    if (!inRanked) return;
    var up = ch.querySelector('[data-exui-food-act="up"]');
    var down = ch.querySelector('[data-exui-food-act="down"]');
    // 1등 up도 클릭 가능(동작만 없음), 꼴등 down은 후보로 이동 처리하므로 비활성화하지 않음
    if (up) up.disabled = false;
    if (down) down.disabled = false;
  }

  function refreshAllFoodOrderButtons() {
    foodRanked.querySelectorAll('.exui-chip--food').forEach(updateFoodOrderButtons);
    foodPool.querySelectorAll('.exui-chip--food').forEach(updateFoodOrderButtons);
  }

  function foodChip(text, dataId, imageUrl) {
    var el = document.createElement('div');
    el.className = 'exui-chip exui-chip--food';
    el.setAttribute('draggable', 'true');
    el.dataset.exuiId = dataId;
    el.dataset.exuiKind = 'food';

    var inner = document.createElement('div');
    inner.className = 'exui-chip-row';

    var imgUrl = imageUrl != null ? String(imageUrl).trim() : '';
    if (imgUrl) {
      var img = document.createElement('img');
      img.className = 'exui-chip-thumb';
      img.alt = '';
      img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
      img.src = imgUrl;
      inner.appendChild(img);
    }

    var label = document.createElement('span');
    label.className = 'exui-chip-label';
    label.textContent = text;

    var order = document.createElement('span');
    order.className = 'exui-chip-order';
    order.setAttribute('hidden', '');

    function mkOrderBtn(act, title) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'exui-chip-btn';
      b.setAttribute('draggable', 'false');
      b.dataset.exuiFoodAct = act;
      b.title = title;
      b.setAttribute('aria-label', title);
      var flip = act === 'down' ? ' exui-chip-btn-ico--flip' : '';
      b.innerHTML = '<svg class="exui-chip-btn-ico' + flip + '" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-hand-thumb"></use></svg>';
      return b;
    }

    order.appendChild(mkOrderBtn('up', '우선순위 올리기'));
    order.appendChild(mkOrderBtn('down', '우선순위 내리기 (꼴등이면 후보로 이동)'));

    inner.appendChild(label);
    inner.appendChild(order);
    el.appendChild(inner);

    el.title = '이름 클릭: 선호 ↔ 후보 · 선호 칸에서 엄지 버튼으로 순서';

    order.addEventListener('click', function (e) {
      e.stopPropagation();
      var btn = e.target.closest('.exui-chip-btn');
      if (!btn || !order.contains(btn)) return;
      e.preventDefault();
      if (el.parentNode !== foodRanked) return;
      var act = btn.dataset.exuiFoodAct;
      if (act === 'up') {
        var prev = el.previousElementSibling;
        if (prev) foodRanked.insertBefore(el, prev);
      } else if (act === 'down') {
        var next = el.nextElementSibling;
        if (next) {
          foodRanked.insertBefore(next, el);
        } else {
          // 꼴등에서 down 클릭 시 후보로 이동
          foodPool.appendChild(el);
        }
      }
      refreshAllFoodOrderButtons();
    });

    el.addEventListener('click', function (e) {
      if (e.target.closest('.exui-chip-btn')) return;
      if (el.dataset.exuiIgnoreToggleClick) return;
      if (el.parentNode === foodRanked) {
        foodPool.appendChild(el);
      } else {
        foodRanked.appendChild(el);
      }
      refreshAllFoodOrderButtons();
    });

    return el;
  }

  function wireDrag(container) {
    container.addEventListener('dragstart', function (e) {
      if (e.target.closest('.exui-chip-btn')) {
        e.preventDefault();
        return;
      }
      var t = e.target.closest('.exui-chip');
      if (!t || !container.contains(t)) return;
      exuiDragged = t;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', t.dataset.exuiId || '');
      t.classList.add('exui-chip--ghost');
    });
    container.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });
    container.addEventListener('drop', function (e) {
      e.preventDefault();
      var t = e.target.closest('.exui-chip');
      var kind = container.getAttribute('data-exui-drop');
      var src = exuiDragged;
      if (src && src.dataset.exuiKind === kind) {
        if (t && t !== src && container.contains(t)) {
          var rect = t.getBoundingClientRect();
          var before = (e.clientY - rect.top) < rect.height / 2;
          t.parentNode.insertBefore(src, before ? t : t.nextSibling);
        } else {
          container.appendChild(src);
        }
        if (kind === 'food') refreshAllFoodOrderButtons();
        if (kind === 'loc') refreshAllLocOrderButtons();
      }
    });
  }

  function initFood() {
    foodPool.innerHTML = '';
    foodRanked.innerHTML = '';
    (data.food_types || []).forEach(function (ft) {
      foodRanked.appendChild(foodChip(ft.label, ft.id, ft.image_url));
    });
    refreshAllFoodOrderButtons();
  }

  function updateLocOrderButtons(ch) {
    var order = ch.querySelector('.exui-chip-order');
    if (!order) return;
    var inRanked = ch.parentNode === locRanked;
    order.hidden = !inRanked;
    if (!inRanked) return;
    var up = ch.querySelector('[data-exui-loc-act="up"]');
    var down = ch.querySelector('[data-exui-loc-act="down"]');
    // 1등 up도 클릭 가능(동작만 없음), 꼴등 down은 후보(=제외)로 이동 처리하므로 비활성화하지 않음
    if (up) up.disabled = false;
    if (down) down.disabled = false;
  }

  function refreshAllLocOrderButtons() {
    locRanked.querySelectorAll('.exui-chip--loc').forEach(updateLocOrderButtons);
    locShed.querySelectorAll('.exui-chip--loc').forEach(updateLocOrderButtons);
  }

  function locChip(text, dataId) {
    var el = document.createElement('div');
    el.className = 'exui-chip exui-chip--loc';
    el.setAttribute('draggable', 'true');
    el.dataset.exuiId = dataId;
    el.dataset.exuiKind = 'loc';

    var inner = document.createElement('div');
    inner.className = 'exui-chip-row';

    var label = document.createElement('span');
    label.className = 'exui-chip-label';
    label.textContent = text;

    var order = document.createElement('span');
    order.className = 'exui-chip-order';
    order.setAttribute('hidden', '');

    function mkOrderBtn(act, title) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'exui-chip-btn';
      b.setAttribute('draggable', 'false');
      b.dataset.exuiLocAct = act;
      b.title = title;
      b.setAttribute('aria-label', title);
      var flip = act === 'down' ? ' exui-chip-btn-ico--flip' : '';
      b.innerHTML = '<svg class="exui-chip-btn-ico' + flip + '" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-hand-thumb"></use></svg>';
      return b;
    }

    order.appendChild(mkOrderBtn('up', '우선순위 올리기'));
    order.appendChild(mkOrderBtn('down', '우선순위 내리기 (꼴등이면 후보로 이동)'));

    inner.appendChild(label);
    inner.appendChild(order);
    el.appendChild(inner);

    el.title = '이름 클릭: 선호 ↔ 후보(제외) · 선호 칸에서 엄지 버튼으로 순서';

    order.addEventListener('click', function (e) {
      e.stopPropagation();
      var btn = e.target.closest('.exui-chip-btn');
      if (!btn || !order.contains(btn)) return;
      e.preventDefault();
      if (el.parentNode !== locRanked) return;
      var act = btn.dataset.exuiLocAct;
      if (act === 'up') {
        var prev = el.previousElementSibling;
        if (prev) locRanked.insertBefore(el, prev);
      } else if (act === 'down') {
        var next = el.nextElementSibling;
        if (next) {
          locRanked.insertBefore(next, el);
        } else {
          // 꼴등에서 down 클릭 시 후보(=제외)로 이동
          locShed.appendChild(el);
        }
      }
      refreshAllLocOrderButtons();
    });

    el.addEventListener('click', function (e) {
      if (e.target.closest('.exui-chip-btn')) return;
      if (el.dataset.exuiIgnoreToggleClick) return;
      if (el.parentNode === locRanked) {
        locShed.appendChild(el);
      } else {
        locRanked.appendChild(el);
      }
      refreshAllLocOrderButtons();
    });

    return el;
  }

  function buildLocExclude() {
    locRanked.innerHTML = '';
    locShed.innerHTML = '';
    (data.locations || []).forEach(function (loc) {
      locRanked.appendChild(locChip(loc.label, loc.id));
    });
    refreshAllLocOrderButtons();
  }

  function updateCarHints() {
    var hasCar = carYes.checked;
    hintYes.hidden = !hasCar;
    hintNo.hidden = hasCar;
  }

  carYes.addEventListener('change', updateCarHints);
  carNo.addEventListener('change', updateCarHints);
  updateCarHints();

  wireDrag(foodPool);
  wireDrag(foodRanked);
  wireDrag(locRanked);
  wireDrag(locShed);

  initFood();
  buildLocExclude();

  function readFoodRankedIds() {
    var ids = [];
    foodRanked.querySelectorAll('.exui-chip').forEach(function (c) {
      ids.push(c.dataset.exuiId);
    });
    return ids;
  }

  function readLocRankedIds() {
    var ids = [];
    locRanked.querySelectorAll('.exui-chip').forEach(function (c) {
      ids.push(c.dataset.exuiId);
    });
    return ids;
  }

  function readExcludedIds() {
    var ex = [];
    locShed.querySelectorAll('.exui-chip').forEach(function (c) {
      ex.push(c.dataset.exuiId);
    });
    return ex;
  }

  function scoreAndSort() {
    var foodIds = readFoodRankedIds();
    var locIds = readLocRankedIds();
    var foodW = {};
    var n = foodIds.length;
    for (var i = 0; i < n; i++) foodW[foodIds[i]] = n - i;
    var locW = {};
    var m = locIds.length;
    for (var j = 0; j < m; j++) locW[locIds[j]] = m - j;

    var rows = (data.restaurants || []).map(function (r) {
      var fs = 0;
      (r.food_ids || []).forEach(function (fid) {
        if (foodW[fid] != null) fs += foodW[fid];
      });
      var ls = locW[r.location_id] != null ? locW[r.location_id] : 0;
      return {
        name: r.name,
        detail: r.detail,
        location_id: r.location_id,
        foodScore: fs,
        locScore: ls,
        total: fs + ls,
        url: r.url,
        lat: r.lat,
        lng: r.lng,
        marker_image: r.marker_image
      };
    });
    rows.sort(function (a, b) {
      if (b.total !== a.total) return b.total - a.total;
      return a.name.localeCompare(b.name, 'ko');
    });
    return rows;
  }

  function buildSummaryText(rows, foodIds, locIds, excluded, hasCar) {
    var lines = [];
    lines.push('=== 회식 설문 제출 ===');
    lines.push('차량: ' + (hasCar ? 'O' : 'X'));
    lines.push('');
    lines.push('[음식 선호 순위]');
    if (foodIds.length === 0) lines.push('(순위 지정 없음)');
    else foodIds.forEach(function (id, i) {
      lines.push((i + 1) + '. ' + foodLabel(id));
    });
    lines.push('');
    lines.push('[제외 장소]');
    if (excluded.length === 0) lines.push('(없음)');
    else excluded.forEach(function (id) { lines.push('- ' + locLabel(id)); });
    lines.push('');
    lines.push('[장소 선호 순위 / 제외 반영 후]');
    if (locIds.length === 0) lines.push('(남은 장소 없음)');
    else locIds.forEach(function (id, i) {
      lines.push((i + 1) + '. ' + locLabel(id));
    });
    lines.push('');
    lines.push('[식당 정렬 결과]');
    rows.forEach(function (r, i) {
      lines.push((i + 1) + '. ' + r.name + ' (' + r.detail + ') @ ' + locLabel(r.location_id) +
        ' — 합계 ' + r.total + ' (음식 ' + r.foodScore + ', 장소 ' + r.locScore + ')');
    });
    return lines.join('\n');
  }

  function getNaverNcpKeyId() {
    if (root && root.closest) {
      var pageEl = root.closest('.exui-page');
      if (pageEl) {
        var v = pageEl.getAttribute('data-exui-naver-ncp-key-id');
        return v != null ? String(v).trim() : '';
      }
    }
    return '';
  }

  var EXUI_MAP_KEY_MISSING_HTML = '이 영역에 네이버 지도를 띄우려면 페이지 최상단의 <code>data-exui-naver-ncp-key-id</code>에 ' +
    '<a href="https://www.ncloud.com/product/applicationService/maps" target="_blank" rel="noopener noreferrer">네이버 클라우드 Maps</a>에서 발급한 Web 동적 지도용 <strong>ncpKeyId</strong>를 넣어 주세요.';

  function destroyExuiMap() {
    if (exuiMapInfoWindow) {
      try { exuiMapInfoWindow.close(); } catch (e1) {}
      exuiMapInfoWindow = null;
    }
    exuiMapMarkers = [];
    if (exuiNaverMap) {
      try { exuiNaverMap.destroy(); } catch (e2) {}
      exuiNaverMap = null;
    }
  }

  function ensureNaverMapsScript(ncpKeyId, onLoaded, onError) {
    if (window.naver && window.naver.maps) {
      onLoaded();
      return;
    }
    if (!exuiNaverMapScriptCallbacks) {
      exuiNaverMapScriptCallbacks = [];
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=' + encodeURIComponent(ncpKeyId);
      s.onload = function () {
        var list = exuiNaverMapScriptCallbacks;
        exuiNaverMapScriptCallbacks = null;
        if (list) list.forEach(function (fn) { try { fn(true); } catch (e) {} });
      };
      s.onerror = function () {
        var list = exuiNaverMapScriptCallbacks;
        exuiNaverMapScriptCallbacks = null;
        if (list) list.forEach(function (fn) { try { fn(false); } catch (e) {} });
      };
      document.head.appendChild(s);
    }
    exuiNaverMapScriptCallbacks.push(function (ok) {
      if (ok) onLoaded();
      else if (onError) onError();
    });
  }

  function renderExuiMap(rows) {
    var canvas = document.getElementById('exui-map-canvas');
    var keyMissing = document.getElementById('exui-map-key-missing');
    var emptyHint = document.getElementById('exui-map-empty');
    if (!canvas || !keyMissing || !emptyHint) return;

    keyMissing.innerHTML = EXUI_MAP_KEY_MISSING_HTML;

    var key = getNaverNcpKeyId();
    var picked = rows.filter(function (r) {
      return r.total > 0 && r.lat != null && r.lng != null &&
        isFinite(Number(r.lat)) && isFinite(Number(r.lng));
    });
    var mapLandmarks = (data.landmarks || []).filter(function (lm) {
      return lm.lat != null && lm.lng != null &&
        isFinite(Number(lm.lat)) && isFinite(Number(lm.lng));
    });

    if (!key) {
      destroyExuiMap();
      keyMissing.hidden = false;
      canvas.hidden = true;
      emptyHint.hidden = true;
      return;
    }

    keyMissing.hidden = true;
    canvas.hidden = false;

    var myToken = ++exuiMapRenderToken;
    destroyExuiMap();

    function escHtml(s) {
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/"/g, '&quot;');
    }

    ensureNaverMapsScript(key, function () {
      if (myToken !== exuiMapRenderToken) return;
      var n = window.naver;
      if (!n || !n.maps) return;

      var defaultCenter = new n.maps.LatLng(37.397, 127.11);
      var firstCenter = defaultCenter;
      if (picked.length > 0) {
        firstCenter = new n.maps.LatLng(Number(picked[0].lat), Number(picked[0].lng));
      } else if (mapLandmarks.length > 0) {
        firstCenter = new n.maps.LatLng(Number(mapLandmarks[0].lat), Number(mapLandmarks[0].lng));
      }
      var pinCount = picked.length + mapLandmarks.length;

      exuiNaverMap = new n.maps.Map(canvas, {
        center: firstCenter,
        zoom: pinCount === 1 ? 15 : 13,
        mapTypeControl: false,
        scaleControl: true,
        logoControl: true,
        zoomControl: true
      });

      exuiMapInfoWindow = new n.maps.InfoWindow({ pixelOffset: new n.maps.Point(0, -10) });

      function landmarkHtmlIconOpts(lm) {
        var label = lm.label != null ? String(lm.label) : '장소';
        var w = Math.min(176, Math.max(52, 22 + label.length * 11));
        var h = 28;
        var tail = 8;
        var content =
          '<div style="box-sizing:border-box;padding:5px 12px;width:' + w + 'px;height:' + h + 'px;' +
          'border-radius:999px;background:#243047;border:2px solid #94a3b8;color:#f1f5f9;font-size:12px;font-weight:700;' +
          'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:16px;' +
          'box-shadow:0 2px 12px rgba(0,0,0,.5);pointer-events:auto;">' + escHtml(label) + '</div>';
        return {
          content: content,
          size: new n.maps.Size(w, h + tail),
          anchor: new n.maps.Point(w / 2, h + tail)
        };
      }

      function markerHtmlIconOpts(rank, row) {
        var img = row.marker_image != null ? String(row.marker_image).trim() : '';
        if (img) {
          var w = 40;
          var h = 40;
          var pad = 6;
          var boxW = w + pad;
          var boxH = h + pad;
          var u = escHtml(img);
          var content =
            '<div style="width:' + boxW + 'px;height:' + boxH + 'px;position:relative;pointer-events:auto;">' +
            '<img src="' + u + '" alt="" referrerpolicy="no-referrer" ' +
            'style="display:block;width:' + w + 'px;height:' + h + 'px;object-fit:cover;border-radius:50%;' +
            'border:2px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.4);"/>' +
            '<span style="position:absolute;right:0;bottom:0;min-width:18px;height:18px;padding:0 5px;' +
            'box-sizing:border-box;display:flex;align-items:center;justify-content:center;border-radius:999px;' +
            'background:#00a1e4;color:#fff;font-size:11px;font-weight:800;border:2px solid #fff;line-height:1;">' +
            rank + '</span></div>';
          return {
            content: content,
            size: new n.maps.Size(boxW, boxH),
            anchor: new n.maps.Point(boxW / 2, boxH)
          };
        }
        var d = 32;
        var fs = rank >= 10 ? 11 : 13;
        var content =
          '<div style="display:flex;align-items:center;justify-content:center;width:' + d + 'px;height:' + d + 'px;' +
          'border-radius:50%;background:linear-gradient(180deg,#00a1e4,#0588c5);color:#fff;font-weight:800;font-size:' + fs + 'px;' +
          'font-family:system-ui,-apple-system,sans-serif;border:2px solid #fff;box-shadow:0 2px 12px rgba(0,0,0,.35);line-height:1;">' +
          rank + '</div>';
        return {
          content: content,
          size: new n.maps.Size(d, d),
          anchor: new n.maps.Point(d / 2, d)
        };
      }

      var bounds = new n.maps.LatLngBounds();
      mapLandmarks.forEach(function (lm) {
        var pos = new n.maps.LatLng(Number(lm.lat), Number(lm.lng));
        bounds.extend(pos);
        var lIcon = landmarkHtmlIconOpts(lm);
        var lMarker = new n.maps.Marker({
          position: pos,
          map: exuiNaverMap,
          title: lm.label || '',
          zIndex: 0,
          icon: {
            content: lIcon.content,
            size: lIcon.size,
            anchor: lIcon.anchor
          }
        });
        var iwParts = ['<div style="padding:10px 12px;max-width:240px;font-size:13px;line-height:1.5"><strong>' +
          escHtml(lm.label != null ? String(lm.label) : '') + '</strong>'];
        if (lm.note != null && String(lm.note).trim()) {
          iwParts.push('<br><span style="opacity:.9">' + escHtml(String(lm.note)) + '</span>');
        }
        if (lm.url != null && String(lm.url).trim()) {
          iwParts.push('<br><a href="' + escHtml(String(lm.url).trim()) + '" target="_blank" rel="noopener noreferrer" ' +
            'style="margin-top:8px;display:inline-block;color:#03c75a">지도 / 길찾기</a>');
        }
        iwParts.push('</div>');
        var lmIw = iwParts.join('');
        n.maps.Event.addListener(lMarker, 'click', function () {
          exuiMapInfoWindow.setContent(lmIw);
          exuiMapInfoWindow.open(exuiNaverMap, lMarker);
        });
        exuiMapMarkers.push(lMarker);
      });

      picked.forEach(function (r, idx) {
        var pos = new n.maps.LatLng(Number(r.lat), Number(r.lng));
        bounds.extend(pos);
        var rank = idx + 1;
        var icon = markerHtmlIconOpts(rank, r);
        var marker = new n.maps.Marker({
          position: pos,
          map: exuiNaverMap,
          title: r.name,
          zIndex: 1,
          icon: {
            content: icon.content,
            size: icon.size,
            anchor: icon.anchor
          }
        });
        var href = restaurantHref(r);
        var html = '<div style="padding:10px 12px;max-width:240px;font-size:13px;line-height:1.5">' +
          '<strong>' + escHtml(r.name) + '</strong><br><span style="opacity:.88">' + escHtml(r.detail) + '</span><br>' +
          '<a href="' + escHtml(href) + '" target="_blank" rel="noopener noreferrer" ' +
          'style="margin-top:8px;display:inline-block;color:#03c75a">플레이스 / 길찾기</a></div>';
        n.maps.Event.addListener(marker, 'click', function () {
          exuiMapInfoWindow.setContent(html);
          exuiMapInfoWindow.open(exuiNaverMap, marker);
        });
        exuiMapMarkers.push(marker);
      });

      var MAP_EMPTY_DEFAULT = '지도에 올릴 식당이 없습니다. 음식 선호와 식당의 메뉴 종류, 또는 장소 선호가 겹치는지 확인해 주세요.';
      var MAP_EMPTY_LM_ONLY = '선호와 맞는 식당은 없습니다. 캡슐 라벨은 랜드마크(역·회사 등) 위치입니다.';

      if (picked.length > 0) {
        emptyHint.hidden = true;
      } else {
        emptyHint.hidden = false;
        emptyHint.textContent = mapLandmarks.length > 0 ? MAP_EMPTY_LM_ONLY : MAP_EMPTY_DEFAULT;
      }

      if (pinCount >= 2) {
        exuiNaverMap.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
      } else if (pinCount === 1) {
        var one = picked.length === 1 ? picked[0] : mapLandmarks[0];
        exuiNaverMap.setCenter(new n.maps.LatLng(Number(one.lat), Number(one.lng)));
        exuiNaverMap.setZoom(picked.length === 1 ? 16 : 15);
      } else {
        exuiNaverMap.setCenter(defaultCenter);
        exuiNaverMap.setZoom(13);
      }
    }, function () {
      if (myToken !== exuiMapRenderToken) return;
      destroyExuiMap();
      keyMissing.hidden = false;
      keyMissing.textContent = '';
      var errSpan = document.createElement('span');
      errSpan.textContent = '네이버 지도 스크립트를 불러오지 못했습니다. ncpKeyId·도메인 등록·콘솔 설정을 확인해 주세요.';
      keyMissing.appendChild(errSpan);
      canvas.hidden = true;
      emptyHint.hidden = true;
    });
  }

  function renderResult(rows) {
    resultBody.innerHTML = '';
    rows.forEach(function (r, i) {
      var tr = document.createElement('tr');
      if (r.foodScore === 0 || r.locScore === 0) tr.classList.add('exui-result-row--zero');
      function tdText(t) {
        var td = document.createElement('td');
        td.textContent = t;
        return td;
      }
      tr.appendChild(tdText(String(i + 1)));
      var tdName = document.createElement('td');
      var a = document.createElement('a');
      a.className = 'exui-result-link';
      a.href = restaurantHref(r);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = r.name;
      tdName.appendChild(a);
      tr.appendChild(tdName);
      tr.appendChild(tdText(r.detail));
      tr.appendChild(tdText(locLabel(r.location_id)));
      tr.appendChild(tdText(String(r.foodScore)));
      tr.appendChild(tdText(String(r.locScore)));
      tr.appendChild(tdText(String(r.total)));
      resultBody.appendChild(tr);
    });
    renderExuiMap(rows);
    resultPanel.hidden = false;
    if (root && root.closest) {
      var pageEl = root.closest('.exui-page');
      if (pageEl) pageEl.classList.add('exui-mode-result');
    }
  }

  document.getElementById('exui-form').addEventListener('submit', function (e) {
    e.preventDefault();
    errEl.hidden = true;
    var foodIds = readFoodRankedIds();
    var locIds = readLocRankedIds();
    var excluded = readExcludedIds();

    if (locIds.length === 0) {
      errEl.textContent = '순위에 남은 장소가 없습니다. 제외 체크를 풀거나 순위를 조정해 주세요.';
      errEl.hidden = false;
      return;
    }

    var rows = scoreAndSort();
    var hasCar = carYes.checked;
    var summary = buildSummaryText(rows, foodIds, locIds, excluded, hasCar);
    lastSummary = summary;
    if (copyStatus) copyStatus.textContent = '';
    renderResult(rows);
    if (formPanel) formPanel.hidden = true;
  });

  document.getElementById('exui-reset').addEventListener('click', function () {
    exuiMapRenderToken++;
    destroyExuiMap();
    var canvas = document.getElementById('exui-map-canvas');
    var keyMissing = document.getElementById('exui-map-key-missing');
    var emptyHint = document.getElementById('exui-map-empty');
    if (canvas) canvas.hidden = true;
    if (keyMissing) {
      keyMissing.hidden = true;
      keyMissing.innerHTML = EXUI_MAP_KEY_MISSING_HTML;
    }
    if (emptyHint) emptyHint.hidden = true;
    initFood();
    buildLocExclude();
    carNo.checked = true;
    carYes.checked = false;
    updateCarHints();
    resultPanel.hidden = true;
    if (formPanel) formPanel.hidden = false;
    if (root && root.closest) {
      var pageEl = root.closest('.exui-page');
      if (pageEl) pageEl.classList.remove('exui-mode-result');
    }
    lastSummary = '';
    if (copyStatus) copyStatus.textContent = '';
    errEl.hidden = true;
  });
})();
</script>
</div>
