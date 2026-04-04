/**
 * Kangourou des Mathématiques — Application principale
 */

// ─── STATE ──────────────────────────────────────────────
const state = {
  currentLevel: null,
  questions: [],
  answers: [],          // index choisi par l'utilisateur (null = sans réponse)
  currentIndex: 0,
  timerSeconds: 0,
  timerInterval: null,
  isPaused: false,
  isFinished: false,
};

// ─── DOM REFS ───────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
  screenHome:    $("#screen-home"),
  screenQuiz:    $("#screen-quiz"),
  screenResults: $("#screen-results"),
  levelGrid:     $("#level-grid"),
  quizLevelLabel:$("#quiz-level-label"),
  quizProgress:  $("#quiz-progress"),
  timer:         $("#timer"),
  btnPause:      $("#btn-pause"),
  btnStop:       $("#btn-stop"),
  pauseOverlay:  $("#pause-overlay"),
  btnResume:     $("#btn-resume"),
  btnQuitPause:  $("#btn-quit-pause"),
  questionDiff:  $("#question-difficulty"),
  questionText:  $("#question-text"),
  choices:       $("#choices"),
  btnPrev:       $("#btn-prev"),
  btnNext:       $("#btn-next"),
  btnFinish:     $("#btn-finish"),
  resultScore:   $("#result-score"),
  resultPoints:  $("#result-points"),
  resultTime:    $("#result-time"),
  resultsDetail: $("#results-detail"),
  btnRetry:      $("#btn-retry"),
  btnHome:       $("#btn-home"),
};

// ─── INIT ───────────────────────────────────────────────
function init() {
  renderLevelGrid();
  dom.btnPause.addEventListener("click", togglePause);
  dom.btnStop.addEventListener("click", () => showPauseOverlay(true));
  dom.btnResume.addEventListener("click", togglePause);
  dom.btnQuitPause.addEventListener("click", quitQuiz);
  dom.btnPrev.addEventListener("click", () => navigateQuestion(-1));
  dom.btnNext.addEventListener("click", () => navigateQuestion(1));
  dom.btnFinish.addEventListener("click", finishQuiz);
  dom.btnRetry.addEventListener("click", retryLevel);
  dom.btnHome.addEventListener("click", goHome);

  // Toggle hint update
  const toggle = document.getElementById("use-generated");
  const hint = document.getElementById("toggle-hint");
  toggle.addEventListener("change", () => {
    hint.textContent = toggle.checked
      ? "Les questions sont générées aléatoirement — chaque quiz est unique."
      : "Questions de la banque statique (24 par niveau).";
  });
}

// ─── SCREENS ────────────────────────────────────────────
function showScreen(screenId) {
  $$(".screen").forEach((s) => s.classList.remove("active"));
  $(`#screen-${screenId}`).classList.add("active");
}

// ─── LEVEL GRID ─────────────────────────────────────────
function renderLevelGrid() {
  dom.levelGrid.innerHTML = LEVELS.map(
    (lvl) => `
    <button class="level-btn" data-level="${lvl.id}" style="--level-color: ${lvl.color}">
      <span class="level-name">${lvl.label}</span>
      <span class="level-info">${lvl.questions} questions · ${lvl.timeMinutes} min</span>
    </button>
  `
  ).join("");

  dom.levelGrid.querySelectorAll(".level-btn").forEach((btn) => {
    btn.addEventListener("click", () => startQuiz(btn.dataset.level));
  });
}

// ─── START QUIZ ─────────────────────────────────────────
function startQuiz(levelId) {
  const level = LEVELS.find((l) => l.id === levelId);
  if (!level) return;

  const useGenerated = document.getElementById("use-generated").checked;

  state.currentLevel = level;
  if (useGenerated && typeof generateQuestions === "function" && GENERATORS[levelId]) {
    state.questions = generateQuestions(levelId, level.questions);
  } else if (QUESTIONS[levelId]) {
    state.questions = shuffleArray([...QUESTIONS[levelId]]);
  } else {
    return;
  }
  state.answers = new Array(state.questions.length).fill(null);
  state.currentIndex = 0;
  state.timerSeconds = 0;
  state.isPaused = false;
  state.isFinished = false;

  dom.quizLevelLabel.textContent = level.label;
  dom.quizLevelLabel.style.background = level.color;
  dom.pauseOverlay.classList.add("hidden");

  showScreen("quiz");
  renderQuestion();
  startTimer();
}

