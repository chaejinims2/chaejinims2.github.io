"use strict";

const STORAGE_KEY = "colorLabPaletteSets";
const LEGACY_STORAGE_KEY = "colorLabPalette";
const PALETTE_SLOTS = 20;
const MAX_PALETTE_SETS = 8;
const MAX_COLOR_NAME_LEN = 48;
const MAX_COLOR_MEMO_LEN = 200;
const PICKER_MIN = 88;
const PICKER_MAX = 300;
const HUE_STRIP_WIDTH = 22;

// --- Pure color utilities ---

function normalizeHex(input) {
  if (input == null || typeof input !== "string") return null;
  let s = input.trim().toUpperCase();
  if (s.startsWith("#")) s = s.slice(1);
  if (/^[0-9A-F]{3}$/.test(s)) {
    s = s
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9A-F]{6}$/.test(s)) return null;
  return `#${s}`;
}

function isValidHex(hex) {
  return normalizeHex(hex) !== null;
}

function hexToRgb(hex) {
  const n = normalizeHex(hex);
  if (!n) return null;
  const h = n.slice(1);
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v) => clamp(v).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hk = h / 360;

  return {
    r: Math.round(hue2rgb(p, q, hk + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hk) * 255),
    b: Math.round(hue2rgb(p, q, hk - 1 / 3) * 255),
  };
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const v = max;
  const s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

function hsvToRgb(h, s, v) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  v = Math.max(0, Math.min(100, v)) / 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (h < 60) {
    rp = c;
    gp = x;
  } else if (h < 120) {
    rp = x;
    gp = c;
  } else if (h < 180) {
    gp = c;
    bp = x;
  } else if (h < 240) {
    gp = x;
    bp = c;
  } else if (h < 300) {
    rp = x;
    bp = c;
  } else {
    rp = c;
    bp = x;
  }
  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  };
}

const INPUT_PLACEHOLDERS = {
  hex: "3B5BDB",
  rgb: "59, 91, 219",
  hsl: "228, 69, 55",
  hsv: "228, 73, 86",
};

function stripColorWrapper(raw) {
  return raw
    .trim()
    .replace(/^(rgb|hsl|hsv)a?\s*\(/i, "")
    .replace(/\)\s*$/, "")
    .trim();
}

function parseNumericTokens(raw) {
  const s = stripColorWrapper(raw);
  const tokens = s.match(/\d+(?:\.\d+)?%?/g);
  if (!tokens || tokens.length < 3) return null;
  return tokens.slice(0, 3).map((t) => ({
    value: parseFloat(t.replace("%", "")),
    hasPercent: t.includes("%"),
  }));
}

