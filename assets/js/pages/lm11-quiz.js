(function () {
  "use strict";

  function forEachNode(nodeList, fn) {
    Array.prototype.forEach.call(nodeList || [], fn);
  }

  function toArray(nodeList) {
    return Array.prototype.slice.call(nodeList || []);
  }

  /* LM11 Quiz pager (single card per page, PJAX-safe) */
  function initLm11QuizPage() {
    var root = document.getElementById("quiz-section");
    if (!root) return;
    if (root.dataset.lm11QuizInit === "1") return;
    root.dataset.lm11QuizInit = "1";

    var STORAGE_KEY = "lm11-quiz-pager";
    var examSelect = document.getElementById("quiz-exam-select");
    var subjectSelect = document.getElementById("quiz-subject-select");
    var applyBtn = document.getElementById("quiz-filter-apply");
    var prevBtn = document.getElementById("quiz-prev");
    var nextBtn = document.getElementById("quiz-next");
    var statusEl = document.getElementById("quiz-status");
    var startBtn = document.getElementById("quiz-start-btn");

    var cards = toArray(root.querySelectorAll(".quiz-card-block"));
    var matched = [];
    var current = 0;

    function loadState() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    function saveState() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            examKey: (examSelect && examSelect.value) || "",
            subjectKey: (subjectSelect && subjectSelect.value) || "",
            current: current,
          })
        );
      } catch (e) {}
    }

    function getMatchedCards() {
      var examKey = (examSelect && examSelect.value) || "";
      var subjectKey = (subjectSelect && subjectSelect.value) || "";
      return cards.filter(function (card) {
        var matchExam = !examKey || card.getAttribute("data-exam-key") === examKey;
        var matchSubject =
          !subjectKey || card.getAttribute("data-subject-key") === String(subjectKey);
        return matchExam && matchSubject;
      });
    }

    function render() {
      matched = getMatchedCards();
      if (current < 0) current = 0;
      if (current >= matched.length) current = Math.max(0, matched.length - 1);

      cards.forEach(function (c) {
        c.hidden = true;
      });
      if (matched[current]) matched[current].hidden = false;

      if (statusEl)
        statusEl.textContent =
          (matched.length ? current + 1 : 0) + " / " + matched.length;
      if (prevBtn) prevBtn.disabled = matched.length === 0 || current === 0;
      if (nextBtn)
        nextBtn.disabled = matched.length === 0 || current === matched.length - 1;

      saveState();
      if (matched[current])
        matched[current].scrollIntoView({ block: "start", behavior: "instant" });
    }

    function applyFilter(resetToFirst) {
      if (resetToFirst) current = 0;
      render();
    }

    function go(delta) {
      if (!matched.length) return;
      current += delta;
      render();
    }

    // 초기 상태 복원
    var st = loadState();
    if (st) {
      if (examSelect) examSelect.value = st.examKey || "";
      if (subjectSelect) subjectSelect.value = st.subjectKey || "";
      current = typeof st.current === "number" ? st.current : 0;
    }

    if (applyBtn) applyBtn.addEventListener("click", function () { applyFilter(true); });
    if (prevBtn) prevBtn.addEventListener("click", function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(1); });

    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });

    // Start button
    if (startBtn) {
      startBtn.addEventListener("click", function () {
        var section = document.getElementById("quiz-section");
        var pager = document.querySelector(".quiz-pager");
        if (section) {
          section.style.display = "block";
          if (pager) pager.style.display = "flex";
          applyFilter(true);
          // Hide start button and filters after starting
          startBtn.style.display = "none";
          var filters = document.querySelector(".quiz-filters-wrap");
          if (filters) filters.style.display = "none";
          // Initialize card interactions after showing
          if (window.initLm11QuizCardInteractions) {
            window.initLm11QuizCardInteractions();
          }
        }
      });
    }

    // Do not render initially; wait for start
  }

  /* LM11 Quiz: card interactions (options select + explanation toggle + highlight + swipe) */
  function initLm11QuizCardInteractions() {
    var root = document.getElementById("quiz-section");
    if (!root) {
      console.log("initLm11QuizCardInteractions: quiz-section not found");
      return;
    }
    if (root.dataset.lm11QuizCardInit === "1") {
      console.log("initLm11QuizCardInteractions: already initialized");
      return;
    }
    root.dataset.lm11QuizCardInit = "1";
    console.log("initLm11QuizCardInteractions: initializing");

    var STORAGE_KEY = "lm11-answer-sheet";
    var quizRoot = root.querySelector(".quiz-cards-set") || root;

    var prevBtn = document.getElementById("quiz-prev");
    var nextBtn = document.getElementById("quiz-next");
    var examSelect = document.getElementById("quiz-exam-select");
    var subjectSelect = document.getElementById("quiz-subject-select");
    var applyBtn = document.getElementById("quiz-filter-apply");

    function shuffleList(list) {
      var items = toArray(list && list.children);
      for (var i = items.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = items[i];
        items[i] = items[j];
        items[j] = t;
      }
      items.forEach(function (el) {
        list.appendChild(el);
      });
    }

    function setChoiceNumbers(ol) {
      forEachNode(ol && ol.querySelectorAll(".quiz-card__option"), function (li, i) {
        li.setAttribute("data-choice", String(i + 1));
      });
    }

    function loadAnswers() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    function saveAnswers(obj) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      } catch (e) {}
    }

    function getQuestionKey(card) {
      var ek = card.getAttribute("data-exam-key");
      var lid = card.getAttribute("data-local-id");
      return ek && lid ? ek + "-" + lid : null;
    }

    function applySelectionToCard(card, answers) {
      var key = getQuestionKey(card);
      if (!key) return;
      var choice = answers[key];
      forEachNode(card.querySelectorAll(".quiz-card__option"), function (li) {
        var c = li.getAttribute("data-choice");
        var selected = c && String(choice) === c;
        li.classList.toggle("is-selected", selected);
        li.setAttribute("aria-pressed", selected ? "true" : "false");
      });
    }

    function handleOptionToggle(card, li, answers) {
      var key = getQuestionKey(card);
      if (!key) return;
      var choice = li.getAttribute("data-choice");
      if (!choice) return;
      var num = parseInt(choice, 10);
      if (num < 1 || num > 4) return;

      if (answers[key] === num) delete answers[key];
      else answers[key] = num;

      saveAnswers(answers);
      applySelectionToCard(card, answers);
    }

    function syncAnswerToggleState(panel) {
      if (!panel) return;
      var content = panel.querySelector(".quiz-answer-content");
      var toggle = panel.querySelector(".quiz-answer-toggle");
      if (!content || !toggle) return;
      var expanded = !content.classList.contains("is-hidden");
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      toggle.setAttribute("aria-label", expanded ? "해설 숨기기" : "해설 보기");
    }

    function toggleAnswerPanel(panel) {
      if (!panel) return;
      var content = panel.querySelector(".quiz-answer-content");
      if (!content) return;
      content.classList.toggle("is-hidden");
      syncAnswerToggleState(panel);
    }

    function triggerFilter() {
      if (applyBtn) {
        applyBtn.click();
        return;
      }
      if (window.initLm11QuizPage) {
        try {
          window.initLm11QuizPage();
        } catch (e) {}
      }
    }

    if (examSelect) examSelect.addEventListener("change", triggerFilter);
    if (subjectSelect) subjectSelect.addEventListener("change", triggerFilter);

    // Shuffle options if needed
    forEachNode(
      document.querySelectorAll(".quiz-cards-set .quiz-card__options[data-shuffle]"),
      function (ol) {
        shuffleList(ol);
        setChoiceNumbers(ol);
      }
    );

    // Set choice numbers for all options (even if not shuffled)
    forEachNode(document.querySelectorAll(".quiz-card__options"), function (ol) {
      setChoiceNumbers(ol);
    });

    var answers = loadAnswers();
    forEachNode(document.querySelectorAll(".quiz-card-block"), function (card) {
      applySelectionToCard(card, answers);
    });

    // 초기 해설 버튼 상태 동기화
    forEachNode(document.querySelectorAll(".quiz-answer"), function (panel) {
      syncAnswerToggleState(panel);
    });

    // 클릭/키보드 이벤트 위임
    quizRoot.addEventListener("click", function (e) {
      var li = e.target.closest && e.target.closest(".quiz-card__option");
      if (li && quizRoot.contains(li)) {
        console.log("Option clicked:", li);
        var card = li.closest(".quiz-card-block");
        if (!card) return;
        handleOptionToggle(card, li, answers);
        return;
      }

      var toggle = e.target.closest && e.target.closest(".quiz-answer-toggle");
      if (toggle && quizRoot.contains(toggle)) {
        var panel = toggle.closest(".quiz-answer");
        toggleAnswerPanel(panel);
      }
    });

    quizRoot.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;

      var li = e.target.closest && e.target.closest(".quiz-card__option");
      if (li && quizRoot.contains(li)) {
        var card = li.closest(".quiz-card-block");
        if (!card) return;
        e.preventDefault();
        handleOptionToggle(card, li, answers);
        return;
      }

      var toggle = e.target.closest && e.target.closest(".quiz-answer-toggle");
      if (toggle && quizRoot.contains(toggle)) {
        var panel = toggle.closest(".quiz-answer");
        e.preventDefault();
        toggleAnswerPanel(panel);
      }
    });

    // 문제 본문 강조
    forEachNode(document.querySelectorAll(".quiz-card .quiz-card__body"), function (el) {
      var text = el.textContent;
      if (!text) return;
      var re = /(틀린 것|알맞은 것|올바른 것)/g;
      if (re.test(text)) {
        el.innerHTML = el.innerHTML.replace(
          re,
          '<span class="quiz-card__body-underline">$1</span>'
        );
      }
    });

    // Swipe: prev/next
    var startX = 0,
      startY = 0,
      currentX = 0,
      currentY = 0,
      isTracking = false;
    var SWIPE_THRESHOLD = 60;
    var VERTICAL_LIMIT = 40;

    function onTouchStart(e) {
      if (!e.touches || e.touches.length !== 1) return;
      var touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      currentX = startX;
      currentY = startY;
      isTracking = true;
    }

    function onTouchMove(e) {
      if (!isTracking || !e.touches || e.touches.length !== 1) return;
      var touch = e.touches[0];
      currentX = touch.clientX;
      currentY = touch.clientY;
    }

    function onTouchEnd() {
      if (!isTracking) return;
      isTracking = false;
      var deltaX = currentX - startX;
      var deltaY = currentY - startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      if (Math.abs(deltaY) > VERTICAL_LIMIT) return;
      if (deltaX > SWIPE_THRESHOLD) {
        if (prevBtn && !prevBtn.disabled) prevBtn.click();
        return;
      }
      if (deltaX < -SWIPE_THRESHOLD) {
        if (nextBtn && !nextBtn.disabled) nextBtn.click();
        return;
      }
    }

    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: true });
    root.addEventListener("touchend", onTouchEnd, { passive: true });
    root.addEventListener("touchcancel", onTouchEnd, { passive: true });
  }

  window.initLm11QuizPage = initLm11QuizPage;
  window.initLm11QuizCardInteractions = initLm11QuizCardInteractions;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initLm11QuizPage();
      initLm11QuizCardInteractions();
    });
  } else {
    initLm11QuizPage();
    initLm11QuizCardInteractions();
  }
})();
