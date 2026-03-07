---
layout: default
permalink: /language/lm11-question/
title: Linux Master 1급 1차
# 데이터: _data/lm11/questions.json, exams.json, subjects.json
---

<div class="app-page-container">
  <header class="quiz-filter-wrap" role="region" aria-label="문제 필터">
    <h2 class="page-title">{{ page.title }}</h2>
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
    <button type="button" id="bank-shuffle-order" class="quiz-shuffle-btn">문제 순서 섞기</button>
  </header>

  <section class="quiz-bank-section" id="bank-section" aria-label="문제 목록">
    {% include quiz_cards_bank.html questions=site.data.lm11.questions %}
  </section>

  <nav class="quiz-one-nav" id="bank-one-nav" aria-label="한 문제씩 이동" style="margin-bottom: 1.5rem;">
    <a href="#" id="bank-prev" class="quiz-one-nav__btn" aria-label="이전 문제">
      <span class="app-nav-ico app-nav-ico--svg" style="--ico: url('{{ site.baseurl }}/assets/svg/default/chevron-left.svg');" aria-hidden="true"></span>
    </a>
    <span class="quiz-one-nav__count" id="bank-one-count" aria-live="polite">1 / 100</span>
    <a href="#" id="bank-next" class="quiz-one-nav__btn" aria-label="다음 문제">
      <span class="app-nav-ico app-nav-ico--svg" style="--ico: url('{{ site.baseurl }}/assets/svg/default/chevron-right.svg');" aria-hidden="true"></span>
    </a>
  </nav>

  <section class="quiz-answer-sheet-wrap" id="quiz-answer-sheet" hidden aria-label="답안지">
    <h2 class="quiz-answer-sheet-title">답안지</h2>
    <p class="quiz-answer-sheet-hint">선지를 선택하면 여기에 기록됩니다. 시험을 선택하면 해당 시험 1~100번이 표시됩니다.</p>
    <div class="quiz-answer-sheet-actions">
      <button type="button" id="quiz-grade-btn" class="quiz-grade-btn">채점하기</button>
      <button type="button" id="quiz-reset-btn" class="quiz-reset-btn">선택 초기화</button>
      <p id="quiz-grade-result" class="quiz-grade-result" aria-live="polite" hidden></p>
    </div>
    <div class="quiz-answer-sheet-grid" id="quiz-answer-sheet-list"></div>
  </section>
</div>