function parseColorInput(raw, type) {
  if (raw == null || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (type === "hex") {
    return normalizeHex(trimmed);
  }

  const parts = parseNumericTokens(trimmed);
  if (!parts) return null;

  if (type === "rgb") {
    const [r, g, b] = parts.map((p) => p.value);
    if (![r, g, b].every((n) => Number.isFinite(n) && n >= 0 && n <= 255)) {
      return null;
    }
    return rgbToHex(r, g, b);
  }

  if (type === "hsl") {
    const h = parts[0].value;
    let s = parts[1].value;
    let l = parts[2].value;
    if (!Number.isFinite(h) || h < 0 || h > 360) return null;
    if (parts[1].hasPercent) s = Math.min(100, s);
    else if (s > 100) return null;
    if (parts[2].hasPercent) l = Math.min(100, l);
    else if (l > 100) return null;
    if (s < 0 || l < 0) return null;
    const rgb = hslToRgb(h, s, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  if (type === "hsv") {
    const h = parts[0].value;
    let s = parts[1].value;
    let v = parts[2].value;
    if (!Number.isFinite(h) || h < 0 || h > 360) return null;
    if (parts[1].hasPercent) s = Math.min(100, s);
    else if (s > 100) return null;
    if (parts[2].hasPercent) v = Math.min(100, v);
    else if (v > 100) return null;
    if (s < 0 || v < 0) return null;
    const rgb = hsvToRgb(h, s, v);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  return null;
}

function formatColorValue(hex, type) {
  const normalized = normalizeHex(hex);
  if (!normalized) return "";
  const rgb = hexToRgb(normalized);
  if (!rgb) return "";

  switch (type) {
    case "hex":
      return normalized;
    case "rgb":
      return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    case "hsl": {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return `${hsl.h}, ${hsl.s}, ${hsl.l}`;
    }
    case "hsv": {
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      return `${hsv.h}, ${hsv.s}, ${hsv.v}`;
    }
    default:
      return normalized;
  }
}

function getColorValueType() {
  const el = document.querySelector(
    ".color-type-segment .segment-option.is-selected"
  );
  return el ? el.dataset.colorType : "hex";
}

function selectColorValueType(type) {
  const segment = document.querySelector(".color-type-segment");
  if (!segment) return;
  segment.querySelectorAll(".segment-option").forEach((btn) => {
    const on = btn.dataset.colorType === type;
    btn.classList.toggle("is-selected", on);
    btn.setAttribute("aria-checked", on ? "true" : "false");
  });
}

function invalidMessageForType(type) {
  switch (type) {
    case "rgb":
      return "Invalid RGB. Use three numbers 0–255 (e.g. 59, 91, 219).";
    case "hsl":
      return "Invalid HSL. Use hue 0–360 and S/L 0–100 (e.g. 228, 69, 55).";
    case "hsv":
      return "Invalid HSV. Use hue 0–360 and S/V 0–100 (e.g. 228, 73, 86).";
    default:
      return "Invalid HEX. Use 3 or 6 hex digits, with or without #.";
  }
}

function getReadableTextColor(r, g, b) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.179 ? "#000000" : "#FFFFFF";
}

// --- Storage (palette sets: each set has fixed slots) ---

function emptyPaletteSlots() {
  return Array(PALETTE_SLOTS).fill(null);
}

function normalizeColorName(name) {
  if (name == null || typeof name !== "string") return "";
  return name.trim().slice(0, MAX_COLOR_NAME_LEN);
}

function normalizeColorMemo(memo) {
  if (memo == null || typeof memo !== "string") return "";
  return memo.trim().slice(0, MAX_COLOR_MEMO_LEN);
}

function normalizePaletteSlot(entry) {
  if (entry == null || entry === "") return null;
  if (typeof entry === "string") {
    return isValidHex(entry)
      ? { hex: normalizeHex(entry), name: "", memo: "" }
      : null;
  }
  if (typeof entry === "object" && entry.hex) {
    const hex = isValidHex(entry.hex) ? normalizeHex(entry.hex) : null;
    if (!hex) return null;
    return {
      hex,
      name: normalizeColorName(entry.name),
      memo: normalizeColorMemo(entry.memo),
    };
  }
  return null;
}

function paletteSlotToStoredJson(slot) {
  const item = { hex: slot.hex };
  if (slot.name) item.name = slot.name;
  if (slot.memo) item.memo = slot.memo;
  return item;
}

function slotHex(entry) {
  const slot = normalizePaletteSlot(entry);
  return slot ? slot.hex : null;
}

function slotName(entry) {
  const slot = normalizePaletteSlot(entry);
  return slot ? slot.name : "";
}

function slotMemo(entry) {
  const slot = normalizePaletteSlot(entry);
  return slot ? slot.memo : "";
}

function normalizeSlotArray(parsed) {
  if (!Array.isArray(parsed)) return emptyPaletteSlots();

  if (parsed.length === PALETTE_SLOTS) {
    return parsed.map((entry) => normalizePaletteSlot(entry));
  }

  const slots = emptyPaletteSlots();
  parsed.slice(0, PALETTE_SLOTS).forEach((entry, i) => {
    slots[i] = normalizePaletteSlot(entry);
  });
  return slots;
}

/** Preserves open order (first opened below active, last opened at bottom). */
function normalizePinnedArray(pinned, setCount, active) {
  if (!Array.isArray(pinned)) return [];
  const out = [];
  const seen = new Set();
  for (const raw of pinned) {
    const i = Number(raw);
    if (!Number.isInteger(i) || i < 0 || i >= setCount || i === active || seen.has(i)) {
      continue;
    }
    seen.add(i);
    out.push(i);
  }
  return out;
}

function normalizeSwatchArray(swatches, setCount) {
  const out = Array.isArray(swatches)
    ? swatches.map((c) => {
        if (c == null || c === "") return null;
        return isValidHex(c) ? normalizeHex(c) : null;
      })
    : [];
  while (out.length < setCount) out.push(null);
  return out.slice(0, setCount);
}

function paletteStoreFromParsed(parsed) {
  if (!parsed || !Array.isArray(parsed.sets) || parsed.sets.length === 0) {
    return null;
  }
  const sets = parsed.sets
    .slice(0, MAX_PALETTE_SETS)
    .map((set) => normalizeSlotArray(set));
  const active = Math.min(
    Math.max(0, Number(parsed.active) || 0),
    sets.length - 1
  );
  const swatches = normalizeSwatchArray(parsed.swatches, sets.length);
  const pinned = normalizePinnedArray(parsed.pinned, sets.length, active);
  return { active, sets, swatches, pinned };
}

function loadPaletteStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const store = paletteStoreFromParsed(JSON.parse(raw));
      if (store) return store;
    }

    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      return {
        active: 0,
        sets: [normalizeSlotArray(legacy)],
        swatches: [null],
        pinned: [],
      };
    }
  } catch {
    /* fall through */
  }
  return { active: 0, sets: [emptyPaletteSlots()], swatches: [null], pinned: [] };
}

function resolveColorLabAsset(rel) {
  const el = document.querySelector("script[data-color-lab-bundle]");
  try {
    const base = el?.src
      ? new URL(".", el.src).href
      : window.location.href;
    return new URL(rel, base).href;
  } catch {
    return rel;
  }
}

async function ensureDefaultPaletteOnFirstVisit() {
  if (localStorage.getItem(STORAGE_KEY)) return;
  if (localStorage.getItem(LEGACY_STORAGE_KEY)) return;

  let store = null;
  try {
    const res = await fetch(resolveColorLabAsset("default-palette.json"), {
      cache: "no-cache",
    });
    if (res.ok) {
      store = paletteStoreFromParsed(await res.json());
    }
  } catch {
    /* use inline fallback */
  }

  if (!store) {
    try {
      store = paletteStoreFromParsed(
        JSON.parse(
          '{"active":0,"swatches":["#3B5BDB"],"sets":[[{"hex":"#3B5BDB","name":"Indigo"},{"hex":"#E03131","name":"Red"},{"hex":"#2F9E44","name":"Green"}]]}'
        )
      );
    } catch {
      return;
    }
  }

  if (store) savePaletteStore(store);
}

