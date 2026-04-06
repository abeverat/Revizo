GENERATORS["2nde"] = [
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
  // Valeurs trigonométriques remarquables
  () => {
    const table = [
      { angle: '0',    cos: '1',    sin: '0',    tan: '0' },
      { angle: 'π/6',  cos: '√3/2', sin: '1/2',  tan: '√3/3' },
      { angle: 'π/4',  cos: '√2/2', sin: '√2/2', tan: '1' },
      { angle: 'π/3',  cos: '1/2',  sin: '√3/2', tan: '√3' },
      { angle: 'π/2',  cos: '0',    sin: '1',    tan: null },
    ];
    const entry = randChoice(table);
    const fn = randChoice(entry.tan !== null ? ['cos', 'sin', 'tan'] : ['cos', 'sin']);
    const correct = entry[fn];
    const allValues = ['0', '1', '1/2', '√2/2', '√3/2', '√3', '√3/3', '-1', '-1/2'];
    const dists = allValues.filter(v => v !== correct);
    return buildQuestion(
      `Que vaut ${fn}(${entry.angle}) ?`, correct,
      dists, 1,
      `${fn}(${entry.angle}) = ${correct}`
    );
  },
  // Intersection d'intervalles
  () => {
    const a = randInt(-5, 0), b = randInt(3, 8);
    const c = randInt(a + 1, b - 1), d = randInt(b + 1, b + 6);
    // [a,b] ∩ [c,d] = [c,b]
    const correct = `[${c} ; ${b}]`;
    return buildQuestion(
      `Quel est l'ensemble [${a} ; ${b}] ∩ [${c} ; ${d}] ?`, correct,
      [`[${a} ; ${d}]`, `[${a} ; ${b}]`, `[${c} ; ${d}]`, `[${a} ; ${c}]`, `∅`], 2,
      `[${a} ; ${b}] ∩ [${c} ; ${d}] = [max(${a},${c}) ; min(${b},${d})] = ${correct}`
    );
  },
];
