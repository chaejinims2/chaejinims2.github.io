/**
 * section 레이아웃 공통: 네비 아이콘, 사이드바 설정, 코드 복사, 퀴즈 토글, LM11 로그.
 * PJAX 네비게이션 후에는 pjax.html에서 window.init* 를 다시 호출한다.
 */
(function () {
  'use strict';

  function forEachNode(nodeList, fn) {
    Array.prototype.forEach.call(nodeList || [], fn);
  }

  forEachNode(document.querySelectorAll('.app-nav-ico[data-icon]'), function (span) {
    if (span.textContent) return;
    var hex = (span.getAttribute('data-icon') || '25B6').trim();
    var chars = hex.split(',').map(function (h) {
      var code = parseInt(h.trim(), 16);
      return isNaN(code) ? '' : String.fromCodePoint(code);
    });
    span.textContent = chars.join('');
  });

  var body = document.body;
  if (!body) return;
  var posKey = 'sidebar-position';
  var posVal = localStorage.getItem(posKey) || 'left';
  if (posVal !== 'left' && posVal !== 'top') {
    posVal = 'left';
    try { localStorage.setItem(posKey, 'left'); } catch (e) {}
  }
  body.classList.remove('sidebar-right', 'sidebar-bottom');
  if (posVal === 'top') body.classList.add('sidebar-top');
  else body.classList.remove('sidebar-top');
  var compactKey = 'sidebar-compact';
  function syncSidebarCompactClass() {
    var p = localStorage.getItem(posKey) || 'left';
    if (p !== 'left' && p !== 'top') p = 'left';
    var want = localStorage.getItem(compactKey) === '1' && p === 'left';
    body.classList.toggle('sidebar-compact', want);
  }
  syncSidebarCompactClass();

  function applySidebarPosition(v) {
    if (v !== 'left' && v !== 'top') v = 'left';
    try { localStorage.setItem(posKey, v); } catch (e) {}
    body.classList.remove('sidebar-right', 'sidebar-bottom');
    body.classList.toggle('sidebar-top', v === 'top');
    syncSidebarCompactClass();
    var compactCb = document.getElementById('sidebar-compact-checkbox');
    if (compactCb) compactCb.checked = localStorage.getItem(compactKey) === '1';
    var posFooterCb = document.getElementById('sidebar-position-checkbox');
    if (posFooterCb) posFooterCb.checked = v === 'top';
    try {
      window.dispatchEvent(new Event('resize'));
    } catch (e) {}
  }
  window.applySectionSidebarPosition = applySidebarPosition;

  function initFooterSidebarPositionCheckbox() {
    var cb = document.getElementById('sidebar-position-checkbox');
    if (!cb || cb.dataset.footerSidebarPositionInited) return;
    cb.dataset.footerSidebarPositionInited = '1';
    var stored = localStorage.getItem(posKey) || 'left';
    if (stored !== 'left' && stored !== 'top') stored = 'left';
    cb.checked = stored === 'top';
    cb.addEventListener('change', function () {
      applySidebarPosition(this.checked ? 'top' : 'left');
    });
  }
  initFooterSidebarPositionCheckbox();
  window.initFooterSidebarPositionCheckbox = initFooterSidebarPositionCheckbox;

  document.addEventListener('keydown', function (e) {
    if (!e.altKey || !e.shiftKey) return;
    if (e.key !== 's' && e.key !== 'S') return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
    e.preventDefault();
    var cur = localStorage.getItem(posKey) || 'left';
    if (cur !== 'left' && cur !== 'top') cur = 'left';
    applySidebarPosition(cur === 'top' ? 'left' : 'top');
  }, true);

  function initSidebarCompactCheckbox() {
    var cb = document.getElementById('sidebar-compact-checkbox');
    if (!cb) return;
    cb.checked = localStorage.getItem(compactKey) === '1';
    if (!cb.dataset.sidebarCompactInited) {
      cb.dataset.sidebarCompactInited = '1';
      cb.addEventListener('change', function () {
        var on = this.checked;
        try { localStorage.setItem(compactKey, on ? '1' : '0'); } catch (e) {}
        syncSidebarCompactClass();
      });
    }
  }
  initSidebarCompactCheckbox();
  window.initSidebarCompactCheckbox = initSidebarCompactCheckbox;

  var copyIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" /></svg>';
  function getCodeText(block) {
    var code = block.querySelector('code');
    return code ? code.textContent : (block.textContent || '');
  }
  function initCodeCopyButtons() {
    var content = document.querySelector('.app-main');
    if (!content) return;
    forEachNode(content.querySelectorAll('.terminal-pre-wrap'), function (wrap) {
      if (wrap.querySelector('.code-block-copy-btn')) return;
      addCopyButtonForTerminal(wrap);
    });
  }

  function addCopyButtonForTerminal(wrap) {
    var pre = wrap.querySelector('.terminal-content');
    if (!pre) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-block-copy-btn';
    btn.title = '코드 복사';
    btn.setAttribute('aria-label', '코드 복사');
    btn.innerHTML = copyIconSvg;
    btn.addEventListener('click', function () {
      var text = getCodeText(pre);
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { showCopied(btn); }).catch(function () { fallbackCopy(text, btn); });
      } else {
        fallbackCopy(text, btn);
      }
    });
    wrap.appendChild(btn);
  }
  function showCopied(btn) {
    btn.classList.add('copied');
    var label = btn.getAttribute('aria-label');
    btn.setAttribute('aria-label', '복사됨');
    setTimeout(function () {
      btn.classList.remove('copied');
      btn.setAttribute('aria-label', label || '코드 복사');
    }, 1500);
  }
  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showCopied(btn);
    } catch (e) {}
    document.body.removeChild(ta);
  }
  window.initCodeCopyButtons = initCodeCopyButtons;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCodeCopyButtons);
  else initCodeCopyButtons();
})();
