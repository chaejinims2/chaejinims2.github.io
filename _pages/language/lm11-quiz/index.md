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
  position: sticky;
  bottom: 0;
  z-index: 0;

  display: flex;
  gap: var(--space-3);
  align-items: center;
  justify-content: space-between;

  margin: 0;
  padding: 0.75rem 0;

  background: color-mix(in srgb, var(--app-bg, #111) 82%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  border-top: 1px solid var(--app-border);
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

#quiz-section {
  touch-action: pan-y;
  -webkit-user-select: none;
  user-select: none;
  overscroll-behavior-x: contain;
  padding-bottom: 0rem;
}

.quiz-cards-set {
  touch-action: pan-y;
}

/* 스와이프 중일 때 드래그 선택 방지 */
.quiz-card,
.quiz-card * {
  -webkit-user-select: none;
  user-select: none;
}
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

<div class="quiz-pager" role="region" aria-label="문제 이동">
  <div class="quiz-pager__left">
    <button type="button" class="quiz-pager__btn" id="quiz-prev">Prev</button>
  </div>
    <span class="quiz-pager__status" id="quiz-status">0 / 0</span>
  <div class="quiz-pager__right">
    <button type="button" class="quiz-pager__btn" id="quiz-next">Next</button>
  </div>
</div>


<script>
try { 
  if (window.initLm11QuizPage) window.initLm11QuizPage(); 
} catch (e) {}

(function () {
  const quizSection = document.getElementById('quiz-section');
  const prevBtn = document.getElementById('quiz-prev');
  const nextBtn = document.getElementById('quiz-next');

  if (!quizSection || !prevBtn || !nextBtn) return;

  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let isTracking = false;

  const SWIPE_THRESHOLD = 60;   // 최소 가로 이동 거리
  const VERTICAL_LIMIT = 40;    // 세로 흔들림 허용치

  function onTouchStart(e) {
    if (!e.touches || e.touches.length !== 1) return;

    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    currentX = startX;
    currentY = startY;
    isTracking = true;
  }

  function onTouchMove(e) {
    if (!isTracking || !e.touches || e.touches.length !== 1) return;

    const touch = e.touches[0];
    currentX = touch.clientX;
    currentY = touch.clientY;
  }

  function onTouchEnd() {
    if (!isTracking) return;
    isTracking = false;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    // 세로 스크롤이 더 큰 동작이면 무시
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    // 세로 흔들림이 크면 무시
    if (Math.abs(deltaY) > VERTICAL_LIMIT) return;

    // 우로 스와이프 → 이전 카드
    if (deltaX > SWIPE_THRESHOLD) {
      if (!prevBtn.disabled) prevBtn.click();
      return;
    }

    // 좌로 스와이프 → 다음 카드
    if (deltaX < -SWIPE_THRESHOLD) {
      if (!nextBtn.disabled) nextBtn.click();
      return;
    }
  }

  quizSection.addEventListener('touchstart', onTouchStart, { passive: true });
  quizSection.addEventListener('touchmove', onTouchMove, { passive: true });
  quizSection.addEventListener('touchend', onTouchEnd, { passive: true });
  quizSection.addEventListener('touchcancel', onTouchEnd, { passive: true });
})();
</script>