<script>
(function () {
  var examSelect = document.getElementById('bank-exam-select');
  var subjectSelect = document.getElementById('bank-subject-select');
  var oneNav = document.getElementById('bank-one-nav');
  var prevBtn = document.getElementById('bank-prev');
  var nextBtn = document.getElementById('bank-next');
  var oneCountEl = document.getElementById('bank-one-count');
  var bankSection = document.getElementById('bank-section');
  var gradeBtn = document.getElementById('quiz-grade-btn');
  var resultEl = document.getElementById('quiz-grade-result');
  var listEl = document.getElementById('quiz-answer-sheet-list');
  var memoEl = document.getElementById('quiz-memo');
  var memoCurrentEl = document.getElementById('quiz-memo-current');

  var cards = document.querySelectorAll('.quiz-card--bank');
  if (!cards.length) return;

  var currentIndex = 0;

  // ---- 필터 / 한 문제씩 보기 ----
  function getVisibleCards() {
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

  function updateFilter() {
    var visible = getVisibleCards();
    currentIndex = Math.max(0, Math.min(currentIndex, visible.length - 1));
    cards.forEach(function (card) { card.hidden = true; });
    visible.forEach(function (card, i) { card.hidden = (i !== currentIndex); });
    if (oneNav) oneNav.hidden = visible.length === 0;
    if (bankSection) bankSection.classList.add('is-single-mode');
    if (oneCountEl && visible.length) {
      oneCountEl.textContent = (currentIndex + 1) + ' / ' + visible.length;
      if (prevBtn) {
        prevBtn.setAttribute('aria-disabled', currentIndex <= 0 ? 'true' : 'false');
        prevBtn.classList.toggle('is-disabled', currentIndex <= 0);
      }
      if (nextBtn) {
        nextBtn.setAttribute('aria-disabled', currentIndex >= visible.length - 1 ? 'true' : 'false');
        nextBtn.classList.toggle('is-disabled', currentIndex >= visible.length - 1);
      }
    }
  }

  function goPrev(e) {
    if (e) e.preventDefault();
    var visible = getVisibleCards();
    if (currentIndex > 0) {
      currentIndex--;
      updateFilter();
    }
  }

  function goNext(e) {
    if (e) e.preventDefault();
    var visible = getVisibleCards();
    if (currentIndex < visible.length - 1) {
      currentIndex++;
      updateFilter();
    }
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
    currentIndex = 0;
    updateFilter();
  }

  if (document.getElementById('bank-shuffle-order')) {
    document.getElementById('bank-shuffle-order').addEventListener('click', shuffleOrder);
  }
  if (prevBtn) prevBtn.addEventListener('click', function (e) { e.preventDefault(); goPrev(e); });
  if (nextBtn) nextBtn.addEventListener('click', function (e) { e.preventDefault(); goNext(e); });

  if (examSelect) {
    examSelect.addEventListener('change', function () {
      currentIndex = 0;
      updateFilter();
      clearGrade();
      buildAnswerSheet();
    });
  }
  if (subjectSelect) {
    subjectSelect.addEventListener('change', function () {
      currentIndex = 0;
      updateFilter();
    });
  }

  // ---- 답안지 ----
  function getStoredAnswers() {
    try {
      var raw = localStorage.getItem('lm11-answer-sheet');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function buildAnswerSheet() {
    var wrap = document.getElementById('quiz-answer-sheet');
    var list = document.getElementById('quiz-answer-sheet-list');
    if (!wrap || !list || !examSelect) return;
    var examKey = examSelect.value || '';
    if (!examKey) {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    var answers = getStoredAnswers();
    var circle = ['①', '②', '③', '④'];
    list.innerHTML = '';
    for (var n = 1; n <= 100; n++) {
      var key = examKey + '-' + n;
      var val = answers[key];
      var cell = document.createElement('span');
      cell.className = 'answer-sheet__cell';
      cell.setAttribute('data-question-key', key);
      cell.textContent = n + '번 ' + (val ? circle[val - 1] : '-');
      list.appendChild(cell);
    }
  }

  document.addEventListener('quiz-answer-changed', buildAnswerSheet);
  buildAnswerSheet();

  // ---- 채점 ----
  var isGraded = false;

  function clearGrade() {
    if (!listEl) return;
    listEl.querySelectorAll('.answer-sheet__cell').forEach(function (cell) {
      cell.classList.remove('is-correct', 'is-wrong');
    });
    if (resultEl) {
      resultEl.hidden = true;
      resultEl.textContent = '';
      resultEl.className = 'quiz-grade-result';
    }
    if (gradeBtn) gradeBtn.textContent = '채점하기';
    isGraded = false;
  }

  function runGrade() {
    var examKey = examSelect && examSelect.value;
    if (!examKey || !resultEl || !listEl) return;
    if (isGraded) {
      clearGrade();
      return;
    }
    var answers = getStoredAnswers();
    var correct = 0;
    var answered = 0;
    listEl.querySelectorAll('.answer-sheet__cell').forEach(function (cell) {
      cell.classList.remove('is-correct', 'is-wrong');
    });
    for (var n = 1; n <= 100; n++) {
      var key = examKey + '-' + n;
      var userChoice = answers[key];
      if (userChoice == null) continue;
      answered++;
      var card = document.querySelector('.quiz-card--bank[data-exam-key="' + examKey + '"][data-local-id="' + n + '"]');
      if (!card) continue;
      var opts = card.querySelectorAll('.quiz-card__options--selectable .quiz-card__option');
      var chosenLi = null;
      for (var i = 0; i < opts.length; i++) {
        if (String(opts[i].getAttribute('data-choice')) === String(userChoice)) {
          chosenLi = opts[i];
          break;
        }
      }
      var cellEl = listEl.querySelector('.answer-sheet__cell[data-question-key="' + key + '"]');
      if (!cellEl) continue;
      if (chosenLi && chosenLi.getAttribute('data-correct') === 'true') {
        correct++;
        cellEl.classList.add('is-correct');
      } else {
        cellEl.classList.add('is-wrong');
      }
    }
    resultEl.hidden = false;
    if (answered === 0) {
      resultEl.textContent = '푼 문항이 없습니다. 선지를 선택한 뒤 채점해 주세요.';
      resultEl.className = 'quiz-grade-result';
    } else {
      resultEl.textContent = '맞힌 개수: ' + correct + ' / 푼 개수: ' + answered + ' (미응답 ' + (100 - answered) + '문항 제외)';
      resultEl.className = 'quiz-grade-result quiz-grade-result--done';
    }
    if (gradeBtn) gradeBtn.textContent = '채점 전으로';
    isGraded = true;
  }

  if (gradeBtn) gradeBtn.addEventListener('click', runGrade);

  var resetBtn = document.getElementById('quiz-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      document.dispatchEvent(new CustomEvent('quiz-answer-reset'));
      clearGrade();
      buildAnswerSheet();
    });
  }

  // ---- 메모 (카드 키 ↔ 라벨/노트) ----
  function getQuestionKeyFromCard(card) {
    var ek = card.getAttribute('data-exam-key');
    var lid = card.getAttribute('data-local-id');
    return ek && lid ? ek + '-' + lid : null;
  }

  function getCardByKey(key) {
    if (!key || !cards.length) return null;
    for (var i = 0; i < cards.length; i++) {
      if (getQuestionKeyFromCard(cards[i]) === key) return cards[i];
    }
    return null;
  }

  function getMemoLabelFromKey(key) {
    var card = getCardByKey(key);
    if (!card) return key;
    var numEl = card.querySelector('.quiz-card__num');
    var bodyEl = card.querySelector('.quiz-card__body');
    var label = '';
    if (numEl) label += numEl.textContent.trim() + ' ';
    if (bodyEl) label += bodyEl.textContent.trim();
    return label || key;
  }

  function getMemoNotesFromKey(key) {
    var card = getCardByKey(key);
    return card ? (card.getAttribute('data-notes') || '') : '';
  }

  function parseNotesFromAttr(attr) {
    if (!attr) return '';
    try {
      var p = JSON.parse(attr);
      return Array.isArray(p) ? p.join('\n') : (typeof p === 'string' ? p : '');
    } catch (e) {
      return attr;
    }
  }

  var MEMO_MAP_KEY = 'lm11-memo-map';
  var MEMO_CURRENT_KEY = 'lm11-memo-current';
  var memoMap = {};
  var currentMemoKey = null;
  var memoTimeout = null;

  function loadMemoMap() {
    try {
      var raw = localStorage.getItem(MEMO_MAP_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveMemoMap() {
    try {
      localStorage.setItem(MEMO_MAP_KEY, JSON.stringify(memoMap));
    } catch (e) {}
  }

  function setCurrentMemoTarget(key, initialNotes) {
    if (!memoEl) return;
    currentMemoKey = key;
    if (!memoMap) memoMap = {};
    var text = Object.prototype.hasOwnProperty.call(memoMap, key)
      ? memoMap[key]
      : (parseNotesFromAttr(initialNotes) || parseNotesFromAttr(getMemoNotesFromKey(key)) || '');
    memoEl.disabled = false;
    memoEl.value = text;
    if (memoCurrentEl) memoCurrentEl.textContent = getMemoLabelFromKey(key);
    try { localStorage.setItem(MEMO_CURRENT_KEY, key); } catch (e) {}
  }

  if (memoEl) {
    memoMap = loadMemoMap();
    memoEl.disabled = true;
    if (memoCurrentEl) memoCurrentEl.textContent = '';
    try {
      var lastKey = localStorage.getItem(MEMO_CURRENT_KEY);
      if (lastKey) setCurrentMemoTarget(lastKey);
    } catch (e) {}

    memoEl.addEventListener('input', function () {
      if (!currentMemoKey) return;
      if (memoTimeout) clearTimeout(memoTimeout);
      memoTimeout = setTimeout(function () {
        memoTimeout = null;
        memoMap[currentMemoKey] = memoEl.value;
        saveMemoMap();
      }, 300);
    });

    document.addEventListener('quiz-memo-select', function (e) {
      var key = e && e.detail && e.detail.key;
      var notes = e && e.detail && e.detail.notes;
      if (!key) return;
      setCurrentMemoTarget(key, notes);
      memoEl.focus();
    });
  }

  updateFilter();
})();
</script>
