---
layout: page
title: linux master 1
---

<style>
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
{% for card in site.data.lm11.prac.lm11-prac %}
{% assign num = forloop.index %}
{% capture num_str %}{% if num < 10 %}0{% endif %}{{ num }}{% endcapture %}
    <option value="{{ site.baseurl }}/labs/lm11/prac/log/{{ num_str }}.log">{{ card.cmd }}{% if card.title != "" %} : {{ card.title }}{% endif %}</option>
{% endfor %}
  </select>
</div>

<div class="terminal-box" style="--terminal-height: var(--lm11-card-fixed-height);" role="region" aria-label="실행 로그">
  <div class="terminal-pre-wrap">
    <pre class="terminal-content log-content"></pre>
  </div>
</div>
<script>
/* PJAX에서도 동작하도록 전역 초기화 함수(core/site.js)를 사용 */
try { if (window.initLm11LogPage) window.initLm11LogPage(); } catch (e) {}
</script>
