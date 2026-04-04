// ═══════════════════════════════════════
// Fractions-specific logic
// ═══════════════════════════════════════
const MODULE_KEY = 'fractions';
let gameMode  = 'pie'; // active rendering mode (may be overridden by review)
let _userMode = 'pie'; // mode chosen by the user — survives review cards
let currentAnswer = null;

const questionArea  = document.getElementById('question-area');
const cardModeLabel = document.getElementById('card-mode-label');
const levelDescEl   = document.getElementById('level-desc');

// ── Level definitions ──
let currentLevel = 'ce2';

const levels = {
    ce2: { desc: 'Identifier (dénominateur 2–6)', maxDen: 6, allowedModes: ['pie'] },
    cm1: { desc: 'Identifier, Simplifier, Comparer (2–9)', maxDen: 9, allowedModes: ['pie', 'simplify', 'compare'] },
    cm2: { desc: 'Tous les modes (2–12)', maxDen: 12, allowedModes: ['pie', 'simplify', 'compare', 'add'] }
};

function selectLevel(level) {
    currentLevel = level;
    document.querySelectorAll('.level-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.level === level);
    });
    levelDescEl.textContent = levels[level].desc;

    // Show/hide mode buttons based on allowed modes
    const allowed = levels[level].allowedModes;
    document.querySelectorAll('.mode-btn').forEach(btn => {
        const mode = btn.id.replace('mode-', '');
        btn.style.display = allowed.includes(mode) ? '' : 'none';
    });

    // If current mode is not allowed, switch to first allowed
    if (!allowed.includes(gameMode)) {
        selectMode(allowed[0]);
    }
}

// ── Mode selection ──
function selectMode(mode) {
    gameMode  = mode;
    _userMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('mode-' + mode).classList.add('selected');
}

// ── Math utilities ──
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function fractionHTML(num, den, small) {
    const cls = small ? 'fraction-display fraction-display-small' : 'fraction-display';
    return `<div class="${cls}">
        <span class="numerator">${num}</span>
        <div class="fraction-bar"></div>
        <span class="denominator">${den}</span>
    </div>`;
}

