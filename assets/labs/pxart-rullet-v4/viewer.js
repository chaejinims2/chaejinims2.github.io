/* global window, document */
(function () {
  'use strict';

  function el(name, cls) { var e = document.createElement(name); if (cls) e.className = cls; return e; }

  function isPlainObject(o) {
    return o !== null && typeof o === 'object' && !Array.isArray(o);
  }
  function deepClone(o) {
    if (Array.isArray(o)) return o.map(deepClone);
    if (isPlainObject(o)) {
      var r = {};
      Object.keys(o).forEach(function (k) { r[k] = deepClone(o[k]); });
      return r;
    }
    return o;
  }
  /** layout.json `viewer`와 병합되는 기본값(키 없을 때 하위 호환) */
  var DEFAULT_VIEWER = {
    directionSlider: {
      order: ['front', 'right', 'back', 'left'],
      labels: { front: 'Front', right: 'Right', back: 'Back', left: 'Left' }
    },
    drawOrderFallbackPreferred: ['shirt', 'acc', 'hair', 'hat'],
    bodyLayersByDirection: {
      front: [{ part: 0, row: 0, col: 0, flipX: false }, { part: 1, row: 0, col: 0, flipX: false }],
      right: [{ part: 0, row: 1, col: 0, flipX: false }, { part: 1, row: 1, col: 0, flipX: false }],
      back: [{ part: 0, row: 2, col: 0, flipX: false }, { part: 1, row: 2, col: 0, flipX: false }],
      left: [{ part: 0, row: 1, col: 0, flipX: true }, { part: 1, row: 1, col: 0, flipX: true }]
    },
    accHairHueIndices: [0, 1, 2, 3, 4, 5, 11, 17, 19, 20, 21, 22],
    tint: { hairHueDefault: 30, pantsHueDefault: 210, saturation: 0.85, lightness: 0.55 },
    femaleClothingDstYNudge: 1,
    canvas: {
      width: 20,
      height: 40,
      checkerCell: 4,
      checkerColors: ['rgba(255,255,255,0.06)', 'rgba(0,0,0,0.18)']
    },
    dirCellFallbackRows: { front: 0, right: 1, back: 2, left: 3 },
    assetSrcRewrite: {
      pathnameSpritesMarker: '/sprites/',
      outputSpritesBase: '/assets/data/sprites/',
      dataSpritesMarker: '/data/sprites/'
    }
  };
  function mergeViewerDefaults(base, over) {
    if (!over) return deepClone(base);
    var out = deepClone(base);
    Object.keys(over).forEach(function (k) {
      var v = over[k];
      if (Array.isArray(v)) out[k] = v.slice();
      else if (isPlainObject(v) && isPlainObject(out[k])) out[k] = mergeViewerDefaults(out[k], v);
      else out[k] = v;
    });
    return out;
  }

  function buildDrawOrder(sheets, assets, preferred) {
    preferred = preferred || DEFAULT_VIEWER.drawOrderFallbackPreferred;
    var keys = [];
    preferred.forEach(function (k) {
      if (sheets && sheets[k] && assets && assets[k]) keys.push(k);
    });
    // Only include keys that exist in BOTH sheets and assets (exclude body/pants specs).
    if (sheets && assets) {
      Object.keys(sheets).sort().forEach(function (k) {
        if (!assets[k]) return;
        if (keys.indexOf(k) === -1) keys.push(k);
      });
    }
    return keys;
  }

  function normalizeAssetSrc(src, rewrite) {
    if (!src) return src;
    rewrite = rewrite || DEFAULT_VIEWER.assetSrcRewrite;
    var pathMark = String(rewrite.pathnameSpritesMarker || '/sprites/');
    var outBase = String(rewrite.outputSpritesBase || '/assets/data/sprites/').replace(/\/?$/, '/');
    var dataMark = String(rewrite.dataSpritesMarker || '/data/sprites/');
    try {
      var u = new URL(src, window.location.href);
      var p = u.pathname || '';
      var idx = p.toLowerCase().indexOf(pathMark.toLowerCase());
      if (idx >= 0) {
        var sub = p.slice(idx + pathMark.length).replace(/^\/+/, '');
        return outBase + sub;
      }
      return src;
    } catch (e) {
      var s = String(src);
      s = s.replace(/\\/g, '/');
      s = s.replace(/^file:\/*/i, '');
      var j = s.toLowerCase().indexOf(dataMark.toLowerCase());
      if (j >= 0) {
        var sub2 = s.slice(j + dataMark.length).replace(/^\/+/, '');
        return outBase + sub2;
      }
      return src;
    }
  }

  /** `?layout=` 또는 인라인 엔트리가 세팅한 `window.__PXR_V4_LAYOUT_URL__`. 없으면 `./layout.json` */
  function resolveLayoutUrl() {
    try {
      if (window.__PXR_V4_LAYOUT_URL__) {
        var abs = String(window.__PXR_V4_LAYOUT_URL__).trim();
        if (abs) return abs;
      }
    } catch (e0) { /* ignore */ }
    try {
      var u = new URL(window.location.href);
      var q = u.searchParams.get('layout');
      if (q && String(q).trim()) {
        return new URL(String(q).trim(), window.location.href).href;
      }
    } catch (e) { /* ignore */ }
    try {
      return new URL('./layout.json', window.location.href).href;
    } catch (e2) {
      return './layout.json';
    }
  }

  function getDirCell(spec, dir, dirCellFallbackRows) {
    // layout.json: directions.{front/right/back/left} = [row,col] or sometimes [row,0]
    var d = spec && spec.directions && spec.directions[dir];
    if (d && d.length >= 2) return { row: d[0] | 0, col: d[1] | 0 };
    var map = dirCellFallbackRows || DEFAULT_VIEWER.dirCellFallbackRows;
    var row = typeof map[dir] === 'number' ? map[dir] : 0;
    return { row: row, col: 0 };
  }

  function main(scopeEl) {
    var scope = scopeEl && scopeEl.nodeType === 1 ? scopeEl : document.body;
    if (scope.getAttribute('data-pxr-v4-inited') === '1') return;

    function $(sel) { return scope.querySelector(sel); }
    function logLine(kind, msg) {
      var host = $('[data-log]');
      if (!host) return;
      var div = el('div', kind);
      div.textContent = msg;
      host.appendChild(div);
    }
    function clearLog() {
      var host = $('[data-log]');
      if (host) host.textContent = '';
    }

    var dirSel = $('[data-dir]');
    var genderSel = $('[data-body-gender]');
    var bodyDxInput = $('[data-body-dx]');
    var bodyDyInput = $('[data-body-dy]');
    var bodyPanel = $('[data-body-panel]');
    var pantsPanel = $('[data-pants-panel]');
    var pantsTypeEl = $('[data-pants-type]');
    var pantsTypeOut = $('[data-pants-type-out]');
    var pantsHueEl = $('[data-pants-hue]');
    var pantsHueOut = $('[data-pants-hue-out]');
    var hairHueEl = $('[data-hair-hue]');
    var hairHueOut = $('[data-hair-hue-out]');
    var layerHost = $('[data-layer-indices]');
    var dstXInput = $('[data-dst-x]');
    var dstYInput = $('[data-dst-y]');
    var applyDstBtn = $('[data-dst-apply]');
    var meta = $('[data-meta]');
    var canvas = $('[data-canvas]');
    var ctx = canvas ? canvas.getContext('2d') : null;
    if (!dirSel || !layerHost || !dstXInput || !dstYInput || !applyDstBtn || !meta || !canvas || !ctx) return;
    scope.setAttribute('data-pxr-v4-inited', '1');
    ctx.imageSmoothingEnabled = false;

    clearLog();

    var viewerOpts = mergeViewerDefaults(DEFAULT_VIEWER, {});

    function dirFromSlider(dirEl) {
      var order = (viewerOpts.directionSlider && viewerOpts.directionSlider.order) || DEFAULT_VIEWER.directionSlider.order;
      if (!dirEl) return order[0] || 'front';
      var i = parseInt(dirEl.value, 10);
      if (isNaN(i)) i = 0;
      var maxI = Math.max(0, order.length - 1);
      i = Math.max(0, Math.min(maxI, i));
      return order[i];
    }
    function syncDirLabel(dirEl) {
      var label = scope.querySelector('[data-dir-label]');
      if (!label || !dirEl) return;
      var order = (viewerOpts.directionSlider && viewerOpts.directionSlider.order) || DEFAULT_VIEWER.directionSlider.order;
      var labels = (viewerOpts.directionSlider && viewerOpts.directionSlider.labels) || {};
      var i = parseInt(dirEl.value, 10);
      if (isNaN(i)) i = 0;
      var maxI = Math.max(0, order.length - 1);
      i = Math.max(0, Math.min(maxI, i));
      var key = order[i];
      label.textContent = labels[key] != null ? String(labels[key]) : String(key || '');
    }

    // scale is fixed to 4x (no UI)
    canvas.classList.remove('scale-1', 'scale-2', 'scale-6');
    canvas.classList.add('scale-4');

    function downloadPng(filename) {
      var name = filename || 'pxart-rullet-v4.png';
      canvas.toBlob(function (blob) {
        if (!blob) return;
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        a.click();
        URL.revokeObjectURL(a.href);
      });
    }
    function safe(s) {
      return String(s || '').replace(/[^a-z0-9._-]+/gi, '_').replace(/^_+|_+$/g, '').slice(0, 120) || 'x';
    }
    function buildExportName() {
      var gender = genderSel && genderSel.value === 'male' ? 'm' : 'f';
      var dir = dirFromSlider(dirSel);
      var pantsType = pantsTypeEl ? pantsTypeEl.value : '0';
      return safe('rullet-v4_' + gender + '_' + dir + '_pt' + pantsType + '.png');
    }
    var exportBtn = scope.querySelector('[data-export]');
    if (exportBtn) exportBtn.addEventListener('click', function () { downloadPng(buildExportName()); });

    var images = {};
    var paintToken = 0;
    var lastAppliedDx = 0;
    var lastAppliedDy = 0;
    var layout = null;
    var drawOrder = [];

    function ensureImageLoaded(key, cb) {
      if (images[key] && images[key].complete && images[key].naturalWidth) return cb(null, images[key]);
      var a = layout && layout.assets && layout.assets[key];
      var src = a && a.src ? a.src : '';
      if (!src) return cb(new Error('missing asset src for ' + key));
      var img = images[key] || new Image();
      img.decoding = 'async';
      img.onload = function () { cb(null, img); };
      img.onerror = function () { cb(new Error('failed to load image: ' + src)); };
      img.src = src;
      images[key] = img;
    }

    function whenAllLoaded(keys, cb) {
      var n = keys.length;
      if (!n) return cb(null);
      var err0 = null;
      var done = 0;
      keys.forEach(function (k) {
        ensureImageLoaded(k, function (err) {
          if (err && !err0) err0 = err;
          done++;
          if (done === n) cb(err0);
        });
      });
    }

    function syncPanels() {
      if (bodyPanel) bodyPanel.style.display = layout && layout.sheets && layout.sheets.body ? '' : 'none';
      if (pantsPanel) pantsPanel.style.display = layout && layout.sheets && layout.sheets.pants ? '' : 'none';
    }

    function syncPantsIdxLabels() {
      if (pantsTypeOut && pantsTypeEl) pantsTypeOut.textContent = pantsTypeEl.value;
      if (pantsHueOut && pantsHueEl) pantsHueOut.textContent = pantsHueEl.value;
    }

    function syncHueStyles() {
      var th = viewerOpts.tint || DEFAULT_VIEWER.tint;
      if (hairHueEl) hairHueEl.style.setProperty('--hue', String(getHue(hairHueEl, th.hairHueDefault)));
      if (pantsHueEl) pantsHueEl.style.setProperty('--hue', String(getHue(pantsHueEl, th.pantsHueDefault)));
    }

    /** 몸통 제외(바지/의상)만 여성일 때 DstY 보정 (layout `viewer.femaleClothingDstYNudge`) */
    function clothingFemaleDstYNudge() {
      var n = typeof viewerOpts.femaleClothingDstYNudge === 'number' ? viewerOpts.femaleClothingDstYNudge : DEFAULT_VIEWER.femaleClothingDstYNudge;
      return (genderSel && genderSel.value !== 'male') ? n : 0;
    }

    /** acc 슬라이더 인덱스: 헤어 Hue와 동일 틴트 (layout `viewer.accHairHueIndices`) */
    function accIndexUsesHairHue(i) {
      var arr = viewerOpts.accHairHueIndices || DEFAULT_VIEWER.accHairHueIndices;
      return arr.indexOf(i | 0) >= 0;
    }

    function getHue(el0, fallback) {
      if (!el0) return fallback;
      var v = parseInt(el0.value, 10);
      if (isNaN(v)) v = fallback;
      v = Math.max(0, Math.min(360, v));
      return v;
    }
    function hslToRgb(h, s, l) {
      h = ((h % 360) + 360) % 360;
      s = Math.max(0, Math.min(1, s));
      l = Math.max(0, Math.min(1, l));
      var c = (1 - Math.abs(2 * l - 1)) * s;
      var hp = h / 60;
      var x = c * (1 - Math.abs((hp % 2) - 1));
      var r1 = 0, g1 = 0, b1 = 0;
      if (hp >= 0 && hp < 1) { r1 = c; g1 = x; }
      else if (hp < 2) { r1 = x; g1 = c; }
      else if (hp < 3) { g1 = c; b1 = x; }
      else if (hp < 4) { g1 = x; b1 = c; }
      else if (hp < 5) { r1 = x; b1 = c; }
      else { r1 = c; b1 = x; }
      var m = l - c / 2;
      return { r: Math.round((r1 + m) * 255), g: Math.round((g1 + m) * 255), b: Math.round((b1 + m) * 255) };
    }
    var tintCanvas = document.createElement('canvas');
    var tintCtx = tintCanvas.getContext('2d');
    function drawTintedTile(img, sx, sy, sw, sh, dx, dy, hue) {
      if (!tintCtx) { ctx.drawImage(img, sx, sy, sw, sh, dx, dy, sw, sh); return; }
      tintCanvas.width = sw;
      tintCanvas.height = sh;
      tintCtx.clearRect(0, 0, sw, sh);
      tintCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      var id = tintCtx.getImageData(0, 0, sw, sh);
      var d = id.data;
      var th = viewerOpts.tint || DEFAULT_VIEWER.tint;
      var sat = typeof th.saturation === 'number' ? th.saturation : 0.85;
      var lit = typeof th.lightness === 'number' ? th.lightness : 0.55;
      var base = hslToRgb(hue, sat, lit);
      for (var i = 0; i < d.length; i += 4) {
        var a = d[i + 3];
        if (!a) continue;
        var intensity = d[i] / 255;
        d[i] = Math.round(base.r * intensity);
        d[i + 1] = Math.round(base.g * intensity);
        d[i + 2] = Math.round(base.b * intensity);
      }
      tintCtx.putImageData(id, 0, 0);
      ctx.drawImage(tintCanvas, 0, 0, sw, sh, dx, dy, sw, sh);
    }

    function getLayerIndex(key) {
      var inp = layerHost.querySelector('[data-layer-index="' + key + '"]') || scope.querySelector('[data-layer-index="' + key + '"]');
      if (!inp) return 0;
      var v = parseInt(inp.value, 10);
      if (isNaN(v)) v = 0;
      var spec = layout && layout.sheets && layout.sheets[key];
      var maxI = spec && typeof spec.maxIndex === 'number' ? spec.maxIndex : 0;
      if (v < 0) v = 0;
      if (v > maxI) v = maxI;
      return v;
    }

    function getLayerDst(key) {
      var spec = layout && layout.sheets && layout.sheets[key];
      var baseX = spec && typeof spec.dstX === 'number' ? spec.dstX : 0;
      var baseY = spec && typeof spec.dstY === 'number' ? spec.dstY : 0;
      var ix = layerHost.querySelector('[data-layer-dx="' + key + '"]') || scope.querySelector('[data-layer-dx="' + key + '"]');
      var iy = layerHost.querySelector('[data-layer-dy="' + key + '"]') || scope.querySelector('[data-layer-dy="' + key + '"]');
      var ox = ix ? parseInt(ix.value, 10) : baseX;
      var oy = iy ? parseInt(iy.value, 10) : baseY;
      if (isNaN(ox)) ox = baseX;
      if (isNaN(oy)) oy = baseY;
      return { ox: ox, oy: oy };
    }

    function syncBodyInputsFromSpec(bs) {
      if (!bs) return;
      var lx = typeof bs.dstX === 'number' ? bs.dstX : 0;
      var ly = typeof bs.dstY === 'number' ? bs.dstY : 0;
      if (bodyDxInput) bodyDxInput.value = String(lx);
      if (bodyDyInput) bodyDyInput.value = String(ly);
    }

    function syncPantsOffsetFromSpec(ps) {
      if (!ps) return;
      var lx = typeof ps.dstX === 'number' ? ps.dstX : 0;
      var ly = typeof ps.dstY === 'number' ? ps.dstY : 0;
      var ix = scope.querySelector('[data-layer-dx="pants"]');
      var iy = scope.querySelector('[data-layer-dy="pants"]');
      if (ix) ix.value = String(lx);
      if (iy) iy.value = String(ly);
    }

    function buildLayerIndicesUI() {
      layerHost.innerHTML = '';
      if (!layout || !layout.sheets) return;
      drawOrder = buildDrawOrder(layout.sheets, layout.assets, viewerOpts.drawOrderFallbackPreferred);
      drawOrder.forEach(function (key) {
        var spec = layout.sheets[key];
        if (!spec || !spec.tileSize) return;
        var maxI = typeof spec.maxIndex === 'number' ? spec.maxIndex : 0;
        var lx0 = typeof spec.dstX === 'number' ? spec.dstX : 0;
        var ly0 = typeof spec.dstY === 'number' ? spec.dstY : 0;

        var row = el('div', 'layerRow');
        var name = el('span', 'layerName');
        name.textContent = key;

        var idxBlock = el('div', 'idxRow');
        var input = el('input');
        input.type = 'range';
        input.className = 'layerIdxSlider';
        input.min = '0';
        input.max = String(maxI);
        input.step = '1';
        input.value = '0';
        input.setAttribute('data-layer-index', key);
        var idxOut = el('span', 'layerIdxOut');
        idxOut.textContent = '0';
        var hint = el('span', 'layerMax');
        hint.textContent = '/' + maxI;
        idxBlock.appendChild(input);
        idxBlock.appendChild(idxOut);
        idxBlock.appendChild(hint);

        var layerOff = el('div', 'layerOff');
        function addOff(axis, val) {
          var lab = el('label');
          var sm = el('span', 'lblSm');
          sm.textContent = axis;
          var inp = el('input');
          inp.type = 'number';
          inp.step = '1';
          inp.value = String(val);
          if (axis === 'X') inp.setAttribute('data-layer-dx', key);
          else inp.setAttribute('data-layer-dy', key);
          lab.appendChild(sm);
          lab.appendChild(inp);
          layerOff.appendChild(lab);
          inp.addEventListener('input', function () { render(); });
          inp.addEventListener('change', function () { render(); });
        }
        addOff('X', lx0);
        addOff('Y', ly0);

        row.appendChild(name);
        row.appendChild(idxBlock);
        row.appendChild(layerOff);
        layerHost.appendChild(row);
        function syncOut() { idxOut.textContent = input.value; }
        input.addEventListener('input', function () { syncOut(); render(); });
        input.addEventListener('change', function () { syncOut(); render(); });
      });
    }

    function bodyLayersFromDirection(dir) {
      var byDir = viewerOpts.bodyLayersByDirection || DEFAULT_VIEWER.bodyLayersByDirection;
      var layers = byDir[dir];
      if (layers && layers.length) return layers;
      var fb = DEFAULT_VIEWER.bodyLayersByDirection[dir];
      return fb && fb.length ? fb : DEFAULT_VIEWER.bodyLayersByDirection.front;
    }

    function readDraftGlobalDst() {
      var dx = parseInt(dstXInput.value, 10);
      var dy = parseInt(dstYInput.value, 10);
      if (isNaN(dx)) dx = 0;
      if (isNaN(dy)) dy = 0;
      return { dx: dx, dy: dy };
    }
    function applyGlobalDst() {
      var d = readDraftGlobalDst();
      lastAppliedDx = d.dx;
      lastAppliedDy = d.dy;
      render();
    }

    function getPaintOrder(dir0) {
      var doMap = layout && layout.drawOrder;
      var raw = null;
      if (doMap && typeof doMap === 'object') {
        raw = doMap[dir0];
        if (!raw && doMap.default) raw = doMap.default;
      }
      if (!raw || !raw.length) {
        var fb = ['body'];
        if (layout.sheets && layout.sheets.pants) fb.push('pants');
        drawOrder.forEach(function (k) { fb.push(k); });
        return fb;
      }
      var out = [];
      var seen = {};
      raw.forEach(function (k) {
        if (!k || seen[k]) return;
        seen[k] = true;
        out.push(k);
      });
      return out;
    }

    function collectAssetKeysForPaint(paintOrder, bodyAssetKey, pantsAssetKey) {
      var keys = [];
      function add(k) {
        if (!k) return;
        if (keys.indexOf(k) === -1) keys.push(k);
      }
      paintOrder.forEach(function (part) {
        if (part === 'body') add(bodyAssetKey);
        else if (part === 'pants') add(pantsAssetKey);
        else add(part);
      });
      return keys;
    }

    function render() {
      if (!layout || !layout.sheets || !layout.assets) return;
      var myToken = ++paintToken;
      clearLog();

      var dir = dirFromSlider(dirSel);
      var clothYNudge = clothingFemaleDstYNudge();
      var bodyAssetKey = (genderSel && genderSel.value === 'male') ? 'bodyMale' : 'bodyFemale';
      var pantsAssetKey = (genderSel && genderSel.value === 'male') ? 'pantsMale' : 'pantsFemale';
      var paintOrder = getPaintOrder(dir);
      var keys = collectAssetKeysForPaint(paintOrder, bodyAssetKey, pantsAssetKey);

      var bspec = layout.sheets.body;
      var pspec = layout.sheets.pants;

      var lines = [];
      paintOrder.forEach(function (key) {
        if (key === 'body') {
          if (!bspec || !bspec.tileSize) return;
          var swB = bspec.tileSize.w | 0;
          var shB = bspec.tileSize.h | 0;
          var cpbB = bspec.colsPerPartBlock | 0;
          var layers0 = bodyLayersFromDirection(dir);
          var bits = [];
          for (var li = 0; li < layers0.length; li++) {
            var L0 = layers0[li];
            var sxL = ((L0.part * cpbB) + L0.col) * swB;
            var syL = (L0.row | 0) * shB;
            bits.push('p' + L0.part + '(r' + L0.row + ',c' + L0.col + ')→(' + sxL + ',' + syL + ')' + (L0.flipX ? '↔' : ''));
          }
          var bd0 = bodyDxInput && bodyDyInput
            ? { ox: parseInt(bodyDxInput.value, 10) || 0, oy: parseInt(bodyDyInput.value, 10) || 0 }
            : { ox: typeof bspec.dstX === 'number' ? bspec.dstX : 0, oy: typeof bspec.dstY === 'number' ? bspec.dstY : 0 };
          lines.push('body: ' + bits.join(' + ') + ' · off(' + bd0.ox + ',' + bd0.oy + ')');
          return;
        }
        if (key === 'pants') {
          if (!pspec || !pspec.tileSize) return;
          var twP = pspec.tileSize.w | 0;
          var thP = pspec.tileSize.h | 0;
          var cptP = (pspec.colsPerType | 0) || 6;
          var typeIdx = pantsTypeEl ? (parseInt(pantsTypeEl.value, 10) || 0) : 0;
          var rowIdx = 0;
          var dcellP = getDirCell(pspec, dir, viewerOpts.dirCellFallbackRows);
          var sxP = typeIdx * (cptP * twP) + (dcellP.col | 0) * twP;
          var syP = rowIdx * thP;
          var pd0 = getLayerDst('pants');
          lines.push('pants: type ' + typeIdx + ' src(' + sxP + ',' + syP + ',' + twP + ',' + thP + ') off(' + pd0.ox + ',' + pd0.oy + ')');
          return;
        }
        var spec = layout.sheets[key];
        if (!spec || !spec.tileSize) return;
        var idx = getLayerIndex(key);
        var tileW = spec.tileSize.w | 0;
        var tileH = spec.tileSize.h | 0;
        var dcell = getDirCell(spec, dir, viewerOpts.dirCellFallbackRows);
        var sx = idx * tileW;
        var sy = (dcell.row | 0) * tileH;
        var ld = getLayerDst(key);
        var accTint = (key === 'acc' && accIndexUsesHairHue(idx)) ? ' · 틴트=헤어' : '';
        lines.push(key + ': #' + idx + ' src(' + sx + ',' + sy + ',' + tileW + ',' + tileH + ') off(' + ld.ox + ',' + ld.oy + ')' + accTint);
      });

      meta.innerHTML =
        '<div><b>direction</b>: ' + dir +
        ' <span style="opacity:.6">·</span> <b>draw</b>: ' + paintOrder.join(' → ') +
        (clothYNudge ? ' · <span style="opacity:.85">여성: 바지·의상 DstY +1</span>' : '') +
        '</div>' +
        '<div><b>전체(공통) 오프셋 적용됨</b>: (' + lastAppliedDx + ', ' + lastAppliedDy + ')</div>' +
        '<div>' + lines.join('<br/>') + '</div>';

      syncPickerOutLabels();

      whenAllLoaded(keys, function (err) {
        if (myToken !== paintToken) return;
        if (err) { logLine('bad', String(err.message || err)); ctx.clearRect(0, 0, canvas.width, canvas.height); return; }

        var cv = viewerOpts.canvas || DEFAULT_VIEWER.canvas;
        var outW = cv.width | 0;
        var outH = cv.height | 0;
        canvas.width = outW;
        canvas.height = outH;
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, outW, outH);

        // checker
        var hideChecker = false;
        try {
          hideChecker =
            (canvas && canvas.getAttribute && canvas.getAttribute('data-hide-checkerboard') === '1') ||
            (canvas && canvas.closest && canvas.closest('[data-hide-checkerboard="1"]'));
        } catch (e0) { /* ignore */ }
        if (!hideChecker) {
          var cell = (cv.checkerCell | 0) || 4;
          var chk = (cv.checkerColors && cv.checkerColors.length >= 2) ? cv.checkerColors : DEFAULT_VIEWER.canvas.checkerColors;
          for (var yy = 0; yy < outH; yy += cell) {
            for (var xx = 0; xx < outW; xx += cell) {
              ctx.fillStyle = ((xx / cell + yy / cell) % 2 === 0) ? chk[0] : chk[1];
              ctx.fillRect(xx, yy, cell, cell);
            }
          }
        }

        var gx = lastAppliedDx, gy = lastAppliedDy;

        paintOrder.forEach(function (part) {
          if (myToken !== paintToken) return;
          if (part === 'body') {
            if (!bspec || !bspec.tileSize) return;
            var bimg = images[bodyAssetKey];
            if (!bimg || !bimg.naturalWidth) return;
            var sw = bspec.tileSize.w | 0;
            var sh = bspec.tileSize.h | 0;
            var cpb = bspec.colsPerPartBlock | 0;
            var baseBX = typeof bspec.dstX === 'number' ? bspec.dstX : 0;
            var baseBY = typeof bspec.dstY === 'number' ? bspec.dstY : 0;
            var bodOffX = bodyDxInput ? parseInt(bodyDxInput.value, 10) : baseBX;
            var bodOffY = bodyDyInput ? parseInt(bodyDyInput.value, 10) : baseBY;
            if (isNaN(bodOffX)) bodOffX = baseBX;
            if (isNaN(bodOffY)) bodOffY = baseBY;
            var bdx = gx + bodOffX;
            var bdy = gy + bodOffY;
            var layers = bodyLayersFromDirection(dir);
            layers.forEach(function (L) {
              var sxB = ((L.part * cpb) + L.col) * sw;
              var syB = (L.row | 0) * sh;
              if (L.flipX) {
                ctx.save();
                ctx.translate(bdx + sw, bdy);
                ctx.scale(-1, 1);
                ctx.drawImage(bimg, sxB, syB, sw, sh, 0, 0, sw, sh);
                ctx.restore();
              } else {
                ctx.drawImage(bimg, sxB, syB, sw, sh, bdx, bdy, sw, sh);
              }
            });
            return;
          }
          if (part === 'pants') {
            if (!pspec || !pspec.tileSize) return;
            var pimg = images[pantsAssetKey];
            if (!pimg || !pimg.naturalWidth) return;
            var tw = pspec.tileSize.w | 0;
            var th = pspec.tileSize.h | 0;
            var colsPerType = (pspec.colsPerType | 0) || 6;
            var typeIdx = pantsTypeEl ? (parseInt(pantsTypeEl.value, 10) || 0) : 0;
            var rowIdx = 0;
            var dcellP = getDirCell(pspec, dir, viewerOpts.dirCellFallbackRows);
            var sxP = typeIdx * (colsPerType * tw) + (dcellP.col | 0) * tw;
            var syP = rowIdx * th;
            var pd = getLayerDst('pants');
            var px = gx + pd.ox;
            var py = gy + pd.oy;// + clothYNudge;
            var thP = viewerOpts.tint || DEFAULT_VIEWER.tint;
            var ph = getHue(pantsHueEl, thP.pantsHueDefault);
            drawTintedTile(pimg, sxP, syP, tw, th, px, py, ph);
            return;
          }
          var spec = layout.sheets[part];
          var img = images[part];
          if (!spec || !spec.tileSize || !img || !img.naturalWidth) return;
          var tileW = spec.tileSize.w | 0;
          var tileH = spec.tileSize.h | 0;
          var idx = getLayerIndex(part);
          var dcell2 = getDirCell(spec, dir, viewerOpts.dirCellFallbackRows);
          var sx = idx * tileW;
          var sy = (dcell2.row | 0) * tileH;
          var ld = getLayerDst(part);
          var dx = gx + ld.ox;
          var dy = gy + ld.oy + clothYNudge;
          var thH = viewerOpts.tint || DEFAULT_VIEWER.tint;
          if (part === 'hair') {
            var hh = getHue(hairHueEl, thH.hairHueDefault);
            drawTintedTile(img, sx, sy, tileW, tileH, dx, dy, hh);
          } else if (part === 'acc' && accIndexUsesHairHue(idx)) {
            var hhAcc = getHue(hairHueEl, thH.hairHueDefault);
            drawTintedTile(img, sx, sy, tileW, tileH, dx, dy, hhAcc);
          } else {
            ctx.drawImage(img, sx, sy, tileW, tileH, dx, dy, tileW, tileH);
          }
        });

        logLine('ok', 'composite ' + keys.length + ' assets (layout.json)');
      });
    }

    function syncPickerOutLabels() {
      ['shirt', 'acc', 'hair', 'hat'].forEach(function (k) {
        var out = scope.querySelector('[data-picker-out="' + k + '"]');
        if (out) out.textContent = String(getLayerIndex(k));
      });
    }

    function wireIndexStepButtons() {
      scope.querySelectorAll('[data-step]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var step = btn.getAttribute('data-step');
          var delta = parseInt(btn.getAttribute('data-delta'), 10);
          if (isNaN(delta) || delta === 0) return;
          if (step === 'pants-type' && pantsTypeEl) {
            var maxT = parseInt(pantsTypeEl.getAttribute('max'), 10);
            if (isNaN(maxT)) maxT = 15;
            var vt = (parseInt(pantsTypeEl.value, 10) || 0) + delta;
            pantsTypeEl.value = String(Math.max(0, Math.min(maxT, vt)));
            pantsTypeEl.dispatchEvent(new Event('input', { bubbles: true }));
            return;
          }
          if (step === 'layer') {
            var layer = btn.getAttribute('data-layer');
            if (!layer) return;
            var inp = layerHost.querySelector('[data-layer-index="' + layer + '"]');
            if (!inp) return;
            var maxI = parseInt(inp.getAttribute('max'), 10);
            if (isNaN(maxI)) maxI = 0;
            var vi = (parseInt(inp.value, 10) || 0) + delta;
            vi = Math.max(0, Math.min(maxI, vi));
            inp.value = String(vi);
            inp.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      });
    }

    function wireUi() {
      function onDirSlider() { syncDirLabel(dirSel); render(); }
      dirSel.addEventListener('input', onDirSlider);
      dirSel.addEventListener('change', onDirSlider);
      syncDirLabel(dirSel);
      scope.querySelectorAll('[data-dir-delta]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (!dirSel) return;
          var delta = parseInt(btn.getAttribute('data-dir-delta'), 10);
          if (isNaN(delta) || delta === 0) return;
          var order = (viewerOpts.directionSlider && viewerOpts.directionSlider.order) || DEFAULT_VIEWER.directionSlider.order;
          var len = Math.max(0, order.length | 0);
          if (!len) return;
          var i = parseInt(dirSel.value, 10) || 0;
          i = ((i + delta) % len + len) % len; // wrap-around (supports negative delta)
          dirSel.value = String(i | 0);
          onDirSlider();
        });
      });
      applyDstBtn.addEventListener('click', function () { applyGlobalDst(); });
      dstXInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') applyGlobalDst(); });
      dstYInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') applyGlobalDst(); });

      wireIndexStepButtons();

      function onPantsAny() { syncPantsIdxLabels(); syncHueStyles(); render(); }
      if (pantsTypeEl) { pantsTypeEl.addEventListener('input', onPantsAny); pantsTypeEl.addEventListener('change', onPantsAny); }
      if (pantsHueEl) { pantsHueEl.addEventListener('input', onPantsAny); pantsHueEl.addEventListener('change', onPantsAny); }
      if (hairHueEl) {
        function onHairHue() { if (hairHueOut) hairHueOut.textContent = hairHueEl.value; syncHueStyles(); render(); }
        hairHueEl.addEventListener('input', onHairHue);
        hairHueEl.addEventListener('change', onHairHue);
        onHairHue();
      }
      function wireGenderButtons() {
        if (!genderSel) return;
        var btnF = scope.querySelector('[data-gender-btn="female"]');
        var btnM = scope.querySelector('[data-gender-btn="male"]');
        if (!btnF || !btnM) return;

        function syncGenderBtns() {
          var v = genderSel.value === 'male' ? 'male' : 'female';
          btnF.setAttribute('aria-pressed', v === 'female' ? 'true' : 'false');
          btnM.setAttribute('aria-pressed', v === 'male' ? 'true' : 'false');
        }
        function setGender(v) {
          genderSel.value = v;
          syncGenderBtns();
          try { genderSel.dispatchEvent(new Event('change', { bubbles: true })); } catch (e0) { /* ignore */ }
        }
        btnF.addEventListener('click', function () { setGender('female'); });
        btnM.addEventListener('click', function () { setGender('male'); });
        genderSel.addEventListener('change', syncGenderBtns);
        syncGenderBtns();
      }

      wireGenderButtons();
      if (genderSel) genderSel.addEventListener('change', function () { render(); });
      if (bodyDxInput) { bodyDxInput.addEventListener('input', function () { render(); }); bodyDxInput.addEventListener('change', function () { render(); }); }
      if (bodyDyInput) { bodyDyInput.addEventListener('input', function () { render(); }); bodyDyInput.addEventListener('change', function () { render(); }); }

      syncHueStyles();
    }

    var layoutUrl = resolveLayoutUrl();
    fetch(layoutUrl)
      .then(function (r) { if (!r.ok) throw new Error('layout HTTP ' + r.status + ' ' + layoutUrl); return r.json(); })
      .then(function (data) {
        if (!data || !data.sheets || !data.assets) throw new Error('invalid layout.json');
        layout = data;
        viewerOpts = mergeViewerDefaults(DEFAULT_VIEWER, data.viewer || {});
        var rw = viewerOpts.assetSrcRewrite || DEFAULT_VIEWER.assetSrcRewrite;
        Object.keys(data.assets).forEach(function (k) {
          if (data.assets[k] && data.assets[k].src) data.assets[k].src = normalizeAssetSrc(data.assets[k].src, rw);
        });
        var th0 = viewerOpts.tint || DEFAULT_VIEWER.tint;
        if (hairHueEl) {
          hairHueEl.value = String(typeof th0.hairHueDefault === 'number' ? th0.hairHueDefault : 30);
          if (hairHueOut) hairHueOut.textContent = hairHueEl.value;
        }
        if (pantsHueEl) {
          pantsHueEl.value = String(typeof th0.pantsHueDefault === 'number' ? th0.pantsHueDefault : 210);
          if (pantsHueOut) pantsHueOut.textContent = pantsHueEl.value;
        }
        drawOrder = buildDrawOrder(layout.sheets, layout.assets, viewerOpts.drawOrderFallbackPreferred);
        syncPanels();
        if (layout.sheets && layout.sheets.body) syncBodyInputsFromSpec(layout.sheets.body);
        if (layout.sheets && layout.sheets.pants) syncPantsOffsetFromSpec(layout.sheets.pants);
        buildLayerIndicesUI();
        syncPantsIdxLabels();
        syncPickerOutLabels();
        wireUi();
        render();
      })
      .catch(function (e) {
        clearLog();
        logLine('bad', 'failed: ' + (e && e.message ? e.message : String(e)));
      });
  }

  window.pxartRulletV4Boot = main;
  var embedRoot = null;
  try {
    embedRoot = window.__PXR_V4_EMBED_ROOT__;
    if (embedRoot) delete window.__PXR_V4_EMBED_ROOT__;
  } catch (eR) { /* ignore */ }
  if (embedRoot) {
    main(embedRoot);
  } else {
    function go() { main(document.body); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
    else go();
  }
})();