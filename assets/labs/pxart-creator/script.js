/**
 * pxart-creator — layered sprite preview (vanilla JS, no modules for file:// safety).
 *
 * Sections: CONSTANTS → state → assets → render → UI → extras
 */

(function () {
  "use strict";

  // --- CONSTANTS ---
  var FRAME_W = 16;
  var FRAME_H = 32;
  var COLS = 4;
  var CANVAS_W = 64;
  var CANVAS_H = 128;
  /** Draw order: back → front */
  var LAYER_ORDER = ["body", "shirt", "hair", "hat"];
  var ANIM_MS = 200;

  /** Character-Backgrounds.png: 가로로 이어 붙인 패널 N개(기본 2), 각 패널 너비 = 시트너비/N */
  var BG_SHEET_URL = "./assets/background/Character-Backgrounds.png";
  var BG_PANEL_COUNT = 2;

  /** direction index = sheet row: 0 down, 1 left, 2 right, 3 up */
  var VARIANTS = ["01", "02"];

  // --- STATE ---
  var state = {
    direction: 0,
    frame: 0,
    selections: {
      body: "01",
      hair: "01",
      shirt: "01",
      hat: "01",
    },
    animOn: false,
    /** "none" | "0" | "1" — which half of Character-Backgrounds.png */
    background: "none",
    /** true면 body~hat 레이어는 그리지 않음 (배경만) */
    hideCharacter: false,
    /** @type {Record<string, HTMLImageElement|null>} null = failed load */
    images: {},
    /** keys that failed for current build */
    loadErrors: {},
    animTimer: null,
  };

  var canvas = document.getElementById("view");
  var ctx = canvas.getContext("2d");
  var missingBanner = document.getElementById("missing-banner");

  function assetUrl(layer, variant) {
    return "./assets/" + layer + "/" + layer + "_" + variant + ".png";
  }

  function imageKey(layer, variant) {
    return layer + "_" + variant;
  }

  // --- ASSET LOADING ---
  function loadImage(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        resolve(img);
      };
      img.onerror = function () {
        resolve(null);
      };
      img.src = url;
    });
  }

  function preloadAll() {
    var tasks = [];
    LAYER_ORDER.forEach(function (layer) {
      VARIANTS.forEach(function (v) {
        var url = assetUrl(layer, v);
        var key = imageKey(layer, v);
        tasks.push(
          loadImage(url).then(function (img) {
            state.images[key] = img;
            if (!img) state.loadErrors[key] = true;
            else delete state.loadErrors[key];
          })
        );
      });
    });
    tasks.push(
      loadImage(BG_SHEET_URL).then(function (img) {
        state.images.bg_sheet = img;
        if (!img) state.loadErrors.bg_sheet = true;
        else delete state.loadErrors.bg_sheet;
      })
    );
    return Promise.all(tasks);
  }

  function updateMissingBanner() {
    var keys = LAYER_ORDER.map(function (layer) {
      return imageKey(layer, state.selections[layer]);
    });
    var anyMissing =
      !state.hideCharacter &&
      keys.some(function (k) {
        return state.images[k] === null;
      });
    var bgWanted = state.background !== "none";
    var bgMissing = bgWanted && state.images.bg_sheet === null;
    missingBanner.hidden = !anyMissing && !bgMissing;
    if (anyMissing && bgMissing) {
      missingBanner.textContent = "missing asset (layers + background)";
    } else if (bgMissing) {
      missingBanner.textContent = "missing asset (background)";
    } else if (anyMissing) {
      missingBanner.textContent = "missing asset";
    }
  }

  // --- RENDER ---
  /**
   * Character-Backgrounds 시트에서 패널 하나를 잘라 논리 캔버스 전체에 맞춤.
   * 패널 폭 = naturalWidth / BG_PANEL_COUNT, 높이 = 시트 전체 높이.
   */
  function drawBackground(targetCtx) {
    if (state.background === "none") return;
    var sheet = state.images.bg_sheet;
    if (!sheet || !sheet.naturalWidth) return;
    var idx = Number(state.background);
    if (idx < 0 || idx >= BG_PANEL_COUNT) return;
    var pw = Math.floor(sheet.naturalWidth / BG_PANEL_COUNT);
    var ph = sheet.naturalHeight;
    var sx = idx * pw;
    targetCtx.imageSmoothingEnabled = false;
    targetCtx.drawImage(sheet, sx, 0, pw, ph, 0, 0, CANVAS_W, CANVAS_H);
  }

  /**
   * Character layers only (no clear). Source rect: sx = frame * 16, sy = direction * 32.
   */
  function drawCharacterLayers(targetCtx, direction, frame) {
    targetCtx.imageSmoothingEnabled = false;
    var sx = frame * FRAME_W;
    var sy = direction * FRAME_H;

    LAYER_ORDER.forEach(function (layer) {
      var key = imageKey(layer, state.selections[layer]);
      var img = state.images[key];
      if (!img) return;
      targetCtx.drawImage(
        img,
        sx,
        sy,
        FRAME_W,
        FRAME_H,
        0,
        0,
        CANVAS_W,
        CANVAS_H
      );
    });
  }

  /** Full scene: optional backdrop + layers (used by canvas + export). */
  function drawScene(targetCtx, direction, frame) {
    targetCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    drawBackground(targetCtx);
    if (!state.hideCharacter) {
      drawCharacterLayers(targetCtx, direction, frame);
    }
  }

  function render() {
    drawScene(ctx, state.direction, state.frame);
    updateMissingBanner();
  }

  // --- UI BINDING ---
  function setActiveDirButtons() {
    var wrap = document.getElementById("dir-buttons");
    wrap.querySelectorAll("button").forEach(function (btn) {
      btn.classList.toggle("active", Number(btn.getAttribute("data-dir")) === state.direction);
    });
  }

  function setActiveFrameButtons() {
    var wrap = document.getElementById("frame-buttons");
    wrap.querySelectorAll("button").forEach(function (btn) {
      btn.classList.toggle("active", Number(btn.getAttribute("data-frame")) === state.frame);
    });
  }

  function fillSelect(id, layer) {
    var sel = document.getElementById(id);
    sel.innerHTML = "";
    VARIANTS.forEach(function (v) {
      var opt = document.createElement("option");
      opt.value = v;
      opt.textContent = layer + " " + v;
      sel.appendChild(opt);
    });
    sel.value = state.selections[layer];
  }

  function applyScale() {
    var s4 = document.getElementById("scale-4");
    if (s4.checked) {
      canvas.classList.add("scale-4");
    } else {
      canvas.classList.remove("scale-4");
    }
  }

  function stopAnim() {
    if (state.animTimer) {
      clearInterval(state.animTimer);
      state.animTimer = null;
    }
  }

  function startAnim() {
    stopAnim();
    state.animTimer = setInterval(function () {
      state.frame = (state.frame + 1) % COLS;
      setActiveFrameButtons();
      render();
    }, ANIM_MS);
  }

  function wireUi() {
    document.getElementById("dir-buttons").addEventListener("click", function (e) {
      var t = e.target;
      if (t.tagName !== "BUTTON") return;
      state.direction = Number(t.getAttribute("data-dir"));
      setActiveDirButtons();
      render();
    });

    document.getElementById("frame-buttons").addEventListener("click", function (e) {
      var t = e.target;
      if (t.tagName !== "BUTTON") return;
      state.frame = Number(t.getAttribute("data-frame"));
      setActiveFrameButtons();
      render();
    });

    [["sel-body", "body"], ["sel-hair", "hair"], ["sel-shirt", "shirt"], ["sel-hat", "hat"]].forEach(
      function (pair) {
        var id = pair[0];
        var layer = pair[1];
        fillSelect(id, layer);
        document.getElementById(id).addEventListener("change", function (e) {
          state.selections[layer] = e.target.value;
          render();
        });
      }
    );

    document.getElementById("sel-background").value = state.background;
    document.getElementById("sel-background").addEventListener("change", function (e) {
      state.background = e.target.value;
      render();
    });

    var hideCh = document.getElementById("toggle-hide-character");
    hideCh.checked = state.hideCharacter;
    hideCh.addEventListener("change", function (e) {
      state.hideCharacter = e.target.checked;
      render();
    });

    document.getElementById("toggle-anim").addEventListener("change", function (e) {
      state.animOn = e.target.checked;
      if (state.animOn) startAnim();
      else stopAnim();
    });

    document.querySelectorAll('input[name="scale"]').forEach(function (radio) {
      radio.addEventListener("change", applyScale);
    });

    document.getElementById("btn-export").addEventListener("click", exportPng);
    document.getElementById("btn-random").addEventListener("click", randomize);

    document.addEventListener("keydown", function (e) {
      var map = { ArrowDown: 0, ArrowLeft: 1, ArrowRight: 2, ArrowUp: 3 };
      if (map.hasOwnProperty(e.key)) {
        e.preventDefault();
        state.direction = map[e.key];
        setActiveDirButtons();
        render();
      }
    });

    setActiveDirButtons();
    setActiveFrameButtons();
    applyScale();
  }

  // --- EXTRAS ---
  var SELECT_IDS = { body: "sel-body", hair: "sel-hair", shirt: "sel-shirt", hat: "sel-hat" };

  function randomize() {
    LAYER_ORDER.forEach(function (layer) {
      var v = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
      state.selections[layer] = v;
      document.getElementById(SELECT_IDS[layer]).value = v;
    });
    render();
  }

  function exportPng() {
    var out = document.createElement("canvas");
    out.width = CANVAS_W;
    out.height = CANVAS_H;
    var octx = out.getContext("2d");
    drawScene(octx, state.direction, state.frame);
    out.toBlob(function (blob) {
      if (!blob) return;
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "character-" + state.direction + "-" + state.frame + ".png";
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  // --- BOOT ---
  preloadAll().then(function () {
    wireUi();
    render();
  });
})();
