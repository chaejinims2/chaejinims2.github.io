"use strict";

const STORAGE_KEY = "colorLabRecent";
const RECENT_LIMIT = 5;
const PALETTE_STEPS = 5;

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

/** WCAG relative luminance; pick black or white text for contrast on the fill. */
function getReadableTextColor(r, g, b) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.179 ? "#000000" : "#FFFFFF";
}

function mixRgb(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

function generateTints(hex) {
  const base = hexToRgb(hex);
  if (!base) return [];
  const white = { r: 255, g: 255, b: 255 };
  const out = [];
  for (let i = 0; i < PALETTE_STEPS; i++) {
    const t = i / (PALETTE_STEPS - 1);
    const rgb = mixRgb(base, white, t * 0.85);
    out.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  }
  return out;
}

function generateShades(hex) {
  const base = hexToRgb(hex);
  if (!base) return [];
  const black = { r: 0, g: 0, b: 0 };
  const out = [];
  for (let i = 0; i < PALETTE_STEPS; i++) {
    const t = i / (PALETTE_STEPS - 1);
    const rgb = mixRgb(base, black, t * 0.85);
    out.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  }
  return out;
}

function generateComplementary(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const comp = hslToRgb((h + 180) % 360, s, l);
  return [hex, rgbToHex(comp.r, comp.g, comp.b)];
}

function generateAnalogous(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const offsets = [-60, -30, 0, 30, 60];
  return offsets.map((d) => {
    const c = hslToRgb(h + d, s, l);
    return rgbToHex(c.r, c.g, c.b);
  });
}

function generateMonochrome(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const lights = [92, 72, 52, 32, 12];
  return lights.map((l) => {
    const c = hslToRgb(h, Math.min(s, 80), l);
    return rgbToHex(c.r, c.g, c.b);
  });
}

// --- Storage ---

function loadRecent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((c) => typeof c === "string" && isValidHex(c))
      .map((c) => normalizeHex(c))
      .slice(0, RECENT_LIMIT);
  } catch {
    return [];
  }
}

function saveRecent(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) return;
  let list = loadRecent().filter((c) => c !== normalized);
  list.unshift(normalized);
  list = list.slice(0, RECENT_LIMIT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// --- DOM ---

const hexInput = document.getElementById("hex-input");
const colorPicker = document.getElementById("color-picker");
const hexError = document.getElementById("hex-error");
const previewCard = document.getElementById("preview-card");
const previewLabel = document.getElementById("preview-label");
const valueList = document.getElementById("value-list");
const recentList = document.getElementById("recent-list");
const palettesRoot = document.getElementById("palettes-root");

const PALETTE_DEFS = [
  { id: "tints", title: "Tints", fn: generateTints },
  { id: "shades", title: "Shades", fn: generateShades },
  { id: "complementary", title: "Complementary", fn: generateComplementary },
  { id: "analogous", title: "Analogous", fn: generateAnalogous },
  { id: "monochrome", title: "Monochrome", fn: generateMonochrome },
];

let copyFeedbackTimer = null;

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
    button.classList.add("copied");
    button.textContent = "Copied";
    clearTimeout(copyFeedbackTimer);
    copyFeedbackTimer = setTimeout(() => {
      button.classList.remove("copied");
      button.textContent = "Copy";
    }, 1500);
  }
}

function showCardCopied(card) {
  const fb = card.querySelector(".color-card-feedback");
  if (!fb) return;
  fb.classList.add("show");
  clearTimeout(card._copyTimer);
  card._copyTimer = setTimeout(() => fb.classList.remove("show"), 1200);
}

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
      <button type="button" class="btn-copy" data-copy="${escapeAttr(row.value)}">Copy</button>
    </li>`
    )
    .join("");

  valueList.querySelectorAll(".btn-copy").forEach((btn) => {
    btn.addEventListener("click", () => {
      copyText(btn.getAttribute("data-copy"), btn);
    });
  });
}

function escapeAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function renderPreview(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return;
  const text = getReadableTextColor(rgb.r, rgb.g, rgb.b);
  previewCard.style.backgroundColor = hex;
  previewCard.style.color = text;
  previewLabel.textContent = hex;
}

function createColorCard(hex) {
  const rgb = hexToRgb(hex);
  const text = rgb ? getReadableTextColor(rgb.r, rgb.g, rgb.b) : "#000";
  const card = document.createElement("button");
  card.type = "button";
  card.className = "color-card";
  card.style.backgroundColor = hex;
  card.style.color = text;
  card.setAttribute("aria-label", `Copy ${hex}`);
  card.innerHTML = `
    <span class="color-card-hex">${hex}</span>
    <span class="color-card-feedback">Copied</span>
  `;
  card.addEventListener("click", () => {
    copyText(hex, null);
    showCardCopied(card);
  });
  return card;
}

function renderPalettes(hex) {
  palettesRoot.innerHTML = "";
  PALETTE_DEFS.forEach(({ title, fn }) => {
    const colors = fn(hex);
    const block = document.createElement("div");
    block.className = "palette-block";
    block.innerHTML = `<h3 class="palette-name">${title}</h3>`;
    const swatches = document.createElement("div");
    swatches.className = "palette-swatches";
    colors.forEach((c) => swatches.appendChild(createColorCard(c)));
    block.appendChild(swatches);
    palettesRoot.appendChild(block);
  });
}

function renderRecent(currentHex) {
  const recent = loadRecent();
  recentList.innerHTML = "";
  if (recent.length === 0) {
    const li = document.createElement("li");
    li.className = "recent-empty";
    li.textContent = "No recent colors yet.";
    recentList.appendChild(li);
    return;
  }
  recent.forEach((hex) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "recent-swatch";
    btn.style.backgroundColor = hex;
    btn.setAttribute("aria-label", `Use ${hex}`);
    btn.addEventListener("click", () => applyColor(hex, false));
    recentList.appendChild(btn);
  });
}

function setError(message) {
  if (message) {
    hexError.hidden = false;
    hexError.textContent = message;
    hexInput.classList.add("invalid");
  } else {
    hexError.hidden = true;
    hexError.textContent = "";
    hexInput.classList.remove("invalid");
  }
}

function applyColor(raw, persistRecent = true) {
  const hex = normalizeHex(raw);
  if (!hex) {
    setError("Enter a valid HEX color (#RGB, RGB, #RRGGBB, or RRGGBB).");
    return false;
  }
  setError("");
  hexInput.value = hex;
  colorPicker.value = hex.toLowerCase();
  renderPreview(hex);
  renderValueRows(hex);
  renderPalettes(hex);
  if (persistRecent) {
    saveRecent(hex);
    renderRecent(hex);
  }
  return true;
}

function onHexInput() {
  const raw = hexInput.value;
  if (!raw.trim()) {
    setError("");
    hexInput.classList.remove("invalid");
    return;
  }
  if (!isValidHex(raw)) {
    setError("Invalid HEX. Use 3 or 6 hex digits, with or without #.");
    hexInput.classList.add("invalid");
    return;
  }
  applyColor(raw, true);
}

hexInput.addEventListener("input", onHexInput);
hexInput.addEventListener("blur", onHexInput);

colorPicker.addEventListener("input", () => {
  applyColor(colorPicker.value, true);
});

const initial = normalizeHex(hexInput.value) || "#3B5BDB";
applyColor(initial, false);
renderRecent(initial);
