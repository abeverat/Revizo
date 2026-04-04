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

// ═══════════════════════════════════════
// Spaced repetition — wrong-answer queue
// ═══════════════════════════════════════
// Structure stored in localStorage:
//   revizo_wrong = {
//     multiplications: { ce2: [{id, data, addedAt}, ...], ... },
//     ...
//   }

const WRONG_KEY = 'revizo_wrong';

function _loadWrong() {
    try {
        return JSON.parse(localStorage.getItem(WRONG_KEY)) || {};
    } catch (e) {
        return {};
    }
}

function _saveWrong(data) {
    try {
        localStorage.setItem(WRONG_KEY, JSON.stringify(data));
    } catch (e) {}
}

/**
 * Add a wrong answer to the review queue.
 * Avoids duplicates by key if data has a `key` property.
 * @returns {string} unique id for this entry
 */
function saveWrongAnswer(module, level, data) {
    if (!module || !level || !data) return null;
    const wrong = _loadWrong();
    if (!wrong[module]) wrong[module] = {};
    if (!wrong[module][level]) wrong[module][level] = [];

    const queue = wrong[module][level];

    // Deduplicate by data.key if present (avoid filling queue with same question)
    if (data.key) {
        if (queue.some(q => q.data && q.data.key === data.key)) return null;
    }

    // Cap queue at 20 per level to avoid unbounded growth
    if (queue.length >= 20) queue.shift();

    const id = String(Date.now()) + String(Math.random()).slice(2, 7);
    queue.push({ id, data, addedAt: Date.now() });
    _saveWrong(wrong);
    return id;
}

/**
 * Peek at the next review item (FIFO) without removing it.
 * @returns {{ id: string, data: object } | null}
 */
function getNextWrongAnswer(module, level) {
    const wrong = _loadWrong();
    const queue = (wrong[module] && wrong[module][level]) || [];
    return queue.length > 0 ? { id: queue[0].id, data: queue[0].data } : null;
}

/**
 * Remove a review item after it has been answered correctly.
 */
function clearWrongAnswer(module, level, id) {
    const wrong = _loadWrong();
    if (!wrong[module] || !wrong[module][level]) return;
    wrong[module][level] = wrong[module][level].filter(q => q.id !== id);
    _saveWrong(wrong);
}

/**
 * Count pending review items for a module/level.
 */
function getWrongAnswerCount(module, level) {
    const wrong = _loadWrong();
    return ((wrong[module] && wrong[module][level]) || []).length;
}

