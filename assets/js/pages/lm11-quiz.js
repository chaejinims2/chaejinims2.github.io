(function () {
  "use strict";

  function forEachNode(nodeList, fn) {
    Array.prototype.forEach.call(nodeList || [], fn);
  }

  function toArray(nodeList) {
    return Array.prototype.slice.call(nodeList || []);
  }

  /* 헬퍼: 답안 데이터 관리 */
  window.loadLm11Answers = function() {
    try {
      var raw = localStorage.getItem("lm11-answer-sheet");
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  };

  window.saveLm11Answers = function(obj) {
    try {
      localStorage.setItem("lm11-answer-sheet", JSON.stringify(obj));
    } catch (e) {}
  };

  /* LM11 Quiz pager (메인 제어) */
  function initLm11QuizPage() {
    var root = document.getElementById("quiz-section");
    if (!root) return;
    if (root.dataset.lm11QuizInit === "1") return;
    root.dataset.lm11QuizInit = "1";

    var STORAGE_KEY = "lm11-quiz-pager";
    var ANS_STORAGE_KEY = "lm11-answer-sheet";
    var examSelect = document.getElementById("quiz-exam-select");
    var subjectSelect = document.getElementById("quiz-subject-select");
    var prevBtn = document.getElementById("quiz-prev");
    var nextBtn = document.getElementById("quiz-next");
    var statusEl = document.getElementById("quiz-status");
    var startBtn = document.getElementById("quiz-start-btn");
    var timerEl = document.getElementById("quiz-timer");
    var ansSheetEl = document.getElementById("quiz-ans-sheet");

    var cards = toArray(root.querySelectorAll(".quiz-card-block"));
    var matched = [];
    var current = 0;
    var timerInterval = null;
    var seconds = 0;

    function getQuestionKey(card) {
      var ek = card.getAttribute("data-exam-key");
      var lid = card.getAttribute("data-local-id");
      return ek && lid ? ek + "-" + lid : null;
    }

    function startTimer() {
      if (timerInterval) clearInterval(timerInterval);
      seconds = 0;
      if (timerEl) timerEl.textContent = "00:00";
      timerInterval = setInterval(function () {
        seconds++;
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        if (timerEl) {
          timerEl.textContent = (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
        }
      }, 1000);
    }

    // --- 채점 및 종료 로직 ---
    function stopTimer() {
      clearInterval(timerInterval);
      var finalTime = timerEl ? timerEl.textContent : "00:00";
      var allAnswers = window.loadLm11Answers();
      
      var correctCount = 0;
      var report = [];

      matched.forEach(function(card, index) {
        var qKey = getQuestionKey(card);
        var userAns = allAnswers[qKey]; // 선택한 번호 (1, 2, 3...)
        
        // 카드 내 data-correct="true"인 li 찾기
        var options = toArray(card.querySelectorAll('.quiz-card__option'));
        var correctOption = card.querySelector('.quiz-card__option[data-correct="true"]');
        var correctAnswerNum = options.indexOf(correctOption) + 1;

        var isCorrect = userAns && parseInt(userAns, 10) === correctAnswerNum;
        if (isCorrect) correctCount++;

        report.push({
          "No": index + 1,
          "Question": qKey,
          "My Answer": userAns || "Unanswered",
          "Correct": correctAnswerNum,
          "Result": isCorrect ? "O" : "X"
        });
      });

      var score = Math.round((correctCount / matched.length) * 100);

      console.log("=== 퀴즈 종료 리포트 ===");
      console.log("소요 시간:", finalTime);
      console.log("최종 점수:", score + "점");
      console.table(report);

      alert("종료되었습니다!\n점수: " + score + "점\n시간: " + finalTime + "\n맞은 개수: " + correctCount + "/" + matched.length);
    }
    
    function renderAnswerSheet() {
      if (!ansSheetEl) return;
      ansSheetEl.innerHTML = "";
      var answers = window.loadLm11Answers();

      matched.forEach(function(card, index) {
        var dot = document.createElement("div");
        dot.className = "ans-dot";
        if (index === current) dot.classList.add("is-active");
        var key = getQuestionKey(card);
        if (answers[key]) dot.classList.add("is-filled");
        dot.textContent = index + 1;
        dot.onclick = function() {
          current = index;
          render();
        };
        ansSheetEl.appendChild(dot);
      });
    }
    window.refreshLm11AnsSheet = renderAnswerSheet;

    function render() {
      matched = getMatchedCards();
      if (current < 0) current = 0;
      if (current >= matched.length) current = Math.max(0, matched.length - 1);

      cards.forEach(function (c) { c.hidden = true; });
      if (matched[current]) matched[current].hidden = false;

      if (statusEl) statusEl.textContent = (matched.length ? current + 1 : 0) + " / " + matched.length;
      if (prevBtn) prevBtn.disabled = matched.length === 0 || current === 0;
      if (nextBtn) {
        var isLast = matched.length > 0 && current === matched.length - 1;
        nextBtn.textContent = isLast ? "Stop" : "Next";
      }

      renderAnswerSheet();
      if (matched[current]) matched[current].scrollIntoView({ block: "start", behavior: "instant" });
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

    function go(delta) {
      if (!matched.length) return;
      if (delta === 1 && current === matched.length - 1) {
        stopTimer();
        return;
      }
      current += delta;
      render();
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(1); });

    if (startBtn) {
      startBtn.addEventListener("click", function () {
        // 데이터 및 UI 초기화
        localStorage.removeItem(ANS_STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
        current = 0;

        document.getElementById("quiz-section").style.display = "block";
        document.querySelector(".quiz-pager").style.display = "flex";
        
        render();
        startTimer();
        
        startBtn.style.display = "none";
        if (document.querySelector(".quiz-filters-wrap")) {
          document.querySelector(".quiz-filters-wrap").style.display = "none";
        }
        
        // 카드 선택 UI 강제 초기화 및 이벤트 재연결
        initLm11QuizCardInteractions(true); 
      });
    }
  }

  /* LM11 Quiz: 카드 상호작용 */
  function initLm11QuizCardInteractions(isReset) {
    var cards = document.querySelectorAll(".quiz-card-block");
    
    forEachNode(cards, function(card) {
      var options = card.querySelectorAll(".quiz-card__option");
      var qKey = card.getAttribute("data-exam-key") + "-" + card.getAttribute("data-local-id");

      // 초기화 요청 시 모든 선택 클래스 제거
      if (isReset) {
        forEachNode(options, function(opt) { opt.classList.remove("is-selected"); });
      }

      forEachNode(options, function(opt, idx) {
        // 이벤트 중복 등록 방지 (PJAX 대응 등)
        if (!opt.dataset.hasEvent || isReset) {
          opt.onclick = function() {
            var answers = window.loadLm11Answers();
            var choiceNum = idx + 1;
            if (answers[qKey] === choiceNum) {
              delete answers[qKey];
            } else {
              answers[qKey] = choiceNum;
            }
            window.saveLm11Answers(answers);
            updateCardUI(card, answers[qKey]);
            if (window.refreshLm11AnsSheet) window.refreshLm11AnsSheet();
          };
          opt.dataset.hasEvent = "true";
        }
      });

      var savedAnswers = window.loadLm11Answers();
      updateCardUI(card, savedAnswers[qKey]);
    });

    function updateCardUI(card, selectedIdx) {
      var options = card.querySelectorAll(".quiz-card__option");
      forEachNode(options, function(opt, idx) {
        opt.classList.toggle("is-selected", (idx + 1) === selectedIdx);
      });
    }
  }

  window.initLm11QuizPage = initLm11QuizPage;
  initLm11QuizPage();

})();