function savePaletteStore(store) {
  const sets = store.sets.map((slots) =>
    slots.map((entry) => {
      const slot = normalizePaletteSlot(entry);
      if (!slot) return null;
      return paletteSlotToStoredJson(slot);
    })
  );
  const active = Math.min(
    Math.max(0, store.active),
    Math.max(0, sets.length - 1)
  );
  const swatches = normalizeSwatchArray(store.swatches, sets.length);
  const pinned = normalizePinnedArray(store.pinned, sets.length, active);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ active, sets, swatches, pinned })
  );
}

function loadPalette() {
  const store = loadPaletteStore();
  return store.sets[store.active].map((entry) => normalizePaletteSlot(entry));
}

function savePalette(slots) {
  const store = loadPaletteStore();
  store.sets[store.active] = slots.map((entry) => normalizePaletteSlot(entry));
  savePaletteStore(store);
}

function switchPaletteSet(index) {
  const store = loadPaletteStore();
  if (index < 0 || index >= store.sets.length) return;
  store.active = index;
  store.pinned = normalizePinnedArray(store.pinned, store.sets.length, index);
  savePaletteStore(store);
  renderPaletteSetPicker();
  renderPaletteGrids();
}

function togglePinnedPaletteSet(index) {
  const store = loadPaletteStore();
  if (index < 0 || index >= store.sets.length || index === store.active) return;
  let pinned = normalizePinnedArray(store.pinned, store.sets.length, store.active);
  if (pinned.includes(index)) {
    pinned = pinned.filter((i) => i !== index);
  } else {
    pinned = [...pinned, index];
  }
  store.pinned = pinned;
  savePaletteStore(store);
  renderPaletteSetPicker();
  renderPaletteGrids();
}

function addPaletteSet() {
  const store = loadPaletteStore();
  if (store.sets.length >= MAX_PALETTE_SETS) return;
  store.sets.push(emptyPaletteSlots());
  store.swatches = normalizeSwatchArray(store.swatches, store.sets.length);
  store.active = store.sets.length - 1;
  savePaletteStore(store);
  renderPaletteSetPicker();
  renderPaletteGrids();
}

/** Right-click on palette slot: set tab swatch for that palette set. */
function setPaletteSetSwatch(setIndex, hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) return;
  const store = loadPaletteStore();
  if (setIndex < 0 || setIndex >= store.sets.length) return;
  store.swatches = normalizeSwatchArray(store.swatches, store.sets.length);
  store.swatches[setIndex] = normalized;
  savePaletteStore(store);
  renderPaletteSetPicker();
}

function onPaletteSlotContextMenu(e, hex, setIndex) {
  e.preventDefault();
  setPaletteSetSwatch(setIndex, hex);
}

function formatPaletteSetExportLine(set, isLastSet) {
  const suffix = isLastSet ? "" : ",";
  const slotJson = (entry) =>
    entry === null ? "null" : JSON.stringify(entry);

  if (set.every((s) => s === null)) {
    return `    [ ${set.map(() => "null").join(", ")} ]${suffix}`;
  }

  let lastNonNull = -1;
  for (let j = set.length - 1; j >= 0; j--) {
    if (set[j] !== null) {
      lastNonNull = j;
      break;
    }
  }

  const head = set.slice(0, lastNonNull + 1).map(slotJson);
  const tailNulls = set.slice(lastNonNull + 1);

  if (head.length === 1 && tailNulls.length === 0) {
    return `    [ ${head[0]} ]${suffix}`;
  }

  const out = [`    [ ${head[0]},`];
  for (let j = 1; j < head.length; j++) {
    const needsComma = j < head.length - 1 || tailNulls.length > 0;
    out.push(`      ${head[j]}${needsComma ? "," : ""}`);
  }
  if (tailNulls.length > 0) {
    out.push(`      ${tailNulls.map(() => "null").join(", ")} `);
  }
  out.push(`    ]${suffix}`);
  return out.join("\n");
}

function formatPaletteExportJson(payload) {
  const lines = [
    "{",
    `  "active": ${payload.active},`,
    `  "pinned": ${JSON.stringify(payload.pinned)},`,
    `  "swatches": ${JSON.stringify(payload.swatches)},`,
    '  "sets": [',
  ];
  payload.sets.forEach((set, idx) => {
    lines.push(
      formatPaletteSetExportLine(set, idx === payload.sets.length - 1)
    );
  });
  lines.push("  ]");
  lines.push("}");
  return lines.join("\n");
}

function paletteStoreToExportJson() {
  const store = loadPaletteStore();
  const payload = {
    active: store.active,
    pinned: store.pinned,
    swatches: store.swatches,
    sets: store.sets.map((slots) =>
      slots.map((entry) => {
        const slot = normalizePaletteSlot(entry);
        if (!slot) return null;
        return paletteSlotToStoredJson(slot);
      })
    ),
  };
  return formatPaletteExportJson(payload);
}

function exportPaletteJsonToClipboard() {
  copyText(paletteStoreToExportJson(), exportPaletteJsonBtn);
}

