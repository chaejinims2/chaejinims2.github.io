/* global window, document */
(function () {
  "use strict";

  var __LOADER_SRC__ =
    document.currentScript && document.currentScript.src
      ? document.currentScript.src
      : "";

  function resolveAsset(rel) {
    try {
      return new URL(rel, __LOADER_SRC__ || window.location.href).href;
    } catch (e) {
      return rel;
    }
  }

  function ensureCss(href) {
    if (document.querySelector("link[data-color-lab-css]")) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-color-lab-css", "1");
    document.head.appendChild(link);
  }

  function loadAppScript() {
    if (window.__colorLabScriptLoaded) return;
    if (document.querySelector("script[data-color-lab-bundle]")) return;
    var s = document.createElement("script");
    s.src = resolveAsset("./script.js");
    s.async = false;
    s.setAttribute("data-color-lab-bundle", "1");
    s.onerror = function () {
      console.error("color-lab: failed to load script.js");
    };
    s.onload = function () {
      window.__colorLabScriptLoaded = true;
    };
    (document.head || document.body).appendChild(s);
  }

  function mountFromShell(root) {
    ensureCss(resolveAsset("./style.css"));
    if (root.querySelector(".color-lab-root")) {
      loadAppScript();
      return;
    }
    fetch(resolveAsset("./embed.html"))
      .then(function (r) {
        if (!r.ok) throw new Error("embed HTTP " + r.status);
        return r.text();
      })
      .then(function (html) {
        root.innerHTML = html;
        root.setAttribute("data-color-lab-entry-booted", "1");
        loadAppScript();
      })
      .catch(function (e) {
        console.error("color-lab entry:", e);
      });
  }

  function boot() {
    var root = document.querySelector("[data-color-lab-root]");
    if (!root) return;
    if (root.getAttribute("data-color-lab-entry-booted") === "1") {
      loadAppScript();
      return;
    }
    mountFromShell(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
