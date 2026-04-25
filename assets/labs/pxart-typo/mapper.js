/* global window, document, fetch */
(function () {
  'use strict';

  function el(name, cls) { var e = document.createElement(name); if (cls) e.className = cls; return e; }
  function $(sel) { return document.querySelector(sel); }

  var cv = $('[data-cv]');
  var ctx = cv ? cv.getContext('2d') : null;
  var statEl = $('[data-stat]');
  var logEl = $('[data-log]');
  var statusEl = $('[data-status]');
  var fontmapInp = $('[data-fontmap]');
  var fontIdxSel = $('[data-font-idx]');
  var orderTa = $('[data-order]');
  var rowTolInp = $('[data-rowtol]');
  var mergeGapInp = $('[data-mergegap]');

  var btnLoad = $('[data-load]');
  var btnAuto = $('[data-autosort]');
  var btnExport = $('[data-export]');
  var btnPrev = $('[data-prev]');
  var btnNext = $('[data-next]');

  if (!cv || !ctx || !btnLoad || !btnAuto || !btnExport || !btnPrev || !btnNext) return;

  function logLine(kind, msg) {
    if (!logEl) return;
    var div = el('div', kind || '');
    div.textContent = msg;
    logEl.appendChild(div);
  }
  function clearLog() { if (logEl) logEl.textContent = ''; }
  function setStatus(t) { if (statusEl) statusEl.textContent = t; }
  function setStat(t) { if (statEl) statEl.textContent = t; }

  function parseIntSafe(v, fb) {
    var n = parseInt(String(v || ''), 10);
    return isNaN(n) ? (fb || 0) : n;
  }

  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.decoding = 'async';
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error('failed to load image: ' + src)); };
      img.src = src;
    });
  }

  // state
  var fontmap = null;
  var img = null;
  var imgData = null; // ImageData for pixels
  var boxes = []; // detected glyph boxes in image coords: {x,y,w,h}
  var sorted = []; // indices into boxes
  var orderChars = []; // desired assignment order, with duplicates
  var assign = {}; // char -> boxIndex (first occurrence only)
  var cursor = 0; // which orderChars index is current
  var hovered = -1;

  function getFontIndex() { return parseIntSafe(fontIdxSel ? fontIdxSel.value : '0', 0); }

  function fontGlyphsObj() {
    var i = getFontIndex();
    var f = fontmap && fontmap.fonts && fontmap.fonts[i];
    if (!f) return null;
    if (!f.glyphs || typeof f.glyphs !== 'object') f.glyphs = {};
    return f.glyphs;
  }

  function parseOrder() {
    var raw = String(orderTa ? orderTa.value : '');
    raw = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    var lines = raw.split('\n');
    var chars = [];
    lines.forEach(function (ln) {
      for (var i = 0; i < ln.length; i++) chars.push(ln[i]);
    });
    return chars;
  }

  function isOn(x, y) {
    var idx = (y * imgData.width + x) * 4 + 3;
    return imgData.data[idx] > 0;
  }

  function detectBoxes(roi) {
    boxes = [];
    sorted = [];
    assign = {};
    cursor = 0;
    hovered = -1;

    if (!img || !imgData) return;
    var w = imgData.width, h = imgData.height;
    var xMin = 0, yMin = 0, xMax = w, yMax = h;
    if (roi && typeof roi === 'object') {
      xMin = Math.max(0, (roi.x | 0));
      yMin = Math.max(0, (roi.y | 0));
      xMax = Math.min(w, xMin + Math.max(0, (roi.w | 0)));
      yMax = Math.min(h, yMin + Math.max(0, (roi.h | 0)));
    }

    var visited = new Uint8Array(w * h);
    function idxOf(x, y) { return y * w + x; }

    var qx = new Int32Array(w * h);
    var qy = new Int32Array(w * h);

    var minCount = 12;
    for (var yy = yMin; yy < yMax; yy++) {
      for (var xx = xMin; xx < xMax; xx++) {
        var id = idxOf(xx, yy);
        if (visited[id]) continue;
        visited[id] = 1;
        if (!isOn(xx, yy)) continue;

        var head = 0, tail = 0;
        qx[tail] = xx; qy[tail] = yy; tail++;
        var minx = xx, maxx = xx, miny = yy, maxy = yy;
        var cnt = 0;

        while (head < tail) {
          var x = qx[head], y = qy[head]; head++;
          cnt++;
          if (x < minx) minx = x;
          if (x > maxx) maxx = x;
          if (y < miny) miny = y;
          if (y > maxy) maxy = y;
          for (var dy = -1; dy <= 1; dy++) {
            for (var dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              var nx = x + dx, ny = y + dy;
              if (nx < xMin || ny < yMin || nx >= xMax || ny >= yMax) continue;
              var nid = idxOf(nx, ny);
              if (visited[nid]) continue;
              visited[nid] = 1;
              if (!isOn(nx, ny)) continue;
              qx[tail] = nx; qy[tail] = ny; tail++;
            }
          }
        }

        if (cnt < minCount) continue;
        boxes.push({ x: minx, y: miny, w: (maxx - minx + 1), h: (maxy - miny + 1) });
      }
    }
  }

  // merge nearby component boxes to form glyph boxes
  function mergeBoxes(gap) {
    gap = Math.max(0, gap | 0);
    if (!boxes.length) return [];
    var merged = boxes.map(function (b, i) { return { x: b.x, y: b.y, w: b.w, h: b.h, ids: [i] }; });

    function overlap1(a0, a1, b0, b1) { return a0 <= b1 && b0 <= a1; }
    function dist1(a0, a1, b0, b1) {
      if (overlap1(a0, a1, b0, b1)) return 0;
      if (a1 < b0) return b0 - a1;
      return a0 - b1;
    }
    function shouldMerge(A, B) {
      var ax0 = A.x, ax1 = A.x + A.w - 1;
      var ay0 = A.y, ay1 = A.y + A.h - 1;
      var bx0 = B.x, bx1 = B.x + B.w - 1;
      var by0 = B.y, by1 = B.y + B.h - 1;
      var dx = dist1(ax0, ax1, bx0, bx1);
      var dy = dist1(ay0, ay1, by0, by1);
      if (dx > gap || dy > gap) return false;
      // require some vertical overlap (dot on i, ':' etc)
      var ovY = Math.min(ay1, by1) - Math.max(ay0, by0);
      return ovY >= -gap;
    }

    var changed = true;
    while (changed) {
      changed = false;
      outer: for (var i = 0; i < merged.length; i++) {
        for (var j = i + 1; j < merged.length; j++) {
          if (!shouldMerge(merged[i], merged[j])) continue;
          var a = merged[i], b = merged[j];
          var x0 = Math.min(a.x, b.x);
          var y0 = Math.min(a.y, b.y);
          var x1 = Math.max(a.x + a.w, b.x + b.w);
          var y1 = Math.max(a.y + a.h, b.y + b.h);
          merged[i] = { x: x0, y: y0, w: x1 - x0, h: y1 - y0, ids: a.ids.concat(b.ids) };
          merged.splice(j, 1);
          changed = true;
          break outer;
        }
      }
    }
    return merged.map(function (m) { return { x: m.x, y: m.y, w: m.w, h: m.h }; });
  }

  function buildSortedOrder(glyphBoxes, rowTol) {
    rowTol = Math.max(0, rowTol | 0);
    var items = glyphBoxes.map(function (b, i) {
      return { i: i, x: b.x, y: b.y, w: b.w, h: b.h, cx: b.x + b.w / 2, cy: b.y + b.h / 2 };
    });
    items.sort(function (a, b) { return (a.cy - b.cy) || (a.cx - b.cx); });

    var rows = [];
    for (var k = 0; k < items.length; k++) {
      var it = items[k];
      var placed = false;
      for (var r = 0; r < rows.length; r++) {
        if (Math.abs(it.cy - rows[r].cy) <= rowTol) {
          rows[r].items.push(it);
          rows[r].cy = (rows[r].cy * (rows[r].items.length - 1) + it.cy) / rows[r].items.length;
          placed = true;
          break;
        }
      }
      if (!placed) rows.push({ cy: it.cy, items: [it] });
    }
    rows.sort(function (a, b) { return a.cy - b.cy; });
    rows.forEach(function (r) { r.items.sort(function (a, b) { return a.cx - b.cx; }); });
    return rows.flatMap(function (r) { return r.items.map(function (it) { return it.i; }); });
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (!img) return;
    ctx.drawImage(img, 0, 0);

    if (!boxes.length) return;
    ctx.save();
    ctx.lineWidth = 1;
    for (var k = 0; k < boxes.length; k++) {
      var b = boxes[k];
      var isH = (k === hovered);
      ctx.strokeStyle = isH ? 'rgba(255,0,0,.9)' : 'rgba(0,255,255,.45)';
      ctx.strokeRect(b.x - 0.5, b.y - 0.5, b.w + 1, b.h + 1);
    }
    // draw cursor target if auto order exists
    if (orderChars.length && sorted.length && cursor < orderChars.length) {
      var ch = orderChars[cursor];
      var idx = assign[ch];
      if (idx != null && boxes[idx]) {
        var bb = boxes[idx];
        ctx.strokeStyle = 'rgba(255,165,0,.9)';
        ctx.lineWidth = 2;
        ctx.strokeRect(bb.x - 1, bb.y - 1, bb.w + 2, bb.h + 2);
      }
    }
    ctx.restore();
  }

  function hitBox(mx, my) {
    for (var i = 0; i < boxes.length; i++) {
      var b = boxes[i];
      if (mx >= b.x && mx < b.x + b.w && my >= b.y && my < b.y + b.h) return i;
    }
    return -1;
  }

  function rebuildStats() {
    var uniq = {};
    Object.keys(assign).forEach(function (k) { uniq[k] = true; });
    var aCount = Object.keys(uniq).length;
    setStat(
      'boxes=' + boxes.length +
      '\\norderChars=' + orderChars.length +
      '\\nassigned(unique)=' + aCount +
      '\\ncursor=' + cursor + (orderChars[cursor] ? (' char=' + JSON.stringify(orderChars[cursor])) : '')
    );
  }

  function applyAssignToFontmap() {
    var glyphs = fontGlyphsObj();
    if (!glyphs) return;
    Object.keys(assign).forEach(function (ch) {
      var bi = assign[ch];
      if (bi == null) return;
      var b = boxes[bi];
      if (!b) return;
      glyphs[ch] = { x: b.x | 0, y: b.y | 0, w: b.w | 0, h: b.h | 0, xAdvance: b.w | 0 };
    });
  }

  function exportFontmap() {
    if (!fontmap) return;
    applyAssignToFontmap();
    var blob = new Blob([JSON.stringify(fontmap, null, 4)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'fontmap.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function loadAll() {
    clearLog();
    setStatus('fontmap.json 로딩…');
    var fmUrl = String(fontmapInp && fontmapInp.value ? fontmapInp.value : './fontmap.json');
    fetch(fmUrl)
      .then(function (r) { if (!r.ok) throw new Error('fontmap HTTP ' + r.status + ' ' + fmUrl); return r.json(); })
      .then(function (data) {
        fontmap = data;
        if (!fontmap || !Array.isArray(fontmap.fonts)) throw new Error('invalid fontmap.json: fonts[] required');
        setStatus('Fonts.png 로딩…');
        var src = String(fontmap.imageSrc || '');
        if (!src) throw new Error('fontmap.imageSrc required');
        return loadImage(src);
      })
      .then(function (img0) {
        img = img0;
        cv.width = img.naturalWidth | 0;
        cv.height = img.naturalHeight | 0;
        ctx.drawImage(img, 0, 0);
        imgData = ctx.getImageData(0, 0, cv.width, cv.height);

        setStatus('박스 검출…');
        var fi = getFontIndex();
        var f0 = fontmap && fontmap.fonts && fontmap.fonts[fi];
        var roi = (f0 && f0.sheetRect && typeof f0.sheetRect === 'object') ? f0.sheetRect : null;
        detectBoxes(roi);
        var mg = parseIntSafe(mergeGapInp ? mergeGapInp.value : '2', 2);
        boxes = mergeBoxes(mg);
        sorted = boxes.map(function (_, i) { return i; });
        orderChars = parseOrder();
        assign = {};
        cursor = 0;
        setStatus('준비됨. Auto-sort 또는 클릭 매핑을 시작하세요.');
        rebuildStats();
        draw();
        logLine('ok', 'loaded: boxes=' + boxes.length);
      })
      .catch(function (e) {
        setStatus('실패: ' + (e && e.message ? e.message : String(e)));
        logLine('bad', String(e && e.message ? e.message : e));
      });
  }

  function autoSort() {
    if (!boxes.length) return;
    orderChars = parseOrder();
    var rt = parseIntSafe(rowTolInp ? rowTolInp.value : '10', 10);
    sorted = buildSortedOrder(boxes, rt);
    assign = {};
    var usedBox = {};
    var pi = 0;
    for (var i = 0; i < orderChars.length && pi < sorted.length; i++) {
      var ch = orderChars[i];
      if (ch === ' ') continue;
      if (assign[ch] != null) continue;
      while (pi < sorted.length && usedBox[sorted[pi]]) pi++;
      if (pi >= sorted.length) break;
      assign[ch] = sorted[pi];
      usedBox[sorted[pi]] = true;
      pi++;
    }
    cursor = 0;
    rebuildStats();
    draw();
    logLine('ok', 'auto-sort assigned ' + Object.keys(assign).length + ' unique chars');
  }

  function step(delta) {
    if (!orderChars.length) orderChars = parseOrder();
    if (!orderChars.length) return;
    cursor = Math.max(0, Math.min(orderChars.length - 1, cursor + delta));
    rebuildStats();
    draw();
  }

  cv.addEventListener('mousemove', function (e) {
    var r = cv.getBoundingClientRect();
    var mx = Math.floor((e.clientX - r.left) * (cv.width / r.width));
    var my = Math.floor((e.clientY - r.top) * (cv.height / r.height));
    var h = hitBox(mx, my);
    if (h !== hovered) { hovered = h; draw(); }
  });
  cv.addEventListener('mouseleave', function () { hovered = -1; draw(); });
  cv.addEventListener('click', function (e) {
    if (!boxes.length) return;
    if (!orderChars.length) orderChars = parseOrder();
    if (!orderChars.length) return;
    var r = cv.getBoundingClientRect();
    var mx = Math.floor((e.clientX - r.left) * (cv.width / r.width));
    var my = Math.floor((e.clientY - r.top) * (cv.height / r.height));
    var h = hitBox(mx, my);
    if (h < 0) return;
    var ch = orderChars[cursor];
    if (!ch || ch === ' ') return;
    assign[ch] = h;
    step(1);
    logLine('ok', 'set ' + JSON.stringify(ch) + ' -> box#' + h);
  });

  btnLoad.addEventListener('click', function () { loadAll(); });
  btnAuto.addEventListener('click', function () { autoSort(); });
  btnExport.addEventListener('click', function () { exportFontmap(); });
  btnPrev.addEventListener('click', function () { step(-1); });
  btnNext.addEventListener('click', function () { step(1); });

})();
