/**
 * Kangourou — Générateurs : utilitaires partagés
 *
 * Chaque générateur retourne un objet :
 *   { question, choices: [5 strings], answer (index 0-4), difficulty: 1|2|3, explanation }
 */

// ─── UTILS ──────────────────────────────────────────────
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function round2(x) {
  return Math.round(x * 100) / 100;
}

/** Build a question object from correct answer + distractors */
function buildQuestion(question, correct, distractors, difficulty, explanation) {
  correct = String(correct);
  let dists = [...new Set(distractors.map(String))].filter(d => d !== correct);
  let safety = 0;
  while (dists.length < 4 && safety++ < 50) {
    const numCorrect = parseFloat(correct);
    if (!isNaN(numCorrect)) {
      const offset = randInt(1, 10) * randChoice([-1, 1]);
      const fake = String(numCorrect + offset);
      if (fake !== correct && !dists.includes(fake)) dists.push(fake);
    } else {
      const fallback = "Réponse " + String.fromCharCode(65 + dists.length);
      if (!dists.includes(fallback)) dists.push(fallback);
    }
  }
  // Fallback: sequential offsets if random failed
  for (let i = 1; dists.length < 4; i++) {
    const numCorrect = parseFloat(correct);
    const fake = !isNaN(numCorrect) ? String(numCorrect + i) : "Option " + (dists.length + 1);
    if (fake !== correct && !dists.includes(fake)) dists.push(fake);
  }
  dists = dists.slice(0, 4);

  const answerIndex = randInt(0, 4);
  const choices = [];
  let distIdx = 0;
  for (let i = 0; i < 5; i++) {
    if (i === answerIndex) {
      choices.push(correct);
    } else {
      choices.push(dists[distIdx++]);
    }
  }

  return { question, choices, answer: answerIndex, difficulty, explanation };
}

/** Make nearby-value distractors for a numeric answer */
function numericDistractors(correct, count = 6) {
  const results = new Set();
  for (const d of [-2, -1, 1, 2, 3, -3, 5, -5, 10, -10]) {
    const v = correct + d;
    if (v !== correct && v > 0) results.add(v);
  }
  results.add(correct * 2);
  results.add(Math.abs(correct - 1));
  return [...results].map(String).slice(0, count);
}

function fractionStr(num, den) {
  if (den === 1) return String(num);
  return `${num}/${den}`;
}

const GENERATORS = {};
