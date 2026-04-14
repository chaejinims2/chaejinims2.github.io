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
  if (posVal === 'right') body.classList.add('sidebar-right');
  else if (posVal === 'bottom') body.classList.add('sidebar-bottom');
  else if (posVal === 'top') body.classList.add('sidebar-top');
  var compactKey = 'sidebar-compact';
  function syncSidebarCompactClass() {
    var p = localStorage.getItem(posKey) || 'left';
    var want = localStorage.getItem(compactKey) === '1' && p === 'left';
    body.classList.toggle('sidebar-compact', want);
  }
  syncSidebarCompactClass();
  function reorderShell(contentFirst) {
    var shell = document.querySelector('.app-shell');
    var mainCol = document.querySelector('.app-main');
    var sidebar = document.querySelector('.app-sidebar');
    if (!shell || !mainCol || !sidebar) return;
    if (contentFirst) shell.insertBefore(mainCol, sidebar);
    else shell.insertBefore(sidebar, mainCol);
  }

  function applySidebarPosition(v) {
    try { localStorage.setItem(posKey, v); } catch (e) {}
    document.body.classList.toggle('sidebar-right', v === 'right');
    document.body.classList.toggle('sidebar-top', v === 'top');
    document.body.classList.toggle('sidebar-bottom', v === 'bottom');
    reorderShell(v === 'right' || v === 'bottom');
    syncSidebarCompactClass();
    var compactCb = document.getElementById('sidebar-compact-checkbox');
    if (compactCb) compactCb.checked = localStorage.getItem(compactKey) === '1';
    var sel = document.getElementById('sidebar-position-select');
    if (sel) sel.value = v;
    var posFooterCb = document.getElementById('sidebar-position-checkbox');
    if (posFooterCb) posFooterCb.checked = v === 'top';
    try {
      window.dispatchEvent(new Event('resize'));
    } catch (e) {}
  }
  window.applySectionSidebarPosition = applySidebarPosition;

  function initSidebarPositionSelect() {
    var sel = document.getElementById('sidebar-position-select');
    if (!sel) return;
    sel.value = posVal;
    if (!sel.dataset.sidebarPositionInited) {
      sel.dataset.sidebarPositionInited = '1';
      sel.addEventListener('change', function () {
        applySidebarPosition(this.value);
      });
    }
  }
  initSidebarPositionSelect();
  window.initSidebarPositionSelect = initSidebarPositionSelect;

  function initFooterSidebarPositionCheckbox() {
    var cb = document.getElementById('sidebar-position-checkbox');
    if (!cb || cb.dataset.footerSidebarPositionInited) return;
    cb.dataset.footerSidebarPositionInited = '1';
    cb.checked = (localStorage.getItem(posKey) || 'left') === 'top';
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

  function initQuizAnswerToggles() {
    var content = document.querySelector('.app-main');
    if (!content) return;
    forEachNode(content.querySelectorAll('.quiz-card__answer-wrap'), function (wrap) {
      var btn = wrap.querySelector('.quiz-card__answer-toggle');
      if (!btn || btn.dataset.quizInit === '1') return;
      btn.dataset.quizInit = '1';
      btn.addEventListener('click', function () {
        var hidden = wrap.classList.toggle('is-hidden');
        btn.setAttribute('aria-label', hidden ? '정답 보기' : '정답 가리기');
      });
    });
    forEachNode(content.querySelectorAll('.quiz-answer'), function (answerBlock) {
      var btn = answerBlock.querySelector('.quiz-answer-toggle');
      var answerContent = answerBlock.querySelector('.quiz-answer-content');
      if (!btn || !answerContent || btn.dataset.quizAnswerInit === '1') return;
      btn.dataset.quizAnswerInit = '1';
      btn.addEventListener('click', function () {
        answerContent.classList.toggle('is-hidden');
        var hidden = answerContent.classList.contains('is-hidden');
        btn.setAttribute('aria-expanded', !hidden);
        btn.setAttribute('aria-label', hidden ? '뜻 보기' : '뜻 가리기');
      });
    });
  }
  window.initQuizAnswerToggles = initQuizAnswerToggles;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initQuizAnswerToggles);
  else initQuizAnswerToggles();

  function initLm11LogPage() {
    var base = document.querySelector('base');
    var baseUrl = base ? base.getAttribute('href') : '';
    var fixedPre = document.querySelector('.log-content');
    var selectEl = document.getElementById('lm11-log-select');
    if (!fixedPre || !selectEl) return;

    if (selectEl.dataset.lm11Init === '1') return;
    selectEl.dataset.lm11Init = '1';

    function esc(s) { var d = document.createElement('div'); d.textContent = String(s == null ? '' : s); return d.innerHTML; }
    function resolveUrl(url) {
      var u = String(url || '');
      if (baseUrl && u.indexOf('/') === 0) return baseUrl.replace(/\/$/, '') + u;
      return u;
    }
    function setFixedLog(text) {
      var t = String(text == null ? '' : text);
      var prompt = 'cherry@rhombus:~$';
      var promptEsc = esc(prompt);
      var html = esc(t);
      if (promptEsc) {
        html = html.split(promptEsc).join('<span class="term-prompt">' + promptEsc + '</span>');
      }
      fixedPre.innerHTML = html;
      fixedPre.classList.remove('log-loading', 'log-error');
      fixedPre.dataset.loaded = '1';
    }
    function loadSelectedLog() {
      var url = resolveUrl(selectEl.value || '');
      if (!url) return;
      fixedPre.textContent = '불러오는 중…';
      fixedPre.classList.add('log-loading');
      fetch(url).then(function (r) { return r.ok ? r.text() : Promise.reject(new Error(r.status)); })
        .then(function (text) { setFixedLog(text); })
        .catch(function () {
          fixedPre.textContent = '로그를 불러올 수 없습니다. (파일 경로를 확인하세요)';
          fixedPre.classList.remove('log-loading');
          fixedPre.classList.add('log-error');
          fixedPre.dataset.loaded = '1';
        });
    }

    selectEl.addEventListener('change', loadSelectedLog);
    if (!fixedPre.dataset.loaded) loadSelectedLog();
  }
  window.initLm11LogPage = initLm11LogPage;
  try { initLm11LogPage(); } catch (e) {}
})();
