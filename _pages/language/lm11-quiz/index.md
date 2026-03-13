---
layout: page
permalink: /language/lm11-quiz/
title: Linux Master 1급 1차 (퀴즈)
# 데이터: _data/lm11/questions.json, exams.json, subjects.json
---

<style>
.quiz-header { margin-bottom: var(--space-6, 1rem); }
.quiz-title { font-size: 1.25rem; margin: 0 0 0.25rem; font-weight: 700; }
.quiz-subtitle { font-size: 0.95rem; color: var(--app-muted); margin: 0; }
.quiz-filters-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: center;
  justify-content: flex-end;
}
.quiz-select-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  margin-bottom: var(--space-6);
  padding: 0;
}
.quiz-select-label {
  font-size: var(--quiz-card-fs-default);
  font-weight: var(--fw-600);
  color: var(--app-text);
}
.quiz-select {
  padding: var(--space-2) var(--space-4);
  font-size: var(--);
  border: 1px solid var(--app-border);
  border-radius: var(--radius-2);
  background: var(--app-panel);
  color: var(--app-text);
  min-width: 6rem;
  max-width: 10rem;
}
.quiz-select:hover,
.quiz-select:focus {
  border-color: var(--accent);
  outline: none;
}
.quiz-apply-btn {
  padding: var(--space-2) var(--space-4);
  font-size: var(--quiz-card-fs-default);
  font-weight: var(--fw-500);
  color: var(--app-muted);
  background: transparent;
  border: 1px solid var(--app-border);
  border-radius: var(--radius-2);
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  margin-bottom: var(--space-6);
}
.quiz-apply-btn:hover {
  color: var(--app-text);
  border-color: var(--app-muted);
}

.quiz-pager {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  justify-content: space-between;
  margin: 0 0 var(--space-6);
}
.quiz-pager__left, .quiz-pager__right { display: inline-flex; gap: var(--space-2); align-items: center; }
.quiz-pager__btn {
  padding: 0.45rem 0.75rem;
  border: 1px solid var(--app-border);
  border-radius: var(--radius-2);
  background: var(--app-panel);
  color: var(--app-text);
  cursor: pointer;
}
.quiz-pager__btn:disabled { opacity: 0.5; cursor: not-allowed; }
.quiz-pager__status { color: var(--app-muted); font-size: var(--quiz-card-fs-default); }
</style>

<header class="quiz-filters-wrap" role="region" aria-label="퀴즈 필터">
  <div class="quiz-select-wrap">
    <select id="quiz-exam-select" class="quiz-select" aria-label="시험 선택">
      <option value="">All</option>
      {% for exam in site.data.lm11.exams %}
        <option value="{{ exam.key }}">{{ exam.date }}</option>
      {% endfor %}
    </select>
  </div>
  <div class="quiz-select-wrap">
    <select id="quiz-subject-select" class="quiz-select" aria-label="과목 선택">
      <option value="">All</option>
      {% for subj in site.data.lm11.subjects %}
        <option value="{{ subj.key }}">{{ subj.name }}</option>
      {% endfor %}
    </select>
  </div>
  <button type="button" id="quiz-filter-apply" class="quiz-apply-btn">Apply</button>
</header>

<div class="quiz-pager" role="region" aria-label="문제 이동">
  <div class="quiz-pager__left">
    <button type="button" class="quiz-pager__btn" id="quiz-prev">Prev</button>
    <button type="button" class="quiz-pager__btn" id="quiz-next">Next</button>
  </div>
  <div class="quiz-pager__right">
    <span class="quiz-pager__status" id="quiz-status">0 / 0</span>
  </div>
</div>

<div id="quiz-section" aria-label="퀴즈">
  {% include quiz_cards_bank_style.html %}

  <div class="quiz-cards-set" role="list">
    {% for q in site.data.lm11.questions %}
      {% assign exam = site.data.lm11.exams | where: "key", q.examKey | first %}
      {% assign subject = site.data.lm11.subjects | where: "key", q.subjectKey | first %}
      {% if exam and exam.answers %}
        {% assign answer_index = q.localId | minus: 1 %}
        {% assign correct_answer_num = exam.answers[answer_index] %}
      {% else %}
        {% assign correct_answer_num = 1 %}
      {% endif %}

      {% include quiz_cards_bank_item.html q=q exam=exam subject=subject correct_answer_num=correct_answer_num %}
    {% endfor %}
  </div>

  {% include quiz_cards_bank_script.html %}
</div>

<script>
try { if (window.initLm11QuizPage) window.initLm11QuizPage(); } catch (e) {}
</script>
