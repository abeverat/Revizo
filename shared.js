// ═══════════════════════════════════════
// Shared game engine for Revizo
// ═══════════════════════════════════════

// ── State ──
let currentCard = 0;
let totalCards = 0;
let roundScore = 0;
let timerInterval = null;
let seconds = 0;
let isFlipped = false;
let isPaused = false;
let wrongQuestions = [];
let isReviewMode = false;
let reviewIndex = 0;
let cardsPerRound = 10;
let selectedRoundSize = 10;

// ── DOM cache (common elements) ──
const startScreen  = document.getElementById('start-screen');
const gameScreen   = document.getElementById('game-screen');
const pauseScreen  = document.getElementById('pause-screen');
const cardEl       = document.getElementById('card');
const cardBack     = document.getElementById('card-back');
const resultEl     = document.getElementById('result');
const resultIconEl = document.getElementById('result-icon');
const btnNext      = document.getElementById('btn-next');
const cardCountEl  = document.getElementById('card-count');
const timerEl      = document.getElementById('timer');
const scoreEl      = document.getElementById('score');
const cardNumEl    = document.getElementById('card-num');
const answerZone   = document.getElementById('answer-zone');
const ingamePauseOverlay = document.getElementById('ingame-pause-overlay');

// ═══════════════════════════════════════
// Decorative stars
// ═══════════════════════════════════════
(function createStars() {
    const container = document.getElementById('stars');
    for (let i = 0; i < 40; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top  = Math.random() * 100 + '%';
        star.style.animationDelay = (Math.random() * 3) + 's';
        star.style.width = star.style.height = (Math.random() * 4 + 3) + 'px';
        container.appendChild(star);
    }
})();

// ═══════════════════════════════════════
// Timer
// ═══════════════════════════════════════
function updateTimerDisplay() {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;
}

function getTimerText() {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
}

function startTimer() {
    seconds = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => { seconds++; updateTimerDisplay(); }, 1000);
}

function stopTimer()  { clearInterval(timerInterval); }
function pauseTimer() { clearInterval(timerInterval); }

function resumeTimer() {
    timerInterval = setInterval(() => { seconds++; updateTimerDisplay(); }, 1000);
}

// ═══════════════════════════════════════
// Confetti 🎊
// ═══════════════════════════════════════
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiAnimId = null;

function resizeCanvas() {
    confettiCanvas.width  = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti(colors) {
    const defaultColors = ['#f857a6','#ff5858','#43e97b','#38f9d7','#667eea','#ffd700','#ff6b6b','#48dbfb'];
    const palette = colors || defaultColors;
    for (let i = 0; i < 60; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: -10,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: palette[Math.floor(Math.random() * palette.length)],
            vx: (Math.random() - 0.5) * 6,
            vy: Math.random() * 4 + 2,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10,
            life: 1
        });
    }
    if (!confettiAnimId) animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiPieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.rotation += p.rotSpeed;
        p.life -= 0.005;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
    });

    confettiPieces = confettiPieces.filter(p => p.life > 0 && p.y < confettiCanvas.height + 20);

    if (confettiPieces.length > 0) {
        confettiAnimId = requestAnimationFrame(animateConfetti);
    } else {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiAnimId = null;
    }
}

// ═══════════════════════════════════════
// Game flow
// ═══════════════════════════════════════

/**
 * Each page must define:
 *   generateQuestion()  — set up the card front & answer zone
 *   validateAnswer()    — check user answer and call showResult()
 *   getFocusInput()     — return the element to focus after resume (or null)
 *   canEnterValidate()  — whether Enter should call validateAnswer()
 */

function startGame() {
    startScreen.style.display = 'none';
    pauseScreen.style.display = 'none';
    gameScreen.style.display  = 'block';

    currentCard = 0;
    roundScore  = 0;
    totalCards  = 0;
    wrongQuestions = [];
    isReviewMode = false;
    cardsPerRound = selectedRoundSize;
    scoreEl.textContent = '0';

    startTimer();
    newRound();
}

function newRound() {
    currentCard = 0;
    roundScore  = 0;
    loadCard();
}