function loadSlotsForSet(setIndex) {
  const store = loadPaletteStore();
  if (setIndex < 0 || setIndex >= store.sets.length) return emptyPaletteSlots();
  return store.sets[setIndex].map((entry) => normalizePaletteSlot(entry));
}

function saveSlotsForSet(setIndex, slots) {
  const store = loadPaletteStore();
  if (setIndex < 0 || setIndex >= store.sets.length) return;
  store.sets[setIndex] = slots.map((entry) => normalizePaletteSlot(entry));
  savePaletteStore(store);
}

function setPaletteSlot(index, hex, name, setIndex) {
  const normalized = normalizeHex(hex);
  if (!normalized || index < 0 || index >= PALETTE_SLOTS) return;
  const si =
    setIndex !== undefined ? setIndex : loadPaletteStore().active;
  const slots = loadSlotsForSet(si);
  const nextName =
    name !== undefined
      ? normalizeColorName(name)
      : normalizeColorName(colorNameInput?.value ?? "");
  const nextMemo = normalizeColorMemo(colorMemoInput?.value ?? "");
  slots[index] = { hex: normalized, name: nextName, memo: nextMemo };
  saveSlotsForSet(si, slots);
  if (si === loadPaletteStore().active) {
    lastEditedPaletteSlotIndex = index;
  }
  renderPaletteGrids();
}

function updatePaletteSlotName(index, name, setIndex) {
  if (index < 0 || index >= PALETTE_SLOTS) return;
  const si =
    setIndex !== undefined ? setIndex : loadPaletteStore().active;
  const slots = loadSlotsForSet(si);
  const hex = slotHex(slots[index]);
  if (!hex) return;
  slots[index] = {
    hex,
    name: normalizeColorName(name),
    memo: slotMemo(slots[index]),
  };
  saveSlotsForSet(si, slots);
  renderPaletteGrids();
}

function clearPaletteSlot(index, setIndex) {
  if (index < 0 || index >= PALETTE_SLOTS) return;
  const si =
    setIndex !== undefined ? setIndex : loadPaletteStore().active;
  const slots = loadSlotsForSet(si);
  slots[index] = null;
  saveSlotsForSet(si, slots);
  if (
    si === loadPaletteStore().active &&
    lastEditedPaletteSlotIndex === index
  ) {
    lastEditedPaletteSlotIndex = -1;
  }
  renderPaletteGrids();
}

function fillColorMetaInputs(name, memo) {
  if (colorNameInput) colorNameInput.value = name;
  if (colorMemoInput) colorMemoInput.value = memo;
}

function selectPaletteSlot(index, hex, name, memo, setIndex) {
  const store = loadPaletteStore();
  const si = setIndex !== undefined ? setIndex : store.active;
  if (si === store.active) {
    lastEditedPaletteSlotIndex = index;
    applyColorFromHex(hex, { syncPicker: true, preserveColorMeta: true });
    fillColorMetaInputs(name, memo);
    return;
  }
  applyColorFromHex(hex, { syncPicker: true, preserveColorMeta: true });
  fillColorMetaInputs(name, memo);
}

// --- DOM ---

const colorValueInput = document.getElementById("color-value-input");
const colorNameInput = document.getElementById("color-name-input");
const colorMemoInput = document.getElementById("color-memo-input");
let lastEditedPaletteSlotIndex = -1;
const hexError = document.getElementById("hex-error");
const colorTypeSegment = document.querySelector(".color-type-segment");
const previewCard = document.getElementById("preview-card");
const previewLabel = document.getElementById("preview-label");
const valueList = document.getElementById("value-list");
const valueHexSummary = document.getElementById("value-hex-summary");
const valueHexSummaryText = document.getElementById("value-hex-summary-text");
const valuesListToggle = document.getElementById("values-list-toggle");
const paletteGrids = document.getElementById("palette-grids");
const paletteSetPicker = document.getElementById("palette-set-picker");
const dashboard = document.querySelector(".dashboard");
const pickerColumn = document.querySelector(".picker-column");
const pickerPanel = document.querySelector(".picker-panel");
const svPickerRow = document.querySelector(".sv-picker-row");
const svWrap = document.querySelector(".sv-wrap");
const hueWrap = document.querySelector(".hue-wrap");
const svCanvas = document.getElementById("color-sv");
const hueCanvas = document.getElementById("color-hue");
const svCursor = document.getElementById("sv-cursor");
const hueCursor = document.getElementById("hue-cursor");
const eyedropperBtn = document.getElementById("eyedropper-btn");
const exportPaletteJsonBtn = document.getElementById("export-palette-json-btn");
const othersSection = document.getElementById("others-section");

const pickerState = { h: 225, s: 72, v: 86 };
let syncingPicker = false;
let svDragging = false;
let hueDragging = false;
let copyFeedbackTimer = null;
let pickerSize = 200;
let pickerLayoutFrame = 0;
let syncingColorInput = false;
let lastValidHex = "#3B5BDB";

const svCtx = svCanvas.getContext("2d", { willReadFrequently: true });
const hueCtx = hueCanvas.getContext("2d", { willReadFrequently: true });

// --- Clipboard ---

async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  if (button) {
    const prev = button.textContent;
    button.classList.add("copied");
    button.textContent = "Copied";
    clearTimeout(copyFeedbackTimer);
    copyFeedbackTimer = setTimeout(() => {
      button.classList.remove("copied");
      button.textContent = prev;
    }, 1500);
  }
}

