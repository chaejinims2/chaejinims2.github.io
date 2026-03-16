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
    var timerEl = document.getElementById("quiz-timer");

    var cards = toArray(root.querySelectorAll(".quiz-card-block"));
    var matched = [];
    var current = 0;
    var timerInterval = null;
    var seconds = 0;

    // --- 타이머 기능 ---
    function startTimer() {
      if (timerInterval) clearInterval(timerInterval);
      seconds = 0;
      if (timerEl) timerEl.textContent = "00:00";
      
      timerInterval = setInterval(function () {
        seconds++;
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        if (timerEl) {
          timerEl.textContent = 
            (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
        }
      }, 1000);
    }

    function stopTimer() {
      clearInterval(timerInterval);
      var finalTime = timerEl ? timerEl.textContent : "";
      alert("퀴즈가 종료되었습니다! 소요 시간: " + finalTime);
    }

    function loadState() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) { return null; }
    }

    function saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          examKey: (examSelect && examSelect.value) || "",
          subjectKey: (subjectSelect && subjectSelect.value) || "",
          current: current,
        }));
      } catch (e) {}
    }

    function getMatchedCards() {
      var examKey = (examSelect && examSelect.value) || "";
      var subjectKey = (subjectSelect && subjectSelect.value) || "";
      return cards.filter(function (card) {
        var matchExam = !examKey || card.getAttribute("data-exam-key") === examKey;
        var matchSubject = !subjectKey || card.getAttribute("data-subject-key") === String(subjectKey);
        return matchExam && matchSubject;
      });
    }

    function render() {
      matched = getMatchedCards();
      if (current < 0) current = 0;
      if (current >= matched.length) current = Math.max(0, matched.length - 1);

      cards.forEach(function (c) { c.hidden = true; });
      if (matched[current]) matched[current].hidden = false;

      if (statusEl)
        statusEl.textContent = (matched.length ? current + 1 : 0) + " / " + matched.length;

      if (prevBtn) prevBtn.disabled = matched.length === 0 || current === 0;

      if (nextBtn) {
        var isLast = matched.length > 0 && current === matched.length - 1;
        if (isLast) {
          nextBtn.textContent = "Stop";
          nextBtn.disabled = false;
          nextBtn.classList.add("is-stop"); // CSS 스타일링용 클래스 추가 가능
        } else {
          nextBtn.textContent = "Next";
          nextBtn.disabled = matched.length === 0;
          nextBtn.classList.remove("is-stop");
        }
      }

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
      // 마지막 문제에서 Next(Stop) 클릭 시
      if (delta === 1 && current === matched.length - 1) {
        stopTimer();
        nextBtn.disabled = true;
        return;
      }
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

    // Start button 로직 통합
    if (startBtn) {
      startBtn.addEventListener("click", function () {
        var section = document.getElementById("quiz-section");
        var pager = document.querySelector(".quiz-pager");
        if (section) {
          section.style.display = "block";
          if (pager) pager.style.display = "flex";
          
          applyFilter(true);
          startTimer(); // 타이머 시작

          startBtn.style.display = "none";
          var filters = document.querySelector(".quiz-filters-wrap");
          if (filters) filters.style.display = "none";
          
          if (window.initLm11QuizCardInteractions) {
            window.initLm11QuizCardInteractions();
          }
        }
      });
    }
  }

  // 페이지 로드 시 실행
  window.initLm11QuizPage = initLm11QuizPage;
  initLm11QuizPage();

})();
