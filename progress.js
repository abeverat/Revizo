// ═══════════════════════════════════════
// Progress tracking — localStorage
// ═══════════════════════════════════════
// Stores best scores per module + level.
// Structure stored in localStorage:
//   revizo_progress = {
//     multiplications: { ce2: { best: 9, total: 10, time: 45 }, ... },
//     fractions:       { ce2: { ... }, ... },
//     ...
//   }

const PROGRESS_KEY = 'revizo_progress';
const HISTORY_KEY  = 'revizo_history';
const STATS_KEY    = 'revizo_stats';
const BADGES_KEY   = 'revizo_badges';
const MAX_HISTORY  = 20;

function _loadProgress() {
    try {
        return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
    } catch (e) {
        return {};
    }
}

function _saveProgress(data) {
    try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
    } catch (e) {}
}

/**
 * Save a round result. Keeps the best score per module/level.
 * @param {string} module   e.g. 'multiplications'
 * @param {string} level    e.g. 'ce2'
 * @param {number} correct  number of correct answers
 * @param {number} total    total cards in the round
 * @param {number} seconds  elapsed time in seconds
 */
function saveRoundScore(module, level, correct, total, seconds) {
    if (!module || !level) return;
    const progress = _loadProgress();
    if (!progress[module]) progress[module] = {};

    const existing = progress[module][level];
    const isBetter = !existing
        || correct > existing.best
        || (correct === existing.best && seconds < existing.time);

    if (isBetter) {
        progress[module][level] = { best: correct, total, time: seconds };
    }
    _saveProgress(progress);

    // Also save to history
    saveSessionHistory(module, level, correct, total, seconds);

    // Update cumulative stats
    updateStats(module, correct, total);
}

/**
 * Get the best score record for a module/level, or null if never played.
 * @returns {{ best: number, total: number, time: number } | null}
 */
function getBestScore(module, level) {
    const progress = _loadProgress();
    return (progress[module] && progress[module][level]) || null;
}

/**
 * Get all recorded levels for a module.
 * @returns {{ [level]: { best, total, time } }}
 */
function getModuleScores(module) {
    return _loadProgress()[module] || {};
}

// ═══════════════════════════════════════
// Session history (last 20 per module)
// ═══════════════════════════════════════
function _loadHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || {};
    } catch (e) {
        return {};
    }
}

function saveSessionHistory(module, level, correct, total, seconds) {
    const history = _loadHistory();
    if (!history[module]) history[module] = [];

    history[module].unshift({
        level, correct, total, time: seconds,
        date: new Date().toISOString()
    });

    // Keep only last MAX_HISTORY entries per module
    if (history[module].length > MAX_HISTORY) {
        history[module] = history[module].slice(0, MAX_HISTORY);
    }

    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {}
}

function getModuleHistory(module) {
    return _loadHistory()[module] || [];
}

// ═══════════════════════════════════════
// Cumulative stats & streak
// ═══════════════════════════════════════
function _loadStats() {
    try {
        return JSON.parse(localStorage.getItem(STATS_KEY)) || {
            totalQuestions: 0,
            totalCorrect: 0,
            totalSessions: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastPlayDate: null,
            modulesPlayed: {}
        };
    } catch (e) {
        return {
            totalQuestions: 0, totalCorrect: 0, totalSessions: 0,
            currentStreak: 0, longestStreak: 0, lastPlayDate: null,
            modulesPlayed: {}
        };
    }
}

