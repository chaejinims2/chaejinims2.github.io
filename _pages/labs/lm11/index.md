---
layout: page
title: linux master 1
---

<style>
.lm11-card { border: 1px solid var(--border); border-radius: var(--radius-3); padding: var(--space-6); background: var(--surface-1); transition: border-color .2s, box-shadow .2s; cursor: pointer; }
.lm11-card:hover { border-color: var(--tone-muted); box-shadow: var(--shadow-subtle); }
.lm11-card .card-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-3); }
.lm11-card .title { font-weight: var(--fw-600); color: var(--tone-text); margin: 0; margin-left: auto; font-size: var(--fs-4); }
.lm11-card .title code { color: var(--tone-muted); font-weight: var(--fw-500); }
.lm11-card .log-box .description {
  display: block;
  margin: var(--space-3);
  font-size: var(--fs-3);
  line-height: 1.5;
  color: var(--tone-text-75);
}
.lm11-card .cmd {
  margin: 0;
  padding: var(--space-3) var(--space-4);
  font-family: ui-monospace, monospace;
  font-size: var(--fs-3);
  line-height: 1.4;
  letter-spacing: 0.02em;
  color: var(--tone-text);
  background: var(--surface-0);
  border: 1px solid var(--border);
  border-radius: var(--radius-2);
}
.lm11-card .log-box { display: none; margin-top: var(--space-4); }
.lm11-card .log-box.is-open { display: block; }
.lm11-card:not(.lm11-card-fixed) .log-box { display: none !important; } /* 카드 클릭 시 상단 고정 터미널에만 표시 */
/* 터미널 느낌 */
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
.lm11-card .log-box pre .term-prompt { color: #4ec9b0; font-weight: 600;}
.lm11-card .log-box .log-loading { color: #858585; }
.lm11-card .log-box .log-error { color: #f87171; }
.lm11-intro { margin-bottom: var(--space-6); color: inherit; }
.lm11-intro a { color: var(--tone-accent); text-decoration: none; }
.lm11-intro a:hover { text-decoration: underline; }
/* 고정 카드: 스크롤해도 상단에 고정 표시 */
.lm11-card-fixed { position: sticky; top: 0; z-index: 2; margin-bottom: var(--space-6); background: var(--surface-1); cursor: default; }
.lm11-card-fixed:hover { box-shadow: none; }
.lm11-card-fixed .log-box .log-pre-wrap { height: var(--lm11-card-fixed-height); min-height: var(--lm11-card-fixed-height); display: flex; flex-direction: column; }
.lm11-card-fixed .log-box pre { height: 100%; min-height: 0; flex: 1; }
/* cmd 순차 목록 */
.lm11-cmd-list { margin: 1.5rem 0; display: flex; flex-direction: column; gap: var(--space-2); }
.lm11-cmd-row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4); border: 1px solid var(--border); border-radius: var(--radius-2); background: var(--surface-1); cursor: pointer; transition: border-color .2s, box-shadow .2s; }
.lm11-cmd-row:hover { border-color: var(--tone-muted); box-shadow: var(--shadow-subtle); }
.lm11-cmd-row .cmd { margin: 0; font-family: ui-monospace, monospace; font-size: var(--fs-3); color: var(--tone-text); background: var(--surface-0); border: 1px solid var(--border); border-radius: var(--radius-2); padding: var(--space-2) var(--space-3); }
.lm11-cmd-row .title { font-size: var(--fs-3); font-weight: var(--fw-600); color: var(--tone-text); }
</style>

<div class="lm11-intro">
  <!-- <strong>카드를 클릭</strong>하면 실행 로그가 코드 블록으로 펼쳐집니다. -->
</div>
<div class="lm11-card lm11-card-fixed" data-log-url="{{ site.baseurl }}/labs/lm11/prac/log/00.log" aria-expanded="true">
  <div class="log-box is-open" role="region" aria-label="실행 로그">
    <div class="log-pre-wrap">
      <pre class="log-content"></pre>
    </div>
  </div>
</div>
<div class="lm11-cmd-list" role="list">
{% for card in site.data.lm11.prac.lm11-prac %}
{% assign num = forloop.index %}
{% capture num_str %}{% if num < 10 %}0{% endif %}{{ num }}{% endcapture %}
  <div class="lm11-cmd-row" data-log-url="{{ site.baseurl }}/labs/lm11/prac/log/{{ num_str }}.log" role="button" tabindex="0">
    <code class="cmd">{{ card.cmd }}</code>{% if card.title != "" %} <span class="title">{{ card.title }}</span>{% endif %}
  </div>
{% endfor %}
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
  document.querySelectorAll('.lm11-cmd-row').forEach(function(row) {
    function handleClick() {
      var url = row.getAttribute('data-log-url');
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
    row.addEventListener('click', handleClick);
    row.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } });
  });

  /* 고정 카드는 열린 상태로 00.log 자동 로드 */
  var fixedCard = document.querySelector('.lm11-card-fixed');
  if (fixedCard && fixedPre && !fixedPre.dataset.loaded) {
    var url = fixedCard.getAttribute('data-log-url');
    if (baseUrl && url.indexOf('/') === 0) { url = baseUrl.replace(/\/$/, '') + url; }
    fixedPre.textContent = '불러오는 중…';
    fixedPre.classList.add('log-loading');
    fetch(url).then(function(r) { return r.ok ? r.text() : Promise.reject(new Error(r.status)); })
      .then(function(text) { setFixedLog(url, text); })
      .catch(function() {
        fixedPre.textContent = '로그를 불러올 수 없습니다. (파일 경로를 확인하세요)';
        fixedPre.classList.remove('log-loading');
        fixedPre.classList.add('log-error');
        fixedPre.dataset.loaded = '1';
      });
  }

  var cmdRows = Array.from(document.querySelectorAll('.lm11-cmd-row'));
  document.addEventListener('keydown', function(e) {
    if (!cmdRows.length) return;
    var i = cmdRows.indexOf(document.activeElement);
    if (i === -1) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (i + 1 < cmdRows.length) cmdRows[i + 1].focus();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (i - 1 >= 0) cmdRows[i - 1].focus();
    }
  });
})();
</script>
