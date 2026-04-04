// ═══════════════════════════════════════
// Geometry definitions — CM2
// ═══════════════════════════════════════
let gameMode = 'cercle';
let currentAnswer = null;
let currentExplanation = '';

const questionArea  = document.getElementById('question-area');
const cardModeLabel = document.getElementById('card-mode-label');
const explanationEl = document.getElementById('explanation');

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

// ── Build question pool for current mode ──
function getQuestionPool() {
    switch (gameMode) {
        case 'cercle':  return cercleQuestions;
        case 'droites': return droitesQuestions;
        case 'figures': return figuresQuestions;
        case 'angles':  return anglesQuestions;
        case 'mesures': return mesuresQuestions;
        case 'melange': return [
            ...cercleQuestions,
            ...droitesQuestions,
            ...figuresQuestions,
            ...anglesQuestions,
            ...mesuresQuestions
        ];
        default: return cercleQuestions;
    }
}

let usedIndices = [];

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

function generateQuestion() {
    const q = pickQuestion();
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