function _saveStats(stats) {
    try {
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {}
}

function updateStats(module, correct, total) {
    const stats = _loadStats();
    stats.totalQuestions += total;
    stats.totalCorrect  += correct;
    stats.totalSessions += 1;
    stats.modulesPlayed[module] = true;

    // Streak logic
    const today = new Date().toISOString().slice(0, 10);
    if (stats.lastPlayDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (stats.lastPlayDate === yesterday) {
            stats.currentStreak += 1;
        } else if (stats.lastPlayDate !== today) {
            stats.currentStreak = 1;
        }
        stats.lastPlayDate = today;
    }
    if (stats.currentStreak > stats.longestStreak) {
        stats.longestStreak = stats.currentStreak;
    }

    _saveStats(stats);
    return stats;
}

function getStats() {
    const stats = _loadStats();
    // Check if streak is still valid (if last play was yesterday or today)
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (stats.lastPlayDate !== today && stats.lastPlayDate !== yesterday) {
        stats.currentStreak = 0;
    }
    return stats;
}

// ═══════════════════════════════════════
// Badges
// ═══════════════════════════════════════
const BADGE_DEFINITIONS = [
    { id: 'first_session',  icon: '🎯', name: 'Première session',  desc: 'Termine ta première session',     check: s => s.totalSessions >= 1 },
    { id: 'perfect_round',  icon: '💯', name: 'Sans faute',        desc: 'Obtiens 10/10 sur un round',      check: (_s, p) => checkPerfectRound(p) },
    { id: 'streak_3',       icon: '🔥', name: '3 jours de suite',  desc: 'Joue 3 jours consécutifs',        check: s => s.currentStreak >= 3 || s.longestStreak >= 3 },
    { id: 'streak_7',       icon: '🔥', name: 'Semaine parfaite',  desc: 'Joue 7 jours consécutifs',        check: s => s.currentStreak >= 7 || s.longestStreak >= 7 },
    { id: 'centurion',      icon: '💪', name: 'Centurion',         desc: 'Réponds à 100 questions',          check: s => s.totalQuestions >= 100 },
    { id: 'marathon',       icon: '🏃', name: 'Marathon',          desc: 'Réponds à 500 questions',          check: s => s.totalQuestions >= 500 },
    { id: 'polyvalent',     icon: '🌟', name: 'Polyvalent',        desc: 'Joue à tous les modules',         check: s => Object.keys(s.modulesPlayed).length >= 5 },
    { id: 'precision',      icon: '🎯', name: 'Précision',         desc: 'Maintiens > 80% de réussite',     check: s => s.totalQuestions >= 20 && (s.totalCorrect / s.totalQuestions) > 0.8 },
];

function checkPerfectRound(progress) {
    for (const mod of Object.values(progress)) {
        for (const lvl of Object.values(mod)) {
            if (lvl.best === lvl.total && lvl.total >= 10) return true;
        }
    }
    return false;
}

function _loadBadges() {
    try {
        return JSON.parse(localStorage.getItem(BADGES_KEY)) || {};
    } catch (e) {
        return {};
    }
}

function _saveBadges(badges) {
    try {
        localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
    } catch (e) {}
}

function checkAndAwardBadges() {
    const stats    = getStats();
    const progress = _loadProgress();
    const awarded  = _loadBadges();
    const newBadges = [];

    for (const badge of BADGE_DEFINITIONS) {
        if (!awarded[badge.id] && badge.check(stats, progress)) {
            awarded[badge.id] = new Date().toISOString();
            newBadges.push(badge);
        }
    }

    if (newBadges.length > 0) {
        _saveBadges(awarded);
    }
    return newBadges;
}

function getAllBadges() {
    const awarded = _loadBadges();
    return BADGE_DEFINITIONS.map(b => ({
        ...b,
        unlocked: !!awarded[b.id],
        unlockedDate: awarded[b.id] || null
    }));
}

// ═══════════════════════════════════════
// Reset all progress
// ═══════════════════════════════════════
function resetAllProgress() {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(BADGES_KEY);
}

// ═══════════════════════════════════════
// Theme toggle (dark / light)
// ═══════════════════════════════════════
const THEME_KEY = 'revizo_theme';

function _applyTheme(theme) {
    document.documentElement.classList.toggle('dark-mode', theme === 'dark');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const current = localStorage.getItem(THEME_KEY) || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    _applyTheme(next);
}

// Apply saved theme on load
(function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark') {
        _applyTheme('dark');
    }
})();
