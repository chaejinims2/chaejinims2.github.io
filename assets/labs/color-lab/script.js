"use strict";

const STORAGE_KEY = "colorLabPaletteSets";
const LEGACY_STORAGE_KEY = "colorLabPalette";
const PALETTE_SLOTS = 10;
const MAX_PALETTE_SETS = 8;
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

function normalizeSlotArray(parsed) {
  if (!Array.isArray(parsed)) return emptyPaletteSlots();

  if (parsed.length === PALETTE_SLOTS) {
    return parsed.map((c) => {
      if (c == null || c === "") return null;
      return isValidHex(c) ? normalizeHex(c) : null;
    });
  }

  const slots = emptyPaletteSlots();
  parsed
    .filter((c) => typeof c === "string" && isValidHex(c))
    .slice(0, PALETTE_SLOTS)
    .forEach((c, i) => {
      slots[i] = normalizeHex(c);
    });
  return slots;
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

function loadPaletteStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.sets) && parsed.sets.length > 0) {
        const sets = parsed.sets
          .slice(0, MAX_PALETTE_SETS)
          .map((set) => normalizeSlotArray(set));
        const active = Math.min(
          Math.max(0, Number(parsed.active) || 0),
          sets.length - 1
        );
        const swatches = normalizeSwatchArray(parsed.swatches, sets.length);
        return { active, sets, swatches };
      }
    }

    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      return {
        active: 0,
        sets: [normalizeSlotArray(legacy)],
        swatches: [null],
      };
    }
  } catch {
    /* fall through */
  }
  return { active: 0, sets: [emptyPaletteSlots()], swatches: [null] };
}

function savePaletteStore(store) {
  const sets = store.sets.map((slots) =>
    slots.map((c) => (c && isValidHex(c) ? normalizeHex(c) : null))
  );
  const active = Math.min(
    Math.max(0, store.active),
    Math.max(0, sets.length - 1)
  );
  const swatches = normalizeSwatchArray(store.swatches, sets.length);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ active, sets, swatches })
  );
}

function loadPalette() {
  const store = loadPaletteStore();
  return store.sets[store.active].map((c) => c);
}

function savePalette(slots) {
  const store = loadPaletteStore();
  store.sets[store.active] = slots.map((c) =>
    c && isValidHex(c) ? normalizeHex(c) : null
  );
  savePaletteStore(store);
}

function switchPaletteSet(index) {
  const store = loadPaletteStore();
  if (index < 0 || index >= store.sets.length) return;
  store.active = index;
  savePaletteStore(store);
  renderPaletteSetPicker();
  renderPaletteGrid();
}

function addPaletteSet() {
  const store = loadPaletteStore();
  if (store.sets.length >= MAX_PALETTE_SETS) return;
  store.sets.push(emptyPaletteSlots());
  store.swatches = normalizeSwatchArray(store.swatches, store.sets.length);
  store.active = store.sets.length - 1;
  savePaletteStore(store);
  renderPaletteSetPicker();
  renderPaletteGrid();
}

/** Right-click on palette slot: set list swatch for the active palette set. */
function setActivePaletteSetSwatch(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) return;
  const store = loadPaletteStore();
  store.swatches = normalizeSwatchArray(store.swatches, store.sets.length);
  store.swatches[store.active] = normalized;
  savePaletteStore(store);
  renderPaletteSetPicker();
}

function onPaletteSlotContextMenu(e, hex) {
  e.preventDefault();
  setActivePaletteSetSwatch(hex);
}

function setPaletteSlot(index, hex) {
  const normalized = normalizeHex(hex);
  if (!normalized || index < 0 || index >= PALETTE_SLOTS) return;
  const slots = loadPalette();
  slots[index] = normalized;
  savePalette(slots);
  renderPaletteGrid();
}

function clearPaletteSlot(index) {
  if (index < 0 || index >= PALETTE_SLOTS) return;
  const slots = loadPalette();
  slots[index] = null;
  savePalette(slots);
  renderPaletteGrid();
}

// --- DOM ---

const colorValueInput = document.getElementById("color-value-input");
const hexError = document.getElementById("hex-error");
const colorTypeSegment = document.querySelector(".color-type-segment");
const previewCard = document.getElementById("preview-card");
const previewLabel = document.getElementById("preview-label");
const valueList = document.getElementById("value-list");
const paletteGrid = document.getElementById("palette-grid");
const paletteSetPicker = document.getElementById("palette-set-picker");
const pickerPanel = document.querySelector(".picker-panel");
const pickerStack = document.querySelector(".picker-stack");
const svPickerRow = document.querySelector(".sv-picker-row");
const svWrap = document.querySelector(".sv-wrap");
const hueWrap = document.querySelector(".hue-wrap");
const svCanvas = document.getElementById("color-sv");
const hueCanvas = document.getElementById("color-hue");
const svCursor = document.getElementById("sv-cursor");
const hueCursor = document.getElementById("hue-cursor");
const eyedropperBtn = document.getElementById("eyedropper-btn");

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

