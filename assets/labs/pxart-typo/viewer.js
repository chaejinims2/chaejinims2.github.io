/* global window, document */
(function () {
  'use strict';

  function el(name, cls) { var e = document.createElement(name); if (cls) e.className = cls; return e; }

  function isPlainObject(o) { return o !== null && typeof o === 'object' && !Array.isArray(o); }

  var PREVIEW_SCALE = 1;
  var EXPORT_SCALE = 4;

  function resolveFontmapUrl() {
    try {
      if (window.__PXART_TYPO_FONTMAP_URL__) {
        var abs = String(window.__PXART_TYPO_FONTMAP_URL__).trim();
        if (abs) return abs;
      }
    } catch (e0) { /* ignore */ }
    try {
      var u = new URL(window.location.href);
      var q = u.searchParams.get('fontmap');
      if (q && String(q).trim()) return new URL(String(q).trim(), window.location.href).href;
    } catch (e1) { /* ignore */ }
    try { return new URL('./fontmap.json', window.location.href).href; } catch (e2) { return './fontmap.json'; }
  }

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function parseHexColor(hex) {
    hex = String(hex || '').trim();
    if (!hex) return { r: 255, g: 255, b: 255, a: 255 };
    if (hex[0] === '#') hex = hex.slice(1);
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    if (hex.length !== 6) return { r: 255, g: 255, b: 255, a: 255 };
    var n = parseInt(hex, 16);
    if (isNaN(n)) return { r: 255, g: 255, b: 255, a: 255 };
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 255 };
  }

  function main(scopeEl) {
    var scope = scopeEl && scopeEl.nodeType === 1 ? scopeEl : document.body;
    if (scope.getAttribute('data-pxart-typo-inited') === '1') return;
    scope.setAttribute('data-pxart-typo-inited', '1');

    function $(sel) { return scope.querySelector(sel); }
    function logLine(kind, msg) {
      var host = $('[data-log]');
      if (!host) return;
      var div = el('div', kind);
      div.textContent = msg;
      host.appendChild(div);
    }
    function clearLog() { var host = $('[data-log]'); if (host) host.textContent = ''; }
    function setHint(msg) { var h = $('[data-hint]'); if (h) h.textContent = msg; }

    var canvas = $('[data-canvas]');
    var ctx = canvas ? canvas.getContext('2d') : null;
    var textEl = $('[data-text]');
    var fontSel = $('[data-font]');
    var scaleSel = $('[data-scale]');
    var fgEl = $('[data-fg]');
    var tintSel = $('[data-tint]');
    var bgModeSel = $('[data-bgmode]');
    var bgColorEl = $('[data-bgcolor]');
    var exportBtn = scope.querySelector('[data-export]');
    var meta = $('[data-meta]');

    if (!canvas || !ctx || !textEl || !fontSel || !fgEl || !tintSel || !bgModeSel || !bgColorEl) return;

    function syncCanvasDisplaySize() {
      var s = parseInt(scaleSel && scaleSel.value ? scaleSel.value : String(PREVIEW_SCALE), 10);
      if (isNaN(s) || s <= 0) s = PREVIEW_SCALE;
      canvas.style.width = (canvas.width * s) + 'px';
      canvas.style.height = (canvas.height * s) + 'px';
    }

    var fontmap = null;
    var fontImg = null;

    function getFontIndex() {
      var v = parseInt(fontSel.value, 10);
      if (isNaN(v)) v = 0;
      var len = (fontmap && fontmap.fonts && fontmap.fonts.length) ? fontmap.fonts.length : 0;
      return clamp(v, 0, Math.max(0, len - 1));
    }

    function getActiveFont() {
      var idx = getFontIndex();
      return fontmap && fontmap.fonts && fontmap.fonts[idx] ? fontmap.fonts[idx] : null;
    }

    function getGlyph(font, ch) {
      if (!font || !font.glyphs || typeof font.glyphs !== 'object') return null;
      var g = font.glyphs[ch];
      if (g && typeof g === 'object') return g;
      if (font.fallbackGlyph && font.fallbackGlyph !== ch) {
        var fb = font.glyphs[font.fallbackGlyph];
        if (fb && typeof fb === 'object') return fb;
      }
      return null;
    }

    function glyphAdvance(font, g) {
      var ls = letterSpacing(font);
      if (g && typeof g.xAdvance === 'number' && (g.xAdvance | 0) > 0) return (g.xAdvance | 0) + ls;
      if (g && typeof g.w === 'number' && (g.w | 0) > 0) return (g.w | 0) + ls;
      return spaceWidth(font) + ls;
    }

    function lineHeight(font) {
      var lh = font && typeof font.lineHeight === 'number' ? (font.lineHeight | 0) : 0;
      return lh > 0 ? lh : 0;
    }

    function spaceWidth(font) {
      var sw = font && typeof font.spaceWidth === 'number' ? (font.spaceWidth | 0) : 0;
      var cw = font && font.cell && typeof font.cell.w === 'number' ? (font.cell.w | 0) : 0;
      return sw > 0 ? sw : (cw > 0 ? cw : 0);
    }

    function letterSpacing(font) {
      var ls = font && typeof font.letterSpacing === 'number' ? (font.letterSpacing | 0) : 0;
      return ls;
    }

    function glyphSrcRectFromGlyph(g) {
      if (!g || typeof g !== 'object') return null;
      var sx = g.x | 0, sy = g.y | 0, sw = g.w | 0, sh = g.h | 0;
      if (sw <= 0 || sh <= 0) return null;
      return { sx: sx, sy: sy, sw: sw, sh: sh };
    }

    var tintCanvas = document.createElement('canvas');
    var tintCtx = tintCanvas.getContext('2d');
    function drawGlyph(img, rect, dx, dy, fg, tintOn) {
      if (!img || !rect) return;
      if (!tintOn || !tintCtx) {
        ctx.drawImage(img, rect.sx, rect.sy, rect.sw, rect.sh, dx, dy, rect.sw, rect.sh);
        return;
      }
      tintCanvas.width = rect.sw;
      tintCanvas.height = rect.sh;
      tintCtx.clearRect(0, 0, rect.sw, rect.sh);
      tintCtx.globalCompositeOperation = 'source-over';
      tintCtx.drawImage(img, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, rect.sw, rect.sh);
      tintCtx.globalCompositeOperation = 'source-in';
      tintCtx.fillStyle = 'rgba(' + fg.r + ',' + fg.g + ',' + fg.b + ',' + (fg.a / 255) + ')';
      tintCtx.fillRect(0, 0, rect.sw, rect.sh);
      tintCtx.globalCompositeOperation = 'source-over';
      ctx.drawImage(tintCanvas, 0, 0, rect.sw, rect.sh, dx, dy, rect.sw, rect.sh);
    }

    function measureText(font, text) {
      var lh = lineHeight(font);
      var ls = letterSpacing(font);
      var sw = spaceWidth(font);
      var lines = String(text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
      var maxW = 0;
      for (var li = 0; li < lines.length; li++) {
        var s = lines[li];
        var x = 0;
        for (var ci = 0; ci < s.length; ci++) {
          var ch = s[ci];
          if (ch === ' ') { x += sw + ls; continue; }
          var g = getGlyph(font, ch);
          x += glyphAdvance(font, g);
        }
        if (x > maxW) maxW = x;
      }
      var h = Math.max(1, lines.length) * (lh > 0 ? lh : 1);
      return { w: Math.max(1, maxW), h: Math.max(1, h), lines: lines };
    }

    function render() {
      clearLog();
      if (!fontmap || !fontImg || !fontImg.naturalWidth) {
        setHint('fontmap.json과 Fonts.png가 로드되면 렌더됩니다.');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      var font = getActiveFont();
      if (!font) { setHint('font를 선택할 수 없습니다.'); return; }
      var hasGlyphs = font.glyphs && typeof font.glyphs === 'object';
      if (!hasGlyphs) {
        setHint('선택한 font의 glyphs(문자별 좌표)를 채워주세요.');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      if (!(typeof font.lineHeight === 'number' && (font.lineHeight | 0) > 0)) {
        setHint('선택한 font의 lineHeight를 먼저 채워주세요.');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      setHint('');
      var text = textEl.value || '';
      var meas = measureText(font, text);

      var pad = 1;
      canvas.width = meas.w + pad * 2;
      canvas.height = meas.h + pad * 2;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // background
      if ((bgModeSel.value || 'transparent') === 'solid') {
        var bg = parseHexColor(bgColorEl.value);
        ctx.fillStyle = 'rgba(' + bg.r + ',' + bg.g + ',' + bg.b + ',' + (bg.a / 255) + ')';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      var fg = parseHexColor(fgEl.value);
      var tintOn = (tintSel.value || 'on') === 'on';
      var lh = lineHeight(font);
      var ls = letterSpacing(font);
      var sw = spaceWidth(font);

      var y = pad;
      for (var li = 0; li < meas.lines.length; li++) {
        var line = meas.lines[li];
        var x = pad;
        for (var ci = 0; ci < line.length; ci++) {
          var ch = line[ci];
          if (ch === ' ') { x += sw + ls; continue; }
          var g = getGlyph(font, ch);
          var rect = glyphSrcRectFromGlyph(g);
          if (!rect) { x += glyphAdvance(font, g); continue; }
          // bottom-align within the line box (baseline-ish)
          var dy = y + Math.max(0, (lh | 0) - (rect.sh | 0));
          drawGlyph(fontImg, rect, x, dy, fg, tintOn);
          x += glyphAdvance(font, g);
        }
        y += lh;
      }

      syncCanvasDisplaySize();

      if (meta) {
        meta.textContent =
          'canvas=' + canvas.width + 'x' + canvas.height +
          ' · previewScale=' + (scaleSel ? scaleSel.value : String(PREVIEW_SCALE)) +
          ' · font=' + (font.id || '?');
      }

      logLine('ok', 'render ok');
    }

    function downloadPng(filename) {
      var name = filename || 'pxart-typo.png';
      var s = EXPORT_SCALE;
      var srcW = canvas.width | 0;
      var srcH = canvas.height | 0;
      if (srcW <= 0 || srcH <= 0) return;
      if (s === 1) {
        canvas.toBlob(function (blob) {
          if (!blob) return;
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = name;
          a.click();
          URL.revokeObjectURL(a.href);
        });
        return;
      }
      var out = document.createElement('canvas');
      out.width = srcW * s;
      out.height = srcH * s;
      var octx = out.getContext('2d');
      if (!octx) return;
      octx.imageSmoothingEnabled = false;
      octx.clearRect(0, 0, out.width, out.height);
      octx.drawImage(canvas, 0, 0, srcW, srcH, 0, 0, out.width, out.height);
      out.toBlob(function (blob) {
        if (!blob) return;
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        a.click();
        URL.revokeObjectURL(a.href);
      });
    }

    function rebuildFontSelect() {
      fontSel.innerHTML = '';
      var arr = fontmap && fontmap.fonts ? fontmap.fonts : [];
      for (var i = 0; i < arr.length; i++) {
        var f = arr[i];
        var opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = (f && f.label) ? String(f.label) : ('Font ' + i);
        fontSel.appendChild(opt);
      }
      if (!arr.length) {
        var opt0 = document.createElement('option');
        opt0.value = '0';
        opt0.textContent = 'No fonts';
        fontSel.appendChild(opt0);
      }
    }

    function wireUi() {
      function onAny() { render(); }
      textEl.addEventListener('input', onAny);
      fontSel.addEventListener('change', onAny);
      fgEl.addEventListener('input', onAny);
      tintSel.addEventListener('change', onAny);
      bgModeSel.addEventListener('change', onAny);
      bgColorEl.addEventListener('input', onAny);
      if (scaleSel) scaleSel.addEventListener('change', function () { syncCanvasDisplaySize(); });
      if (exportBtn) exportBtn.addEventListener('click', function () { downloadPng('pxart-typo.png'); });
    }

    var fontmapUrl = resolveFontmapUrl();
    fetch(fontmapUrl)
      .then(function (r) { if (!r.ok) throw new Error('fontmap HTTP ' + r.status + ' ' + fontmapUrl); return r.json(); })
      .then(function (data) {
        if (!data || !data.fonts || !Array.isArray(data.fonts)) throw new Error('invalid fontmap.json: fonts[] required');
        fontmap = data;
        rebuildFontSelect();
        wireUi();

        var img = new Image();
        img.decoding = 'async';
        img.onload = function () { fontImg = img; render(); };
        img.onerror = function () { clearLog(); logLine('bad', 'failed to load Fonts.png: ' + img.src); };
        img.src = String(fontmap.imageSrc || '');
        if (!img.src) throw new Error('fontmap.json: imageSrc required');
        setHint('Fonts.png 로딩 중…');
      })
      .catch(function (e) {
        clearLog();
        logLine('bad', String(e && e.message ? e.message : e));
        setHint('fontmap.json 로드 실패');
      });
  }

  window.pxartTypoBoot = main;
  var embedRoot = null;
  try {
    embedRoot = window.__PXART_TYPO_EMBED_ROOT__;
    if (embedRoot) delete window.__PXART_TYPO_EMBED_ROOT__;
  } catch (eR) { /* ignore */ }
  if (embedRoot) main(embedRoot);
  else {
    function go() { main(document.body); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
    else go();
  }
})();

