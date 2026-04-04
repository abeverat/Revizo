GENERATORS["1ere"] = [
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
    const b = fa - fpa * a;
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
];
