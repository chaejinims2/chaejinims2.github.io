---
layout: page
permalink: /language/lm11-question/
title: Linux Master 1급 1차
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
  justify-content: flex-end; /* 전체를 오른쪽 정렬 */
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
.quiz-select-hint {
  font-size: var(--quiz-card-fs-default);
  color: var(--app-muted);
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
.quiz-set-wrap {
  /* width: 50rem; */
  margin: 0;
}
</style>

<header class="quiz-filters-wrap" role="region" aria-label="문제 필터">
  <div class="quiz-select-wrap">
    <select id="bank-exam-select" class="quiz-select">
      {% for exam in site.data.lm11.exams %}
        <option value="{{ exam.key }}">{{ exam.date }}</option>
      {% endfor %}
    </select>
  </div>
  <div class="quiz-select-wrap">
    <select id="bank-subject-select" class="quiz-select">
      <option value="">All</option>
      {% for subj in site.data.lm11.subjects %}
        <option value="{{ subj.key }}">{{ subj.name }}</option>
      {% endfor %}
    </select>
  </div>
  <button type="button" id="bank-filter-apply" class="quiz-apply-btn">Apply</button>
</header>

<div id="bank-section" aria-label="문제 목록">
  <div class="quiz-set-wrap">
    {% include quiz_cards_bank.html questions=site.data.lm11.questions %}
  </div>
</div>

<script>
(function () {
  var examSelect = document.getElementById('bank-exam-select');
  var subjectSelect = document.getElementById('bank-subject-select');
  var bankSection = document.getElementById('bank-section');
  var applyBtn = document.getElementById('bank-filter-apply');
  var cards = document.querySelectorAll('.quiz-card');

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

  function shuffleOrder() {
    var container = bankSection && bankSection.querySelector('.quiz-grid--bank');
    if (!container) return;
    var cardArr = [].slice.call(container.querySelectorAll('.quiz-card'));
    for (var i = cardArr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = cardArr[i];
      cardArr[i] = cardArr[j];
      cardArr[j] = t;
    }
    cardArr.forEach(function (c) { container.appendChild(c); });
    cards = document.querySelectorAll('.quiz-card');
    applyFilter();
  }

  if (document.getElementById('bank-shuffle-order')) {
    document.getElementById('bank-shuffle-order').addEventListener('click', shuffleOrder);
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', function () {
      applyFilter();
    });
  }

  applyFilter();
})();
</script>
