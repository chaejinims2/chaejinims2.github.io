/* global window, document */
(function () {
  'use strict';

  var __LOADER_SRC__ = (document.currentScript && document.currentScript.src) ? document.currentScript.src : '';

  function resolveAsset(rel) {
    try { return new URL(rel, __LOADER_SRC__ || window.location.href).href; } catch (e) { return rel; }
  }

  function ensureCss(href) {
    if (document.querySelector('link[data-pxart-typo-css]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-pxart-typo-css', '1');
    document.head.appendChild(link);
  }

  function applyFontmapFromRoot(root) {
    try { delete window.__PXART_TYPO_FONTMAP_URL__; } catch (e0) { /* ignore */ }
    var dl = (root.getAttribute('data-fontmap') || '').trim();
    if (!dl) {
      try {
        var sp = new URL(__LOADER_SRC__ || window.location.href).searchParams;
        if (sp.get('fontmap')) dl = sp.get('fontmap');
      } catch (e1) { /* ignore */ }
    }
    if (!dl) {
      try {
        var pq = new URLSearchParams(window.location.search || '');
        if (pq.get('fontmap')) dl = pq.get('fontmap');
      } catch (e2) { /* ignore */ }
    }
    if (dl) {
      try { window.__PXART_TYPO_FONTMAP_URL__ = new URL(dl, window.location.href).href; }
      catch (e3) { window.__PXART_TYPO_FONTMAP_URL__ = dl; }
    } else {
      try {
        var sp2 = new URL(__LOADER_SRC__ || '').searchParams;
        if (sp2.get('static') === '1') window.__PXART_TYPO_FONTMAP_URL__ = resolveAsset('./fontmap.json');
      } catch (e4) { /* ignore */ }
    }
  }

  function loadViewer(root) {
    if (!root) return;
    window.__PXART_TYPO_EMBED_ROOT__ = root;
    if (window.pxartTypoBoot) { window.pxartTypoBoot(root); return; }
    if (document.querySelector('script[data-pxart-typo-bundle]')) return;
    var s = document.createElement('script');
    s.src = resolveAsset('./viewer.js');
    s.async = true;
    s.setAttribute('data-pxart-typo-bundle', '1');
    s.onerror = function () { console.error('pxart-typo: failed to load viewer.js'); };
    (document.head || document.body).appendChild(s);
  }

  function mount(root) {
    ensureCss(resolveAsset('./style.css'));
    applyFontmapFromRoot(root);
    loadViewer(root);
  }

  function boot() {
    var root = document.querySelector('[data-pxart-typo-root]');
    if (!root) return;
    if (root.getAttribute('data-pxart-typo-entry-booted') === '1') return;

    if (root.querySelector('[data-canvas]')) {
      root.setAttribute('data-pxart-typo-entry-booted', '1');
      mount(root);
      return;
    }

    fetch(resolveAsset('./embed.html'))
      .then(function (r) { if (!r.ok) throw new Error('embed HTTP ' + r.status); return r.text(); })
      .then(function (html) {
        root.innerHTML = html;
        root.setAttribute('data-pxart-typo-entry-booted', '1');
        mount(root);
      })
      .catch(function (e) { console.error('pxart-typo entry:', e); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