// ─── TIMER ──────────────────────────────────────────────
function startTimer() {
  clearInterval(state.timerInterval);
  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    if (!state.isPaused) {
      state.timerSeconds++;
      updateTimerDisplay();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(state.timerSeconds / 60).toString().padStart(2, "0");
  const s = (state.timerSeconds % 60).toString().padStart(2, "0");
  dom.timer.textContent = `${m}:${s}`;
}

function stopTimer() {
  clearInterval(state.timerInterval);
}

// ─── PAUSE ──────────────────────────────────────────────
function togglePause() {
  state.isPaused = !state.isPaused;
  if (state.isPaused) {
    showPauseOverlay(false);
  } else {
    dom.pauseOverlay.classList.add("hidden");
  }
  dom.btnPause.textContent = state.isPaused ? "▶️" : "⏸️";
}

function showPauseOverlay(fromStop) {
  state.isPaused = true;
  dom.btnPause.textContent = "▶️";
  dom.pauseOverlay.classList.remove("hidden");
}

function quitQuiz() {
  stopTimer();
  state.isFinished = true;
  finishQuiz();
}

// ─── RENDER QUESTION ────────────────────────────────────
function renderQuestion() {
  const q = state.questions[state.currentIndex];
  const idx = state.currentIndex;
  const total = state.questions.length;

  dom.quizProgress.textContent = `Question ${idx + 1} / ${total}`;

  const diffLabels = { 1: "⭐ Facile (3 pts)", 2: "⭐⭐ Moyen (4 pts)", 3: "⭐⭐⭐ Difficile (5 pts)" };
  const diffClasses = { 1: "diff-easy", 2: "diff-medium", 3: "diff-hard" };
  dom.questionDiff.textContent = diffLabels[q.difficulty];
  dom.questionDiff.className = `question-difficulty ${diffClasses[q.difficulty]}`;

  dom.questionText.textContent = q.question;

  const labels = ["A", "B", "C", "D", "E"];
  dom.choices.innerHTML = q.choices
    .map(
      (c, i) => `
    <button class="choice-btn ${state.answers[idx] === i ? "selected" : ""}" data-choice="${i}">
      <span class="choice-label">${labels[i]}</span>
      <span class="choice-text">${c}</span>
    </button>
  `
    )
    .join("");

  dom.choices.querySelectorAll(".choice-btn").forEach((btn) => {
    btn.addEventListener("click", () => selectAnswer(parseInt(btn.dataset.choice)));
  });

  // Navigation buttons
  dom.btnPrev.disabled = idx === 0;
  dom.btnNext.classList.toggle("hidden", idx === total - 1);
  dom.btnFinish.classList.toggle("hidden", idx !== total - 1);
}

// ─── SELECT ANSWER ──────────────────────────────────────
function selectAnswer(choiceIndex) {
  const idx = state.currentIndex;
  // Toggle : re-cliquer désélectionne
  if (state.answers[idx] === choiceIndex) {
    state.answers[idx] = null;
  } else {
    state.answers[idx] = choiceIndex;
  }
  renderQuestion();
}

// ─── NAVIGATION ─────────────────────────────────────────
function navigateQuestion(direction) {
  const newIndex = state.currentIndex + direction;
  if (newIndex >= 0 && newIndex < state.questions.length) {
    state.currentIndex = newIndex;
    renderQuestion();
  }
}

// ─── FINISH QUIZ ────────────────────────────────────────
function finishQuiz() {
  stopTimer();
  state.isFinished = true;

  let correct = 0;
  let points = 0;
  const total = state.questions.length;

  const detailHTML = state.questions
    .map((q, i) => {
      const userAnswer = state.answers[i];
      const isCorrect = userAnswer === q.answer;
      const isUnanswered = userAnswer === null;
      const pointsMap = { 1: 3, 2: 4, 3: 5 };
      const qPoints = pointsMap[q.difficulty];

      let earnedPoints = 0;
      let statusClass = "unanswered";
      let statusIcon = "⬜";

      if (isCorrect) {
        correct++;
        earnedPoints = qPoints;
        points += qPoints;
        statusClass = "correct";
        statusIcon = "✅";
      } else if (!isUnanswered) {
        earnedPoints = -Math.ceil(qPoints / 4);
        points += earnedPoints;
        statusClass = "wrong";
        statusIcon = "❌";
      }

      const labels = ["A", "B", "C", "D", "E"];

      return `
        <div class="result-item ${statusClass}">
          <div class="result-item-header">
            <span>${statusIcon} Q${i + 1}</span>
            <span class="result-item-points">${earnedPoints > 0 ? "+" : ""}${earnedPoints} pt${Math.abs(earnedPoints) > 1 ? "s" : ""}</span>
          </div>
          <p class="result-item-question">${q.question}</p>
          <div class="result-item-answers">
            ${q.choices
              .map(
                (c, j) => `
              <span class="result-choice ${j === q.answer ? "is-correct" : ""} ${j === userAnswer && !isCorrect ? "is-wrong" : ""}">
                ${labels[j]}. ${c}
              </span>
            `
              )
              .join("")}
          </div>
          ${q.explanation ? `<p class="result-explanation">💡 ${q.explanation}</p>` : ""}
        </div>
      `;
    })
    .join("");

  dom.resultScore.textContent = `${correct} / ${total}`;
  dom.resultPoints.textContent = `${points} pts`;
  dom.resultTime.textContent = dom.timer.textContent;
  dom.resultsDetail.innerHTML = detailHTML;

  showScreen("results");
}

// ─── RETRY / HOME ───────────────────────────────────────
function retryLevel() {
  if (state.currentLevel) {
    startQuiz(state.currentLevel.id);
  }
}

function goHome() {
  stopTimer();
  showScreen("home");
}

// ─── UTILS ──────────────────────────────────────────────
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── GO ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", init);
