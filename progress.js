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
