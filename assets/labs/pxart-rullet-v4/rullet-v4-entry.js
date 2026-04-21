/* global window, document */
(function () {
  'use strict';

  var __LOADER_SRC__ = (document.currentScript && document.currentScript.src) ? document.currentScript.src : '';

  function resolveAsset(rel) {
    try {
      return new URL(rel, __LOADER_SRC__ || window.location.href).href;
    } catch (e) {
      return rel;
    }
  }

  function ensureCss(href) {
    if (document.querySelector('link[data-pxr-v4-css]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-pxr-v4-css', '1');
    document.head.appendChild(link);
  }

  /** layout URL: root `data-layout` > 엔트리 스크립트 `?layout=` > 페이지 `?layout=` > `?static=1`이면 기본 layout.json */
  function applyLayoutFromRoot(root) {
    try { delete window.__PXR_V4_LAYOUT_URL__; } catch (e0) { /* ignore */ }
    var dl = (root.getAttribute('data-layout') || '').trim();
    if (!dl) {
      try {
        var sp = new URL(__LOADER_SRC__ || window.location.href).searchParams;
        if (sp.get('layout')) dl = sp.get('layout');
      } catch (e1) { /* ignore */ }
    }
    if (!dl) {
      try {
        var pq = new URLSearchParams(window.location.search || '');
        if (pq.get('layout')) dl = pq.get('layout');
      } catch (e2) { /* ignore */ }
    }
    if (dl) {
      try {
        window.__PXR_V4_LAYOUT_URL__ = new URL(dl, window.location.href).href;
      } catch (e3) {
        window.__PXR_V4_LAYOUT_URL__ = dl;
      }
    } else {
      try {
        var sp2 = new URL(__LOADER_SRC__ || '').searchParams;
        if (sp2.get('static') === '1') {
          window.__PXR_V4_LAYOUT_URL__ = resolveAsset('./layout.json');
        }
      } catch (e4) { /* ignore */ }
    }
  }

  function loadViewer() {
    var root = document.querySelector('[data-pxrullet-v4-root]');
    if (!root) return;
    window.__PXR_V4_EMBED_ROOT__ = root;
    if (window.pxartRulletV4Boot) {
      window.pxartRulletV4Boot(root);
      return;
    }
    if (document.querySelector('script[data-pxr-v4-bundle]')) return;
    var s = document.createElement('script');
    s.src = resolveAsset('./viewer.js');
    s.async = true;
    s.setAttribute('data-pxr-v4-bundle', '1');
    s.onerror = function () {
      console.error('pxart-rullet-v4: failed to load viewer.js');
    };
    (document.head || document.body).appendChild(s);
  }

  function mountFromShell(root) {
    ensureCss(resolveAsset('./style.css'));
    applyLayoutFromRoot(root);
    loadViewer();
  }

  function boot() {
    var root = document.querySelector('[data-pxrullet-v4-root]');
    if (!root) return;
    if (root.getAttribute('data-pxr-v4-entry-booted') === '1') return;

    if (root.querySelector('[data-canvas]')) {
      root.setAttribute('data-pxr-v4-entry-booted', '1');
      mountFromShell(root);
      return;
    }

    var embedUrl = resolveAsset('./embed.html');
    fetch(embedUrl)
      .then(function (r) {
        if (!r.ok) throw new Error('embed HTTP ' + r.status);
        return r.text();
      })
      .then(function (html) {
        root.innerHTML = html;
        root.setAttribute('data-pxr-v4-entry-booted', '1');
        mountFromShell(root);
      })
      .catch(function (e) {
        console.error('pxart-rullet-v4 entry:', e);
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
