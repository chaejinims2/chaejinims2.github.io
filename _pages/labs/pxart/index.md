---
layout: page
title: Pixer Art Character Generator
intro: |
  This is a Pixer Art Character Generator.
tags:
  - pxart
  - labs
  - dark-ui
---

<div class="pxart-embed-wrap" markdown="0">
  <iframe
    class="pxart-embed-frame"
    title="Pixel character preview"
    src="{{ site.baseurl }}/assets/labs/pxart-creator/index.html"
    loading="lazy"
    referrerpolicy="strict-origin-when-cross-origin"
  ></iframe>
  <p class="pxart-embed-link">
    <a href="{{ site.baseurl }}/assets/labs/pxart-creator/index.html" target="_blank" rel="noopener noreferrer">Open preview in a new tab</a>
    (works offline when opened as a local file from the repo).
  </p>
</div>

<style>
  .pxart-embed-wrap {
    margin-top: 1rem;
  }
  .pxart-embed-frame {
    display: block;
    width: 100%;
    max-width: 960px;
    min-height: 640px;
    border: 1px solid var(--border-default, #2e3440);
    border-radius: 8px;
    background: #121418;
  }
  .pxart-embed-link {
    margin-top: 0.75rem;
    font-size: 0.9rem;
  }
</style>