GENERATORS["terminale"] = [
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
];
