---
layout: default
title: IELTS Lab
intro: |
  책·시험을 고른 뒤 스킬을 선택하면 CBT 스타일로 **지문(좌)** 과 **답안(우)** 을 나란히 봅니다. 좁은 화면에서는 위·아래로 쌓입니다. 아래는 UI 플레이스홀더이며, 이후 `_data/ielts` 데이터와 연결할 수 있습니다.
tags:
  - ielts
  - labs
  - dark-ui
ielts_nav:
  - id: reading
    label: Reading
    icon: book
  - id: writing
    label: Writing
    icon: pen
  - id: speaking
    label: Speaking
    icon: microphone
---

<div class="ielts-lab-page ielts-hide-pane-scrollbars" data-view="single">

<div class="app">

  <aside class="sidebar" aria-label="IELTS lab navigation">
    {% assign manifest = site.data.ielts.manifest %}
    {% assign book0 = manifest.books[0] %}
    {% assign test0 = book0.tests[0] %}
    {% assign skills0 = test0.skills %}
    {% assign reading0 = skills0 | where: "key", "reading" | first %}
    <nav class="ielts-breadcrumb" aria-label="현재 선택 경로">
      <div class="ielts-breadcrumb__combo">
        <div class="combo-wrap combo-wrap--breadcrumb">
          <select id="ielts-book" class="combo combo--breadcrumb" aria-label="책 선택">
            {% for b in manifest.books %}
              <option value="{{ b.key }}" {% if b.key == book0.key %}selected{% endif %}>{{ b.label }}</option>
            {% endfor %}
          </select>
        </div>
      </div>
      <span class="ielts-breadcrumb__sep" aria-hidden="true">/</span>
      <div class="ielts-breadcrumb__combo">
        <div class="combo-wrap combo-wrap--breadcrumb">
          <select id="ielts-test" class="combo combo--breadcrumb" aria-label="시험 번호">
            {% for t in book0.tests %}
              <option value="{{ t.key }}" {% if t.key == test0.key %}selected{% endif %}>{{ t.label }}</option>
            {% endfor %}
          </select>
        </div>
      </div>
      <span class="ielts-breadcrumb__sep" aria-hidden="true">/</span>
      <div class="ielts-breadcrumb__combo">
        <div class="combo-wrap combo-wrap--breadcrumb">
          <select id="ielts-skill" class="combo combo--breadcrumb" aria-label="스킬 선택">
            {% for s in skills0 %}
              <option value="{{ s.key }}" {% if s.key == "reading" %}selected{% endif %} data-skill-title="{{ s.label }}">{{ s.label }}</option>
            {% endfor %}
          </select>
        </div>
      </div>
    </nav>
    <div class="sidebar-stack">
      <div class="sidebar-body">
        <div class="ielts-breadcrumb__combo">
          <div class="ielts-passage-picker" role="group" aria-label="지문 선택">
            {% for p in reading0.passages %}
            <button
              type="button"
              class="ielts-passage-btn"
              data-passage="{{ p.key }}"
              data-short-label="{{ forloop.index }}"
              aria-pressed="{% if forloop.first %}true{% else %}false{% endif %}"
              aria-label="Passage {{ forloop.index }}"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-num-{{ forloop.index }}"/></svg>
            </button>
            {% endfor %}
          </div>
        </div>
      </div>
      <div class="sidebar-footer">
        <div class="ielts-reader-menu" id="ielts-reader-menu">
          <button
            type="button"
            class="ielts-view-toggle btn-tag"
            id="ielts-reader-btn"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="ielts-reader-panel"
            aria-label="Reader 설정"
            title="Reader">
            <svg class="ielts-reader-btn-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-book"/></svg>
          </button>
          <div class="ielts-reader-panel card" id="ielts-reader-panel" role="dialog" aria-label="Reader 설정" hidden>
            <div class="ielts-reader-row">
              <span class="field-label">View</span>
              <div class="ielts-seg" role="group" aria-label="보기 모드">
                <button type="button" class="ielts-seg__btn" data-view="auto" aria-pressed="false">AUTO</button>
                <button type="button" class="ielts-seg__btn" data-view="single" aria-pressed="true">1PAGE</button>
                <button type="button" class="ielts-seg__btn" data-view="split" aria-pressed="false">2PAGE</button>
              </div>
            </div>
            <div class="ielts-reader-row">
              <label class="field-label" for="ielts-font-family">Font</label>
              <div class="combo-wrap">
                <select id="ielts-font-family" class="combo" aria-label="글꼴">
                  <option value="sans" selected>SANS</option>
                  <option value="serif">SERIF</option>
                  <option value="mono">MONO</option>
                </select>
              </div>
            </div>
            <div class="ielts-reader-row">
              <label class="field-label" for="ielts-font-size">Size</label>
              <input id="ielts-font-size" class="ielts-range" type="range" min="14" max="22" step="1" value="16" />
            </div>
            <div class="ielts-reader-row">
              <label class="field-label" for="ielts-line-height">Line</label>
              <input id="ielts-line-height" class="ielts-range" type="range" min="1.35" max="2.05" step="0.05" value="1.65" />
            </div>
            <div class="ielts-reader-row">
              <label class="field-label" for="ielts-measure">Width</label>
              <input id="ielts-measure" class="ielts-range" type="range" min="60" max="110" step="5" value="85" />
            </div>
            <div class="ielts-reader-row">
              <span class="field-label">Bars</span>
              <div class="ielts-seg" role="group" aria-label="패널 스크롤바 표시">
                <button type="button" class="ielts-seg__btn" data-ielts-scrollbars="show" aria-pressed="false">ON</button>
                <button type="button" class="ielts-seg__btn" data-ielts-scrollbars="hide" aria-pressed="true">OFF</button>
              </div>
            </div>
            <div class="ielts-reader-row">
              <span class="field-label">Highlight</span>
              <button type="button" class="btn-secondary" id="ielts-clear-highlights" title="Ctrl+드래그로 하이라이트 · 하이라이트 구간 클릭 시 해당 블록만 제거 · CLEAR는 전체 제거">
                CLEAR
              </button>
            </div>
            <div class="ielts-reader-actions">
              <button type="button" class="btn-secondary" id="ielts-reader-reset">Reset</button>
              <button type="button" class="btn-primary" id="ielts-reader-close">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>

  <main class="main">
    <div class="main-inner--ielts">
      <section id="ielts-workspace" class="ielts-section" aria-labelledby="ielts-workspace-heading">
        <div class="ielts-split" role="region" aria-label="CBT 두 패널">
          <article class="ielts-pane card card-transparent" aria-label="문제 영역">
            <div class="ielts-pane-body ielts-pane-body--muted" id="ielts-passage-body">
              {% capture ielts_reading_passage1 %}{% include ielts/ielts18/test1/reading/passage1.md %}{% endcapture %}
              {{ ielts_reading_passage1 | markdownify }}
            </div>
          </article>
          <article class="ielts-pane card card-transparent" aria-label="답안 영역">
            <div class="ielts-pane-body" id="ielts-questions-body">
              {% capture ielts_reading_q0 %}{% include ielts/ielts18/test1/reading/passage1-questions.md %}{% endcapture %}
              {{ ielts_reading_q0 | markdownify }}
            </div>
          </article>
        </div>
      </section>
      {% capture __p1 %}{% include ielts/ielts18/test1/reading/passage1.md %}{% endcapture %}
      {% capture __p2 %}{% include ielts/ielts18/test1/reading/passage2.md %}{% endcapture %}
      {% capture __p3 %}{% include ielts/ielts18/test1/reading/passage3.md %}{% endcapture %}
      <template id="tpl-ielts18-test1-reading-passage1">{{ __p1 | markdownify }}</template>
      <template id="tpl-ielts18-test1-reading-passage2">{{ __p2 | markdownify }}</template>
      <template id="tpl-ielts18-test1-reading-passage3">{{ __p3 | markdownify }}</template>
      {% capture __p1q %}{% include ielts/ielts18/test1/reading/passage1-questions.md %}{% endcapture %}
      {% capture __p2q %}{% include ielts/ielts18/test1/reading/passage2-questions.md %}{% endcapture %}
      {% capture __p3q %}{% include ielts/ielts18/test1/reading/passage3-questions.md %}{% endcapture %}
      <template id="tpl-ielts18-test1-reading-passage1-questions">{{ __p1q | markdownify }}</template>
      <template id="tpl-ielts18-test1-reading-passage2-questions">{{ __p2q | markdownify }}</template>
      <template id="tpl-ielts18-test1-reading-passage3-questions">{{ __p3q | markdownify }}</template>
      {% capture __t2p1 %}{% include ielts/ielts18/test2/reading/passage1.md %}{% endcapture %}
      {% capture __t2p2 %}{% include ielts/ielts18/test2/reading/passage2.md %}{% endcapture %}
      {% capture __t2p3 %}{% include ielts/ielts18/test2/reading/passage3.md %}{% endcapture %}
      <template id="tpl-ielts18-test2-reading-passage1">{{ __t2p1 | markdownify }}</template>
      <template id="tpl-ielts18-test2-reading-passage2">{{ __t2p2 | markdownify }}</template>
      <template id="tpl-ielts18-test2-reading-passage3">{{ __t2p3 | markdownify }}</template>
      {% capture __t2p1q %}{% include ielts/ielts18/test2/reading/passage1-questions.md %}{% endcapture %}
      {% capture __t2p2q %}{% include ielts/ielts18/test2/reading/passage2-questions.md %}{% endcapture %}
      {% capture __t2p3q %}{% include ielts/ielts18/test2/reading/passage3-questions.md %}{% endcapture %}
      <template id="tpl-ielts18-test2-reading-passage1-questions">{{ __t2p1q | markdownify }}</template>
      <template id="tpl-ielts18-test2-reading-passage2-questions">{{ __t2p2q | markdownify }}</template>
      <template id="tpl-ielts18-test2-reading-passage3-questions">{{ __t2p3q | markdownify }}</template>
      {% capture __t3p1 %}{% include ielts/ielts18/test3/reading/passage1.md %}{% endcapture %}
      {% capture __t3p2 %}{% include ielts/ielts18/test3/reading/passage2.md %}{% endcapture %}
      {% capture __t3p3 %}{% include ielts/ielts18/test3/reading/passage3.md %}{% endcapture %}
      <template id="tpl-ielts18-test3-reading-passage1">{{ __t3p1 | markdownify }}</template>
      <template id="tpl-ielts18-test3-reading-passage2">{{ __t3p2 | markdownify }}</template>
      <template id="tpl-ielts18-test3-reading-passage3">{{ __t3p3 | markdownify }}</template>
      {% capture __t3p1q %}{% include ielts/ielts18/test3/reading/passage1-questions.md %}{% endcapture %}
      {% capture __t3p2q %}{% include ielts/ielts18/test3/reading/passage2-questions.md %}{% endcapture %}
      {% capture __t3p3q %}{% include ielts/ielts18/test3/reading/passage3-questions.md %}{% endcapture %}
      <template id="tpl-ielts18-test3-reading-passage1-questions">{{ __t3p1q | markdownify }}</template>
      <template id="tpl-ielts18-test3-reading-passage2-questions">{{ __t3p2q | markdownify }}</template>
      <template id="tpl-ielts18-test3-reading-passage3-questions">{{ __t3p3q | markdownify }}</template>
      {% capture __t4p1 %}{% include ielts/ielts18/test4/reading/passage1.md %}{% endcapture %}
      {% capture __t4p2 %}{% include ielts/ielts18/test4/reading/passage2.md %}{% endcapture %}
      {% capture __t4p3 %}{% include ielts/ielts18/test4/reading/passage3.md %}{% endcapture %}
      <template id="tpl-ielts18-test4-reading-passage1">{{ __t4p1 | markdownify }}</template>
      <template id="tpl-ielts18-test4-reading-passage2">{{ __t4p2 | markdownify }}</template>
      <template id="tpl-ielts18-test4-reading-passage3">{{ __t4p3 | markdownify }}</template>
      {% capture __t4p1q %}{% include ielts/ielts18/test4/reading/passage1-questions.md %}{% endcapture %}
      {% capture __t4p2q %}{% include ielts/ielts18/test4/reading/passage2-questions.md %}{% endcapture %}
      {% capture __t4p3q %}{% include ielts/ielts18/test4/reading/passage3-questions.md %}{% endcapture %}
      <template id="tpl-ielts18-test4-reading-passage1-questions">{{ __t4p1q | markdownify }}</template>
      <template id="tpl-ielts18-test4-reading-passage2-questions">{{ __t4p2q | markdownify }}</template>
      <template id="tpl-ielts18-test4-reading-passage3-questions">{{ __t4p3q | markdownify }}</template>
    </div>
  </main>
