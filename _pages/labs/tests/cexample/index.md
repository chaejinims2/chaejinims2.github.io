---
layout: page
permalink: /tests/cexample/
title: Ielts voca - 예문 번역
dataset: cvoca
data: words
---

{% assign words = site.data[page.dataset][page.data] %}
{% assign max_day = 0 %}
{% for w in words %}{% if w.day_no > max_day %}{% assign max_day = w.day_no %}{% endif %}{% endfor %}

<div class="voca-examples-bank">
  <header class="quiz-filters-wrap" role="region" aria-label="예문 필터">
    <div class="quiz-select-wrap">
      <span class="quiz-select-label">Day</span>
      <div id="voca-day-sheet" class="quiz-ans-sheet voca-day-sheet" role="group" aria-label="Day 선택">
        {% for day in (1..max_day) %}
          <button type="button" class="ans-dot voca-day-dot" data-day="{{ day }}" aria-pressed="false">{{ day }}</button>
        {% endfor %}
      </div>
    </div>
  </header>

  <div id="quiz-section" class="voca-examples-mode" aria-label="예문 번역">
    <div class="quiz-cards-set voca-examples-grid" role="list">
      {% for w in words %}
        {% for def in w.definitions %}
          {% for ex in def.examples %}
            {% if ex.meaning and ex.meaning != '' %}
              {% include parts/voca_example.html w=w def=def ex=ex %}
            {% endif %}
          {% endfor %}
        {% endfor %}
      {% endfor %}
    </div>
  </div>
</div>
<script>
  try { window.initVocaExamplesPage && window.initVocaExamplesPage(); } catch (e) {}
</script>
