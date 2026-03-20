(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  async function getEmbeddedWordsPool() {
    const el = document.getElementById("ve-words-data");
    if (!el) return null;
    try {
      const raw = (el.textContent || "").trim();
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && Array.isArray(parsed.words)) return parsed.words;
        return null;
      }

      // Large JSON can be problematic to embed via Liquid; fallback to fetching a static file.
      const src = el.getAttribute("data-words-src") || el.dataset.wordsSrc;
      if (!src) return null;
      const res = await fetch(src, { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const fetched = await res.json();
      if (Array.isArray(fetched)) return fetched;
      if (fetched && Array.isArray(fetched.words)) return fetched.words;
      return null;
    } catch {
      return null;
    }
  }

  /** @type {{book_id:string,title:string,words:Array<any>}} */
  let model = { book_id: "", title: "", words: [] };
  /** unit 단위로 보기: null = 전체, number = 해당 unit만 */
  let filterUnit = null;
  /** Start 버튼을 눌러야 로드되는 모드 */
  let started = false;
  /** Start 전에도 기억하는 unit 선택값 */
  let pendingUnit = null;
  /** @type {any[]|null} */
  let wordsPool = null;

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function ensureSchema(m) {
    const out = m && typeof m === "object" ? deepClone(m) : {};
    out.book_id = String(out.book_id ?? "");
    out.title = String(out.title ?? "");
    out.words = Array.isArray(out.words) ? out.words : [];

    out.words = out.words.map((w, idx) => {
      const ww = w && typeof w === "object" ? w : {};
      const entries = Array.isArray(ww.entries) ? ww.entries : [];
      return {
        id: Number.isFinite(+ww.id) ? +ww.id : idx + 1,
        unit: Number.isFinite(+ww.unit) ? +ww.unit : Math.floor(idx / 30) + 1,
        term: String(ww.term ?? ""),
        entries: entries.map((e) => {
          const ee = e && typeof e === "object" ? e : {};
          const examples = Array.isArray(ee.examples) ? ee.examples : [];
          return {
            pos: (ee.pos == null || String(ee.pos).trim() === "") ? "v." : String(ee.pos),
            gloss: String(ee.gloss ?? ""),
            examples: examples.map((x) => {
              const xx = x && typeof x === "object" ? x : {};
              return { text: String(xx.text ?? ""), translation: String(xx.translation ?? "") };
            }),
          };
        }),
      };
    });
    return out;
  }

  function calcRowPlan(words) {
    // 각 word → entry → example을 “표의 행”으로 펼친 뒤 rowspan을 계산한다.
    // row는 {wIdx,eIdx,xIdx}를 가진다. (example 없으면 xIdx = -1)
    const rows = [];
    const wordSpans = new Map(); // key: wIdx -> span
    const entrySpans = new Map(); // key: wIdx|eIdx -> span

    words.forEach((w, wIdx) => {
      const entries = (w.entries && w.entries.length) ? w.entries : [{ pos: "v.", gloss: "", examples: [] }];
      let wordRowCount = 0;

      entries.forEach((e, eIdx) => {
        const exs = (e.examples && e.examples.length) ? e.examples : [{ text: "", translation: "" }];
        let entryRowCount = 0;

        exs.forEach((x, xIdx) => {
          rows.push({ wIdx, eIdx, xIdx });
          wordRowCount += 1;
          entryRowCount += 1;
        });

        entrySpans.set(`${wIdx}|${eIdx}`, entryRowCount);
      });

      wordSpans.set(String(wIdx), wordRowCount);
    });

    return { rows, wordSpans, entrySpans };
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = String(s ?? "");
    return d.innerHTML;
  }

  function setMetaUI() {
    const bookIdEl = $("#ve-book-id");
    const titleEl = $("#ve-title");
    if (bookIdEl) bookIdEl.value = model.book_id || "";
    if (titleEl) titleEl.value = model.title || "";
  }

  function setStatsUI() {
    const el = $("#ve-stats");
    if (!el) return;
    const wordCount = model.words.length;
    const entryCount = model.words.reduce((a, w) => a + (w.entries?.length || 0), 0);
    const exCount = model.words.reduce((a, w) => a + (w.entries || []).reduce((b, e) => b + (e.examples?.length || 0), 0), 0);
    el.innerHTML = `<span><b>Words</b>: ${wordCount}</span><span><b>Entries</b>: ${entryCount}</span><span><b>Examples</b>: ${exCount}</span>`;
  }

  function getUniqueUnits() {
    const set = new Set();
    model.words.forEach((w) => {
      const u = Number.isFinite(+w.unit) ? +w.unit : 0;
      if (u > 0) set.add(u);
    });
    return Array.from(set).sort((a, b) => a - b);
  }

  function fillUnitFilter() {
    const sel = $("#ve-unit-select");
    if (!sel) return;
    const current = filterUnit != null ? String(filterUnit) : "";
    const units = getUniqueUnits();
    sel.innerHTML = "<option value=\"\">전체</option>" + units.map((u) => `<option value="${u}">${u}</option>`).join("");
    sel.value = current;
    if (sel.value !== current && units.length) sel.value = units.includes(filterUnit) ? current : "";
  }

  function renderTable() {
    const tbody = $("#ve-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    let { rows, wordSpans, entrySpans } = calcRowPlan(model.words);

    if (filterUnit != null) {
      rows = rows.filter((r) => Number(model.words[r.wIdx].unit) === filterUnit);
      const wordSpans2 = new Map();
      const entrySpans2 = new Map();
      rows.forEach(({ wIdx, eIdx }) => {
        wordSpans2.set(String(wIdx), (wordSpans2.get(String(wIdx)) || 0) + 1);
        entrySpans2.set(`${wIdx}|${eIdx}`, (entrySpans2.get(`${wIdx}|${eIdx}`) || 0) + 1);
      });
      wordSpans = wordSpans2;
      entrySpans = entrySpans2;
    }

    const renderedWord = new Set();
    const renderedEntry = new Set();

    rows.forEach(({ wIdx, eIdx, xIdx }) => {
      const w = model.words[wIdx];
      const hasRealEntries = w.entries && w.entries.length > 0;
      const e = hasRealEntries ? w.entries[eIdx] : { pos: "", gloss: "", examples: [{ text: "", translation: "" }] };
      const exs = (e.examples && e.examples.length) ? e.examples : [{ text: "", translation: "" }];
      const x = exs[xIdx] || { text: "", translation: "" };

      const tr = document.createElement("tr");
      tr.dataset.wIdx = String(wIdx);
      tr.dataset.eIdx = String(eIdx);
      tr.dataset.xIdx = String(xIdx);

      const wordKey = String(wIdx);
      const entryKey = `${wIdx}|${eIdx}`;

      // id / unit / term (rowspan word)
      if (!renderedWord.has(wordKey)) {
        renderedWord.add(wordKey);
        const span = wordSpans.get(wordKey) || 1;

        tr.appendChild(cellText("id", w.id, span));
        tr.appendChild(cellText("unit", w.unit, span));
        tr.appendChild(cellText("term", w.term, span));
      }

      // pos / gloss (rowspan entry)
      if (!renderedEntry.has(entryKey)) {
        renderedEntry.add(entryKey);
        const span = entrySpans.get(entryKey) || 1;
        tr.appendChild(cellPosSelect(e.pos, { wIdx, eIdx, field: "pos" }, span));
        tr.appendChild(cellInput("gloss", e.gloss, { wIdx, eIdx, field: "gloss" }, span, "text"));
      }

      // example text / translation (no rowspan)
      tr.appendChild(cellTextarea("example", x.text, { wIdx, eIdx, xIdx, field: "text" }));
      tr.appendChild(cellTextarea("translation", x.translation, { wIdx, eIdx, xIdx, field: "translation" }));

      // actions
      tr.appendChild(cellActions({ wIdx, eIdx, xIdx }));

      tbody.appendChild(tr);
    });

    fillUnitFilter();
    setStatsUI();
  }

  function cellInput(label, value, path, rowspan = 1, type = "text") {
    const td = document.createElement("td");
    td.className = `ve-cell ve-cell--${label}`;
    if (rowspan > 1) td.rowSpan = rowspan;

    const input = document.createElement("input");
    input.className = "ve-input ve-input--cell";
    input.type = type;
    input.value = value == null ? "" : String(value);
    input.dataset.path = JSON.stringify(path);
    input.addEventListener("change", onCellChange);

    td.appendChild(input);
    return td;
  }

  const POS_OPTIONS = [
    { value: "", label: "" },
    { value: "n.", label: "명사" },
    { value: "pron.", label: "대명사" },
    { value: "v.", label: "동사" },
    { value: "adj.", label: "형용사" },
    { value: "adv.", label: "부사" },
    { value: "prep.", label: "전치사" },
    { value: "conj.", label: "접속사" },
    { value: "interj.", label: "감탄사" }
  ];

  function cellPosSelect(value, path, rowspan = 1) {
    const td = document.createElement("td");
    td.className = "ve-cell ve-cell--pos";
    if (rowspan > 1) td.rowSpan = rowspan;

    const sel = document.createElement("select");
    sel.className = "ve-input ve-input--cell ve-select";
    sel.dataset.path = JSON.stringify(path);
    const current = value == null ? "" : String(value);
    POS_OPTIONS.forEach((opt) => {
      const o = document.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;
      if (opt.value === current) o.selected = true;
      sel.appendChild(o);
    });
    // 값이 옵션에 없으면(기존 데이터) 임시 옵션으로 유지
    if (current && !POS_OPTIONS.some((o) => o.value === current)) {
      const o = document.createElement("option");
      o.value = current;
      o.textContent = `${current} (custom)`;
      o.selected = true;
      sel.insertBefore(o, sel.firstChild);
    }

    sel.addEventListener("change", onCellChange);
    td.appendChild(sel);
    return td;
  }

  function cellText(label, value, rowspan = 1) {
    const td = document.createElement("td");
    td.className = `ve-cell ve-cell--${label} ve-cell--readonly`;
    if (rowspan > 1) td.rowSpan = rowspan;
    td.innerHTML = `<div class="ve-readonly">${escapeHtml(value == null ? "" : String(value))}</div>`;
    return td;
  }

  function cellTextarea(label, value, path) {
    const td = document.createElement("td");
    td.className = `ve-cell ve-cell--${label}`;

    const ta = document.createElement("textarea");
    ta.className = "ve-textarea";
    ta.rows = 1;
    ta.value = value == null ? "" : String(value);
    ta.dataset.path = JSON.stringify(path);
    ta.addEventListener("change", onCellChange);

    td.appendChild(ta);
    return td;
  }

  function cellActions({ wIdx, eIdx, xIdx }) {
    const td = document.createElement("td");
    td.className = "ve-cell ve-cell--actions";

    td.innerHTML = `
      <div class="ve-actions">
        <button type="button" class="ve-mini" data-act="add-entry" data-w="${wIdx}">+</button>
        <button type="button" class="ve-mini ve-mini--danger" data-act="del-entry" data-w="${wIdx}" data-e="${eIdx}">-</button>
      </div>
    `;
/**
 *       <div class="ve-actions">
        <button type="button" class="ve-mini" data-act="add-entry" data-w="${wIdx}">+Entry</button>
        <button type="button" class="ve-mini" data-act="add-ex" data-w="${wIdx}" data-e="${eIdx}">+Ex</button>
        <button type="button" class="ve-mini ve-mini--danger" data-act="del-ex" data-w="${wIdx}" data-e="${eIdx}" data-x="${xIdx}">Del Ex</button>
        <button type="button" class="ve-mini ve-mini--danger" data-act="del-entry" data-w="${wIdx}" data-e="${eIdx}">Del Entry</button>
        <button type="button" class="ve-mini ve-mini--danger" data-act="del-word" data-w="${wIdx}">Del Word</button>
      </div>
 *  */ 
    td.addEventListener("click", onActionClick);
    return td;
  }

  function onCellChange(e) {
    const el = e.target;
    const raw = el.dataset.path;
    if (!raw) return;
    const path = JSON.parse(raw);

    if (path.field === "id" || path.field === "unit") {
      const n = Number(el.value);
      model.words[path.wIdx][path.field] = Number.isFinite(n) ? n : el.value;
      return;
    }

    if (path.field === "term") {
      model.words[path.wIdx].term = el.value;
      return;
    }

    // entry fields
    if (path.field === "pos" || path.field === "gloss") {
      ensureEntries(path.wIdx);
      model.words[path.wIdx].entries[path.eIdx][path.field] = el.value;
      return;
    }

    // example fields
    if (path.field === "text" || path.field === "translation") {
      ensureEntries(path.wIdx);
      ensureExamples(path.wIdx, path.eIdx);
      model.words[path.wIdx].entries[path.eIdx].examples[path.xIdx][path.field] = el.value;
      return;
    }
  }

  function ensureEntries(wIdx) {
    const w = model.words[wIdx];
    if (!Array.isArray(w.entries)) w.entries = [];
    if (w.entries.length === 0) w.entries.push({ pos: "v.", gloss: "", examples: [{ text: "", translation: "" }] });
  }

  function ensureExamples(wIdx, eIdx) {
    const e = model.words[wIdx].entries[eIdx];
    if (!Array.isArray(e.examples)) e.examples = [];
    if (e.examples.length === 0) e.examples.push({ text: "", translation: "" });
  }

  function onActionClick(e) {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;

    const act = btn.dataset.act;
    const wIdx = Number(btn.dataset.w);
    const eIdx = btn.dataset.e != null ? Number(btn.dataset.e) : null;
    const xIdx = btn.dataset.x != null ? Number(btn.dataset.x) : null;

    if (!Number.isFinite(wIdx)) return;

    if (act === "add-entry") {
      model.words[wIdx].entries = Array.isArray(model.words[wIdx].entries) ? model.words[wIdx].entries : [];
      model.words[wIdx].entries.push({ pos: "v.", gloss: "", examples: [{ text: "", translation: "" }] });
      renderTable();
      return;
    }

    if (act === "add-ex") {
      ensureEntries(wIdx);
      model.words[wIdx].entries[eIdx].examples = Array.isArray(model.words[wIdx].entries[eIdx].examples) ? model.words[wIdx].entries[eIdx].examples : [];
      model.words[wIdx].entries[eIdx].examples.push({ text: "", translation: "" });
      renderTable();
      return;
    }

    if (act === "del-ex") {
      ensureEntries(wIdx);
      ensureExamples(wIdx, eIdx);
      const exs = model.words[wIdx].entries[eIdx].examples;
      if (exs.length <= 1) {
        exs[0] = { text: "", translation: "" };
      } else {
        exs.splice(xIdx, 1);
      }
      renderTable();
      return;
    }

    if (act === "del-entry") {
      ensureEntries(wIdx);
      const entries = model.words[wIdx].entries;
      if (entries.length <= 1) {
        entries[0] = { pos: "", gloss: "", examples: [{ text: "", translation: "" }] };
      } else {
        entries.splice(eIdx, 1);
      }
      renderTable();
      return;
    }

    if (act === "del-word") {
      if (!confirm("이 단어(word) 전체를 삭제할까요?")) return;
      model.words.splice(wIdx, 1);
      reindexIdsUnits(false);
      renderTable();
      return;
    }
  }

  function addWord() {
    const nextId = model.words.length ? Math.max(...model.words.map((w) => +w.id || 0)) + 1 : 1;
    const nextUnit = Math.floor(model.words.length / 30) + 1;
    model.words.push({
      id: nextId,
      unit: Math.min(nextUnit, 999),
      term: "",
      entries: [{ pos: "v.", gloss: "", examples: [{ text: "", translation: "" }] }],
    });
    renderTable();
  }

  function reindexIdsUnits(ask = true) {
    if (ask && !confirm("현재 순서대로 id(1..n), unit(30개 단위)을 재정렬할까요?")) return;
    model.words.forEach((w, i) => {
      w.id = i + 1;
      w.unit = Math.floor(i / 30) + 1;
    });
    renderTable();
  }

  function exportJson() {
    // 빈 entry 자동 보정 포함
    const normalized = ensureSchema(model);
    // client fetch src (assets/data/*/words.json) 포맷에 맞춰 내보낸다.
    // 현재 words.json은 { words: [...] } 형태.
    const payload = { words: normalized.words };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "updated_voca.json";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  }

  async function loadFromUrl(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  }

  function loadFromText(text) {
    return JSON.parse(text);
  }

  function loadModel(raw) {
    model = ensureSchema(raw);
    filterUnit = null;
    setMetaUI();
    renderTable();
  }

  function setUnitEnabled(on) {
    const unitSel = $("#ve-unit-select");
    if (unitSel) unitSel.disabled = !on;
  }

  function setExportEnabled(on) {
    const exportBtn = $("#ve-export-button, #ve-export-button-button");
    if (exportBtn) exportBtn.disabled = !on;
  }

  function getSelectedSubject() {
    const sel = $("#ve-book-select");
    if (!sel) return null;
    const opt = sel.selectedOptions && sel.selectedOptions[0] ? sel.selectedOptions[0] : null;
    if (!opt) return null;
    const bookId = String(opt.value || "");
    const title = String(opt.getAttribute("data-title") || opt.textContent || "");
    const start = Number(opt.getAttribute("data-words-start"));
    const end = Number(opt.getAttribute("data-words-end"));
    const hasRange = Number.isFinite(start) && Number.isFinite(end);
    return { book_id: bookId, title, words_range: hasRange ? [start, end] : null };
  }

  function fillUnitOptionsFromBook() {
    const bookSel = $("#ve-book-select");
    const unitSel = $("#ve-unit-select");
    if (!bookSel || !unitSel) return;
    const opt = bookSel.selectedOptions && bookSel.selectedOptions[0] ? bookSel.selectedOptions[0] : null;
    const unitCount = opt ? Number(opt.getAttribute("data-unit-number")) : NaN;
    const fixedMin = Number(unitSel.getAttribute("data-ve-unit-range-min"));
    const fixedMax = Number(unitSel.getAttribute("data-ve-unit-range-max"));
    const current = pendingUnit != null ? String(pendingUnit) : "";
    if (Number.isFinite(fixedMin) && Number.isFinite(fixedMax) && fixedMax >= fixedMin) {
      const opts = [`<option value="">All</option>`];
      for (let i = fixedMin; i <= fixedMax; i += 1) opts.push(`<option value="${i}">${i}</option>`);
      unitSel.innerHTML = opts.join("");
      unitSel.value = current;
      if (unitSel.value !== current) unitSel.value = "";
    } else if (Number.isFinite(unitCount) && unitCount > 0) {
      const opts = [`<option value="">All</option>`];
      for (let i = 1; i <= unitCount; i += 1) opts.push(`<option value="${i}">${i}</option>`);
      unitSel.innerHTML = opts.join("");
      unitSel.value = current;
      if (unitSel.value !== current) unitSel.value = "";
    } else {
      unitSel.innerHTML = `<option value="">All</option>`;
      unitSel.value = "";
      pendingUnit = null;
    }
  }

  function pickWordsForSubject(subj) {
    if (!subj) return [];
    const range = Array.isArray(subj.words_range) ? subj.words_range : null;
    const pool = Array.isArray(wordsPool) ? wordsPool : [];
    if (!range || range.length !== 2) return pool;
    const [start, end] = range;
    const a = Number(start);
    const b = Number(end);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return pool;
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    // words.json의 각 항목은 {id, ...} 형태이므로 id로 필터링
    return pool.filter((w) => {
      const id = Number(w && w.id);
      return Number.isFinite(id) && id >= lo && id <= hi;
    });
  }

  function applySubject(subj) {
    if (!subj || !subj.book_id) return;
    const words = pickWordsForSubject(subj);
    loadModel({ book_id: subj.book_id, title: String(subj.title || ""), words });
    // unit 필터는 subject 로드 후 적용 (loadModel이 filterUnit을 초기화함)
    filterUnit = pendingUnit;
    renderTable();
    setUnitEnabled(true);
    setExportEnabled(true);
  }

  function bindUI() {
    const fileEl = $("#ve-file");
    const loadTextBtn = $("#ve-load-text");
    const exportBtn = $("#ve-export-button, #ve-export-button-button");
    const addWordBtn = $("#ve-add-word");
    const reindexBtn = $("#ve-reindex");
    const loadDefaultBtn = $("#ve-load-default");
    const jsonTa = $("#ve-json");
    const copyBtn = $("#ve-copy-json");
    const bookIdEl = $("#ve-book-id");
    const titleEl = $("#ve-title");
    const bookFilterEl = $("#ve-book-select");
    const startBtn = $("#ve-load-button, #ve-load-button-button");
    const colvisRadios = $$("input[name='ve-colvis']");
    const colChecks = $$("input[name='ve-col']");

    if (bookIdEl) bookIdEl.addEventListener("change", () => { model.book_id = bookIdEl.value; });
    if (titleEl) titleEl.addEventListener("change", () => { model.title = titleEl.value; });

    if (bookFilterEl) {
      bookFilterEl.addEventListener("change", async () => {
        // book 변경 시 unit 옵션을 즉시 갱신 (Start 전에도 가능)
        fillUnitOptionsFromBook();
        // Start 전에는 선택만 바꾸고 로드는 하지 않음
        if (!started) return;
        const subj = getSelectedSubject();
        if (!subj || !subj.book_id) return;
        if (!Array.isArray(wordsPool)) wordsPool = await getEmbeddedWordsPool();
        if (!Array.isArray(wordsPool)) return;
        applySubject(subj);
      });
    }

    if (startBtn) {
      startBtn.addEventListener("click", async () => {
        if (started) return;
        started = true;
        setExportEnabled(false);
        try {
          if (!Array.isArray(wordsPool)) wordsPool = await getEmbeddedWordsPool();
          if (!Array.isArray(wordsPool)) throw new Error("embedded words missing");
          const subj = getSelectedSubject();
          if (subj && subj.book_id) applySubject(subj);
        } catch (err) {
          console.warn("start-load failed:", err);
        }
      });
    }

    if (fileEl) {
      fileEl.addEventListener("change", async () => {
        const f = fileEl.files && fileEl.files[0];
        if (!f) return;
        const text = await f.text();
        loadModel(loadFromText(text));
      });
    }

    if (loadTextBtn) {
      loadTextBtn.addEventListener("click", () => {
        const text = (jsonTa && jsonTa.value) ? jsonTa.value : "";
        if (!text.trim()) return alert("붙여넣은 JSON이 비어 있습니다.");
        try {
          loadModel(loadFromText(text));
        } catch (err) {
          alert("JSON 파싱 실패: " + err);
        }
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        const normalized = ensureSchema(model);
        const txt = JSON.stringify({ words: normalized.words }, null, 2);
        try {
          await navigator.clipboard.writeText(txt);
          alert("현재 JSON을 클립보드에 복사했습니다.");
        } catch {
          if (jsonTa) jsonTa.value = txt;
          alert("클립보드 복사 권한이 없어 textarea에 채웠습니다.");
        }
      });
    }

    if (exportBtn) exportBtn.addEventListener("click", exportJson);
    if (addWordBtn) addWordBtn.addEventListener("click", addWord);
    if (reindexBtn) reindexBtn.addEventListener("click", () => reindexIdsUnits(true));

    // load-default 버튼은 더 이상 사용하지 않음(브라우저에서 _data 접근 불가)

    const unitFilterEl = $("#ve-unit-select");
    if (unitFilterEl) {
      unitFilterEl.addEventListener("change", () => {
        const v = unitFilterEl.value;
        pendingUnit = v === "" ? null : (Number(v) || null);
        if (!started) return;
        filterUnit = pendingUnit;
        renderTable();
      });
    }

    // Column visibility (radio preset + per-column checks)
    const ALL_COLS = ["id", "unit", "term", "pos", "gloss", "example", "translation", "actions"];
    function applyHiddenCols(hidden) {
      const host = document.querySelector(".voca-editor");
      if (!host) return;
      ALL_COLS.forEach((c) => host.classList.remove(`ve-hide-${c}`));
      hidden.forEach((c) => host.classList.add(`ve-hide-${c}`));
    }
    function syncFromChecks() {
      const hidden = colChecks.filter((c) => !c.checked).map((c) => c.value);
      applyHiddenCols(hidden);
    }
    function setChecksForMode(mode) {
      if (mode === "show-all") {
        colChecks.forEach((c) => (c.checked = true));
        syncFromChecks();
        return;
      }
      // custom: keep current
      syncFromChecks();
    }

    colvisRadios.forEach((r) => {
      r.addEventListener("change", () => {
        const checked = colvisRadios.find((x) => x.checked);
        setChecksForMode(checked ? checked.value : "custom");
      });
    });
    colChecks.forEach((c) => {
      c.addEventListener("change", () => {
        // 체크 변경 시 프리셋은 custom으로
        const custom = colvisRadios.find((r) => r.value === "custom");
        if (custom) custom.checked = true;
        syncFromChecks();
      });
    });

    // default: current 체크 상태 적용 (unit/translation 기본 숨김)
    syncFromChecks();
  }

  function init() {
    const host = document.querySelector(".voca-editor");
    if (host && host.dataset.veInited === "1") return;
    const tbody = $("#ve-tbody");
    if (!tbody) return; // not on this page
    if (host) host.dataset.veInited = "1";
    bindUI();

    // Start 버튼을 누르기 전까지는 데이터 로드를 하지 않는다.
    started = false;
    pendingUnit = null;
    setExportEnabled(false);
    setUnitEnabled(true);
    fillUnitOptionsFromBook();
    loadModel({ book_id: "", title: "", words: [] });
  }

  // PJAX 전환 후 재초기화를 위해 노출
  window.initVocaEditorPage = init;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

