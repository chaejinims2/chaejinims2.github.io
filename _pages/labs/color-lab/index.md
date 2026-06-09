---
layout: page
title: Color Lab
intro: |
  HEX converter and palette generator (vanilla JS lab).
tags:
  - color
  - labs
  - tools
---

<style>
  /* Lab host: size only; colors live in assets/labs/color-lab/style.css */
  .color-lab-host {
    max-width: 1100px;
    margin: 0 auto;
    height: min(72dvh, 640px);
    min-height: 420px;
    color: #1a1a1e;
  }
</style>

<div class="color-lab-host" data-color-lab-root aria-label="Color Lab"></div>

<script src="{{ '/assets/labs/color-lab/color-lab-entry.js?static=1' | relative_url }}"></script>
