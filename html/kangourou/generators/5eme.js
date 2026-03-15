GENERATORS["5eme"] = [
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
];
