---
layout: page
permalink: /tests/cvoca/
title: Ielts voca set
data: cvoca
---

{% assign words = site.data[page.data].words %}
{% assign max_day = 0 %}
{% for w in words %}{% if w.day_no > max_day %}{% assign max_day = w.day_no %}{% endif %}{% endfor %}

<header class="quiz-filters-wrap" role="region" aria-label="단어 필터">
  <div class="quiz-select-wrap">
    <span class="quiz-select-label">Day</span>
    <div id="voca-day-sheet" class="quiz-ans-sheet voca-day-sheet" role="group" aria-label="Day 선택">
      {% for day in (1..max_day) %}
        <button type="button" class="ans-dot voca-day-dot" data-day="{{ day }}" aria-pressed="false">{{ day }}</button>
      {% endfor %}
    </div>
  </div>

  <div class="quiz-start-wrap">
    <button type="button" id="voca-start-btn" class="quiz-start-btn">Start Quiz</button>
  </div>
</header>

<div id="quiz-section" aria-label="단어 학습">
  <div class="quiz-cards-set" role="list">
    {% for w in words %}
      {% include parts/voca_card.html w=w %}
    {% endfor %}
  </div>
</div>

<!-- 페이징: lm11과 동일한 구조 (Prev | 0/0 | Next) -->
<div class="quiz-pager" id="quiz-pager" role="region" aria-label="카드 이동">
  <div class="quiz-pager__left">
    <button type="button" class="quiz-pager__btn" id="quiz-prev">Prev</button>
  </div>
  <span class="quiz-pager__status" id="quiz-status">0 / 0</span>
  <div class="quiz-pager__right">
    <button type="button" class="quiz-pager__btn" id="quiz-next">Next</button>
  </div>
</div>
<script>
  try { window.initVocaPage && window.initVocaPage(); } catch (e) {}
</script>
