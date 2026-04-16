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

    var state = {
      scrollX: 0,
      btnIndex: 0,
      emojiIndexOffset: 0,
      emojiScrollX: 0,
      loaded: false,
      animating: false,
      animTimer: 0
    };

    // Center the rullet window inside the 256x256 canvas.
    // We render everything in sprite coords but apply a single translate().
    var viewOffset = {
      x: Math.round((SPRITE_W - RECTS.rullet.w) / 2 - RECTS.rullet.x),
      y: Math.round((SPRITE_H - RECTS.rullet.h) / 2 - RECTS.rullet.y)
    };

    function toViewRect(r) {
      return { x: r.x + viewOffset.x, y: r.y + viewOffset.y, w: r.w, h: r.h };
    }

    function render() {
      ctx.clearRect(0, 0, SPRITE_W, SPRITE_H);
      if (!state.loaded) return;

      // 3) rullet 영역 밖은 보이면 안 됨 → rullet 영역만 렌더
      // (리스트/버튼은 rullet 안에 있고, 소스는 스프라이트 어디든 가능)
      ctx.save();
      ctx.translate(viewOffset.x, viewOffset.y);
      ctx.beginPath();
      ctx.rect(RECTS.rullet.x, RECTS.rullet.y, RECTS.rullet.w, RECTS.rullet.h);
      ctx.clip();

      // list_bg (behind the frame)
      drawTiled(ctx, img, RECTS.list_bg, RECTS.rullet_list, state.scrollX);

      // emojis overlay (inside rullet_list clip)
      if (emojisLoaded) drawEmojiStrip(ctx, emojis, RECTS.rullet_list, state.emojiIndexOffset, state.emojiScrollX);

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
      state.emojiIndexOffset = (state.emojiIndexOffset + 1) % (14 * 14);
      tick();
    }

    function onPointerDown(e) {
      var p = getCanvasPoint(canvas, e);
      var btnRect = toViewRect(RECTS.rullet_btn);
      if (inRect(p, btnRect)) {
        runBtnAnimation();
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown);

    function onPointerMove(e) {
      var p = getCanvasPoint(canvas, e);
      // Pointer cursor only on the button hitbox.
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

