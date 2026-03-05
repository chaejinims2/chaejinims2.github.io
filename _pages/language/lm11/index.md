---
layout: default
permalink: /language/lm11/
title: Linux Master 1급 기출
# _data 폴더에서 사용할 퀴즈 JSON 파일명(확장자 제외). 추가 시 여기에만 넣으면 됨.
exam_keys:
  - "lm11-20200613"
  - "lm11-20201010"
  - "lm11-20220312"
  - "lm11-20230311"
---

<div class="app-page-container">
  <h1 class="page-title">{{ page.title }}</h1>

  <div class="quiz-select-wrap" role="region" aria-label="시험 선택">
    <select id="quiz-exam-select" class="quiz-select" aria-describedby="quiz-exam-hint">
      {% for key in page.exam_keys %}
        {% assign slug = key | split: "-" | last %}
        {% assign year = slug | slice: 0, 4 %}
        {% assign mon  = slug | slice: 4, 2 %}
        {% assign day  = slug | slice: 6, 2 %}
        <option value="{{ key }}" {% if forloop.first %}selected{% endif %}>{{ year }}-{{ mon }}-{{ day }}</option>
      {% endfor %}
    </select>
    <span id="quiz-exam-hint" class="quiz-select-hint"></span>
  </div>

  {% for key in page.exam_keys %}
    {% assign quiz_data = site.data[key] %}
    {% assign slug = key | split: "-" | last %}
    {% assign year = slug | slice: 0, 4 %}
    {% assign mon  = slug | slice: 4, 2 %}
    {% assign day  = slug | slice: 6, 2 %}
    {% assign label = year | append: "-" | append: mon | append: "-" | append: day %}
    <section class="quiz-exam-section" id="exam-{{ key }}" data-exam-key="{{ key }}" aria-labelledby="exam-title-{{ key }}">
      <h2 id="exam-title-{{ key }}" class="quiz-exam-title">{{ label }} ({{ quiz_data.questions | size }}문항)</h2>
      {% include quiz_cards.html quiz=quiz_data %}
    </section>
  {% endfor %}
</div>

<script>
(function() {
  var select = document.getElementById('quiz-exam-select');
  var sections = document.querySelectorAll('.quiz-exam-section');
  if (!select || !sections.length) return;
  function showExam(key) {
    sections.forEach(function(s) {
      s.hidden = (s.getAttribute('data-exam-key') !== key);
    });
  }
  select.addEventListener('change', function() { showExam(select.value); });
  showExam(select.value);
})();
</script>