</div>

<script>
(function () {
  var STORAGE_KEY_VIEW = "ielts-lab-view-mode";
  var STORAGE_KEY_READER = "ielts-lab-reader";
  var sel = document.getElementById("ielts-skill");
  var bookSel = document.getElementById("ielts-book");
  var testSel = document.getElementById("ielts-test");
  var passageBtns = document.querySelectorAll(".ielts-passage-btn[data-passage]");
  var labelEl = document.getElementById("ielts-active-skill-label");
  var pathEl = document.getElementById("ielts-pane-path");
  var passageBody = document.getElementById("ielts-passage-body");
  var questionsBody = document.getElementById("ielts-questions-body");
  var readerBtn = document.getElementById("ielts-reader-btn");
  var readerPanel = document.getElementById("ielts-reader-panel");
  var readerClose = document.getElementById("ielts-reader-close");
  var readerReset = document.getElementById("ielts-reader-reset");
  var viewBtns = document.querySelectorAll(".ielts-seg__btn[data-view]");
  var fontFamilySel = document.getElementById("ielts-font-family");
  var fontSizeRange = document.getElementById("ielts-font-size");
  var lineHeightRange = document.getElementById("ielts-line-height");
  var measureRange = document.getElementById("ielts-measure");
  var clearHighlightsBtn = document.getElementById("ielts-clear-highlights");
  var scrollbarSegBtns = document.querySelectorAll(".ielts-seg__btn[data-ielts-scrollbars]");
  if (!sel) return;

  function selectionAnchorInPassage(range) {
    if (!passageBody || !range) return false;
    var n = range.commonAncestorContainer;
    if (n.nodeType === Node.TEXT_NODE) n = n.parentNode;
    return n && passageBody.contains(n);
  }

  function applyPassageHighlight(ctrlHeld) {
    if (!ctrlHeld) return;
    if (!passageBody) return;
    var winSel = window.getSelection();
    if (!winSel || winSel.rangeCount === 0 || winSel.isCollapsed) return;
    var range = winSel.getRangeAt(0);
    if (!selectionAnchorInPassage(range)) return;
    var t = (winSel.toString() || "").trim();
    if (!t) return;

    var mark = document.createElement("mark");
    mark.className = "ielts-highlight";

    try {
      range.surroundContents(mark);
    } catch (err) {
      var frag = range.extractContents();
      mark.appendChild(frag);
      range.insertNode(mark);
    }
    winSel.removeAllRanges();
  }

  function unwrapHighlightMark(mark) {
    if (!mark || !mark.classList || !mark.classList.contains("ielts-highlight")) return;
    var parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
  }

  function clearPassageHighlights() {
    if (!passageBody) return;
    passageBody.querySelectorAll("mark.ielts-highlight").forEach(unwrapHighlightMark);
  }

  function autoSizeSelect(el) {
    if (!el || !el.options || el.selectedIndex < 0) return;
    var opt = el.options[el.selectedIndex];
    var text = (opt && opt.textContent ? opt.textContent : "").trim();
    if (!text) text = "—";

    var cs = window.getComputedStyle(el);
    var padL = parseFloat(cs.paddingLeft) || 0;
    var padR = parseFloat(cs.paddingRight) || 0;
    var borderL = parseFloat(cs.borderLeftWidth) || 0;
    var borderR = parseFloat(cs.borderRightWidth) || 0;

    var probe = document.createElement("span");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.whiteSpace = "nowrap";
    probe.style.fontFamily = cs.fontFamily;
    probe.style.fontSize = cs.fontSize;
    probe.style.fontWeight = cs.fontWeight;
    probe.style.letterSpacing = cs.letterSpacing;
    probe.style.textTransform = cs.textTransform;
    probe.textContent = text;
    document.body.appendChild(probe);
    var w = probe.getBoundingClientRect().width;
    probe.remove();

    var extra = 6;
    el.style.width = Math.ceil(w + padL + padR + borderL + borderR + extra) + "px";
  }

  function autoSizeAllCombos() {
    document
      .querySelectorAll(".ielts-lab-page .sidebar select.combo")
      .forEach(autoSizeSelect);
  }

  function syncSkillLabel() {
    var opt = sel.options[sel.selectedIndex];
    if (!opt) return;
    var title = opt.getAttribute("data-skill-title") || opt.textContent.trim() || "";
    if (labelEl) labelEl.textContent = title;
    autoSizeAllCombos();
  }

  function selectedText(el) {
    if (!el || !el.options || el.selectedIndex < 0) return "";
    var o = el.options[el.selectedIndex];
    return (o && o.textContent ? o.textContent : "").trim();
  }

  function getPassageKey() {
    var active = document.querySelector(".ielts-passage-btn[aria-pressed='true']");
    return (active && active.getAttribute("data-passage")) || "passage1";
  }

  function setPassageKey(key) {
    passageBtns.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-passage") === key ? "true" : "false");
    });
  }

  function syncPaneHeader() {
    var bookT = selectedText(bookSel);
    var testT = selectedText(testSel);
    var skillT = selectedText(sel);
    var activeP = document.querySelector(".ielts-passage-btn[aria-pressed='true']");
    var passageT = activeP ? (activeP.getAttribute("data-short-label") || "").trim() : "";
    if (pathEl) pathEl.textContent = [bookT, testT, skillT].filter(Boolean).join(" / ");
    if (labelEl && passageT) labelEl.textContent = passageT;
  }

  function syncPassageContent() {
    if (!passageBody) return;
    var bookKey = (bookSel && bookSel.value) || "ielts18";
    var testKey = (testSel && testSel.value) || "test1";
    var skillKey = (sel && sel.value) || "reading";
    var passageKey = getPassageKey();
    var tplId = "tpl-" + bookKey + "-" + testKey + "-" + skillKey + "-" + passageKey;
    var tpl = document.getElementById(tplId);
    if (!tpl) return;
    passageBody.innerHTML = tpl.innerHTML;
    if (questionsBody) {
      var qTpl = document.getElementById(tplId + "-questions");
      questionsBody.innerHTML = qTpl ? qTpl.innerHTML : "";
    }
  }

  function syncAll() {
    syncPassageContent();
    syncPaneHeader();
    autoSizeAllCombos();
  }

  function applyViewMode(mode) {
    var root = document.body;
    if (!root) return;
    if (mode !== "auto" && mode !== "single" && mode !== "split") mode = "single";
    if (mode === "auto") root.removeAttribute("data-view");
    else root.setAttribute("data-view", mode);
    viewBtns.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-view") === mode ? "true" : "false");
    });
    try { localStorage.setItem(STORAGE_KEY_VIEW, mode); } catch (e) {}
  }

  function getSavedViewMode() {
    try { return localStorage.getItem(STORAGE_KEY_VIEW) || "single"; } catch (e) { return "single"; }
  }

  function safeParseJSON(s, fallback) {
    try { return JSON.parse(s); } catch (e) { return fallback; }
  }

  function getReaderState() {
    var d = { font: "sans", size: 16, line: 1.65, measure: 760, hideScrollbars: true };
    try {
      var raw = localStorage.getItem(STORAGE_KEY_READER);
      if (!raw) return d;
      var v = safeParseJSON(raw, d) || d;
      if (v.font) d.font = v.font;
      if (typeof v.size === "number") d.size = v.size;
      if (typeof v.line === "number") d.line = v.line;
      if (typeof v.measure === "number") d.measure = v.measure;
      if (typeof v.hideScrollbars === "boolean") d.hideScrollbars = v.hideScrollbars;
    } catch (e) {}
    return d;
  }

  function setReaderState(next) {
    try { localStorage.setItem(STORAGE_KEY_READER, JSON.stringify(next)); } catch (e) {}
  }

  function applyReaderState(state) {
    if (passageBody) {
      var fontVar = state.font === "serif" ? "var(--font-serif, ui-serif, Georgia, serif)"
        : state.font === "mono" ? "var(--font-mono)"
        : "var(--font-sans)";
      passageBody.style.setProperty("--ielts-reader-font", fontVar);
      passageBody.style.setProperty("--ielts-reader-font-size", state.size + "px");
      passageBody.style.setProperty("--ielts-reader-line-height", String(state.line));
      passageBody.style.setProperty("--ielts-reader-measure", state.measure + "px");
    }
    var root = document.body;
    if (root) {
      if (state.hideScrollbars) root.classList.add("ielts-hide-pane-scrollbars");
      else root.classList.remove("ielts-hide-pane-scrollbars");
    }
  }

  function syncReaderUI(state) {
    if (fontFamilySel) fontFamilySel.value = state.font;
    if (fontSizeRange) fontSizeRange.value = String(state.size);
    if (lineHeightRange) lineHeightRange.value = String(state.line);
    if (measureRange) measureRange.value = String(state.measure);
    scrollbarSegBtns.forEach(function (b) {
      var hide = b.getAttribute("data-ielts-scrollbars") === "hide";
      b.setAttribute("aria-pressed", hide === !!state.hideScrollbars ? "true" : "false");
    });
  }

  function openReader() {
    if (!readerPanel || !readerBtn) return;
    readerPanel.hidden = false;
    readerBtn.setAttribute("aria-expanded", "true");
    // Position as fixed overlay under the button (avoid topbar scroll clipping)
    try {
      var r = readerBtn.getBoundingClientRect();
      var gap = 8;
      var left = Math.max(12, Math.min(window.innerWidth - 12, r.left));
      var top = Math.max(12, r.bottom + gap);
      // Prefer aligning the panel's right edge to button's right edge when possible
      var panelW = readerPanel.getBoundingClientRect().width || 320;
      var leftAligned = Math.min(left, window.innerWidth - 12 - panelW);
      var rightAligned = Math.max(12, Math.min(window.innerWidth - 12 - panelW, r.right - panelW));
      var finalLeft = rightAligned;
      if (finalLeft < 12 || finalLeft + panelW > window.innerWidth - 12) finalLeft = leftAligned;
      readerPanel.style.left = finalLeft + "px";
      readerPanel.style.top = top + "px";
    } catch (e) {}
  }

  function closeReader() {
    if (!readerPanel || !readerBtn) return;
    readerPanel.hidden = true;
    readerBtn.setAttribute("aria-expanded", "false");
  }

  function toggleReader() {
    if (!readerPanel || !readerBtn) return;
    if (readerPanel.hidden) openReader(); else closeReader();
  }

  function onReaderChange() {
    var cur = getReaderState();
    var next = {
      font: fontFamilySel ? fontFamilySel.value : cur.font,
      size: fontSizeRange ? parseInt(fontSizeRange.value, 10) : cur.size,
      line: lineHeightRange ? parseFloat(lineHeightRange.value) : cur.line,
      measure: measureRange ? parseInt(measureRange.value, 10) : cur.measure,
      hideScrollbars: !!cur.hideScrollbars
    };
    setReaderState(next);
    applyReaderState(next);
  }

  function resetReader() {
    var d = { font: "sans", size: 16, line: 1.65, measure: 760, hideScrollbars: true };
    setReaderState(d);
    syncReaderUI(d);
    applyReaderState(d);
  }

  sel.addEventListener("change", syncSkillLabel);
  if (bookSel) bookSel.addEventListener("change", autoSizeAllCombos);
  if (testSel) testSel.addEventListener("change", autoSizeAllCombos);
  if (bookSel) bookSel.addEventListener("change", syncAll);
  if (testSel) testSel.addEventListener("change", syncAll);
  if (sel) sel.addEventListener("change", syncAll);
  passageBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.getAttribute("data-passage");
      if (!k) return;
      setPassageKey(k);
      syncAll();
    });
  });
  syncAll();

  applyViewMode(getSavedViewMode());
  var rs = getReaderState();
  syncReaderUI(rs);
  applyReaderState(rs);

  viewBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      applyViewMode(b.getAttribute("data-view"));
    });
  });

  scrollbarSegBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var cur = getReaderState();
      var next = {
        font: cur.font,
        size: cur.size,
        line: cur.line,
        measure: cur.measure,
        hideScrollbars: b.getAttribute("data-ielts-scrollbars") === "hide"
      };
      setReaderState(next);
      applyReaderState(next);
      syncReaderUI(next);
    });
  });

  if (readerBtn) readerBtn.addEventListener("click", toggleReader);
  if (readerClose) readerClose.addEventListener("click", closeReader);
  if (readerReset) readerReset.addEventListener("click", resetReader);
  if (clearHighlightsBtn) clearHighlightsBtn.addEventListener("click", clearPassageHighlights);

  if (passageBody) {
    passageBody.addEventListener("mouseup", function (e) {
      var ctrl = !!(e && e.ctrlKey);
      window.setTimeout(function () {
        applyPassageHighlight(ctrl);
      }, 0);
    });
    passageBody.addEventListener("touchend", function (e) {
      var ctrl = !!(e && e.ctrlKey);
      window.setTimeout(function () {
        applyPassageHighlight(ctrl);
      }, 50);
    }, { passive: true });
    passageBody.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || typeof t.closest !== "function") return;
      var mark = t.closest("mark.ielts-highlight");
      if (!mark || !passageBody.contains(mark)) return;
      e.preventDefault();
      unwrapHighlightMark(mark);
    });
  }
  [fontFamilySel, fontSizeRange, lineHeightRange, measureRange].forEach(function (el) {
    if (!el) return;
    el.addEventListener("change", onReaderChange);
    el.addEventListener("input", onReaderChange);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeReader();
  });
  document.addEventListener("click", function (e) {
    if (!readerPanel || readerPanel.hidden) return;
    var t = e.target;
    if (readerPanel.contains(t) || (readerBtn && readerBtn.contains(t))) return;
    closeReader();
  });

  window.addEventListener("resize", function () {
    if (!readerPanel || readerPanel.hidden) return;
    openReader();
  });

  window.setTimeout(autoSizeAllCombos, 0);
  window.setTimeout(autoSizeAllCombos, 250);
})();
</script>

</div>