// --- SV + Hue picker (Office-style) ---

function pickerColumnWidthPx() {
  if (!dashboard) return 0;
  const rect = dashboard.getBoundingClientRect();
  const style = getComputedStyle(dashboard);
  const gap = parseFloat(style.columnGap) || 0;
  if (window.matchMedia("(max-width: 640px)").matches) {
    return rect.width;
  }
  if (pickerColumn && pickerColumn.clientWidth > 0) {
    return pickerColumn.clientWidth;
  }
  return (rect.width - gap) * 0.5;
}

function layoutPicker() {
  if (!pickerPanel || !svWrap || !svCanvas || !hueCanvas) return;

  const panelStyle = getComputedStyle(pickerPanel);
  const padX =
    parseFloat(panelStyle.paddingLeft) + parseFloat(panelStyle.paddingRight);
  const padY =
    parseFloat(panelStyle.paddingTop) + parseFloat(panelStyle.paddingBottom);
  const rowGap = svPickerRow
    ? parseFloat(getComputedStyle(svPickerRow).gap) || 0
    : 0;

  const colW = pickerColumnWidthPx() || pickerPanel.clientWidth;
  const colH = dashboard ? dashboard.clientHeight : pickerPanel.clientHeight;
  const availW = Math.max(0, colW - padX);
  const availH = Math.max(0, colH - padY);

  const rowMaxW = availW - HUE_STRIP_WIDTH - rowGap;
  let next = Math.floor(Math.min(rowMaxW, availH, PICKER_MAX));
  if (rowMaxW >= PICKER_MIN && availH >= PICKER_MIN) {
    next = Math.max(PICKER_MIN, next);
  } else {
    next = Math.max(1, Math.min(next, rowMaxW, availH));
  }

  if (next !== pickerSize) {
    pickerSize = next;
    svCanvas.width = pickerSize;
    svCanvas.height = pickerSize;
    hueCanvas.width = HUE_STRIP_WIDTH;
    hueCanvas.height = pickerSize;
  }

  svCanvas.style.width = `${pickerSize}px`;
  svCanvas.style.height = `${pickerSize}px`;
  hueCanvas.style.width = `${HUE_STRIP_WIDTH}px`;
  hueCanvas.style.height = `${pickerSize}px`;
  svWrap.style.width = `${pickerSize}px`;
  svWrap.style.height = `${pickerSize}px`;
  if (hueWrap) {
    hueWrap.style.width = `${HUE_STRIP_WIDTH}px`;
    hueWrap.style.height = `${pickerSize}px`;
  }
  const labRoot = document.querySelector(".color-lab-root");
  if (labRoot) {
    labRoot.style.setProperty("--picker-sv-size", `${pickerSize}px`);
    labRoot.style.setProperty("--picker-row-gap", `${rowGap}px`);
    labRoot.style.setProperty("--picker-hue-width", `${HUE_STRIP_WIDTH}px`);
  }
}

function schedulePickerLayout() {
  cancelAnimationFrame(pickerLayoutFrame);
  pickerLayoutFrame = requestAnimationFrame(() => {
    layoutPicker();
    drawSvPlane();
    drawHueStrip();
    updatePickerCursors();
  });
}