function loadCard() {
    currentCard++;
    totalCards++;

    // Reset card
    cardEl.classList.remove('flipped');
    cardBack.classList.remove('wrong');
    isFlipped = false;

    cardCountEl.textContent = `${currentCard} / ${cardsPerRound}`;
    cardNumEl.textContent   = `#${totalCards}`;
    scoreEl.textContent     = roundScore;

    btnNext.style.display    = 'none';
    answerZone.style.display = 'flex';

    // Delegate to page-specific question generator
    generateQuestion();
}

function showResult(isCorrect, resultText, explanation) {
    resultEl.textContent = resultText;

    // Show explanation if provided
    const explanationEl = document.getElementById('explanation');
    if (explanationEl) {
        explanationEl.textContent = explanation || '';
        explanationEl.style.display = explanation ? 'block' : 'none';
    }

    if (isCorrect) {
        cardBack.classList.remove('wrong');
        resultIconEl.textContent = '✅';
        roundScore++;
        scoreEl.textContent = roundScore;
        launchConfetti();
    } else {
        cardBack.classList.add('wrong');
        resultIconEl.textContent = '❌';
        // Track wrong question for review mode
        if (typeof getCurrentQuestionData === 'function') {
            wrongQuestions.push(getCurrentQuestionData());
        }
    }

    cardEl.classList.add('flipped');
    isFlipped = true;

    answerZone.style.display = 'none';
    btnNext.style.display    = 'inline-block';
    setTimeout(() => btnNext.focus(), 650);
}

function nextCard() {
    if (currentCard >= cardsPerRound) {
        showPauseScreen();
    } else {
        loadCard();
    }
}

// ═══════════════════════════════════════
// Pause screen (after 10 cards)
// ═══════════════════════════════════════
function showPauseScreen() {
    stopTimer();

    // Persist best score if the module declared MODULE_KEY + currentLevel
    if (typeof saveRoundScore === 'function'
        && typeof MODULE_KEY !== 'undefined'
        && typeof currentLevel !== 'undefined') {
        const answered = isFlipped ? currentCard : currentCard - 1;
        saveRoundScore(MODULE_KEY, currentLevel, roundScore, answered, seconds);
    }

    // Check and award badges
    if (typeof checkAndAwardBadges === 'function') {
        const newBadges = checkAndAwardBadges();
        if (newBadges.length > 0) {
            // Show badge notification after a short delay
            setTimeout(() => {
                const toast = document.createElement('div');
                toast.className = 'badge-toast';
                toast.textContent = '🏅 Badge débloqué : ' + newBadges[0].name + ' !';
                toast.setAttribute('role', 'alert');
                document.body.appendChild(toast);
                requestAnimationFrame(() => toast.classList.add('visible'));
                setTimeout(() => {
                    toast.classList.remove('visible');
                    setTimeout(() => toast.remove(), 500);
                }, 3500);
            }, 800);
        }
    }

    gameScreen.style.display  = 'none';
    pauseScreen.style.display = 'block';
    pauseScreen.style.animation = 'none';
    pauseScreen.offsetHeight; // reflow
    pauseScreen.style.animation = 'fadeIn 0.5s ease';

    const answered = isFlipped ? currentCard : currentCard - 1;
    document.getElementById('pause-score').textContent = `${roundScore} / ${answered}`;
    document.getElementById('pause-time').textContent  = getTimerText();

    const pct = answered > 0 ? (roundScore / answered * 100) : 0;
    const msg   = document.getElementById('pause-message');
    const title = document.getElementById('pause-title');

    if (pct === 100) {
        title.textContent = '🏆 Parfait !';
        msg.textContent   = 'Incroyable, sans aucune faute !';
        launchConfetti();
    } else if (pct >= 80) {
        title.textContent = '🎉 Bravo !';
        msg.textContent   = 'Excellent travail, continue comme ça !';
    } else if (pct >= 50) {
        title.textContent = '👍 Pas mal !';
        msg.textContent   = 'Tu progresses, encore un petit effort !';
    } else {
        title.textContent = '💪 Courage !';
        msg.textContent   = 'Entraîne-toi encore, tu vas y arriver !';
    }

    // Adaptive difficulty suggestion
    let hintEl = document.getElementById('difficulty-hint');
    if (!hintEl) {
        hintEl = document.createElement('p');
        hintEl.id = 'difficulty-hint';
        hintEl.className = 'difficulty-hint';
        msg.parentNode.insertBefore(hintEl, msg.nextSibling);
    }
    hintEl.textContent = '';
    hintEl.style.display = 'none';

    if (typeof currentLevel !== 'undefined' && typeof selectLevel === 'function' && !isReviewMode) {
        const levelOrder = ['ce2', 'cm1', 'cm2'];
        const idx = levelOrder.indexOf(currentLevel);
        if (pct >= 90 && idx < levelOrder.length - 1) {
            hintEl.textContent = '⬆️ Tu es prêt(e) pour le niveau ' + levelOrder[idx + 1].toUpperCase() + ' !';
            hintEl.style.display = 'block';
        } else if (pct < 40 && idx > 0) {
            hintEl.textContent = '💡 Essaie le niveau ' + levelOrder[idx - 1].toUpperCase() + ' pour consolider tes bases.';
            hintEl.style.display = 'block';
        }
    }

    // Show/hide review button
    let reviewBtn = document.getElementById('btn-review');
    if (!reviewBtn) {
        const pauseButtons = pauseScreen.querySelector('.pause-buttons');
        if (pauseButtons) {
            reviewBtn = document.createElement('button');
            reviewBtn.id = 'btn-review';
            reviewBtn.className = 'btn btn-review';
            reviewBtn.textContent = '🔄 Revoir mes erreurs';
            reviewBtn.onclick = startReviewMode;
            pauseButtons.appendChild(reviewBtn);
        }
    }
    if (reviewBtn) {
        reviewBtn.style.display = wrongQuestions.length > 0 && !isReviewMode ? 'inline-block' : 'none';
    }
}

