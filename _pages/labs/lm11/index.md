---
layout: page
title: linux master 1
---

<style>
/* 고정 터미널 카드 */
.lm11-card { border: 1px solid var(--border); border-radius: var(--radius-3); padding: var(--space-6); background: var(--surface-1); }
.lm11-card .log-box.is-open { display: block; }
.lm11-card .log-box .log-pre-wrap {
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 4px 12px rgba(0,0,0,0.35);
  background: #0d1117;
}
.lm11-card .log-box .log-pre-wrap::before {
  content: "● ● ●";
  display: block;
  height: 28px;
  line-height: 28px;
  padding-left: 12px;
  font-size: 10px;
  letter-spacing: 3px;
  color: #484f58;
  background: #161b22;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  box-sizing: border-box;
}
.lm11-card .log-box pre {
  margin: 0;
  padding: var(--space-4);
  font-size: 13px;
  line-height: 1.45;
  font-family: "SF Mono", "Monaco", "Inconsolata", "Fira Mono", ui-monospace, monospace;
  background: #0d1117;
  color: #d4d4d4;
  overflow-x: auto;
  max-height: var(--lm11-card-fixed-height);
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
.lm11-card .log-box pre .term-prompt { color: #4ec9b0; font-weight: 600; }
.lm11-card .log-box .log-loading { color: #858585; }
.lm11-card .log-box .log-error { color: #f87171; }
.lm11-card-fixed { position: sticky; top: 0; z-index: 2; margin-bottom: var(--space-6); background: var(--surface-1); cursor: default; }
.lm11-card-fixed .log-box .log-pre-wrap { height: var(--lm11-card-fixed-height); min-height: var(--lm11-card-fixed-height); display: flex; flex-direction: column; }
.lm11-card-fixed .log-box pre { height: 100%; min-height: 0; flex: 1; }
/* 로그 선택 콤보박스 */
.lm11-intro { margin-bottom: var(--space-6); color: inherit; }
.lm11-combo-wrap { margin: 1.5rem 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-3); }
.lm11-combo-wrap label { font-size: var(--fs-3); font-weight: var(--fw-600); color: var(--tone-text); margin: 0; }
.lm11-combo { margin-left: auto; width: auto; min-width: 12rem; max-width: 32rem; padding: var(--space-3) var(--space-4); font-size: var(--fs-3); font-family: ui-monospace, monospace; border: 1px solid var(--border); border-radius: var(--radius-2); background: var(--surface-1); color: var(--tone-text); }
.lm11-combo:focus { outline: 2px solid var(--tone-accent); outline-offset: 2px; }
</style>

<div class="lm11-intro lm11-combo-wrap">
  <label for="lm11-log-select">실행 로그 선택</label>
  <select id="lm11-log-select" class="lm11-combo" aria-label="실행 로그 선택">
    <option value="{{ site.baseurl }}/labs/lm11/prac/log/01.log">preview</option>
{% for card in site.data.lm11.prac.lm11-prac %}
{% assign num = forloop.index %}
{% capture num_str %}{% if num < 10 %}0{% endif %}{{ num }}{% endcapture %}
    <option value="{{ site.baseurl }}/labs/lm11/prac/log/{{ num_str }}.log">{{ card.cmd }}{% if card.title != "" %} : {{ card.title }}{% endif %}</option>
{% endfor %}
  </select>
</div>

<div class="lm11-card lm11-card-fixed" data-log-url="{{ site.baseurl }}/labs/lm11/prac/log/01.log" aria-expanded="true">
  <div class="log-box is-open" role="region" aria-label="실행 로그">
    <div class="log-pre-wrap">
      <pre class="log-content"></pre>
    </div>
  </div>
</div>
<script>
(function() {
  var base = document.querySelector('base');
  var baseUrl = base ? base.getAttribute('href') : '';
  var fixedPre = document.querySelector('.lm11-card-fixed .log-content');
  var esc = function(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
  function setFixedLog(url, text) {
    if (!fixedPre) return;
    var i = text.indexOf('\n');
    var first = i >= 0 ? text.slice(0, i) : text;
    var rest = i >= 0 ? text.slice(i + 1) : '';
    fixedPre.innerHTML = '<span class="term-prompt">' + esc(first) + '</span>' + (rest ? '\n' + esc(rest) : '');
    fixedPre.classList.remove('log-loading', 'log-error');
    fixedPre.dataset.loaded = '1';
  }
  var selectEl = document.getElementById('lm11-log-select');
  function loadSelectedLog() {
    var url = selectEl ? selectEl.value : '';
    if (!url) return;
    if (baseUrl && url.indexOf('/') === 0) { url = baseUrl.replace(/\/$/, '') + url; }
    if (fixedPre) {
      fixedPre.textContent = '불러오는 중…';
      fixedPre.classList.add('log-loading');
    }
    fetch(url).then(function(r) { return r.ok ? r.text() : Promise.reject(new Error(r.status)); })
      .then(function(text) { setFixedLog(url, text); })
      .catch(function() {
        if (fixedPre) {
          fixedPre.textContent = '로그를 불러올 수 없습니다. (파일 경로를 확인하세요)';
          fixedPre.classList.remove('log-loading');
          fixedPre.classList.add('log-error');
          fixedPre.dataset.loaded = '1';
        }
      });
  }
  if (selectEl) selectEl.addEventListener('change', loadSelectedLog);

  /* 초기: 00.log(미리보기) 선택 상태로 고정 터미널에 로드 */
  if (fixedPre && !fixedPre.dataset.loaded) loadSelectedLog();
})();
</script>