function drawSvPlane() {
  const size = pickerSize;
  const h = pickerState.h;
  const img = svCtx.createImageData(size, size);
  const data = img.data;
  for (let y = 0; y < size; y++) {
    const v = ((size - 1 - y) / (size - 1 || 1)) * 100;
    for (let x = 0; x < size; x++) {
      const s = (x / (size - 1 || 1)) * 100;
      const { r, g, b } = hsvToRgb(h, s, v);
      const i = (y * size + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  svCtx.putImageData(img, 0, 0);
}

function drawHueStrip() {
  const w = HUE_STRIP_WIDTH;
  const h = pickerSize;
  const img = hueCtx.createImageData(w, h);
  const data = img.data;
  for (let y = 0; y < h; y++) {
    const hue = (y / (h - 1 || 1)) * 360;
    const { r, g, b } = hsvToRgb(hue, 100, 100);
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  hueCtx.putImageData(img, 0, 0);
}

function updatePickerCursors() {
  const s = pickerState.s;
  const v = pickerState.v;
  const left = (s / 100) * pickerSize;
  const top = (1 - v / 100) * pickerSize;
  svCursor.hidden = false;
  svCursor.style.left = `${left}px`;
  svCursor.style.top = `${top}px`;

  const hueTop = (pickerState.h / 360) * pickerSize;
  hueCursor.hidden = false;
  hueCursor.style.top = `${hueTop}px`;
}

function setPickerHsv(h, s, v) {
  pickerState.h = Math.max(0, Math.min(360, h));
  pickerState.s = Math.max(0, Math.min(100, s));
  pickerState.v = Math.max(0, Math.min(100, v));
  drawSvPlane();
  updatePickerCursors();
  const { r, g, b } = hsvToRgb(
    pickerState.h,
    pickerState.s,
    pickerState.v
  );
  const hex = rgbToHex(r, g, b);
  applyColorFromHex(hex, { syncPicker: false });
}

function syncPickerFromHex(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return;
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  syncingPicker = true;
  pickerState.h = hsv.h;
  pickerState.s = hsv.s;
  pickerState.v = hsv.v;
  drawSvPlane();
  updatePickerCursors();
  syncingPicker = false;
}

function pickFromSvClient(clientX, clientY) {
  const rect = svCanvas.getBoundingClientRect();
  const x = Math.max(
    0,
    Math.min(pickerSize, ((clientX - rect.left) / rect.width) * pickerSize)
  );
  const y = Math.max(
    0,
    Math.min(pickerSize, ((clientY - rect.top) / rect.height) * pickerSize)
  );
  const s = (x / (pickerSize - 1 || 1)) * 100;
  const v = ((pickerSize - 1 - y) / (pickerSize - 1 || 1)) * 100;
  setPickerHsv(pickerState.h, s, v);
}

function pickFromHueClient(clientX, clientY) {
  const rect = hueCanvas.getBoundingClientRect();
  const y = Math.max(
    0,
    Math.min(pickerSize, ((clientY - rect.top) / rect.height) * pickerSize)
  );
  const hue = (y / (pickerSize - 1 || 1)) * 360;
  setPickerHsv(hue, pickerState.s, pickerState.v);
}

function onSvPointerDown(e) {
  svDragging = true;
  svCanvas.setPointerCapture(e.pointerId);
  pickFromSvClient(e.clientX, e.clientY);
}

function onSvPointerMove(e) {
  if (!svDragging) return;
  pickFromSvClient(e.clientX, e.clientY);
}

function onSvPointerUp(e) {
  if (!svDragging) return;
  svDragging = false;
  try {
    svCanvas.releasePointerCapture(e.pointerId);
  } catch {
    /* ignore */
  }
}

function onHuePointerDown(e) {
  hueDragging = true;
  hueCanvas.setPointerCapture(e.pointerId);
  pickFromHueClient(e.clientX, e.clientY);
}

function onHuePointerMove(e) {
  if (!hueDragging) return;
  pickFromHueClient(e.clientX, e.clientY);
}

function onHuePointerUp(e) {
  if (!hueDragging) return;
  hueDragging = false;
  try {
    hueCanvas.releasePointerCapture(e.pointerId);
  } catch {
    /* ignore */
  }
}

async function pickColorFromScreen() {
  if (!window.EyeDropper) return;
  try {
    const dropper = new EyeDropper();
    const { sRGBHex } = await dropper.open();
    applyColorFromHex(sRGBHex, { syncPicker: true });
  } catch {
    /* user cancelled */
  }
}

function hexFromPicker() {
  const { r, g, b } = hsvToRgb(
    pickerState.h,
    pickerState.s,
    pickerState.v
  );
  return rgbToHex(r, g, b);
}

// --- UI render ---

function setValuesListExpanded(expanded) {
  if (valueList) valueList.hidden = !expanded;
  if (valuesListToggle) {
    valuesListToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    valuesListToggle.classList.toggle("is-expanded", expanded);
    valuesListToggle.setAttribute(
      "aria-label",
      expanded ? "RGB, HSL, HSV 목록 숨기기" : "RGB, HSL, HSV 목록 보기"
    );
  }
}

function renderValueRows(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    valueList.innerHTML = "";
    if (valueHexSummaryText) valueHexSummaryText.textContent = "";
    return;
  }
  if (valueHexSummaryText) valueHexSummaryText.textContent = hex;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

  const rows = [
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    {
      label: "HSL",
      value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    },
    {
      label: "HSV",
      value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    },
  ];

  valueList.innerHTML = rows
    .map(
      (row) => `
    <li class="value-row">
      <span class="value-label">${row.label}</span>
      <span class="value-text">${row.value}</span>
    </li>`
    )
    .join("");
}

const COLOR_COPY_FORMATS = ["hex", "rgb", "hsl", "hsv"];

function createColorCopyOverlay(hex) {
  const overlay = document.createElement("div");
  overlay.className = "color-copy-overlay";
  COLOR_COPY_FORMATS.forEach((fmt) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "color-copy-chip";
    chip.textContent = `Copy ${fmt.toUpperCase()}`;
    chip.addEventListener("click", (e) => {
      e.stopPropagation();
      copyText(formatColorValue(hex, fmt), chip);
    });
    overlay.appendChild(chip);
  });
  return overlay;
}

function mountColorCopyOverlay(container, hex) {
  let overlay = container.querySelector(".color-copy-overlay");
  if (!overlay) {
    overlay = createColorCopyOverlay(hex);
    container.appendChild(overlay);
    return;
  }
  overlay.replaceWith(createColorCopyOverlay(hex));
}

function renderPreview(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return;
  const text = getReadableTextColor(rgb.r, rgb.g, rgb.b);
  previewCard.style.backgroundColor = hex;
  previewCard.style.color = text;
  previewLabel.textContent = hex;
  mountColorCopyOverlay(previewCard, hex);
}

function renderPaletteSetPicker() {
  if (!paletteSetPicker) return;
  const store = loadPaletteStore();
  paletteSetPicker.innerHTML = "";

  const pinned = normalizePinnedArray(
    store.pinned,
    store.sets.length,
    store.active
  );

  store.sets.forEach((_, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "segment-option";
    if (index === store.active) {
      btn.classList.add("is-selected");
    }
    if (pinned.includes(index)) {
      btn.classList.add("is-pinned");
    }
    btn.textContent = String(index + 1);
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", index === store.active ? "true" : "false");
    const swatch = store.swatches[index];
    if (swatch) {
      btn.classList.add("palette-set-swatch");
      btn.style.setProperty("--set-swatch", swatch);
      const rgb = hexToRgb(swatch);
      if (rgb) {
        btn.style.color = getReadableTextColor(rgb.r, rgb.g, rgb.b);
      }
    }
    if (index === store.active) {
      btn.setAttribute(
        "aria-label",
        `Palette set ${index + 1}, editing${
          swatch ? `, swatch ${swatch}` : ""
        }`
      );
    } else if (pinned.includes(index)) {
      btn.setAttribute(
        "aria-label",
        `Palette set ${index + 1}, shown below. Click to hide${
          swatch ? `, swatch ${swatch}` : ""
        }. Double-click to edit this set.`
      );
    } else {
      btn.setAttribute(
        "aria-label",
        `Palette set ${index + 1}. Click to show below${
          swatch ? `, swatch ${swatch}` : ""
        }. Double-click to edit this set.`
      );
    }
    let tabClickTimer = 0;
    btn.addEventListener("click", () => {
      if (index === store.active) return;
      clearTimeout(tabClickTimer);
      tabClickTimer = window.setTimeout(() => {
        togglePinnedPaletteSet(index);
      }, 260);
    });
    btn.addEventListener("dblclick", (e) => {
      e.preventDefault();
      clearTimeout(tabClickTimer);
      switchPaletteSet(index);
    });
    paletteSetPicker.appendChild(btn);
  });

  if (store.sets.length < MAX_PALETTE_SETS) {
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "palette-set-add";
    addBtn.textContent = "+";
    addBtn.setAttribute("aria-label", "Add palette set");
    addBtn.addEventListener("click", addPaletteSet);
    paletteSetPicker.appendChild(addBtn);
  }
}

function renderPaletteGridInto(gridEl, setIndex) {
  const slots = loadSlotsForSet(setIndex);
  gridEl.innerHTML = "";
  for (let i = 0; i < PALETTE_SLOTS; i++) {
    const hex = slotHex(slots[i]);
    const name = slotName(slots[i]);
    const memo = slotMemo(slots[i]);
    if (hex) {
      const cell = document.createElement("div");
      cell.className = "palette-slot palette-slot--filled";
      cell.dataset.slotIndex = String(i);
      cell.style.backgroundColor = hex;
      cell.setAttribute("role", "button");
      cell.tabIndex = 0;
      const label = name
        ? `${name}, ${hex}, set ${setIndex + 1} slot ${i + 1}`
        : `Use ${hex}, set ${setIndex + 1} slot ${i + 1}`;
      cell.setAttribute("aria-label", label);
      const titleParts = [name, memo].filter(Boolean);
      if (titleParts.length) {
        cell.title = titleParts.join(" — ");
      }
      if (name) {
        const caption = document.createElement("span");
        caption.className = "palette-slot-name";
        caption.textContent = name;
        cell.appendChild(caption);
      }
      if (memo) {
        const memoMark = document.createElement("span");
        memoMark.className = "palette-slot-memo-mark";
        memoMark.setAttribute("aria-hidden", "true");
        memoMark.textContent = "✎";
        cell.appendChild(memoMark);
      }
      cell.addEventListener("click", (e) => {
        const idx = Number(cell.dataset.slotIndex);
        if (e.altKey) {
          clearPaletteSlot(idx, setIndex);
          return;
        }
        selectPaletteSlot(idx, hex, name, memo, setIndex);
      });
      cell.addEventListener("contextmenu", (e) => {
        onPaletteSlotContextMenu(e, hex, setIndex);
      });
      gridEl.appendChild(cell);
      continue;
    }

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "palette-slot palette-slot--empty";
    btn.dataset.slotIndex = String(i);
    btn.setAttribute(
      "aria-label",
      `Save current color to set ${setIndex + 1} slot ${i + 1}`
    );
    btn.addEventListener("click", () => {
      setPaletteSlot(Number(btn.dataset.slotIndex), lastValidHex, undefined, setIndex);
    });
    btn.addEventListener("contextmenu", (e) => {
      onPaletteSlotContextMenu(e, lastValidHex, setIndex);
    });
    gridEl.appendChild(btn);
  }
}

function renderPaletteGrids() {
  if (!paletteGrids) return;
  const store = loadPaletteStore();
  const pinned = normalizePinnedArray(
    store.pinned,
    store.sets.length,
    store.active
  );
  const order = [store.active, ...pinned];
  paletteGrids.innerHTML = "";

  order.forEach((setIndex) => {
    const block = document.createElement("div");
    block.className = "palette-set-block";
    if (setIndex === store.active) {
      block.classList.add("palette-set-block--active");
    } else {
      block.classList.add("palette-set-block--pinned");
      const label = document.createElement("p");
      label.className = "palette-set-block-label micro-label";
      label.textContent = `Set ${setIndex + 1}`;
      block.appendChild(label);
    }
    const grid = document.createElement("div");
    grid.className = "palette-grid";
    renderPaletteGridInto(grid, setIndex);
    block.appendChild(grid);
    paletteGrids.appendChild(block);
  });
}

function setError(message) {
  if (message) {
    hexError.hidden = false;
    hexError.textContent = message;
    colorValueInput.classList.add("invalid");
  } else {
    hexError.hidden = true;
    hexError.textContent = "";
    colorValueInput.classList.remove("invalid");
  }
}

function syncColorInputFromHex(hex) {
  syncingColorInput = true;
  colorValueInput.value = formatColorValue(hex, getColorValueType());
  syncingColorInput = false;
}

function updateInputPlaceholder() {
  const type = getColorValueType();
  colorValueInput.placeholder = INPUT_PLACEHOLDERS[type] || INPUT_PLACEHOLDERS.hex;
}

function applyColorFromHex(hex, options = {}) {
  const syncPicker = options.syncPicker !== false;
  const updateInput = options.updateInput !== false;
  const normalized = normalizeHex(hex);
  if (!normalized) {
    setError(invalidMessageForType(getColorValueType()));
    return false;
  }
  setError("");
  lastValidHex = normalized;
  if (updateInput) {
    syncColorInputFromHex(normalized);
  }
  const preserveMeta =
    options.preserveColorMeta === true || options.preserveColorName === true;
  if (!preserveMeta) {
    fillColorMetaInputs("", "");
    lastEditedPaletteSlotIndex = -1;
  }
  renderPreview(normalized);
  renderValueRows(normalized);
  if (syncPicker && !syncingPicker) {
    syncPickerFromHex(normalized);
  }
  return true;
}

function onColorValueInput() {
  if (syncingColorInput) return;
  const raw = colorValueInput.value;
  const type = getColorValueType();
  if (!raw.trim()) {
    setError("");
    colorValueInput.classList.remove("invalid");
    return;
  }
  const hex = parseColorInput(raw, type);
  if (!hex) {
    setError(invalidMessageForType(type));
    colorValueInput.classList.add("invalid");
    return;
  }
  applyColorFromHex(hex, { syncPicker: true, updateInput: false });
}

colorValueInput.addEventListener("input", onColorValueInput);
colorValueInput.addEventListener("blur", onColorValueInput);

if (valuesListToggle && valueList) {
  setValuesListExpanded(false);
  valuesListToggle.addEventListener("click", () => {
    setValuesListExpanded(valueList.hidden);
  });
}

if (colorNameInput || colorMemoInput) {
  const syncMetaToLinkedSlot = () => {
    if (lastEditedPaletteSlotIndex < 0) return;
    const store = loadPaletteStore();
    const slots = loadSlotsForSet(store.active);
    if (slotHex(slots[lastEditedPaletteSlotIndex]) !== lastValidHex) {
      lastEditedPaletteSlotIndex = -1;
      return;
    }
    const hex = slotHex(slots[lastEditedPaletteSlotIndex]);
    slots[lastEditedPaletteSlotIndex] = {
      hex,
      name: normalizeColorName(colorNameInput?.value ?? ""),
      memo: normalizeColorMemo(colorMemoInput?.value ?? ""),
    };
    saveSlotsForSet(store.active, slots);
    renderPaletteGrids();
  };
  if (colorNameInput) {
    colorNameInput.addEventListener("change", syncMetaToLinkedSlot);
    colorNameInput.addEventListener("blur", syncMetaToLinkedSlot);
  }
  if (colorMemoInput) {
    colorMemoInput.addEventListener("change", syncMetaToLinkedSlot);
    colorMemoInput.addEventListener("blur", syncMetaToLinkedSlot);
  }
}

if (colorTypeSegment) {
  colorTypeSegment.querySelectorAll(".segment-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectColorValueType(btn.dataset.colorType);
      updateInputPlaceholder();
      syncColorInputFromHex(lastValidHex);
      setError("");
      colorValueInput.classList.remove("invalid");
    });
  });
}

