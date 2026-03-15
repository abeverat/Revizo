GENERATORS["6eme"] = [
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
];
