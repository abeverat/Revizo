// ═══════════════════════════════════════
// Geometry definitions
// ═══════════════════════════════════════
const MODULE_KEY = 'geometrie';
let gameMode = 'cercle';
let currentAnswer = null;
let currentExplanation = '';

const questionArea  = document.getElementById('question-area');
const cardModeLabel = document.getElementById('card-mode-label');
const explanationEl = document.getElementById('explanation');
const levelDescEl   = document.getElementById('level-desc');

// ── Level definitions ──
let currentLevel = 'ce2';
const levelRank = { ce2: 1, cm1: 2, cm2: 3 };
const levelDescs = { ce2: 'Notions de base', cm1: 'Notions intermédiaires', cm2: 'Programme complet' };

function selectLevel(level) {
    currentLevel = level;
    document.querySelectorAll('.level-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.level === level);
    });
    levelDescEl.textContent = levelDescs[level];
    usedIndices = [];
}

const modeLabels = {
    cercle:  'Le cercle',
    droites: 'Droites',
    figures: 'Figures',
    angles:  'Angles',
    mesures: 'Mesures',
    melange: 'Mélange'
};

// ── Mode selection ──
function selectMode(mode) {
    gameMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('mode-' + mode).classList.add('selected');
}

// ── Utility ──
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = randInt(0, i);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ── Build question pool for current mode, filtered by level ──
function filterByLevel(questions) {
    const rank = levelRank[currentLevel];
    return questions.filter(q => levelRank[q.level] <= rank);
}

function getQuestionPool() {
    switch (gameMode) {
        case 'cercle':  return filterByLevel(cercleQuestions);
        case 'droites': return filterByLevel(droitesQuestions);
        case 'figures': return filterByLevel(figuresQuestions);
        case 'angles':  return filterByLevel(anglesQuestions);
        case 'mesures': return filterByLevel(mesuresQuestions);
        case 'melange': return filterByLevel([
            ...cercleQuestions,
            ...droitesQuestions,
            ...figuresQuestions,
            ...anglesQuestions,
            ...mesuresQuestions
        ]);
        default: return filterByLevel(cercleQuestions);
    }
}

let usedIndices = [];
let _currentQ = null; // current raw question object (for review)

function pickQuestion() {
    const pool = getQuestionPool();
    if (usedIndices.length >= pool.length) usedIndices = [];
    let idx;
    do {
        idx = randInt(0, pool.length - 1);
    } while (usedIndices.includes(idx));
    usedIndices.push(idx);
    return pool[idx];
}

// ═══════════════════════════════════════
// Required by shared.js
// ═══════════════════════════════════════

function generateQuestion(q) {
    if (!q) q = pickQuestion();
    _currentQ = q;
    currentAnswer = q.answer;
    currentExplanation = q.explanation;

    cardModeLabel.textContent = modeLabels[gameMode] || 'Géométrie';

    questionArea.innerHTML = `
        <div class="geo-icon">📐</div>
        <div class="question-text">${q.question}</div>
    `;

    const choices = shuffle(q.choices);
    answerZone.innerHTML = '<div class="choice-btns">' +
        choices.map(c => `<button class="choice-btn" onclick="selectAnswer(this, '${c.replace(/'/g, "\\'")}')">${c}</button>`).join('') +
        '</div>';
}

// ── Spaced repetition hooks ──
function getReviewData() {
    if (!_currentQ) return null;
    return { key: _currentQ.question, q: _currentQ };
}

function applyReviewData(data) {
    generateQuestion(data.q);
}

function selectAnswer(btn, choice) {
    if (isFlipped) return;
    const isCorrect = choice === currentAnswer;
    explanationEl.textContent = currentExplanation;
    showResult(isCorrect, currentAnswer);
}

function validateAnswer() {
    // not used — answers selected via buttons
}

function getFocusInput() {
    return null;
}

function canEnterValidate() {
    return false;
}
