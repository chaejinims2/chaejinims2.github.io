---
layout: page
permalink: /language/lm11-question/
title: Linux Master 1급 1차
# 데이터: _data/lm11/questions.json, exams.json, subjects.json
---

<style>
/* LM11 문제은행 페이지 전용 필터 영역 스타일 */
.quiz-select-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-bottom: var(--space-6);
  padding: var(--space-4) 0;
}
.quiz-select-label {
  font-weight: var(--fw-600);
  color: var(--app-text);
}
.quiz-select {
  padding: var(--space-2) var(--space-4);
  font-size: 1rem;
  border: 1px solid var(--app-border);
  border-radius: var(--radius-2);
  background: var(--app-panel);
  color: var(--app-text);
  min-width: 10rem;
}
.quiz-select:hover,
.quiz-select:focus {
  border-color: var(--accent);
  outline: none;
}
.quiz-select-hint {
  font-size: var(--fs-2);
  color: var(--app-muted);
}
</style>

<header class="quiz-filter-wrap" role="region" aria-label="문제 필터">
  <div class="quiz-select-wrap">
    <select id="bank-exam-select" class="quiz-select">
      {% for exam in site.data.lm11.exams %}
        <option value="{{ exam.key }}" {% if forloop.first %}selected{% endif %}>{{ exam.date }}</option>
      {% endfor %}
    </select>
    <label for="bank-exam-select" class="quiz-select-label">시험</label>
  </div>
  <div class="quiz-select-wrap">
    <select id="bank-subject-select" class="quiz-select">
      <option value="">전체</option>
      {% for subj in site.data.lm11.subjects %}
        <option value="{{ subj.key }}">{{ subj.name }}</option>
      {% endfor %}
    </select>
    <label for="bank-subject-select" class="quiz-select-label">과목</label>
  </div>
</header>

<div id="bank-section" aria-label="문제 목록">
  {% include quiz_cards_bank.html questions=site.data.lm11.questions %}
</div>

<script>
(function () {
  var ONE_COLUMN_KEY = 'lm11-bank-one-column';
  var examSelect = document.getElementById('bank-exam-select');
  var subjectSelect = document.getElementById('bank-subject-select');
  var bankSection = document.getElementById('bank-section');
  var oneColumnBtn = document.getElementById('bank-one-column-toggle');

  var cards = document.querySelectorAll('.quiz-card--bank');
  if (!cards.length) return;

  // ---- 필터 (매칭되는 문제 모두 표시) ----
  function getMatchedCards() {
    var examKey = (examSelect && examSelect.value) || '';
    var subjectKey = (subjectSelect && subjectSelect.value) || '';
    var list = [];
    cards.forEach(function (card) {
      var matchExam = !examKey || card.getAttribute('data-exam-key') === examKey;
      var matchSubject = !subjectKey || card.getAttribute('data-subject-key') === String(subjectKey);
      if (matchExam && matchSubject) list.push(card);
    });
    return list;
  }

  function applyFilter() {
    var examKey = (examSelect && examSelect.value) || '';
    var subjectKey = (subjectSelect && subjectSelect.value) || '';
    cards.forEach(function (card) {
      var matchExam = !examKey || card.getAttribute('data-exam-key') === examKey;
      var matchSubject = !subjectKey || card.getAttribute('data-subject-key') === String(subjectKey);
      card.hidden = !(matchExam && matchSubject);
    });
  }

  function setOneColumnMode(enabled) {
    if (!bankSection) return;
    var grid = bankSection.querySelector('.quiz-grid--bank');
    if (!grid) return;
    grid.classList.toggle('is-one-column', !!enabled);
    if (oneColumnBtn) {
      oneColumnBtn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      oneColumnBtn.textContent = enabled ? '문제 기본 배치로 보기' : '문제 한줄로 보기';
    }
    try { localStorage.setItem(ONE_COLUMN_KEY, enabled ? '1' : '0'); } catch (e) {}
  }

  function loadOneColumnMode() {
    try { return localStorage.getItem(ONE_COLUMN_KEY) === '1'; } catch (e) { return false; }
  }

  function shuffleOrder() {
    var container = bankSection && bankSection.querySelector('.quiz-grid--bank');
    if (!container) return;
    var cardArr = [].slice.call(container.querySelectorAll('.quiz-card--bank'));
    for (var i = cardArr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = cardArr[i];
      cardArr[i] = cardArr[j];
      cardArr[j] = t;
    }
    cardArr.forEach(function (c) { container.appendChild(c); });
    cards = document.querySelectorAll('.quiz-card--bank');
    applyFilter();
  }

  if (document.getElementById('bank-shuffle-order')) {
    document.getElementById('bank-shuffle-order').addEventListener('click', shuffleOrder);
  }
  if (oneColumnBtn) {
    oneColumnBtn.addEventListener('click', function () {
      var grid = bankSection && bankSection.querySelector && bankSection.querySelector('.quiz-grid--bank');
      var enabled = !!(grid && grid.classList.contains('is-one-column'));
      setOneColumnMode(!enabled);
    });
  }

  if (examSelect) {
    examSelect.addEventListener('change', function () {
      applyFilter();
    });
  }
  if (subjectSelect) {
    subjectSelect.addEventListener('change', function () {
      applyFilter();
    });
  }

  setOneColumnMode(loadOneColumnMode());
  applyFilter();
})();
</script>
