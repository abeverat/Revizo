// ═══════════════════════════════════════
// Grammar-specific logic
// ═══════════════════════════════════════
const MODULE_KEY = 'grammaire';
let gameMode = 'homophones';
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
    usedIndices = {};
}

function filterByLevel(questions) {
    const rank = levelRank[currentLevel];
    return questions.filter(q => levelRank[q.level] <= rank);
}

// ── Mode selection ──
function selectMode(mode) {
    gameMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => {
        b.classList.remove('selected');
        b.setAttribute('aria-pressed', 'false');
    });
    const active = document.getElementById('mode-' + mode);
    active.classList.add('selected');
    active.setAttribute('aria-pressed', 'true');
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

// ═══════════════════════════════════════
// Banque par mode — on pioche aléatoirement
// ═══════════════════════════════════════
let usedIndices = {};

function pickQuestion(bank, mode) {
    if (!usedIndices[mode]) usedIndices[mode] = [];
    if (usedIndices[mode].length >= bank.length) usedIndices[mode] = [];
    let idx;
    do { idx = randInt(0, bank.length - 1); } while (usedIndices[mode].includes(idx));
    usedIndices[mode].push(idx);
    return bank[idx];
}

function getBank() {
    switch (gameMode) {
        case 'homophones':  return filterByLevel(homophoneQuestions);
        case 'conjugaison': return filterByLevel(conjugaisonQuestions);
        case 'nature':      return filterByLevel(natureQuestions);
        case 'accord':      return filterByLevel(accordQuestions);
    }
}

// ═══════════════════════════════════════
// Required by shared.js
// ═══════════════════════════════════════

function generateQuestion() {
    switch (gameMode) {
        case 'homophones':  generateHomophone(); break;
        case 'conjugaison': generateConjugaison(); break;
        case 'nature':      generateNature(); break;
        case 'accord':      generateAccord(); break;
    }
}

// ── HOMOPHONES ──
function generateHomophone() {
    const q = pickQuestion(homophoneQuestions, 'homophones');
    cardModeLabel.textContent = 'Choisis le bon homophone';

    const display = q.sentence.replace('___', '<span class="blank">???</span>');
    questionArea.innerHTML = `<div class="sentence-text">${display}</div>`;

    currentAnswer = q.answer.toLowerCase();
    currentExplanation = q.explanation;

    const btns = shuffle(q.choices).map(c =>
        `<button class="choice-btn" onclick="validateChoice('${c}')">${c}</button>`
    ).join('');
    answerZone.innerHTML = `<div class="choice-btns">${btns}</div>`;
}

// ── CONJUGAISON ──
function generateConjugaison() {
    const q = pickQuestion(conjugaisonQuestions, 'conjugaison');
    cardModeLabel.textContent = 'Conjugue le verbe';

    const display = q.sentence.replace('___', '<span class="blank">???</span>');
    questionArea.innerHTML = `
        <div class="sentence-text">${display}</div>
        <div class="instruction">${q.hint}</div>`;

    currentAnswer = q.answer.toLowerCase();
    currentExplanation = q.explanation;

    answerZone.innerHTML = `
        <input type="text" class="answer-input" id="grammar-input" placeholder="?" autocomplete="off" autocapitalize="off" spellcheck="false">
        <button class="btn-validate" onclick="validateAnswer()">OK</button>
    `;
    setTimeout(() => document.getElementById('grammar-input').focus(), 100);
}

// ── NATURE DES MOTS ──
function generateNature() {
    const q = pickQuestion(natureQuestions, 'nature');
    cardModeLabel.textContent = 'Quelle est la nature du mot ?';

    questionArea.innerHTML = `<div class="sentence-text">${q.sentence}</div>`;

    currentAnswer = q.answer.toLowerCase();
    currentExplanation = q.explanation;

    const btns = shuffle(q.choices).map(c =>
        `<button class="choice-btn" onclick="validateChoice('${c}')">${c}</button>`
    ).join('');
    answerZone.innerHTML = `<div class="choice-btns">${btns}</div>`;
}

// ── ACCORDS ──
function generateAccord() {
    const q = pickQuestion(accordQuestions, 'accord');
    cardModeLabel.textContent = 'Choisis le bon accord';

    const display = q.sentence.replace('___', '<span class="blank">???</span>');
    questionArea.innerHTML = `<div class="sentence-text">${display}</div>`;

    currentAnswer = q.answer.toLowerCase();
    currentExplanation = q.explanation;

    const unique = [...new Set(q.choices)];
    const btns = shuffle(unique).map(c =>
        `<button class="choice-btn" onclick="validateChoice('${c}')">${c}</button>`
    ).join('');
    answerZone.innerHTML = `<div class="choice-btns">${btns}</div>`;
}

// ═══════════════════════════════════════
// Validation
// ═══════════════════════════════════════
function validateChoice(choice) {
    if (isFlipped) return;
    const isCorrect = choice.toLowerCase() === currentAnswer;
    explanationEl.textContent = currentExplanation;
    showResult(isCorrect, currentAnswer);
}

function validateAnswer() {
    if (isFlipped) return;
    const input = document.getElementById('grammar-input');
    const userVal = input.value.trim().toLowerCase();

    if (!userVal) {
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
        return;
    }

    const isCorrect = userVal === currentAnswer;
    input.disabled = true;
    explanationEl.textContent = currentExplanation;
    showResult(isCorrect, currentAnswer);
}

function getFocusInput() {
    return document.getElementById('grammar-input');
}

function canEnterValidate() {
    return gameMode === 'conjugaison';
}
