/**
 * Kangourou — Générateurs : API publique
 *
 * Generate `count` questions for a given level.
 * Picks generators randomly, assigning difficulties proportionally (8 easy, 8 medium, 8 hard).
 */
function generateQuestions(levelId, count = 24) {
  const gens = GENERATORS[levelId];
  if (!gens || gens.length === 0) return [];

  const difficultyDistribution = [];
  const perDiff = Math.floor(count / 3);
  for (let i = 0; i < perDiff; i++) difficultyDistribution.push(1);
  for (let i = 0; i < perDiff; i++) difficultyDistribution.push(2);
  while (difficultyDistribution.length < count) difficultyDistribution.push(3);

  const questions = [];
  const seenQuestions = new Set();

  for (let i = 0; i < count; i++) {
    const targetDiff = difficultyDistribution[i];
    let attempts = 0;
    let q;
    do {
      q = randChoice(gens)();
      q.difficulty = targetDiff;
      attempts++;
    } while (seenQuestions.has(q.question) && attempts < 20);

    seenQuestions.add(q.question);
    questions.push(q);
  }

  return questions;
}
