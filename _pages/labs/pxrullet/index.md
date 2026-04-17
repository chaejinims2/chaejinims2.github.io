---
layout: page
title: Pixel Rullet
intro: |
  This is a Pixel Rullet.
tags:
  - pxrullet
  - labs
  - dark-ui
---

<style>
  .pxrullet-root {
    --pxrullet-scale: 3;
    display: flex;
    justify-content: center;
    padding: 16px 0 32px;
  }
  .pxrullet-canvas {
    width: calc(256px * var(--pxrullet-scale));
    height: calc(256px * var(--pxrullet-scale));
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    background: transparent;
  }
  @media (max-width: 420px) {
    .pxrullet-root { --pxrullet-scale: 2; }
  }
</style>

<div class="pxrullet-root" data-pxrullet-root>
  <canvas class="pxrullet-canvas" width="256" height="256" aria-label="Pixel rullet"></canvas>
</div>

<script>
  (function () {
    // Page-only loader (like pxart-creator): only runs on this page.
    function boot() {
      var root = document.querySelector('[data-pxrullet-root]');
      if (!root) return;
      if (window.__pxrulletInlineLoading) return;
      window.__pxrulletInlineLoading = true;
      var s = document.createElement('script');
      // Use static layout on GitHub Pages by default (no external API dependency).
      s.src = "{{ '/assets/labs/pxart-rullet/rullet-entry.js?static=1' | relative_url }}";
      s.onload = function () { window.__pxrulletInlineLoading = false; };
      s.onerror = function () { window.__pxrulletInlineLoading = false; };
      document.body.appendChild(s);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  })();
</script>
