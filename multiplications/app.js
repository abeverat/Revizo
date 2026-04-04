// ═══════════════════════════════════════
// Multiplication-specific logic
// ═══════════════════════════════════════
const MODULE_KEY = 'multiplications';
let a, b, correctAnswer;

const questionEl   = document.getElementById('question');
const answerInput  = document.getElementById('answer-input');
const btnValidate  = document.getElementById('btn-validate');
const levelDescEl  = document.getElementById('level-desc');

// ── Level definitions ──
let currentLevel = 'ce2';

const levels = {
    ce2: {
        desc: 'Tables de 2 à 5',
        pool: buildPool(2, 5)
    },
    cm1: {
        desc: 'Tables de 2 à 9',
        pool: buildPool(2, 9)
    },
    cm2: {
        desc: 'Tables de 2 à 12',
        pool: buildPool(2, 12)
    }
};

function buildPool(min, max) {
    const pool = [];
    for (let i = min; i <= max; i++) pool.push(i, i, i, i);
    // add 0 and 1 with lower weight
    pool.push(0, 1);
    return pool;
}

function selectLevel(level) {
    currentLevel = level;
    document.querySelectorAll('.level-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.level === level);
    });
    levelDescEl.textContent = levels[level].desc;
}

function pickNumber() {
    const pool = levels[currentLevel].pool;
    return pool[Math.floor(Math.random() * pool.length)];
}

// ── Required by shared.js ──

function generateQuestion() {
    a = pickNumber();
    b = pickNumber();
    correctAnswer = a * b;
    questionEl.textContent = `${a} × ${b}`;

    answerInput.value    = '';
    answerInput.disabled = false;
    btnValidate.style.display = 'inline-block';
    setTimeout(() => answerInput.focus(), 100);
}

function validateAnswer() {
    if (isFlipped) return;

    const userAnswer = parseInt(answerInput.value);
    if (isNaN(userAnswer)) {
        answerInput.classList.add('shake');
        setTimeout(() => answerInput.classList.remove('shake'), 500);
        return;
    }

    const isCorrect = userAnswer === correctAnswer;

    answerInput.disabled      = true;
    btnValidate.style.display = 'none';

    showResult(isCorrect, String(correctAnswer));
}

function getFocusInput() {
    return answerInput;
}

function canEnterValidate() {
    return true;
}