// ── Pie chart SVG ──
function createPieChart(numerator, denominator) {
    const size = 160;
    const cx = size / 2, cy = size / 2, r = size / 2 - 4;
    let svg = `<svg class="pie-chart" viewBox="0 0 ${size} ${size}">`;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#e8e8e8" stroke="#ccc" stroke-width="2"/>`;

    for (let i = 0; i < denominator; i++) {
        const startAngle = (i / denominator) * 2 * Math.PI - Math.PI / 2;
        const endAngle   = ((i + 1) / denominator) * 2 * Math.PI - Math.PI / 2;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const largeArc = (endAngle - startAngle > Math.PI) ? 1 : 0;
        const filled = i < numerator;
        svg += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z"
                 fill="${filled ? '#f5576c' : '#f0f0f0'}" stroke="#fff" stroke-width="2"/>`;
    }

    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#ccc" stroke-width="2"/>`;
    svg += `</svg>`;
    return svg;
}

// ── Shared answer-zone builder for fraction inputs ──
function buildFractionInputZone() {
    answerZone.innerHTML = `
        <div class="fraction-input-group">
            <input type="number" class="answer-input" id="input-num" placeholder="?" autocomplete="off">
            <div class="input-bar"></div>
            <input type="number" class="answer-input" id="input-den" placeholder="?" autocomplete="off">
        </div>
        <button class="btn-validate" onclick="validateAnswer()">OK</button>
    `;
    setTimeout(() => document.getElementById('input-num').focus(), 100);

    document.getElementById('input-num').addEventListener('keydown', (e) => {
        if (e.key === 'Tab' || e.key === 'ArrowDown') {
            e.preventDefault();
            document.getElementById('input-den').focus();
        }
    });
}

// ═══════════════════════════════════════
// Question generators (one per mode)
// ═══════════════════════════════════════
let _reviewData = null; // stored for spaced repetition

function generatePieQuestion(params) {
    let num, den;
    if (params) {
        num = params.num; den = params.den;
    } else {
        const maxDen = levels[currentLevel].maxDen;
        const denominators = [2, 3, 4, 5, 6, 8, 10, 12].filter(d => d <= maxDen);
        den = denominators[randInt(0, denominators.length - 1)];
        num = randInt(1, den - 1);
    }

    cardModeLabel.textContent = 'Quelle fraction est coloriée ?';
    questionArea.innerHTML = createPieChart(num, den);
    currentAnswer = { num, den };
    _reviewData = { mode: 'pie', key: `pie-${num}/${den}`, num, den };
    buildFractionInputZone();
}

function generateSimplifyQuestion(params) {
    let displayNum, displayDen, sNum, sDen;
    if (params) {
        displayNum = params.displayNum; displayDen = params.displayDen;
        sNum = params.sNum; sDen = params.sDen;
    } else {
        const maxDen = levels[currentLevel].maxDen;
        const simpleNums = [1, 2, 3, 4, 5, 6, 7].filter(n => n < maxDen);
        const simpleDens = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(d => d <= maxDen);
        do {
            sNum = simpleNums[randInt(0, simpleNums.length - 1)];
            sDen = simpleDens[randInt(0, simpleDens.length - 1)];
        } while (sNum >= sDen || gcd(sNum, sDen) !== 1);
        const multiplier = randInt(2, 5);
        displayNum = sNum * multiplier;
        displayDen = sDen * multiplier;
    }

    cardModeLabel.textContent = 'Simplifie cette fraction';
    questionArea.innerHTML = fractionHTML(displayNum, displayDen, false);
    currentAnswer = { num: sNum, den: sDen };
    _reviewData = { mode: 'simplify', key: `simplify-${displayNum}/${displayDen}`, displayNum, displayDen, sNum, sDen };
    buildFractionInputZone();
}

function generateCompareQuestion(params) {
    let n1, d1, n2, d2, correctSymbol;
    if (params) {
        n1 = params.n1; d1 = params.d1; n2 = params.n2; d2 = params.d2;
        correctSymbol = params.correctSymbol;
    } else {
        const maxDen = levels[currentLevel].maxDen;
        const denOptions = [2, 3, 4, 5, 6, 8, 10, 12].filter(d => d <= maxDen);
        do {
            d1 = denOptions[randInt(0, denOptions.length - 1)];
            d2 = denOptions[randInt(0, denOptions.length - 1)];
            n1 = randInt(1, d1);
            n2 = randInt(1, d2);
        } while (n1 / d1 === n2 / d2);
        correctSymbol = (n1 / d1) < (n2 / d2) ? '<' : '>';
    }

    cardModeLabel.textContent = 'Compare ces deux fractions';
    questionArea.innerHTML = `
        <div class="fractions-row">
            ${fractionHTML(n1, d1, false)}
            <span class="comparison-symbol">?</span>
            ${fractionHTML(n2, d2, false)}
        </div>`;

    currentAnswer = { symbol: correctSymbol, n1, d1, n2, d2 };
    _reviewData = { mode: 'compare', key: `cmp-${n1}/${d1}-${n2}/${d2}`, n1, d1, n2, d2, correctSymbol };

    answerZone.innerHTML = `
        <div class="comparison-btns">
            <button class="cmp-btn" onclick="validateComparison('<')">&lt;</button>
            <button class="cmp-btn" onclick="validateComparison('=')">=</button>
            <button class="cmp-btn" onclick="validateComparison('>')">&gt;</button>
        </div>`;
}

function generateAddQuestion(params) {
    let n1, d1, n2, d2, ansNum, ansDen;
    if (params) {
        n1 = params.n1; d1 = params.d1; n2 = params.n2; d2 = params.d2;
        ansNum = params.ansNum; ansDen = params.ansDen;
    } else {
        const maxDen = levels[currentLevel].maxDen;
        const denOptions = [2, 3, 4, 5, 6, 8, 10, 12].filter(d => d <= maxDen);
        const useSameDen = Math.random() < 0.5;
        if (useSameDen) {
            d1 = denOptions[randInt(0, denOptions.length - 1)];
            d2 = d1;
            n1 = randInt(1, d1 - 1);
            n2 = randInt(1, d1 - 1);
            ansNum = n1 + n2;
            ansDen = d1;
        } else {
            const base = denOptions[randInt(0, 5)];
            const mult = randInt(2, 3);
            d1 = base; d2 = base * mult;
            n1 = randInt(1, d1 - 1);
            n2 = randInt(1, d2 - 1);
            ansNum = n1 * mult + n2;
            ansDen = d2;
        }
    }

    const g = gcd(ansNum, ansDen);
    const simpNum = ansNum / g;
    const simpDen = ansDen / g;

    cardModeLabel.textContent = 'Additionne ces fractions';
    questionArea.innerHTML = `
        <div class="fractions-row">
            ${fractionHTML(n1, d1, false)}
            <span class="comparison-symbol">+</span>
            ${fractionHTML(n2, d2, false)}
        </div>`;

    currentAnswer = { num: ansNum, den: ansDen, simpNum, simpDen };
    _reviewData = { mode: 'add', key: `add-${n1}/${d1}+${n2}/${d2}`, n1, d1, n2, d2, ansNum, ansDen };
    buildFractionInputZone();
}

// ═══════════════════════════════════════
// Required by shared.js
// ═══════════════════════════════════════
function generateQuestion() {
    gameMode = _userMode; // always generate fresh cards in the user-selected mode
    switch (gameMode) {
        case 'pie':      generatePieQuestion(); break;
        case 'simplify': generateSimplifyQuestion(); break;
        case 'compare':  generateCompareQuestion(); break;
        case 'add':      generateAddQuestion(); break;
    }
}

// ── Spaced repetition hooks ──
function getReviewData() {
    return _reviewData;
}

function applyReviewData(data) {
    // Restore mode label (gameMode may differ if user mixed modes)
    gameMode = data.mode;
    switch (data.mode) {
        case 'pie':      generatePieQuestion(data);      break;
        case 'simplify': generateSimplifyQuestion(data); break;
        case 'compare':  generateCompareQuestion(data);  break;
        case 'add':      generateAddQuestion(data);      break;
    }
}

function validateAnswer() {
    if (isFlipped) return;

    const numInput = document.getElementById('input-num');
    const denInput = document.getElementById('input-den');
    const userNum  = parseInt(numInput.value);
    const userDen  = parseInt(denInput.value);

    if (isNaN(userNum) || isNaN(userDen) || userDen === 0) {
        const el = isNaN(userNum) ? numInput : denInput;
        el.classList.add('shake');
        setTimeout(() => el.classList.remove('shake'), 500);
        return;
    }

    let isCorrect = false;

    if (gameMode === 'pie') {
        const userVal    = userNum / userDen;
        const correctVal = currentAnswer.num / currentAnswer.den;
        isCorrect = Math.abs(userVal - correctVal) < 0.0001 && userNum > 0 && userDen > 0;
    } else if (gameMode === 'simplify') {
        isCorrect = userNum === currentAnswer.num && userDen === currentAnswer.den;
    } else if (gameMode === 'add') {
        const userG = gcd(Math.abs(userNum), Math.abs(userDen));
        isCorrect = (userNum / userG === currentAnswer.simpNum &&
                     userDen / userG === currentAnswer.simpDen);
    }

    showResult(isCorrect, buildResultText());
}

function validateComparison(symbol) {
    if (isFlipped) return;
    const isCorrect = symbol === currentAnswer.symbol;
    showResult(isCorrect, buildResultText());
}

function buildResultText() {
    if (gameMode === 'pie' || gameMode === 'simplify') {
        return `${currentAnswer.num}⁄${currentAnswer.den}`;
    } else if (gameMode === 'compare') {
        return `${currentAnswer.n1}⁄${currentAnswer.d1} ${currentAnswer.symbol} ${currentAnswer.n2}⁄${currentAnswer.d2}`;
    } else if (gameMode === 'add') {
        return currentAnswer.simpDen === 1
            ? `${currentAnswer.simpNum}`
            : `${currentAnswer.simpNum}⁄${currentAnswer.simpDen}`;
    }
    return '';
}

function getFocusInput() {
    return document.getElementById('input-num');
}

function canEnterValidate() {
    return gameMode !== 'compare';
}
