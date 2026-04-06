GENERATORS["4eme"] = [
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
    let a, b;
    do {
      a = randInt(4, 20);
      b = randInt(4, 20);
    } while (gcd(a, b) === 1 || a === b);
    const correct = lcm(a, b);
    const product = a * b;
    const dists = [gcd(a, b), correct + a, correct - b, a + b];
    if (product !== correct) dists.unshift(product);
    return buildQuestion(
      `Quel est le PPCM de ${a} et ${b} ?`, correct,
      dists.map(String), 2,
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
  // Probabilité de base (dé / pièce)
  () => {
    const scenarios = [
      { q: `On lance un dé à 6 faces. Quelle est la probabilité d'obtenir un nombre pair ?`, ans: '1/2', expl: '3 cas favorables (2,4,6) sur 6 → 3/6 = 1/2', dists: ['1/3', '1/6', '2/3', '3/5', '1/4'] },
      { q: `On lance un dé à 6 faces. Quelle est la probabilité d'obtenir un 6 ?`, ans: '1/6', expl: '1 cas favorable sur 6 → 1/6', dists: ['1/3', '1/2', '2/6', '1/5', '5/6'] },
      { q: `On lance un dé à 6 faces. Quelle est la probabilité d'obtenir un nombre strictement supérieur à 4 ?`, ans: '1/3', expl: '2 cas favorables (5,6) sur 6 → 2/6 = 1/3', dists: ['1/2', '2/5', '1/6', '4/6', '1/4'] },
      { q: `On lance une pièce de monnaie. Quelle est la probabilité d'obtenir pile ?`, ans: '1/2', expl: '1 cas favorable sur 2 → 1/2', dists: ['1/3', '1/4', '2/3', '1/1', '0'] },
      { q: `On tire une carte au hasard dans un jeu de 32 cartes. Quelle est la probabilité de tirer un as ?`, ans: '1/8', expl: '4 as sur 32 cartes → 4/32 = 1/8', dists: ['1/4', '1/32', '1/16', '4/13', '1/13'] },
      { q: `On lance un dé à 6 faces. Quelle est la probabilité d'obtenir un nombre inférieur ou égal à 2 ?`, ans: '1/3', expl: '2 cas favorables (1,2) sur 6 → 2/6 = 1/3', dists: ['1/2', '2/5', '1/6', '1/4', '5/6'] },
    ];
    const s = randChoice(scenarios);
    return buildQuestion(s.q, s.ans, s.dists, 1, s.expl);
  },
  // Aire du cercle (avec dessin)
  () => {
    const r = randInt(2, 12);
    const correct = round2(Math.PI * r * r);
    const svg = svgCircle(r, `r = ${r}`);
    return buildQuestion(
      `Quelle est l'aire de ce disque (arrondie au centième) ?${svg}`,
      correct, [round2(2 * Math.PI * r), round2(Math.PI * r), r * r, round2(Math.PI * r * r * 2), round2(Math.PI * (r + 1) * (r + 1))].map(String), 2,
      `A = π × r² = π × ${r}² ≈ ${correct}`
    );
  },
  // Périmètre du cercle (avec dessin)
  () => {
    const r = randInt(2, 15);
    const correct = round2(2 * Math.PI * r);
    const svg = svgCircle(r, `r = ${r}`);
    return buildQuestion(
      `Quel est le périmètre de ce cercle (arrondi au centième) ?${svg}`,
      correct, [round2(Math.PI * r * r), round2(Math.PI * r), 2 * r, round2(4 * Math.PI * r), round2(2 * Math.PI * (r + 1))].map(String), 2,
      `P = 2 × π × r = 2 × π × ${r} ≈ ${correct}`
    );
  },
];
