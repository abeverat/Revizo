// ═══════════════════════════════════════
// Multiplication-specific logic
// ═══════════════════════════════════════
let a, b, correctAnswer;

const questionEl   = document.getElementById('question');
const answerInput  = document.getElementById('answer-input');
const btnValidate  = document.getElementById('btn-validate');

// Weighted pool: 3–8 appear 4× more often than 0,1,2,9,10
const weightedPool = [
    0, 1, 2,
    3,3,3,3, 4,4,4,4, 5,5,5,5,
    6,6,6,6, 7,7,7,7, 8,8,8,8,
    9, 10
];

function pickNumber() {
    return weightedPool[Math.floor(Math.random() * weightedPool.length)];
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
