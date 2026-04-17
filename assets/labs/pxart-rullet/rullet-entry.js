/* global window, document */
(function () {
    'use strict';

    // Capture loader script URL once; document.currentScript may be null later (e.g., async callbacks or PJAX).
    var __LOADER_SRC__ = (document.currentScript && document.currentScript.src) ? document.currentScript.src : '';
  
    function queryParam(name) {
      try {
        var sp = new URLSearchParams(window.location.search || '');
        return sp.get(name) || '';
      } catch (e) {
        return '';
      }
    }
  
    function apiBase() {
      var qp = queryParam('api');
      if (qp) return qp;
      var el = document.documentElement;
      var explicit = el.getAttribute('data-pxrullet-api-base');
      if (explicit) return explicit;
      // 페이지가 127.0.0.1이면 API도 같은 호스트로 (localhost와 혼용 시 CORS/캔버스 이슈 방지)
      var proto = window.location.protocol;
      var host = window.location.hostname;
      return proto + '//' + host + ':5090';
    }
  
    function uploadsBaseFromSpriteUrl(absUrl) {
      try {
        var u = new URL(absUrl, window.location.href);
        var p = u.pathname;
        var i = p.indexOf('/uploads/');
        if (i < 0) return '';
        return u.origin + p.slice(0, i + '/uploads'.length);
      } catch (e) {
        return '';
      }
    }
  
    function loadScript(src) {
      var s = document.createElement('script');
      s.src = src;
      s.onerror = function () {
        console.error('pxart-rullet: failed to load', src);
      };
      document.body.appendChild(s);
    }

    function resolveLocalAsset(relPath) {
      try {
        // Load relative to this loader script's URL, not the current page URL.
        var base = __LOADER_SRC__ || window.location.href;
        return new URL(relPath, base).toString();
      } catch (e) {
        return relPath;
      }
    }
  
    function cacheKey() {
      return 'pxrullet_layout_v2';
    }
  
    function saveLayout(layout) {
      try { window.localStorage.setItem(cacheKey(), JSON.stringify(layout)); } catch (e) {}
    }
  
    function loadCachedLayout() {
      try {
        var raw = window.localStorage.getItem(cacheKey());
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }
  
    function maybeWarmSwCache(layoutUrl, layout) {
      try {
        if (!navigator.serviceWorker || !navigator.serviceWorker.controller) return;
        var urls = [];
        if (layoutUrl) urls.push(layoutUrl);
        if (layout && layout.assets) {
          Object.keys(layout.assets).forEach(function (k) {
            var a = layout.assets[k];
            if (a && a.src) urls.push(a.src);
          });
        }
        navigator.serviceWorker.controller.postMessage({ type: 'CACHE_URLS', urls: urls });
      } catch (e) {}
    }
  
    function run() {
      var base = apiBase().replace(/\/$/, '');
      var root = document.querySelector('[data-pxrullet-root]');
      var explicitLayout = queryParam('layout');
      // If layout=... is provided, use it as-is (can be a static JSON on GitHub Pages).
      // Otherwise, fetch from API base.
      var layoutUrl = explicitLayout ? explicitLayout : (base + '/api/pxart-rullet/layout');
      fetch(layoutUrl)
        .then(function (r) {
          if (!r.ok) throw new Error('layout HTTP ' + r.status);
          return r.json();
        })
        .then(function (layout) {
          window.__PXR_LAYOUT = layout;
          saveLayout(layout);
          if (root) {
            var sheet = layout && layout.assets && layout.assets.rulletSheet && layout.assets.rulletSheet.src;
            root.setAttribute('data-sprite-src', sheet || '');
            var ub = uploadsBaseFromSpriteUrl(sheet);
            if (ub) root.setAttribute('data-uploads-base', ub);
          }
          maybeWarmSwCache(layoutUrl, layout);
          loadScript(resolveLocalAsset('./script.js'));
        })
        .catch(function (e) {
          // Offline fallback: use last cached layout
          var cached = loadCachedLayout();
          if (cached) {
            window.__PXR_LAYOUT = cached;
            if (root) {
              var sheet2 = cached && cached.assets && cached.assets.rulletSheet && cached.assets.rulletSheet.src;
              root.setAttribute('data-sprite-src', sheet2 || '');
              var ub2 = uploadsBaseFromSpriteUrl(sheet2);
              if (ub2) root.setAttribute('data-uploads-base', ub2);
            }
            loadScript(resolveLocalAsset('./script.js'));
            return;
          }
          console.error('pxart-rullet:', e);
        });
    }
  
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();
  })();
  