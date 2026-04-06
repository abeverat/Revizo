GENERATORS["3eme"] = [
  // Écriture scientifique
  () => {
    const m = round2(randInt(10, 99) / 10);
    const exp = randInt(-5, 5);
    const val = m * Math.pow(10, exp);
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
    if (b === 0) return GENERATORS["3eme"][3]();
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
  // Addition de vecteurs
  () => {
    const ax = randInt(-5, 5), ay = randInt(-5, 5);
    const bx = randInt(-5, 5), by = randInt(-5, 5);
    const cx = ax + bx, cy = ay + by;
    return buildQuestion(
      `Si u⃗(${ax} ; ${ay}) et v⃗(${bx} ; ${by}), quelles sont les coordonnées de u⃗ + v⃗ ?`,
      `(${cx} ; ${cy})`,
      [`(${ax * bx} ; ${ay * by})`, `(${cx + 1} ; ${cy - 1})`, `(${ax - bx} ; ${ay - by})`, `(${cy} ; ${cx})`, `(${cx + 2} ; ${cy})`],
      2, `u⃗ + v⃗ = (${ax}+${bx} ; ${ay}+${by}) = (${cx} ; ${cy})`
    );
  },
  // Théorème de Thalès (avec dessin)
  () => {
    // OA/OA' = OB/OB' with integer ratios
    const k = randInt(2, 5);
    const oa = randInt(2, 6);
    const ob = randInt(2, 6);
    const oaPrime = oa * k;
    const obPrime = ob * k;
    // Choose which value to hide
    const missingChoice = randChoice(['b', 'd']);
    let correct, question;
    if (missingChoice === 'b') {
      // Hide OA' (= oaPrime)
      correct = oaPrime;
      question = `OA = ${oa}, OB = ${ob}, OB' = ${obPrime}. (AB) // (A'B'). Combien vaut OA' ?`;
    } else {
      // Hide OB' (= obPrime)
      correct = obPrime;
      question = `OA = ${oa}, OA' = ${oaPrime}, OB = ${ob}. (AB) // (A'B'). Combien vaut OB' ?`;
    }
    const svg = svgThales({
      a: oa, b: missingChoice === 'b' ? '?' : oaPrime,
      c: ob, d: missingChoice === 'd' ? '?' : obPrime,
      missing: missingChoice
    });
    return buildQuestion(
      `${question}${svg}`, correct,
      numericDistractors(correct), 3,
      `Par le théorème de Thalès : OA/OA' = OB/OB', donc la valeur manquante = ${correct}`
    );
  },
];
