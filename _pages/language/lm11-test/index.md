---
layout: default
permalink: /language/lm11-test/
title: Linux Master 1급 기출
# 시험 목록은 _data/lm11/exams.json 에서 가져옵니다.
---

<div class="app-page-container">
  <h1 class="page-title">{{ page.title }}</h1>

  <div class="quiz-select-wrap" role="region" aria-label="시험 선택">
    <select id="quiz-exam-select" class="quiz-select" aria-describedby="quiz-exam-hint">
      {% for exam in site.data.lm11.exams %}
        <option value="{{ exam.key }}" {% if forloop.first %}selected{% endif %}>{{ exam.date }}</option>
      {% endfor %}
    </select>
    <span id="quiz-exam-hint" class="quiz-select-hint"></span>
  </div>

  {% for exam in site.data.lm11.exams %}
    {% assign quiz_questions = site.data.lm11.questions | where: "examKey", exam.key %}
    <section class="quiz-exam-section" id="exam-{{ exam.key }}" data-exam-key="{{ exam.key }}" aria-labelledby="exam-title-{{ exam.key }}">
      <h2 id="exam-title-{{ exam.key }}" class="quiz-exam-title">{{ exam.date }} ({{ quiz_questions | size }}문항)</h2>
      {% include quiz_cards.html questions=quiz_questions exam_key=exam.key %}
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
