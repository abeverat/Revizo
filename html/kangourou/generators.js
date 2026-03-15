/**
 * Kangourou — Générateurs de questions procédurales
 *
 * Chaque générateur retourne un objet :
 *   { question, choices: [5 strings], answer (index 0-4), difficulty: 1|2|3, explanation }
 *
 * Principe :
 *   1. Tirer des paramètres aléatoires
 *   2. Calculer la bonne réponse
 *   3. Fabriquer 4 distracteurs plausibles
 *   4. Mélanger les 5 choix, retenir l'index de la bonne réponse
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
  // Ensure all are strings
  correct = String(correct);
  // Remove duplicates and the correct answer from distractors
  let dists = [...new Set(distractors.map(String))].filter(d => d !== correct);
  // If we don't have enough distractors, generate offsets
  while (dists.length < 4) {
    const numCorrect = parseFloat(correct);
    if (!isNaN(numCorrect)) {
      const offset = randInt(1, 10) * randChoice([-1, 1]);
      const fake = String(numCorrect + offset);
      if (fake !== correct && !dists.includes(fake)) dists.push(fake);
    } else {
      dists.push("Aucune de ces réponses");
    }
  }
  dists = dists.slice(0, 4);

  // Build choices array with correct answer at random position
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
  // Close offsets
  for (const d of [-2, -1, 1, 2, 3, -3, 5, -5, 10, -10]) {
    const v = correct + d;
    if (v !== correct && v > 0) results.add(v);
  }
  // Multiplicative fakes
  results.add(correct * 2);
  results.add(Math.abs(correct - 1));
  // Return as array of strings
  return [...results].map(String).slice(0, count);
}

function fractionStr(num, den) {
  if (den === 1) return String(num);
  return `${num}/${den}`;
}

// ═══════════════════════════════════════════════════════
// GENERATORS BY LEVEL
// ═══════════════════════════════════════════════════════

const GENERATORS = {

  // ─── 6ÈME ──────────────────────────────────────────
  "6eme": [
    // Multiplication
    () => {
      const a = randInt(3, 25), b = randInt(3, 25);
      const correct = a * b;
      return buildQuestion(
        `Combien font ${a} × ${b} ?`, correct,
        numericDistractors(correct), 1,
        `${a} × ${b} = ${correct}`
      );
    },
    // Addition
    () => {
      const a = randInt(100, 999), b = randInt(100, 999);
      const correct = a + b;
      return buildQuestion(
        `Combien font ${a} + ${b} ?`, correct,
        numericDistractors(correct), 1,
        `${a} + ${b} = ${correct}`
      );
    },
    // Division entière
    () => {
      const b = randInt(3, 12), q = randInt(3, 20);
      const a = b * q;
      return buildQuestion(
        `Combien font ${a} ÷ ${b} ?`, q,
        numericDistractors(q), 1,
        `${a} ÷ ${b} = ${q}`
      );
    },
    // Périmètre rectangle
    () => {
      const l = randInt(3, 20), w = randInt(3, 20);
      const p = 2 * (l + w);
      return buildQuestion(
        `Un rectangle mesure ${l} cm sur ${w} cm. Quel est son périmètre ?`,
        `${p} cm`, [`${l * w} cm`, `${l + w} cm`, `${p + 2} cm`, `${p - 2} cm`, `${2 * l * w} cm`],
        1, `P = 2 × (${l} + ${w}) = ${p} cm`
      );
    },
    // Aire rectangle
    () => {
      const l = randInt(3, 15), w = randInt(3, 15);
      const a = l * w;
      return buildQuestion(
        `Quelle est l'aire d'un rectangle de ${l} cm par ${w} cm ?`,
        `${a} cm²`, [`${2 * (l + w)} cm²`, `${a + l} cm²`, `${a - w} cm²`, `${l + w} cm²`, `${a * 2} cm²`],
        1, `Aire = ${l} × ${w} = ${a} cm²`
      );
    },
    // Double / triple
    () => {
      const n = randInt(5, 99);
      const mult = randChoice([2, 3]);
      const word = mult === 2 ? "double" : "triple";
      const correct = n * mult;
      return buildQuestion(
        `Quel est le ${word} de ${n} ?`, correct,
        numericDistractors(correct), 1,
        `${n} × ${mult} = ${correct}`
      );
    },
    // Fraction de
    () => {
      const den = randChoice([2, 3, 4, 5, 10]);
      const num = randInt(1, den - 1);
      const g = gcd(num, den);
      const base = den * randInt(2, 10);
      const correct = (num * base) / den;
      return buildQuestion(
        `Combien font ${fractionStr(num/g, den/g)} de ${base} ?`, correct,
        numericDistractors(correct), 2,
        `${fractionStr(num/g, den/g)} × ${base} = ${correct}`
      );
    },
    // Pourcentage
    () => {
      const pct = randChoice([10, 15, 20, 25, 30, 40, 50, 75]);
      const base = randChoice([40, 50, 60, 80, 100, 120, 150, 200, 300, 400, 500]);
      const correct = (pct * base) / 100;
      return buildQuestion(
        `Combien font ${pct}% de ${base} ?`, correct,
        numericDistractors(correct), 2,
        `${pct}% × ${base} = ${correct}`
      );
    },
    // Reste division
    () => {
      const b = randInt(3, 12);
      const q = randInt(3, 15);
      const r = randInt(1, b - 1);
      const a = b * q + r;
      return buildQuestion(
        `Quel est le reste de la division de ${a} par ${b} ?`, r,
        numericDistractors(r), 2,
        `${a} = ${b} × ${q} + ${r}, reste = ${r}`
      );
    },
    // PGCD
    () => {
      const primes = [2, 3, 5, 7];
      const g = randChoice(primes) * randChoice(primes);
      const a = g * randInt(2, 6), b = g * randInt(2, 6);
      const correct = gcd(a, b);
      return buildQuestion(
        `Quel est le PGCD de ${a} et ${b} ?`, correct,
        numericDistractors(correct), 3,
        `PGCD(${a}, ${b}) = ${correct}`
      );
    },
    // Diviseurs count
    () => {
      const n = randChoice([12, 18, 24, 30, 36, 40, 48, 60, 72, 84, 90, 100]);
      let count = 0;
      for (let i = 1; i <= n; i++) { if (n % i === 0) count++; }
      return buildQuestion(
        `Combien de diviseurs a le nombre ${n} ?`, count,
        numericDistractors(count), 3,
        `${n} a ${count} diviseurs.`
      );
    },
    // Somme consécutifs
    () => {
      const n = randInt(10, 50);
      const correct = n * (n + 1) / 2;
      return buildQuestion(
        `Combien vaut 1 + 2 + 3 + … + ${n} ?`, correct,
        numericDistractors(correct), 3,
        `n(n+1)/2 = ${n}×${n + 1}/2 = ${correct}`
      );
    },
  ],

  // ─── 5ÈME ──────────────────────────────────────────
  "5eme": [
    // Négatifs multiplication
    () => {
      const a = randInt(-12, -2), b = randInt(-12, -2);
      const correct = a * b;
      return buildQuestion(
        `Combien vaut (${a}) × (${b}) ?`, correct,
        [a + b, -(a * b), a - b, a * b + 1, Math.abs(a) + Math.abs(b)].map(String), 1,
        `(${a}) × (${b}) = ${correct}`
      );
    },
    // Négatifs addition
    () => {
      const a = randInt(-20, 20), b = randInt(-20, 20);
      const correct = a + b;
      return buildQuestion(
        `Combien vaut (${a}) + (${b}) ?`, correct,
        numericDistractors(correct), 1,
        `(${a}) + (${b}) = ${correct}`
      );
    },
    // Addition fractions
    () => {
      const d = randChoice([3, 4, 5, 6, 7, 8]);
      const d2 = randChoice([3, 4, 5, 6, 7, 8].filter(x => x !== d));
      const n1 = randInt(1, d - 1), n2 = randInt(1, d2 - 1);
      const cd = lcm(d, d2);
      const num = n1 * (cd / d) + n2 * (cd / d2);
      const g = gcd(num, cd);
      const correct = fractionStr(num / g, cd / g);
      return buildQuestion(
        `Combien vaut ${fractionStr(n1, d)} + ${fractionStr(n2, d2)} ?`, correct,
        [fractionStr(n1 + n2, d + d2), fractionStr(n1 + n2, d * d2), fractionStr(n1 * n2, d * d2), fractionStr(num, cd), fractionStr(Math.abs(num / g - 1), cd / g)],
        2, `${fractionStr(n1, d)} + ${fractionStr(n2, d2)} = ${correct}`
      );
    },
    // Équation linéaire simple ax + b = c
    () => {
      const a = randInt(2, 10), x = randInt(-10, 10), b = randInt(-15, 15);
      const c = a * x + b;
      return buildQuestion(
        `Résoudre : ${a}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)} = ${c}`, `x = ${x}`,
        [`x = ${x + 1}`, `x = ${x - 1}`, `x = ${-x}`, `x = ${c / a !== x ? round2(c / a) : x + 2}`, `x = ${a}`].map(String),
        2, `${a}x = ${c - b}, x = ${(c - b)} / ${a} = ${x}`
      );
    },
    // Volume pavé droit
    () => {
      const a = randInt(2, 10), b = randInt(2, 10), c = randInt(2, 10);
      const v = a * b * c;
      return buildQuestion(
        `Le volume d'un pavé droit de ${a} cm × ${b} cm × ${c} cm est :`,
        `${v} cm³`, [`${a * b + c} cm³`, `${2 * (a * b + b * c + a * c)} cm³`, `${v + a} cm³`, `${a + b + c} cm³`, `${v * 2} cm³`],
        2, `V = ${a} × ${b} × ${c} = ${v} cm³`
      );
    },
    // Vitesse = distance / temps
    () => {
      const v = randInt(3, 15);
      const t = randInt(2, 8);
      const d = v * t;
      return buildQuestion(
        `Si je parcours ${d} km en ${t} heures, quelle est ma vitesse ?`,
        `${v} km/h`, [`${d + t} km/h`, `${d * t} km/h`, `${v + 1} km/h`, `${v - 1} km/h`, `${t} km/h`],
        1, `v = ${d} / ${t} = ${v} km/h`
      );
    },
    // Diagonales polygone
    () => {
      const n = randInt(5, 10);
      const names = { 5: "pentagone", 6: "hexagone", 7: "heptagone", 8: "octogone", 9: "ennéagone", 10: "décagone" };
      const correct = n * (n - 3) / 2;
      return buildQuestion(
        `Combien de diagonales possède un ${names[n]} (${n} côtés) ?`, correct,
        numericDistractors(correct), 3,
        `n(n-3)/2 = ${n}×${n - 3}/2 = ${correct}`
      );
    },
    // Carrés dans grille
    () => {
      const n = randInt(3, 6);
      let total = 0;
      for (let k = 1; k <= n; k++) total += (n - k + 1) * (n - k + 1);
      return buildQuestion(
        `Combien de carrés (de toutes tailles) peut-on compter dans une grille ${n}×${n} ?`, total,
        numericDistractors(total), 3,
        `Somme de k² pour k=1 à ${n} : ${total}`
      );
    },
  ],

  // ─── 4ÈME ──────────────────────────────────────────
  "4eme": [
    // Racine carrée parfaite
    () => {
      const n = randInt(2, 20);
      const sq = n * n;
      return buildQuestion(
        `Que vaut √${sq} ?`, n,
        numericDistractors(n), 1,
        `√${sq} = ${n}`
      );
    },
    // Puissance
    () => {
      const base = randInt(2, 6), exp = randInt(2, 4);
      const correct = Math.pow(base, exp);
      return buildQuestion(
        `Combien vaut ${base}${["", "", "²", "³", "⁴"][exp]} ?`, correct,
        numericDistractors(correct), 1,
        `${base}^${exp} = ${correct}`
      );
    },
    // Développer (x+a)(x+b)
    () => {
      const a = randInt(-8, 8), b = randInt(-8, 8);
      const s = a + b, p = a * b;
      const formatCoeff = (c, varName, first) => {
        if (c === 0) return "";
        const sign = c > 0 ? (first ? "" : " + ") : (first ? "-" : " - ");
        const abs = Math.abs(c);
        if (varName && abs === 1) return sign + varName;
        return sign + abs + (varName || "");
      };
      const correct = `x²${formatCoeff(s, "x", false)}${formatCoeff(p, "", false)}`;
      const wrong1 = `x²${formatCoeff(s + 1, "x", false)}${formatCoeff(p, "", false)}`;
      const wrong2 = `x²${formatCoeff(s, "x", false)}${formatCoeff(p + a, "", false)}`;
      const wrong3 = `x²${formatCoeff(a * b, "x", false)}${formatCoeff(a + b, "", false)}`;
      const wrong4 = `x²${formatCoeff(-s, "x", false)}${formatCoeff(p, "", false)}`;
      const fmtNum = (n) => n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`;
      return buildQuestion(
        `Développer : (x ${fmtNum(a)})(x ${fmtNum(b)})`, correct,
        [wrong1, wrong2, wrong3, wrong4], 2,
        `(x ${fmtNum(a)})(x ${fmtNum(b)}) = ${correct}`
      );
    },
    // Fonction affine f(n)
    () => {
      const a = randInt(2, 8), b = randInt(-10, 10), x = randInt(-5, 10);
      const correct = a * x + b;
      return buildQuestion(
        `Si f(x) = ${a}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}, combien vaut f(${x}) ?`, correct,
        numericDistractors(correct), 1,
        `f(${x}) = ${a}×${x} + (${b}) = ${correct}`
      );
    },
    // PPCM
    () => {
      const a = randInt(4, 20), b = randInt(4, 20);
      const correct = lcm(a, b);
      return buildQuestion(
        `Quel est le PPCM de ${a} et ${b} ?`, correct,
        [a * b, gcd(a, b), correct + a, correct - b, a + b].map(String), 2,
        `PPCM(${a}, ${b}) = ${correct}`
      );
    },
    // Moyenne
    () => {
      const len = randInt(4, 6);
      const nums = Array.from({ length: len }, () => randInt(3, 20));
      const sum = nums.reduce((s, n) => s + n, 0);
      const correct = sum / len;
      const display = Number.isInteger(correct) ? correct : round2(correct);
      return buildQuestion(
        `Quelle est la moyenne de ${nums.join(", ")} ?`, display,
        numericDistractors(typeof display === "number" ? display : parseFloat(display)), 2,
        `(${nums.join(" + ")}) / ${len} = ${display}`
      );
    },
    // Théorème de Pythagore
    () => {
      const triples = [[3,4,5],[5,12,13],[6,8,10],[8,15,17],[7,24,25],[9,12,15]];
      const [a, b, c] = randChoice(triples);
      const k = randInt(1, 3);
      return buildQuestion(
        `Un triangle rectangle a des côtés de l'angle droit de ${a * k} et ${b * k}. Que vaut l'hypoténuse ?`,
        c * k, numericDistractors(c * k), 2,
        `√(${a * k}² + ${b * k}²) = √${(a * k) ** 2 + (b * k) ** 2} = ${c * k}`
      );
    },
    // Distance entre 2 points
    () => {
      const triples = [[3,4,5],[5,12,13],[6,8,10],[8,15,17]];
      const [dx, dy, d] = randChoice(triples);
      const x1 = randInt(0, 5), y1 = randInt(0, 5);
      return buildQuestion(
        `Quelle est la distance entre A(${x1}, ${y1}) et B(${x1 + dx}, ${y1 + dy}) ?`, d,
        numericDistractors(d), 3,
        `d = √(${dx}² + ${dy}²) = √${dx * dx + dy * dy} = ${d}`
      );
    },
    // Identité remarquable a²-b²
    () => {
      const a = randInt(2, 10);
      const sq = a * a;
      return buildQuestion(
        `Factoriser : x² - ${sq}`, `(x - ${a})(x + ${a})`,
        [`(x - ${a})²`, `(x + ${a})²`, `(x - ${sq})(x + 1)`, `x(x - ${sq})`, `(x - ${a + 1})(x + ${a - 1})`],
        3, `x² - ${sq} = (x - ${a})(x + ${a})`
      );
    },
  ],

  // ─── 3ÈME ──────────────────────────────────────────
  "3eme": [
    // Écriture scientifique
    () => {
      const m = round2(randInt(10, 99) / 10); // 1.0 to 9.9
      const exp = randInt(-5, 5);
      const val = m * Math.pow(10, exp);
      const correct = `${m} × 10${exp >= 0 ? "⁺" : "⁻"}${Math.abs(exp) <= 9 ? ["⁰","¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹"][Math.abs(exp)] : Math.abs(exp)}`;
      // Simpler: just use plain notation
      const correctStr = `${m} × 10^${exp}`;
      return buildQuestion(
        `Quelle est l'écriture scientifique de ${val} ?`, correctStr,
        [`${m * 10} × 10^${exp - 1}`, `${m / 10} × 10^${exp + 1}`, `${m} × 10^${exp + 1}`, `${m} × 10^${exp - 1}`, `${round2(m * 10)} × 10^${exp}`],
        1, `${val} = ${correctStr}`
      );
    },
    // Résoudre x² = n (carré parfait)
    () => {
      const n = randInt(2, 15);
      const sq = n * n;
      return buildQuestion(
        `Résoudre : x² = ${sq}`, `x = ${n} ou x = -${n}`,
        [`x = ${n}`, `x = -${n}`, `x = ${sq / 2}`, `x = √${n}`, `Aucune solution`],
        1, `x = ±${n}`
      );
    },
    // Système 2 équations
    () => {
      const x = randInt(-5, 8), y = randInt(-5, 8);
      const a1 = randInt(1, 4), b1 = randInt(1, 4);
      const a2 = randInt(1, 4), b2 = randInt(-4, -1);
      const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
      return buildQuestion(
        `Résoudre : ${a1}x + ${b1}y = ${c1} et ${a2}x ${b2 >= 0 ? "+" : "-"} ${Math.abs(b2)}y = ${c2}`,
        `x = ${x}, y = ${y}`,
        [`x = ${y}, y = ${x}`, `x = ${x + 1}, y = ${y - 1}`, `x = ${-x}, y = ${-y}`, `x = ${x - 1}, y = ${y + 1}`],
        2, `Solution : x = ${x}, y = ${y}`
      );
    },
    // Développer (ax+b)²
    () => {
      const a = randInt(1, 5), b = randInt(-7, 7);
      if (b === 0) return GENERATORS["3eme"][3](); // retry
      const a2 = a * a, ab2 = 2 * a * b, b2 = b * b;
      const correct = `${a2}x² ${ab2 >= 0 ? "+" : "-"} ${Math.abs(ab2)}x + ${b2}`;
      return buildQuestion(
        `Développer : (${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)})²`, correct,
        [
          `${a2}x² ${ab2 >= 0 ? "+" : "-"} ${Math.abs(ab2)} + ${b2}`,
          `${a2}x² - ${b2}`,
          `${a2}x² ${-ab2 >= 0 ? "+" : "-"} ${Math.abs(ab2)}x + ${b2}`,
          `${a}x² ${ab2 >= 0 ? "+" : "-"} ${Math.abs(ab2)}x + ${b * b}`,
        ],
        2, `(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)})² = ${correct}`
      );
    },
    // Trinôme x² + bx + c = 0
    () => {
      const r1 = randInt(-8, 8), r2 = randInt(-8, 8);
      const b = -(r1 + r2), c = r1 * r2;
      return buildQuestion(
        `Les solutions de x² ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)} = 0 sont :`,
        `${r1} et ${r2}`,
        [`${-r1} et ${-r2}`, `${r1 + 1} et ${r2 - 1}`, `${r1} et ${-r2}`, `${r1 * r2} et ${r1 + r2}`],
        3, `Δ = ${b * b - 4 * c}. Solutions : ${r1} et ${r2}`
      );
    },
    // Trigo : cos/sin/tan dans triangle rect
    () => {
      const triples = [[3,4,5],[5,12,13],[6,8,10],[8,15,17]];
      const [adj, opp, hyp] = randChoice(triples);
      const fn = randChoice(["cos", "sin", "tan"]);
      let correct, expl;
      if (fn === "cos") { correct = `${adj}/${hyp}`; expl = `cos = adjacent/hypoténuse = ${adj}/${hyp}`; }
      else if (fn === "sin") { correct = `${opp}/${hyp}`; expl = `sin = opposé/hypoténuse = ${opp}/${hyp}`; }
      else { correct = `${opp}/${adj}`; expl = `tan = opposé/adjacent = ${opp}/${adj}`; }
      return buildQuestion(
        `Dans un triangle rectangle avec côtés ${adj}, ${opp}, ${hyp}, que vaut ${fn}(α) si le côté adjacent à α est ${adj} et l'opposé est ${opp} ?`, correct,
        [`${adj}/${opp}`, `${hyp}/${opp}`, `${hyp}/${adj}`, `${opp * adj}/${hyp}`, `${adj + opp}/${hyp}`],
        2, expl
      );
    },
    // Volume sphère
    () => {
      const r = randInt(2, 8);
      const correct = `${round2(4 * r * r * r / 3)}π`;
      const fakeR = r + 1;
      return buildQuestion(
        `Le volume d'une sphère de rayon ${r} est :`, correct,
        [`${r * r * r}π`, `${4 * r * r}π`, `${round2(4 * fakeR * fakeR * fakeR / 3)}π`, `${r * r}π`, `${3 * r * r * r}π`],
        2, `V = (4/3)πr³ = (4/3)π×${r}³ = ${correct}`
      );
    },
    // Suite récurrente
    () => {
      const u0 = randInt(1, 5), a = randInt(2, 3), b = randInt(-3, 3);
      const target = randInt(3, 5);
      let u = u0;
      const steps = [`u₀ = ${u0}`];
      for (let i = 1; i <= target; i++) {
        u = a * u + b;
        steps.push(`u${["₁","₂","₃","₄","₅"][i-1]} = ${u}`);
      }
      return buildQuestion(
        `Si u₀ = ${u0} et uₙ₊₁ = ${a}uₙ ${b >= 0 ? "+" : "-"} ${Math.abs(b)}, que vaut u${["₁","₂","₃","₄","₅"][target-1]} ?`, u,
        numericDistractors(u), 3,
        steps.join(", ")
      );
    },
  ],

  // ─── 2NDE ──────────────────────────────────────────
  "2nde": [
    // Valeur absolue
    () => {
      const a = randInt(1, 10), b = randInt(1, 10);
      return buildQuestion(
        `Résoudre : |x - ${a}| = ${b}`,
        `x = ${a - b} ou x = ${a + b}`,
        [`x = ${a + b}`, `x = ${a - b}`, `x = ${-a + b}`, `x = ${a} ou x = ${b}`],
        1, `x - ${a} = ${b} → x = ${a + b}, ou x - ${a} = -${b} → x = ${a - b}`
      );
    },
    // Composition f(f(x))
    () => {
      const a = randInt(2, 5), b = randInt(-5, 5), x = randInt(0, 5);
      const fx = a * x + b;
      const ffx = a * fx + b;
      return buildQuestion(
        `Si f(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}, combien vaut f(f(${x})) ?`, ffx,
        numericDistractors(ffx), 1,
        `f(${x}) = ${fx}, f(${fx}) = ${ffx}`
      );
    },
    // Discriminant
    () => {
      const a = 1, b = randInt(-8, 8), c = randInt(-10, 10);
      const delta = b * b - 4 * a * c;
      const nSol = delta > 0 ? 2 : delta === 0 ? 1 : 0;
      const solText = ["aucune solution réelle", "une solution double", "deux solutions distinctes"][nSol];
      return buildQuestion(
        `Le discriminant de x² ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)} = 0 vaut :`,
        delta,
        numericDistractors(delta), 1,
        `Δ = ${b}² - 4×${c} = ${delta} → ${solText}`
      );
    },
    // Équation droite par 2 points
    () => {
      const x1 = randInt(0, 3), y1 = randInt(0, 5);
      const dx = randInt(1, 4);
      const m = randChoice([1, 2, 3, -1, -2, -3]);
      const x2 = x1 + dx, y2 = y1 + m * dx;
      const b = y1 - m * x1;
      const correct = `y = ${m === 1 ? "" : m === -1 ? "-" : m}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}`;
      return buildQuestion(
        `Quelle est l'équation de la droite passant par A(${x1}, ${y1}) et B(${x2}, ${y2}) ?`, correct,
        [`y = ${-m}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}`, `y = ${m}x ${-b >= 0 ? "+ " + Math.abs(b) : "- " + b}`, `y = ${m + 1}x + ${b - 1}`, `y = ${m - 1}x + ${b + 1}`],
        2, `m = (${y2}-${y1})/(${x2}-${x1}) = ${m}, b = ${b}`
      );
    },
    // Inéquation x²-bx+c ≤ 0
    () => {
      const r1 = randInt(-5, 0), r2 = randInt(1, 8);
      const b = -(r1 + r2), c = r1 * r2;
      const correct = `[${r1}, ${r2}]`;
      return buildQuestion(
        `L'ensemble des solutions de x² ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)} ≤ 0 est :`,
        correct,
        [`]-∞, ${r1}] ∪ [${r2}, +∞[`, `[${r2}, ${-r1}]`, `{${r1}, ${r2}}`, `]${r1}, ${r2}[`],
        2, `Racines : ${r1} et ${r2}. Négatif entre les racines : ${correct}`
      );
    },
    // Variance
    () => {
      const n = 5;
      const data = Array.from({ length: n }, () => randInt(1, 20));
      const mean = data.reduce((s, x) => s + x, 0) / n;
      const variance = round2(data.reduce((s, x) => s + (x - mean) ** 2, 0) / n);
      return buildQuestion(
        `Quelle est la variance de {${data.join(", ")}} ?`, variance,
        numericDistractors(variance), 3,
        `Moyenne = ${round2(mean)}. Variance = ${variance}`
      );
    },
    // Factoriser a³-b³
    () => {
      const a = randChoice([2, 3, 4, 5]);
      const c = a * a * a;
      return buildQuestion(
        `Factoriser : x³ - ${c}`, `(x - ${a})(x² + ${a}x + ${a * a})`,
        [`(x - ${a})³`, `(x - ${a})(x + ${a})²`, `(x - ${a})(x² - ${a}x + ${a * a})`, `(x - ${c})(x² + 1)`],
        3, `a³ - b³ = (a-b)(a²+ab+b²) avec b=${a}`
      );
    },
    // Combinaisons C(n,k)
    () => {
      const n = randInt(5, 12), k = randInt(2, Math.min(4, n));
      let correct = 1;
      for (let i = 0; i < k; i++) correct = correct * (n - i) / (i + 1);
      return buildQuestion(
        `Combien vaut C(${n}, ${k}) ?`, correct,
        numericDistractors(correct), 3,
        `C(${n}, ${k}) = ${n}! / (${k}!×${n - k}!) = ${correct}`
      );
    },
  ],

  // ─── 1ÈRE ──────────────────────────────────────────
  "1ere": [
    // Dérivée de xⁿ
    () => {
      const a = randInt(2, 8), n = randInt(2, 5);
      const coeff = a * n, newN = n - 1;
      const sup = ["", "", "²", "³", "⁴", "⁵"];
      const correct = `${coeff}x${sup[newN]}`;
      return buildQuestion(
        `Quelle est la dérivée de f(x) = ${a}x${sup[n]} ?`, correct,
        [`${a}x${sup[newN]}`, `${coeff}x${sup[n]}`, `${a * (n - 1)}x${sup[newN]}`, `${n}x${sup[newN]}`],
        1, `f'(x) = ${a}×${n}x^${newN} = ${correct}`
      );
    },
    // ln rules
    () => {
      const a = randInt(2, 8), b = randInt(2, 8);
      const op = randChoice(["sum", "diff", "power"]);
      let question, correct, dists, expl;
      if (op === "sum") {
        question = `ln(${a}) + ln(${b}) = ?`;
        correct = `ln(${a * b})`;
        dists = [`ln(${a + b})`, `ln(${a * b + 1})`, `ln(${a}) × ln(${b})`, `${a * b}`];
        expl = `ln(a) + ln(b) = ln(ab) = ln(${a * b})`;
      } else if (op === "diff") {
        question = `ln(${a * b}) - ln(${b}) = ?`;
        correct = `ln(${a})`;
        dists = [`ln(${a * b - b})`, `ln(${b})`, `ln(${a * b}) / ln(${b})`, `${a}`];
        expl = `ln(a) - ln(b) = ln(a/b) = ln(${a})`;
      } else {
        const n = randInt(2, 4);
        question = `${n}·ln(${a}) = ?`;
        correct = `ln(${Math.pow(a, n)})`;
        dists = [`ln(${n * a})`, `ln(${a + n})`, `${n * a}`, `ln(${a})^${n}`];
        expl = `n·ln(a) = ln(aⁿ) = ln(${Math.pow(a, n)})`;
      }
      return buildQuestion(question, correct, dists, 1, expl);
    },
    // Exponentielle eˣ = k
    () => {
      const k = randInt(2, 20);
      return buildQuestion(
        `Résoudre : eˣ = ${k}`, `x = ln(${k})`,
        [`x = ${k}/e`, `x = log₁₀(${k})`, `x = e^${k}`, `x = ${k}`],
        2, `eˣ = ${k} → x = ln(${k})`
      );
    },
    // Suite géométrique
    () => {
      const u0 = randInt(1, 5), q = randInt(2, 4), n = randInt(3, 6);
      const correct = u0 * Math.pow(q, n);
      return buildQuestion(
        `Suite géométrique : u₀ = ${u0}, q = ${q}. Que vaut u${["₁","₂","₃","₄","₅","₆"][n-1]} ?`, correct,
        numericDistractors(correct), 2,
        `u${n} = ${u0} × ${q}^${n} = ${correct}`
      );
    },
    // Suite arithmétique somme
    () => {
      const u0 = randInt(1, 5), r = randInt(1, 5), n = randInt(5, 15);
      const un = u0 + n * r;
      const S = (n + 1) * (u0 + un) / 2;
      return buildQuestion(
        `Suite arithmétique u₀ = ${u0}, raison ${r}. Que vaut S = u₀ + u₁ + … + u${["₅","₆","₇","₈","₉","₁₀","₁₁","₁₂","₁₃","₁₄","₁₅"][n-5]} ?`, S,
        numericDistractors(S), 3,
        `u${n} = ${un}. S = (${n + 1})(${u0} + ${un})/2 = ${S}`
      );
    },
    // Tangente à f(x)=x² en x=a
    () => {
      const a = randInt(-4, 6);
      const fa = a * a, fpa = 2 * a;
      const b = fa - fpa * a; // b = f(a) - f'(a)*a
      return buildQuestion(
        `La tangente à f(x) = x² au point x = ${a} a pour équation :`,
        `y = ${fpa}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}`,
        [`y = ${fpa}x + ${fa}`, `y = ${a}x - ${fa}`, `y = ${2 * a + 1}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`, `y = ${fa}x + ${fpa}`],
        2, `f'(${a}) = ${fpa}, f(${a}) = ${fa}. y = ${fpa}(x - ${a}) + ${fa} = ${fpa}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}`
      );
    },
    // Produit scalaire
    () => {
      const u1 = randInt(-5, 5), u2 = randInt(-5, 5), v1 = randInt(-5, 5), v2 = randInt(-5, 5);
      const correct = u1 * v1 + u2 * v2;
      return buildQuestion(
        `Le produit scalaire de u⃗(${u1}, ${u2}) et v⃗(${v1}, ${v2}) est :`, correct,
        numericDistractors(correct), 2,
        `u⃗·v⃗ = ${u1}×${v1} + ${u2}×${v2} = ${correct}`
      );
    },
    // Dérivée de ln(u)
    () => {
      const a = randInt(2, 5), b = randInt(1, 8);
      return buildQuestion(
        `La dérivée de f(x) = ln(${a}x + ${b}) est :`,
        `${a}/(${a}x + ${b})`,
        [`1/(${a}x + ${b})`, `${a}·ln(${a}x + ${b})`, `(${a}x + ${b})/x`, `${a}x/(${a}x + ${b})`],
        3, `f'(x) = ${a}/(${a}x + ${b})`
      );
    },
  ],

  // ─── TERMINALE ─────────────────────────────────────
  "terminale": [
    // Intégrale de xⁿ
    () => {
      const n = randInt(1, 5), a = randInt(0, 2), b = randInt(a + 1, a + 4);
      const sup = ["", "x", "x²", "x³", "x⁴", "x⁵"];
      const antider = (x) => Math.pow(x, n + 1) / (n + 1);
      const correct = round2(antider(b) - antider(a));
      return buildQuestion(
        `∫ de ${a} à ${b} de ${sup[n]} dx = ?`, correct,
        numericDistractors(correct), 1,
        `∫x^${n}dx = x^${n + 1}/${n + 1}. [${a},${b}] → ${correct}`
      );
    },
    // Primitive de eᵃˣ
    () => {
      const a = randInt(2, 6);
      return buildQuestion(
        `Une primitive de e^(${a}x) est :`, `(1/${a})e^(${a}x)`,
        [`${a}e^(${a}x)`, `e^(${a}x)`, `(1/${a + 1})e^(${a}x)`, `e^(${a}x)/${a + 1}`],
        1, `∫e^(ax)dx = (1/a)e^(ax) + C`
      );
    },
    // Limite forme indéterminée
    () => {
      const a = randInt(2, 5), b = randInt(2, 5);
      const correct = a > b ? "+∞" : a < b ? "0" : "1";
      return buildQuestion(
        `lim(x→+∞) x^${a} / x^${b} = ?`, correct,
        ["0", "1", "+∞", "-∞", `${a}/${b}`].filter(c => c !== correct).concat([correct]),
        1, `x^${a}/x^${b} = x^${a - b} →  ${correct}`
      );
    },
    // Équation différentielle y' = ay
    () => {
      const a = randInt(-5, 5);
      if (a === 0) return GENERATORS["terminale"][3]();
      return buildQuestion(
        `La solution générale de y' = ${a}y est :`, `y = Ce^(${a}x)`,
        [`y = Ce^(${-a}x)`, `y = ${a}eˣ`, `y = Ce^(x/${a})`, `y = Cx^${a}`],
        2, `y'/y = ${a} → y = Ce^(${a}x)`
      );
    },
    // Module nombre complexe
    () => {
      const a = randInt(-8, 8), b = randInt(-8, 8);
      if (a === 0 && b === 0) return GENERATORS["terminale"][4]();
      const mod = round2(Math.sqrt(a * a + b * b));
      const display = Number.isInteger(mod) ? mod : `√${a * a + b * b}`;
      return buildQuestion(
        `Le module de z = ${a} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}i est :`, display,
        [String(a + b), String(Math.abs(a) + Math.abs(b)), String(a * a + b * b), String(Math.abs(a - b))].concat([String(display)]),
        2, `|z| = √(${a}² + ${b}²) = √${a * a + b * b} = ${display}`
      );
    },
    // Intégrale par parties
    () => {
      const n = randInt(1, 4);
      const sup = ["", "x", "x²", "x³", "x⁴"];
      // ∫xⁿ eˣ dx — we just ask for the derivative check
      // Simpler: ∫₀¹ xⁿ dx
      const a = 0, b = 1;
      const correct = `1/${n + 1}`;
      return buildQuestion(
        `∫ de 0 à 1 de ${sup[n]} dx = ?`, correct,
        [`1/${n}`, `1/${n + 2}`, `${n}/${n + 1}`, `${n + 1}`],
        2, `[x^${n + 1}/${n + 1}]₀¹ = ${correct}`
      );
    },
    // Convergence de série géométrique
    () => {
      const q_num = randInt(1, 4), q_den = randInt(q_num + 1, q_num + 5);
      const g = gcd(q_num, q_den);
      const qn = q_num / g, qd = q_den / g;
      const sum = qd / (qd - qn);
      const correct = fractionStr(qd, qd - qn);
      return buildQuestion(
        `La somme de la série Σ (${fractionStr(qn, qd)})ⁿ pour n ≥ 0 est :`, correct,
        [fractionStr(qn, qd), fractionStr(qd, qn), `${qd}`, fractionStr(qn + qd, qd)],
        3, `Somme = 1/(1-q) = 1/(1 - ${fractionStr(qn, qd)}) = ${correct}`
      );
    },
    // Dérivée composée
    () => {
      const a = randInt(2, 6);
      const fns = [
        { f: `sin(${a}x)`, fp: `${a}cos(${a}x)`, wrongs: [`cos(${a}x)`, `-${a}cos(${a}x)`, `${a}sin(${a}x)`, `-sin(${a}x)`] },
        { f: `cos(${a}x)`, fp: `-${a}sin(${a}x)`, wrongs: [`${a}sin(${a}x)`, `-sin(${a}x)`, `${a}cos(${a}x)`, `sin(${a}x)`] },
        { f: `e^(${a}x²)`, fp: `${2 * a}x·e^(${a}x²)`, wrongs: [`${a}x·e^(${a}x²)`, `${2 * a}e^(${a}x²)`, `e^(${a}x²)`, `${a}x²·e^(${a}x²)`] },
      ];
      const chosen = randChoice(fns);
      return buildQuestion(
        `La dérivée de f(x) = ${chosen.f} est :`, chosen.fp,
        chosen.wrongs, 3,
        `Dérivée de composée : f'(x) = ${chosen.fp}`
      );
    },
  ],
};

// ═══════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════

/**
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
      q.difficulty = targetDiff; // Override difficulty to match distribution
      attempts++;
    } while (seenQuestions.has(q.question) && attempts < 20);

    seenQuestions.add(q.question);
    questions.push(q);
  }

  return questions;
}