function layoutPicker() {
  if (!pickerPanel || !svWrap || !svCanvas || !hueCanvas) return;

  const panelStyle = getComputedStyle(pickerPanel);
  const padX =
    parseFloat(panelStyle.paddingLeft) + parseFloat(panelStyle.paddingRight);
  const padY =
    parseFloat(panelStyle.paddingTop) + parseFloat(panelStyle.paddingBottom);
  const stackGap = pickerStack
    ? parseFloat(getComputedStyle(pickerStack).gap) || 0
    : 0;
  const rowGap = svPickerRow
    ? parseFloat(getComputedStyle(svPickerRow).gap) || 0
    : 0;
  const extraH =
    (eyedropperBtn && !eyedropperBtn.hidden ? eyedropperBtn.offsetHeight : 0) +
    (eyedropperBtn && !eyedropperBtn.hidden ? stackGap : 0);

  const availW = Math.max(0, pickerPanel.clientWidth - padX);
  const availH = Math.max(0, pickerPanel.clientHeight - padY - extraH);

  const rowMaxW = availW - HUE_STRIP_WIDTH - rowGap;
  let next = Math.floor(Math.min(rowMaxW, availH, PICKER_MAX));
  next = Math.max(PICKER_MIN, next);

  if (next !== pickerSize) {
    pickerSize = next;
    svCanvas.width = pickerSize;
    svCanvas.height = pickerSize;
    svCanvas.style.width = `${pickerSize}px`;
    svCanvas.style.height = `${pickerSize}px`;
    hueCanvas.width = HUE_STRIP_WIDTH;
    hueCanvas.height = pickerSize;
    hueCanvas.style.width = `${HUE_STRIP_WIDTH}px`;
    hueCanvas.style.height = `${pickerSize}px`;
    svWrap.style.width = `${pickerSize}px`;
    svWrap.style.height = `${pickerSize}px`;
    if (hueWrap) {
      hueWrap.style.height = `${pickerSize}px`;
    }
    if (svPickerRow) {
      svPickerRow.style.width = `${pickerSize + HUE_STRIP_WIDTH + rowGap}px`;
    }
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

function renderValueRows(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    valueList.innerHTML = "";
    return;
  }
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

  const rows = [
    { label: "HEX", value: hex },
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

  store.sets.forEach((_, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "segment-option";
    if (index === store.active) {
      btn.classList.add("is-selected");
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
      btn.setAttribute(
        "aria-label",
        `Palette set ${index + 1}, swatch ${swatch}`
      );
    } else {
      btn.setAttribute("aria-label", `Palette set ${index + 1}`);
    }
    btn.addEventListener("click", () => switchPaletteSet(index));
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

function renderPaletteGrid() {
  const slots = loadPalette();
  paletteGrid.innerHTML = "";
  for (let i = 0; i < PALETTE_SLOTS; i++) {
    const hex = slots[i] || null;
    if (hex) {
      const cell = document.createElement("div");
      cell.className = "palette-slot palette-slot--filled";
      cell.dataset.slotIndex = String(i);
      cell.style.backgroundColor = hex;
      cell.setAttribute("role", "button");
      cell.tabIndex = 0;
      cell.setAttribute("aria-label", `Use ${hex} in slot ${i + 1}`);
      cell.appendChild(createColorCopyOverlay(hex));
      cell.addEventListener("click", (e) => {
        if (e.target.closest(".color-copy-chip")) return;
        const idx = Number(cell.dataset.slotIndex);
        if (e.altKey) {
          clearPaletteSlot(idx);
          return;
        }
        applyColorFromHex(hex, { syncPicker: true });
      });
      cell.addEventListener("contextmenu", (e) => {
        onPaletteSlotContextMenu(e, hex);
      });
      paletteGrid.appendChild(cell);
      continue;
    }

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "palette-slot palette-slot--empty";
    btn.dataset.slotIndex = String(i);
    btn.setAttribute(
      "aria-label",
      `Save current color to slot ${i + 1}`
    );
    btn.addEventListener("click", () => {
      setPaletteSlot(Number(btn.dataset.slotIndex), lastValidHex);
    });
    btn.addEventListener("contextmenu", (e) => {
      onPaletteSlotContextMenu(e, lastValidHex);
    });
    paletteGrid.appendChild(btn);
  }
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

if (eyedropperBtn && window.EyeDropper) {
  eyedropperBtn.hidden = false;
  eyedropperBtn.addEventListener("click", () => pickColorFromScreen());
}

schedulePickerLayout();

if (pickerPanel && typeof ResizeObserver !== "undefined") {
  const pickerObserver = new ResizeObserver(() => schedulePickerLayout());
  pickerObserver.observe(pickerPanel);
}

updateInputPlaceholder();
const initial =
  parseColorInput(colorValueInput.value, getColorValueType()) || "#3B5BDB";
applyColorFromHex(initial, { syncPicker: true });
renderPaletteSetPicker();
renderPaletteGrid();

window.addEventListener("resize", schedulePickerLayout);
