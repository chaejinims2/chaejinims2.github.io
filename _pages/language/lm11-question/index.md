---
layout: default
permalink: /language/lm11-question/
title: Linux Master 1급 문제 은행
# 문제 목록은 _data/lm11/questions.json, 시험/과목은 exams.json·subjects.json에서 가져옵니다.
---

<div class="app-page-container">
  <!-- <h1 class="page-title">{{ page.title }}</h1> -->
  <!-- <p class="page-desc">시험·과목을 선택하면 해당 문제만 모아서 볼 수 있습니다. 선지는 매번 랜덤 순서로 표시됩니다.</p> -->

  <div class="quiz-single-toggle-wrap" role="group" aria-label="보기 방식">
    <input type="checkbox" id="bank-single-mode" class="quiz-single-toggle" aria-describedby="bank-single-hint">
    <label for="bank-single-mode" class="quiz-single-toggle-label">한 문제씩 보기</label>
  </div>

  <div class="quiz-filter-wrap" role="region" aria-label="문제 필터">
    <div class="quiz-select-wrap">
      <label for="bank-exam-select" class="quiz-select-label">시험</label>
      <select id="bank-exam-select" class="quiz-select" aria-describedby="bank-exam-hint">
        <option value="">전체</option>
        {% for exam in site.data.lm11.exams %}
        <option value="{{ exam.key }}">{{ exam.date }}</option>
        {% endfor %}
      </select>
      <span id="bank-exam-hint" class="quiz-select-hint" aria-live="polite"></span>
    </div>
    <div class="quiz-select-wrap">
      <label for="bank-subject-select" class="quiz-select-label">과목</label>
      <select id="bank-subject-select" class="quiz-select" aria-describedby="bank-subject-hint">
        <option value="">전체</option>
        {% for subj in site.data.lm11.subjects %}
        <option value="{{ subj.key }}">{{ subj.name }}</option>
        {% endfor %}
      </select>
      <span id="bank-subject-hint" class="quiz-select-hint" aria-live="polite"></span>
    </div>
    <p class="quiz-filter-count" id="bank-count" aria-live="polite"></p>
  </div>

  <section class="quiz-bank-section" id="bank-section" aria-label="문제 목록">
    {% include quiz_cards_bank.html questions=site.data.lm11.questions %}
  </section>

  <div class="quiz-one-nav" id="bank-one-nav" hidden aria-label="한 문제씩 이동">
    <button type="button" id="bank-prev" class="quiz-one-nav__btn" aria-label="이전 문제">이전</button>
    <span class="quiz-one-nav__count" id="bank-one-count" aria-live="polite">1 / 100</span>
    <button type="button" id="bank-next" class="quiz-one-nav__btn" aria-label="다음 문제">다음</button>
  </div>
</div>

<script>
(function() {
  var examSelect = document.getElementById('bank-exam-select');
  var subjectSelect = document.getElementById('bank-subject-select');
  var countEl = document.getElementById('bank-count');
  var singleCheck = document.getElementById('bank-single-mode');
  var oneNav = document.getElementById('bank-one-nav');
  var prevBtn = document.getElementById('bank-prev');
  var nextBtn = document.getElementById('bank-next');
  var oneCountEl = document.getElementById('bank-one-count');
  var bankSection = document.getElementById('bank-section');
  var cards = document.querySelectorAll('.quiz-card--bank');
  if (!cards.length) return;

  var currentIndex = 0;

  function getVisibleCards() {
    var examKey = (examSelect && examSelect.value) || '';
    var subjectKey = (subjectSelect && subjectSelect.value) || '';
    var list = [];
    cards.forEach(function(card) {
      var matchExam = !examKey || card.getAttribute('data-exam-key') === examKey;
      var matchSubject = !subjectKey || card.getAttribute('data-subject-key') === String(subjectKey);
      if (matchExam && matchSubject) list.push(card);
    });
    return list;
  }

  function updateFilter() {
    var visible = getVisibleCards();
    var singleMode = singleCheck && singleCheck.checked;

    if (singleMode) {
      if (currentIndex >= visible.length) currentIndex = Math.max(0, visible.length - 1);
      cards.forEach(function(card) { card.hidden = true; });
      visible.forEach(function(card, i) { card.hidden = (i !== currentIndex); });
      if (oneNav) oneNav.hidden = visible.length === 0;
      if (bankSection) bankSection.classList.add('is-single-mode');
      updateOneNav(visible.length);
    } else {
      visible.forEach(function(card) { card.hidden = false; });
      cards.forEach(function(card) {
        var inVisible = visible.indexOf(card) !== -1;
        if (!inVisible) card.hidden = true;
      });
      if (oneNav) oneNav.hidden = true;
      if (bankSection) bankSection.classList.remove('is-single-mode');
    }
    if (countEl) countEl.textContent = visible.length + '문항';
  }

  function updateOneNav(total) {
    if (!oneCountEl || total === 0) return;
    oneCountEl.textContent = (currentIndex + 1) + ' / ' + total;
    if (prevBtn) prevBtn.disabled = currentIndex <= 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= total - 1;
  }

  function goPrev() {
    var visible = getVisibleCards();
    if (currentIndex > 0) {
      currentIndex--;
      updateFilter();
    }
  }

  function goNext() {
    var visible = getVisibleCards();
    if (currentIndex < visible.length - 1) {
      currentIndex++;
      updateFilter();
    }
  }

  if (singleCheck) {
    singleCheck.addEventListener('change', function() {
      currentIndex = 0;
      updateFilter();
    });
  }
  if (prevBtn) prevBtn.addEventListener('click', goPrev);
  if (nextBtn) nextBtn.addEventListener('click', goNext);

  if (examSelect) examSelect.addEventListener('change', function() { currentIndex = 0; updateFilter(); });
  if (subjectSelect) subjectSelect.addEventListener('change', function() { currentIndex = 0; updateFilter(); });

  updateFilter();
})();
</script>