function startReviewMode() {
    if (wrongQuestions.length === 0) return;
    isReviewMode = true;
    reviewIndex = 0;
    cardsPerRound = wrongQuestions.length;
    currentCard = 0;
    roundScore = 0;

    pauseScreen.style.display = 'none';
    gameScreen.style.display  = 'block';
    startTimer();

    loadCard();
}

function continueGame() {
    pauseScreen.style.display = 'none';
    gameScreen.style.display  = 'block';
    cardsPerRound = selectedRoundSize;
    wrongQuestions = [];
    isReviewMode = false;
    startTimer();
    newRound();
}

function resetGame() {
    stopTimer();
    cardsPerRound = selectedRoundSize;
    wrongQuestions = [];
    isReviewMode = false;
    pauseScreen.style.display = 'none';
    gameScreen.style.display  = 'none';
    startScreen.style.display = 'block';
}

// ═══════════════════════════════════════
// In-game pause / stop
// ═══════════════════════════════════════
function pauseGame() {
    if (isPaused) return;
    isPaused = true;
    pauseTimer();
    ingamePauseOverlay.classList.add('visible');
}

function resumeGame() {
    if (!isPaused) return;
    isPaused = false;
    resumeTimer();
    ingamePauseOverlay.classList.remove('visible');
    if (!isFlipped) {
        setTimeout(() => {
            const inp = typeof getFocusInput === 'function' ? getFocusInput() : null;
            if (inp) inp.focus();
        }, 100);
    }
}

function stopSeries() {
    isPaused = false;
    ingamePauseOverlay.classList.remove('visible');
    showPauseScreen();
}

// ═══════════════════════════════════════
// Keyboard: Enter to validate / next, Escape for pause
// ═══════════════════════════════════════
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (isPaused) {
            resumeGame();
        } else if (gameScreen.style.display !== 'none' && gameScreen.style.display !== '') {
            pauseGame();
        }
        return;
    }

    if (isPaused) return;

    if (e.key === 'Enter') {
        if (gameScreen.style.display !== 'none' && gameScreen.style.display !== '') {
            if (isFlipped) {
                nextCard();
            } else if (typeof canEnterValidate === 'function' ? canEnterValidate() : true) {
                validateAnswer();
            }
        }
    }
});

// ═══════════════════════════════════════
// Round size selector
// ═══════════════════════════════════════
function selectRoundSize(size) {
    selectedRoundSize = size;
    cardsPerRound = size;
    document.querySelectorAll('.round-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.size) === size);
    });
}
