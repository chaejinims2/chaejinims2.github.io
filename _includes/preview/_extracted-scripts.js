<script>
(function () {
  var STORAGE_KEY = "design-md-preview-theme";
  var root = document.documentElement;
  var themes = ["dark", "light", "modern", "connect", "claude"];

  function byteToHex(n) {
    return Math.round(n).toString(16).toUpperCase().padStart(2, "0");
  }

  function colorToHex(cssColor) {
    if (!cssColor || cssColor === "transparent") return "—";
    var m = cssColor.trim().match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
    if (!m) return cssColor;
    var r = +m[1];
    var g = +m[2];
    var b = +m[3];
    var a = m[4] !== undefined ? parseFloat(m[4]) : 1;
    var rr = byteToHex(r);
    var gg = byteToHex(g);
    var bb = byteToHex(b);
    if (a >= 1 - 1e-6) return "#" + rr + gg + bb;
    return "#" + rr + gg + bb + byteToHex(a * 255);
  }

  function updateColorSwatchHexes() {
    var section = document.getElementById("colors");
    if (!section) return;
    section.querySelectorAll(".swatch-hex-live").forEach(function (el) {
      var swatch = el.closest(".color-swatch");
      if (!swatch) return;
      var block = swatch.querySelector(".color-swatch-block");
      if (!block) return;
      var cs = getComputedStyle(block);
      var dual = el.getAttribute("data-hex-dual") === "border";
      var bgHex = colorToHex(cs.backgroundColor);
      if (dual) {
        el.textContent = bgHex + " / " + colorToHex(cs.borderTopColor);
      } else {
        el.textContent = bgHex;
      }
    });
  }

  function setTheme(name) {
    if (themes.indexOf(name) < 0) name = "connect";
    root.setAttribute("data-theme", name);
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch (e) {}
    var sel = document.getElementById("theme-select");
    if (sel && sel.value !== name) sel.value = name;
    requestAnimationFrame(function () {
      updateColorSwatchHexes();
    });
  }

  var saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {}
  if (saved && themes.indexOf(saved) >= 0) {
    setTheme(saved);
  } else {
    setTheme(root.getAttribute("data-theme") || "connect");
  }

  var themeSelect = document.getElementById("theme-select");
  if (themeSelect) {
    themeSelect.addEventListener("change", function () {
      setTheme(themeSelect.value);
    });
  }
})();

(function () {
  document.querySelectorAll(".icon-cell, .logo-cell").forEach(function (cell) {
    function copy() {
      var name = cell.getAttribute("data-copy") || "";
      var fb = cell.querySelector(".icon-feedback");
      function show(msg) {
        if (fb) { fb.textContent = msg; setTimeout(function () { if (fb.textContent === msg) fb.textContent = ""; }, 1200); }
      }
      if (!name) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(name).then(function () { show("Copied"); }).catch(function () { show("Copy failed"); });
      } else show("No clipboard API");
    }
    cell.addEventListener("click", copy);
    cell.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); copy(); }
    });
  });
})();
