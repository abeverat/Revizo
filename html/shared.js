// ═══════════════════════════════════════
// Shared game engine for Cartes Toto
// ═══════════════════════════════════════

// ── State ──
let currentCard = 0;
let totalCards = 0;
let roundScore = 0;
let timerInterval = null;
let seconds = 0;
let isFlipped = false;
let isPaused = false;

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
    scoreEl.textContent = '0';

    // Start AI generation for the active mode only
    if (typeof Ollama !== 'undefined' && Ollama.isReady && typeof gameMode !== 'undefined') {
        Ollama.startBackgroundRefill(gameMode);
    }

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

    cardCountEl.textContent = `${currentCard} / 10`;
    cardNumEl.textContent   = `#${totalCards}`;
    scoreEl.textContent     = roundScore;

    btnNext.style.display    = 'none';
    answerZone.style.display = 'flex';

    // Delegate to page-specific question generator
    generateQuestion();
}

function showResult(isCorrect, resultText) {
    resultEl.textContent = resultText;

    if (isCorrect) {
        cardBack.classList.remove('wrong');
        resultIconEl.textContent = '✅';
        roundScore++;
        scoreEl.textContent = roundScore;
        launchConfetti();
    } else {
        cardBack.classList.add('wrong');
        resultIconEl.textContent = '❌';
    }

    cardEl.classList.add('flipped');
    isFlipped = true;

    answerZone.style.display = 'none';
    btnNext.style.display    = 'inline-block';
    setTimeout(() => btnNext.focus(), 650);
}

function nextCard() {
    if (currentCard >= 10) {
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
}

function continueGame() {
    pauseScreen.style.display = 'none';
    gameScreen.style.display  = 'block';
    startTimer();
    newRound();
}

function resetGame() {
    stopTimer();
    if (typeof Ollama !== 'undefined') Ollama.stopBackgroundRefill();
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
    if (typeof Ollama !== 'undefined') Ollama.stopBackgroundRefill();
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
