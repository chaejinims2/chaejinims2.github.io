/* global window, document */
(function () {
  'use strict';

  var SPRITE_W = 256;
  var SPRITE_H = 256;

  // Rects are in sprite/canvas pixel coordinates.
  var RECTS = {
    rullet: { x: 0, y: 64, w: 115, h: 93 },
    rullet_list: { x: 24, y: 82, w: 66, h: 21 },
    rullet_btn: { x: 48, y: 118, w: 22, h: 21 },
    btn1: { x: 150, y: 93, w: 22, h: 21 },
    btn2: { x: 150, y: 115, w: 22, h: 21 },
    btn3: { x: 150, y: 138, w: 22, h: 21 },
    list_bg: { x: 0, y: 170, w: 88, h: 21 }
  };

  // Theme column + gap to rullet (used for centered group layout; keep in sync with getThemeButtonRects).
  var THEME_BTN = { w: 32, h: 16, gapY: 6, gapXR: 6, count: 5 };

  // btn1 → btn2 → btn3 → btn2 → btn1
  var BTN_CYCLE = [RECTS.btn1, RECTS.btn2, RECTS.btn3, RECTS.btn2, RECTS.btn1];

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function mod(n, m) { return ((n % m) + m) % m; }
  function resolveUrl(relativeOrAbsolute, base) {
    try { return new URL(relativeOrAbsolute, base || window.location.href).toString(); }
    catch (e) { return relativeOrAbsolute; }
  }

  function getCanvasPoint(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return { x: 0, y: 0 };
    var cx = evt.clientX != null ? evt.clientX : 0;
    var cy = evt.clientY != null ? evt.clientY : 0;
    var x = (cx - rect.left) * (canvas.width / rect.width);
    var y = (cy - rect.top) * (canvas.height / rect.height);
    return { x: x, y: y };
  }

  function inRect(p, r) {
    return p.x >= r.x && p.x < (r.x + r.w) && p.y >= r.y && p.y < (r.y + r.h);
  }

  function drawTiled(ctx, img, srcRect, dstRect, scrollX) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(dstRect.x, dstRect.y, dstRect.w, dstRect.h);
    ctx.clip();

    var tileW = srcRect.w;
    var startX = dstRect.x - mod(scrollX, tileW);
    while (startX > dstRect.x) startX -= tileW;

    for (var x = startX; x < dstRect.x + dstRect.w + tileW; x += tileW) {
      ctx.drawImage(
        img,
        srcRect.x, srcRect.y, srcRect.w, srcRect.h,
        Math.round(x), Math.round(dstRect.y), srcRect.w, srcRect.h
      );
    }
    ctx.restore();
  }

  function drawEmojiStrip(ctx, emojisImg, dstRect, offset, scrollPx) {
    // dstRect: clip area in canvas/sprite coords
    var TILE = 9;
    var GRID = 14; // 126/9
    var COUNT = GRID * GRID; // 196
    var PITCH = 22; // center-to-center
    var centerY = dstRect.y + dstRect.h / 2;
    var shiftX = typeof scrollPx === 'number' ? scrollPx : 0;

    ctx.save();
    ctx.beginPath();
    ctx.rect(dstRect.x, dstRect.y, dstRect.w, dstRect.h);
    ctx.clip();

    // Center one emoji in the window, then place neighbors at ±22px, etc.
    // 66px width fits exactly 3 pitches (22*3); we draw a few extra for clipping.
    var slotsEachSide = 3;
    // When the background shuttles by +scrollX, move emojis by the same amount (stepwise).
    var baseCenterX = dstRect.x + dstRect.w / 2 - shiftX;
    for (var i = -slotsEachSide; i <= slotsEachSide; i++) {
      var idx = mod((offset + i), COUNT);
      var sx = (idx % GRID) * TILE;
      var sy = Math.floor(idx / GRID) * TILE;

      var cx = baseCenterX + i * PITCH;
      var dx = Math.round(cx - TILE / 2);
      var dy = Math.round(centerY - TILE / 2);
      ctx.drawImage(emojisImg, sx, sy, TILE, TILE, dx, dy, TILE, TILE);
    }

    ctx.restore();
  }

  function drawShirtStrip(ctx, shirtsImg, dstRect, entries, offset, scrollPx) {
    if (!entries || !entries.length) return;

    var TILE = 8;
    var PITCH = 22; // center-to-center
    var centerY = dstRect.y + dstRect.h / 2;
    var shiftX = typeof scrollPx === 'number' ? scrollPx : 0;

    ctx.save();
    ctx.beginPath();
    ctx.rect(dstRect.x, dstRect.y, dstRect.w, dstRect.h);
    ctx.clip();

    var slotsEachSide = 3;
    // Reserved area for fixed character preview (20×20) in the left slot.
    var reservedCx = dstRect.x + dstRect.w / 2 - PITCH;
    var reservedRect = {
      x: reservedCx - 10,
      y: centerY - 10,
      w: 20,
      h: 20
    };
    var baseCenterX = dstRect.x + dstRect.w / 2 - shiftX;
    for (var i = -slotsEachSide; i <= slotsEachSide; i++) {
      var idx = mod((offset + i), entries.length);
      var entry = entries[idx];
      var cx = baseCenterX + i * PITCH;
      var dx = Math.round(cx - TILE / 2);
      var dy = Math.round(centerY - TILE / 2);
      // Skip any item that would overlap the fixed character area.
      if (
        dx < reservedRect.x + reservedRect.w &&
        dx + TILE > reservedRect.x &&
        dy < reservedRect.y + reservedRect.h &&
        dy + TILE > reservedRect.y
      ) continue;
      ctx.drawImage(shirtsImg, entry.sx, entry.sy, TILE, TILE, dx, dy, TILE, TILE);
    }

    ctx.restore();
  }

  function drawAccStrip(ctx, accsImg, dstRect, entries, offset, scrollPx) {
    if (!entries || !entries.length) return;

    var TILE = 16;
    var PITCH = 22; // center-to-center
    var centerY = dstRect.y + dstRect.h / 2;
    var shiftX = typeof scrollPx === 'number' ? scrollPx : 0;

    ctx.save();
    ctx.beginPath();
    ctx.rect(dstRect.x, dstRect.y, dstRect.w, dstRect.h);
    ctx.clip();

    var slotsEachSide = 3;
    // Reserved area for fixed character preview (20×20) in the left slot.
    var reservedCx = dstRect.x + dstRect.w / 2 - PITCH;
    var reservedRect = {
      x: reservedCx - 10,
      y: centerY - 10,
      w: 20,
      h: 20
    };
    var baseCenterX = dstRect.x + dstRect.w / 2 - shiftX;
    for (var i = -slotsEachSide; i <= slotsEachSide; i++) {
      var idx = mod((offset + i), entries.length);
      var entry = entries[idx];
      var cx = baseCenterX + i * PITCH;
      var dx = Math.round(cx - TILE / 2);
      var dy = Math.round(centerY - TILE / 2);
      // Skip any item that would overlap the fixed character area.
      if (
        dx < reservedRect.x + reservedRect.w &&
        dx + TILE > reservedRect.x &&
        dy < reservedRect.y + reservedRect.h &&
        dy + TILE > reservedRect.y
      ) continue;
      ctx.drawImage(accsImg, entry.sx, entry.sy, TILE, TILE, dx, dy, TILE, TILE);
    }

    ctx.restore();
  }

  function drawHatStrip(ctx, hatsImg, dstRect, entries, offset, scrollPx) {
    if (!entries || !entries.length) return;

    var SRC = 20;
    var DST = 20;
    var PITCH = 22; // center-to-center
    var centerY = dstRect.y + dstRect.h / 2;
    var shiftX = typeof scrollPx === 'number' ? scrollPx : 0;

    ctx.save();
    ctx.beginPath();
    ctx.rect(dstRect.x, dstRect.y, dstRect.w, dstRect.h);
    ctx.clip();

    var slotsEachSide = 3;
    // Reserved area for fixed character preview (20×20) in the left slot.
    var reservedCx = dstRect.x + dstRect.w / 2 - PITCH;
    var reservedRect = {
      x: reservedCx - 10,
      y: centerY - 10,
      w: 20,
      h: 20
    };
    var baseCenterX = dstRect.x + dstRect.w / 2 - shiftX;
    for (var i = -slotsEachSide; i <= slotsEachSide; i++) {
      var idx = mod((offset + i), entries.length);
      var entry = entries[idx];
      var cx = baseCenterX + i * PITCH;
      var dx = Math.round(cx - DST / 2);
      var dy = Math.round(centerY - DST / 2);
      // Skip any item that would overlap the fixed character area.
      if (
        dx < reservedRect.x + reservedRect.w &&
        dx + DST > reservedRect.x &&
        dy < reservedRect.y + reservedRect.h &&
        dy + DST > reservedRect.y
      ) continue;
      ctx.drawImage(hatsImg, entry.sx, entry.sy, SRC, SRC, dx, dy, DST, DST);
    }

    ctx.restore();
  }

  function drawHairStrip(ctx, hairTiles, dstRect, offset, scrollPx) {
    if (!hairTiles || !hairTiles.length) return;

    var DST = 20;
    var PITCH = 22;
    var centerY = dstRect.y + dstRect.h / 2;
    var shiftX = typeof scrollPx === 'number' ? scrollPx : 0;

    ctx.save();
    ctx.beginPath();
    ctx.rect(dstRect.x, dstRect.y, dstRect.w, dstRect.h);
    ctx.clip();

    var slotsEachSide = 3;
    var reservedCx = dstRect.x + dstRect.w / 2 - PITCH;
    var reservedRect = {
      x: reservedCx - 10,
      y: centerY - 10,
      w: 20,
      h: 20
    };
    var baseCenterX = dstRect.x + dstRect.w / 2 - shiftX;
    for (var i = -slotsEachSide; i <= slotsEachSide; i++) {
      var idx = mod((offset + i), hairTiles.length);
      var tile = hairTiles[idx];
      var cx = baseCenterX + i * PITCH;
      var dx = Math.round(cx - DST / 2);
      var dy = Math.round(centerY - DST / 2);
      if (
        dx < reservedRect.x + reservedRect.w &&
        dx + DST > reservedRect.x &&
        dy < reservedRect.y + reservedRect.h &&
        dy + DST > reservedRect.y
      ) continue;
      ctx.drawImage(tile, dx, dy);
    }

    ctx.restore();
  }

  function getThemeButtonRects(originX, themeFirstY) {
    var btnW = THEME_BTN.w;
    var btnH = THEME_BTN.h;
    var gapY = THEME_BTN.gapY;
    var x = originX;
    var y0 = themeFirstY;
    var rEmoji = { x: x, y: y0 + (btnH + gapY) * 0, w: btnW, h: btnH };
    var rShirt = { x: x, y: y0 + (btnH + gapY) * 1, w: btnW, h: btnH };
    var rAccs = { x: x, y: y0 + (btnH + gapY) * 2, w: btnW, h: btnH };
    var rHat = { x: x, y: y0 + (btnH + gapY) * 3, w: btnW, h: btnH };
    var rHair = { x: x, y: y0 + (btnH + gapY) * 4, w: btnW, h: btnH };
    return { emoji: rEmoji, shirt: rShirt, accs: rAccs, hat: rHat, hair: rHair };
  }

  function drawPixelText(ctx, text, x, y, color) {
    // 3x5 bitmap font, drawn in 1px blocks (crisp when canvas is scaled).
    var glyphs = {
      2: ['111', '001', '111', '100', '111'],
      A: ['010', '101', '111', '101', '101'],
      C: ['111', '100', '100', '100', '111'],
      E: ['111', '100', '111', '100', '111'],
      M: ['101', '111', '111', '101', '101'],
      O: ['111', '101', '101', '101', '111'],
      J: ['111', '001', '001', '101', '111'],
      I: ['111', '010', '010', '010', '111'],
      S: ['111', '100', '111', '001', '111'],
      H: ['101', '101', '111', '101', '101'],
      R: ['110', '101', '110', '101', '101'],
      T: ['111', '010', '010', '010', '010']
    };

    var gap = 1;
    var w = 3;
    var h = 5;
    ctx.save();
    ctx.fillStyle = color || 'rgba(255,255,255,0.9)';
    var ox = x;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      var g = glyphs[ch];
      if (!g) { ox += w + gap; continue; }
      for (var yy = 0; yy < h; yy++) {
        var row = g[yy];
        for (var xx = 0; xx < w; xx++) {
          if (row.charAt(xx) === '1') ctx.fillRect(ox + xx, y + yy, 1, 1);
        }
      }
      ox += w + gap;
    }
    ctx.restore();
  }

  function drawThemeButtons(ctx, activeTheme, originX, themeFirstY) {
    var rects = getThemeButtonRects(originX, themeFirstY);

    function drawOne(r, label, isActive) {
      ctx.save();
      ctx.fillStyle = isActive ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)';
      ctx.strokeStyle = isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.28)';
      ctx.lineWidth = 1;
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);

      // Pixel label (avoid blurry/aliased canvas text when scaled)
      var color = isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)';
      var gap = 1;
      var labelW = label.length * 3 + (label.length - 1) * gap;
      var labelH = 5;
      var tx = Math.round(r.x + (r.w - labelW) / 2);
      var ty = Math.round(r.y + (r.h - labelH) / 2);
      drawPixelText(ctx, label, tx, ty, color);
      ctx.restore();
    }

    drawOne(rects.emoji, 'EMOJI', activeTheme === 'emoji');
    drawOne(rects.shirt, 'SHIRT', activeTheme === 'shirt');
    drawOne(rects.accs, 'ACCS', activeTheme === 'accs');
    drawOne(rects.hat, 'HAT', activeTheme === 'hat');
    drawOne(rects.hair, 'HAIR', activeTheme === 'hair');
    return rects;
  }

  function createRenderer(root) {
    var canvas = root.querySelector('canvas');
    if (!canvas) return null;
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.imageSmoothingEnabled = false;

    canvas.width = SPRITE_W;
    canvas.height = SPRITE_H;

    var spriteSrc = root.getAttribute('data-sprite-src') || '';
    var img = new Image();
    img.decoding = 'async';

    var emojis = new Image();
    emojis.decoding = 'async';
    var emojisLoaded = false;
    // emojis.png sits next to Prize-Ticket-Menu_256x128.png inside the same bg/ folder.
    // Resolve from the spriteSrc URL to avoid page-path relative URL bugs.
    var spriteAbs = resolveUrl(spriteSrc, window.location.href);
    var emojisAbs = resolveUrl('emojis.png', spriteAbs);
    emojis.onload = function () { emojisLoaded = true; render(); };
    emojis.onerror = function () { emojisLoaded = false; render(); };
    emojis.src = emojisAbs;

    var shirts = new Image();
    shirts.decoding = 'async';
    var shirtsLoaded = false;
    var validShirtEntries = [];
    var shirtsAbs = resolveUrl('../farmer/shirts_256x608.png', spriteAbs);
    shirts.onload = function () {
      shirtsLoaded = true;
      // Build valid shirt entries once: shirt = 1 column × 4 rows (8×32), use only top 8×8 as representative.
      try {
        var TILE = 8;
        var COLS = Math.floor(shirts.naturalWidth / TILE); // 256/8 = 32
        var GROUP_H = 4 * TILE; // 32px
        var GROUPS = Math.floor(shirts.naturalHeight / GROUP_H); // 608/32 = 19

        var off = document.createElement('canvas');
        off.width = shirts.naturalWidth;
        off.height = shirts.naturalHeight;
        var octx = off.getContext('2d');
        if (octx) {
          octx.imageSmoothingEnabled = false;
          octx.clearRect(0, 0, off.width, off.height);
          octx.drawImage(shirts, 0, 0);
          validShirtEntries = [];

          for (var gr = 0; gr < GROUPS; gr++) {
            for (var tx = 0; tx < COLS; tx++) {
              var sx = tx * TILE;
              var sy = gr * GROUP_H; // representative tile at top row
              var data = octx.getImageData(sx, sy, TILE, TILE).data;
              var allBlack = true;
              for (var p = 0; p < data.length; p += 4) {
                if (data[p] !== 0 || data[p + 1] !== 0 || data[p + 2] !== 0) {
                  allBlack = false;
                  break;
                }
              }
              if (!allBlack) validShirtEntries.push({ sx: sx, sy: sy });
            }
          }
        }
      } catch (e) {}
      render();
    };
    shirts.onerror = function () { shirtsLoaded = false; validShirtEntries = []; render(); };
    shirts.src = shirtsAbs;

    // Fixed character preview for non-emoji themes (20×20).
    // Source: farmers base + arms (precomposited) preview asset.
    var farmerLoaded = false;
    var farmerSprite = null; // 20×20 offscreen canvas
    var farmer = new Image();
    farmer.decoding = 'async';
    var farmerAbs = resolveUrl('../farmer/farmers_r1c0_base_arms_preview_20x20.png', spriteAbs);
    farmer.onload = function () {
      try {
        var out = document.createElement('canvas');
        out.width = 20;
        out.height = 20;
        var octx = out.getContext('2d');
        if (!octx) return;
        octx.imageSmoothingEnabled = false;
        octx.clearRect(0, 0, 20, 20);
        octx.drawImage(farmer, 0, 0, 20, 20, 0, 0, 20, 20);

        farmerSprite = out;
        farmerLoaded = true;
        render();
      } catch (e) {}
    };
    farmer.onerror = function () { farmerLoaded = false; farmerSprite = null; render(); };
    farmer.src = farmerAbs;

    var accs = new Image();
    accs.decoding = 'async';
    var accsLoaded = false;
    var validAccEntries = [];
    var accsAbs = resolveUrl('../farmer/accs_128x128.png', spriteAbs);
    accs.onload = function () {
      accsLoaded = true;
      // accs: 1 column × 2 rows (16×32), use only top 16×16 as representative.
      try {
        var TILE = 16;
        var COLS = Math.floor(accs.naturalWidth / TILE); // 128/16 = 8
        var GROUP_H = 2 * TILE; // 32px
        var GROUPS = Math.floor(accs.naturalHeight / GROUP_H); // 128/32 = 4

        var off = document.createElement('canvas');
        off.width = accs.naturalWidth;
        off.height = accs.naturalHeight;
        var octx = off.getContext('2d');
        if (octx) {
          octx.imageSmoothingEnabled = false;
          octx.clearRect(0, 0, off.width, off.height);
          octx.drawImage(accs, 0, 0);
          validAccEntries = [];

          for (var gr = 0; gr < GROUPS; gr++) {
            for (var tx = 0; tx < COLS; tx++) {
              var sx = tx * TILE;
              var sy = gr * GROUP_H; // representative tile at top row
              var data = octx.getImageData(sx, sy, TILE, TILE).data;
              var allBlack = true;
              var allTransparent = true;
              for (var p = 0; p < data.length; p += 4) {
                var r = data[p];
                var g = data[p + 1];
                var b = data[p + 2];
                var a = data[p + 3];
                if (r !== 0 || g !== 0 || b !== 0) allBlack = false;
                if (a !== 0) allTransparent = false;
                if (!allBlack && !allTransparent) break;
              }
              if (!(allBlack || allTransparent)) validAccEntries.push({ sx: sx, sy: sy });
            }
          }
        }
      } catch (e) {}
      render();
    };
    accs.onerror = function () { accsLoaded = false; validAccEntries = []; render(); };
    accs.src = accsAbs;

    var hats = new Image();
    hats.decoding = 'async';
    var hatsLoaded = false;
    var validHatEntries = [];
    var hatsKeyed = null; // offscreen canvas with black treated as transparent
    var hatsAbs = resolveUrl('../farmer/hats_480×320_r4c24.png', spriteAbs);
    hats.onload = function () {
      hatsLoaded = true;
      // hats: 1 column × 4 rows (20×80), use only top 20×20 as representative.
      // Grid area: 320×480 from (0,0) => COLS=16, GROUPS=6
      try {
        var TILE = 20;
        var COLS = 24; // 480/20
        var GROUP_H = 4 * TILE; // 80px
        var GROUPS = 12; // 320/80

        var off = document.createElement('canvas');
        off.width = hats.naturalWidth;
        off.height = hats.naturalHeight;
        var octx = off.getContext('2d');
        if (octx) {
          octx.imageSmoothingEnabled = false;
          octx.clearRect(0, 0, off.width, off.height);
          octx.drawImage(hats, 0, 0);

          // Key out black background -> transparent, but preserve internal black outlines.
          // Strategy: flood-fill from image borders through pure-black pixels, and only
          // clear alpha for those border-connected pixels.
          try {
            var imgd = octx.getImageData(0, 0, off.width, off.height);
            var d = imgd.data;
            var w = off.width | 0;
            var h = off.height | 0;
            var seen = new Uint8Array(w * h);
            var qx = new Int32Array(w * h);
            var qy = new Int32Array(w * h);
            var qh = 0, qt = 0;

            function isBlackAt(x, y) {
              var idx = (y * w + x) * 4;
              return d[idx] === 0 && d[idx + 1] === 0 && d[idx + 2] === 0;
            }

            function push(x, y) {
              var p = y * w + x;
              if (seen[p]) return;
              if (!isBlackAt(x, y)) return;
              seen[p] = 1;
              qx[qt] = x;
              qy[qt] = y;
              qt++;
            }

            // seed from borders
            for (var x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
            for (var y = 0; y < h; y++) { push(0, y); push(w - 1, y); }

            while (qh < qt) {
              var x0 = qx[qh];
              var y0 = qy[qh];
              qh++;
              if (x0 > 0) push(x0 - 1, y0);
              if (x0 + 1 < w) push(x0 + 1, y0);
              if (y0 > 0) push(x0, y0 - 1);
              if (y0 + 1 < h) push(x0, y0 + 1);
            }

            // clear alpha for border-connected black pixels only
            for (var p = 0; p < seen.length; p++) {
              if (!seen[p]) continue;
              d[p * 4 + 3] = 0;
            }
            octx.putImageData(imgd, 0, 0);
          } catch (e2) {}
          hatsKeyed = off;
          validHatEntries = [];

          for (var gr = 0; gr < GROUPS; gr++) {
            for (var tx = 0; tx < COLS; tx++) {
              var sx = tx * TILE;
              var sy = gr * GROUP_H; // representative tile at top row
              var data = octx.getImageData(sx, sy, TILE, TILE).data;
              var allBlack = true;
              var allTransparent = true;
              for (var p = 0; p < data.length; p += 4) {
                var r = data[p];
                var g = data[p + 1];
                var b = data[p + 2];
                var a = data[p + 3];
                if (r !== 0 || g !== 0 || b !== 0) allBlack = false;
                if (a !== 0) allTransparent = false;
                if (!allBlack && !allTransparent) break;
              }
              if (!(allBlack || allTransparent)) validHatEntries.push({ sx: sx, sy: sy });
            }
          }
        }
      } catch (e) {}
      render();
    };
    hats.onerror = function () { hatsLoaded = false; validHatEntries = []; render(); };
    hats.src = hatsAbs;

    var hairs = new Image();
    hairs.decoding = 'async';
    var hairsLoaded = false;
    /** @type {HTMLCanvasElement[]} */
    var validHairTiles = [];
    var hairsAbs = resolveUrl('../farmer/hairs.png', spriteAbs);
    hairs.onload = function () {
      hairsLoaded = true;
      validHairTiles = [];
      try {
        var TILE_W = 16;
        var TILE_H = 32;
        var W = hairs.naturalWidth;
        var H = hairs.naturalHeight;
        var midX = Math.floor(W / 2);
        var off = document.createElement('canvas');
        off.width = W;
        off.height = H;
        var octx = off.getContext('2d');
        if (!octx) return;
        octx.imageSmoothingEnabled = false;
        octx.clearRect(0, 0, W, H);
        octx.drawImage(hairs, 0, 0);

        function repIsEmpty(sx, sy) {
          var data = octx.getImageData(sx, sy, TILE_W, TILE_H).data;
          var allBlack = true;
          var allTransparent = true;
          for (var p = 0; p < data.length; p += 4) {
            var r = data[p];
            var g = data[p + 1];
            var b = data[p + 2];
            var a = data[p + 3];
            if (r !== 0 || g !== 0 || b !== 0) allBlack = false;
            if (a !== 0) allTransparent = false;
            if (!allBlack && !allTransparent) break;
          }
          return allBlack || allTransparent;
        }

        function buildHairIcon20(sx, sy) {
          var tmp = document.createElement('canvas');
          tmp.width = 20;
          tmp.height = 32;
          var tctx = tmp.getContext('2d');
          if (!tctx) return null;
          tctx.imageSmoothingEnabled = false;
          tctx.clearRect(0, 0, 20, 32);
          tctx.drawImage(hairs, sx, sy, TILE_W, TILE_H, 2, 0, TILE_W, TILE_H);
          var out = document.createElement('canvas');
          out.width = 20;
          out.height = 20;
          var o2 = out.getContext('2d');
          if (!o2) return null;
          o2.imageSmoothingEnabled = false;
          o2.clearRect(0, 0, 20, 20);
          o2.drawImage(tmp, 0, 0, 20, 20, 0, 0, 20, 20);
          return out;
        }

        // Left half: 1 col × 3 rows per hair (96px stride). Right half: 4 rows (128px).
        for (var cx = 0; cx + TILE_W <= midX; cx += TILE_W) {
          for (var sy = 0; sy + TILE_H <= H; sy += 3 * TILE_H) {
            if (!repIsEmpty(cx, sy)) {
              var cL = buildHairIcon20(cx, sy);
              if (cL) validHairTiles.push(cL);
            }
          }
        }
        for (var cx2 = midX; cx2 + TILE_W <= W; cx2 += TILE_W) {
          for (var sy2 = 0; sy2 + TILE_H <= H; sy2 += 4 * TILE_H) {
            if (!repIsEmpty(cx2, sy2)) {
              var cR = buildHairIcon20(cx2, sy2);
              if (cR) validHairTiles.push(cR);
            }
          }
        }
      } catch (e) {}
      render();
    };
    hairs.onerror = function () { hairsLoaded = false; validHairTiles = []; render(); };
    hairs.src = hairsAbs;

    var state = {
      scrollX: 0,
      btnIndex: 0,
      emojiIndexOffset: 0,
      emojiScrollX: 0,
      shirtIndexOffset: 0,
      accIndexOffset: 0,
      hatIndexOffset: 0,
      hairIndexOffset: 0,
      equippedShirtIndex: -1,
      equippedAccIndex: -1,
      equippedHatIndex: -1,
      equippedHairIndex: -1,
      theme: 'emoji',
      loaded: false,
      animating: false,
      animTimer: 0
    };

    // Theme buttons to the left of the rullet; both centered as one group on the canvas.
    var themeStackH = THEME_BTN.count * THEME_BTN.h + (THEME_BTN.count - 1) * THEME_BTN.gapY;
    var groupW = THEME_BTN.w + THEME_BTN.gapXR + RECTS.rullet.w;
    var groupH = Math.max(themeStackH, RECTS.rullet.h);
    var groupOriginX = Math.round((SPRITE_W - groupW) / 2);
    var groupOriginY = Math.round((SPRITE_H - groupH) / 2);
    var themePadY = Math.floor((groupH - themeStackH) / 2);
    var rulletPadY = Math.floor((groupH - RECTS.rullet.h) / 2);
    var themeFirstY = groupOriginY + themePadY;

    // Sprite coords + this translate = canvas; places rullet to the right of the button column.
    var viewOffset = {
      x: groupOriginX + THEME_BTN.w + THEME_BTN.gapXR - RECTS.rullet.x,
      y: groupOriginY + rulletPadY - RECTS.rullet.y
    };

    function toViewRect(r) {
      return { x: r.x + viewOffset.x, y: r.y + viewOffset.y, w: r.w, h: r.h };
    }

    function render() {
      ctx.clearRect(0, 0, SPRITE_W, SPRITE_H);
      if (!state.loaded) return;

      // Theme buttons to the left of the rullet (outside the rullet clip).
      var themeRects = drawThemeButtons(ctx, state.theme, groupOriginX, themeFirstY);

      // 3) rullet 영역 밖은 보이면 안 됨 → rullet 영역만 렌더
      // (리스트/버튼은 rullet 안에 있고, 소스는 스프라이트 어디든 가능)
      ctx.save();
      ctx.translate(viewOffset.x, viewOffset.y);
      ctx.beginPath();
      ctx.rect(RECTS.rullet.x, RECTS.rullet.y, RECTS.rullet.w, RECTS.rullet.h);
      ctx.clip();

      // list_bg (behind the frame)
      drawTiled(ctx, img, RECTS.list_bg, RECTS.rullet_list, state.scrollX);

      // Fixed character preview in the left slot for non-emoji themes.
      if (farmerLoaded && farmerSprite && state.theme !== 'emoji') {
        ctx.save();
        ctx.beginPath();
        ctx.rect(RECTS.rullet_list.x, RECTS.rullet_list.y, RECTS.rullet_list.w, RECTS.rullet_list.h);
        ctx.clip();
        var PITCH = 22;
        var cx0 = RECTS.rullet_list.x + RECTS.rullet_list.w / 2 - PITCH;
        var cy0 = RECTS.rullet_list.y + RECTS.rullet_list.h / 2;
        var fx = Math.round(cx0 - 10);
        var fy = Math.round(cy0 - 10);
        ctx.drawImage(farmerSprite, fx, fy);

        // Equipped overlays persist across theme toggles (except emoji).
        // Draw order: shirt -> hair -> accs -> hat (hat on top).
        if (shirtsLoaded && validShirtEntries && validShirtEntries.length && state.equippedShirtIndex >= 0) {
          var eShirt = validShirtEntries[mod(state.equippedShirtIndex, validShirtEntries.length)];
          // Shirt start pos is relative to 20×20 character: (6,15).
          ctx.drawImage(shirts, eShirt.sx, eShirt.sy, 8, 8, fx + 6, fy + 15, 8, 8);
        }
        if (hairsLoaded && validHairTiles && validHairTiles.length && state.equippedHairIndex >= 0) {
          var eHair = validHairTiles[mod(state.equippedHairIndex, validHairTiles.length)];
          ctx.drawImage(eHair, fx + 0, fy + 0);
        }
        if (accsLoaded && validAccEntries && validAccEntries.length && state.equippedAccIndex >= 0) {
          var eAcc = validAccEntries[mod(state.equippedAccIndex, validAccEntries.length)];
          // 16×16 centered inside 20×20 => (2,2)
          ctx.drawImage(accs, eAcc.sx, eAcc.sy, 16, 16, fx + 2, fy + 2, 16, 16);
        }
        if (hatsLoaded && validHatEntries && validHatEntries.length && state.equippedHatIndex >= 0) {
          var eHat = validHatEntries[mod(state.equippedHatIndex, validHatEntries.length)];
          var hatsSrc = hatsKeyed || hats;
          // 20×20 aligned to character top-left by default (0,0).
          ctx.drawImage(hatsSrc, eHat.sx, eHat.sy, 20, 20, fx + 0, fy + 0, 20, 20);
        }
        ctx.restore();
      }

      // theme overlay (inside rullet_list clip)
      if (state.theme === 'shirt') {
        if (shirtsLoaded) drawShirtStrip(ctx, shirts, RECTS.rullet_list, validShirtEntries, state.shirtIndexOffset, state.emojiScrollX);
      } else if (state.theme === 'accs') {
        if (accsLoaded) drawAccStrip(ctx, accs, RECTS.rullet_list, validAccEntries, state.accIndexOffset, state.emojiScrollX);
      } else if (state.theme === 'hat') {
        if (hatsLoaded) drawHatStrip(ctx, hatsKeyed || hats, RECTS.rullet_list, validHatEntries, state.hatIndexOffset, state.emojiScrollX);
      } else if (state.theme === 'hair') {
        if (hairsLoaded) drawHairStrip(ctx, validHairTiles, RECTS.rullet_list, state.hairIndexOffset, state.emojiScrollX);
      } else {
        if (emojisLoaded) drawEmojiStrip(ctx, emojis, RECTS.rullet_list, state.emojiIndexOffset, state.emojiScrollX);
      }

      // rullet frame/base (on top)
      ctx.drawImage(
        img,
        RECTS.rullet.x, RECTS.rullet.y, RECTS.rullet.w, RECTS.rullet.h,
        RECTS.rullet.x, RECTS.rullet.y, RECTS.rullet.w, RECTS.rullet.h
      );

      // button overlay
      var btnSrc = BTN_CYCLE[clamp(state.btnIndex, 0, BTN_CYCLE.length - 1)];
      ctx.drawImage(
        img,
        btnSrc.x, btnSrc.y, btnSrc.w, btnSrc.h,
        RECTS.rullet_btn.x, RECTS.rullet_btn.y, RECTS.rullet_btn.w, RECTS.rullet_btn.h
      );

      ctx.restore();
    }

    function runBtnAnimation() {
      // 1) 클릭 1번으로 전체 사이클이 연속적으로 지나가야 함
      // btn1 → btn2 → btn3 → btn2 → btn1
      if (state.animating) return;
      state.animating = true;
      // 2) list_bg는 버튼 단계와 동기화된 왕복(0 → 22 → 0)
      //    5단계(btn1→btn2→btn3→btn2→btn1)에 맞춰 0,11,22,11,0 으로 이동

      var steps = [0, 1, 2, 3, 4];
      var i = 0;
      var scrollSteps = [0, 6, 11, 17, 22];

      function tick() {
        // i: 0..4 (총 5스텝). 요청 스텝: 0→6→11→17→22
        state.scrollX = scrollSteps[clamp(i, 0, scrollSteps.length - 1)];
        state.emojiScrollX = state.scrollX;
        state.btnIndex = steps[i];
        // Button click steps emoji list by 1 per click (not per animation frame)
        render();
        i++;
        if (i >= steps.length) {
          state.animating = false;
          state.btnIndex = 0;
          state.scrollX = 0;
          state.emojiScrollX = 0;
          return;
        }
        state.animTimer = window.setTimeout(tick, 70);
      }

      // start immediately
      if (state.theme === 'shirt') {
        var len = validShirtEntries && validShirtEntries.length ? validShirtEntries.length : 0;
        if (len) {
          state.shirtIndexOffset = (state.shirtIndexOffset + 1) % len;
          state.equippedShirtIndex = state.shirtIndexOffset;
        }
      } else if (state.theme === 'accs') {
        var lenA = validAccEntries && validAccEntries.length ? validAccEntries.length : 0;
        if (lenA) {
          state.accIndexOffset = (state.accIndexOffset + 1) % lenA;
          state.equippedAccIndex = state.accIndexOffset;
        }
      } else if (state.theme === 'hat') {
        var lenH = validHatEntries && validHatEntries.length ? validHatEntries.length : 0;
        if (lenH) {
          state.hatIndexOffset = (state.hatIndexOffset + 1) % lenH;
          state.equippedHatIndex = state.hatIndexOffset;
        }
      } else if (state.theme === 'hair') {
        var lenHr = validHairTiles && validHairTiles.length ? validHairTiles.length : 0;
        if (lenHr) {
          state.hairIndexOffset = (state.hairIndexOffset + 1) % lenHr;
          state.equippedHairIndex = state.hairIndexOffset;
        }
      } else {
        state.emojiIndexOffset = (state.emojiIndexOffset + 1) % (14 * 14);
      }
      tick();
    }

    function onPointerDown(e) {
      var p = getCanvasPoint(canvas, e);
      // Theme switch buttons (canvas coords)
      var themeRects = getThemeButtonRects(groupOriginX, themeFirstY);
      if (inRect(p, themeRects.emoji)) {
        state.theme = 'emoji';
        render();
        return;
      }
      if (inRect(p, themeRects.shirt)) {
        state.theme = 'shirt';
        render();
        return;
      }
      if (inRect(p, themeRects.accs)) {
        state.theme = 'accs';
        render();
        return;
      }
      if (inRect(p, themeRects.hat)) {
        state.theme = 'hat';
        render();
        return;
      }
      if (inRect(p, themeRects.hair)) {
        state.theme = 'hair';
        render();
        return;
      }
      var btnRect = toViewRect(RECTS.rullet_btn);
      if (inRect(p, btnRect)) {
        runBtnAnimation();
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown);

    function onPointerMove(e) {
      var p = getCanvasPoint(canvas, e);
      // Pointer cursor on theme buttons or rullet button hitbox.
      var themeRects = getThemeButtonRects(groupOriginX, themeFirstY);
      if (inRect(p, themeRects.emoji) || inRect(p, themeRects.shirt) || inRect(p, themeRects.accs) || inRect(p, themeRects.hat) || inRect(p, themeRects.hair)) {
        canvas.style.cursor = 'pointer';
        return;
      }
      var btnRect = toViewRect(RECTS.rullet_btn);
      canvas.style.cursor = inRect(p, btnRect) ? 'pointer' : '';
    }
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', function () { canvas.style.cursor = ''; });

    img.onload = function () {
      state.loaded = true;
      render();
    };
    img.onerror = function () {
      state.loaded = false;
      render();
    };
    img.src = spriteSrc;

    return { render: render, state: state, canvas: canvas };
  }

  // Optional init hook for the main site PJAX loader.
  window.initPxRulletPage = function () { try { boot(); } catch (e) {} };

  function boot() {
    var root = document.querySelector('[data-pxrullet-root]');
    if (!root) return;
    if (root.dataset.pxrulletInited === '1') return;
    root.dataset.pxrulletInited = '1';
    createRenderer(root);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