svCanvas.addEventListener("pointerdown", onSvPointerDown);
svCanvas.addEventListener("pointermove", onSvPointerMove);
svCanvas.addEventListener("pointerup", onSvPointerUp);
svCanvas.addEventListener("pointercancel", onSvPointerUp);

hueCanvas.addEventListener("pointerdown", onHuePointerDown);
hueCanvas.addEventListener("pointermove", onHuePointerMove);
hueCanvas.addEventListener("pointerup", onHuePointerUp);
hueCanvas.addEventListener("pointercancel", onHuePointerUp);

if (exportPaletteJsonBtn) {
  exportPaletteJsonBtn.addEventListener("click", exportPaletteJsonToClipboard);
}

if (eyedropperBtn && window.EyeDropper) {
  eyedropperBtn.hidden = false;
  eyedropperBtn.addEventListener("click", () => pickColorFromScreen());
}

(async function bootColorLab() {
  await ensureDefaultPaletteOnFirstVisit();

  schedulePickerLayout();

  if (typeof ResizeObserver !== "undefined") {
    const pickerObserver = new ResizeObserver(() => schedulePickerLayout());
    if (dashboard) pickerObserver.observe(dashboard);
    else if (pickerPanel) pickerObserver.observe(pickerPanel);
  }

  updateInputPlaceholder();
  const initial =
    parseColorInput(colorValueInput.value, getColorValueType()) || "#3B5BDB";
  applyColorFromHex(initial, { syncPicker: true });
  renderPaletteSetPicker();
  renderPaletteGrids();

  window.addEventListener("resize", schedulePickerLayout);
})();
