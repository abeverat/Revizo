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
    let a, b;
    // Ensure at least one operand is negative for 5ème-level relevance
    if (randInt(0, 1)) {
      a = randInt(-20, -1);
      b = randInt(-20, 20);
    } else {
      a = randInt(-20, 20);
      b = randInt(-20, -1);
    }
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
  // Somme des angles d'un triangle (avec dessin)
  () => {
    const a1 = randInt(25, 80);
    const a2 = randInt(25, 130 - a1);
    const a3 = 180 - a1 - a2;
    const hidden = randInt(0, 2);
    const angles = [a1, a2, a3];
    const showAngles = [true, true, true];
    showAngles[hidden] = false;
    const svg = svgTriangle({ angles, showAngles, highlight: hidden });
    return buildQuestion(
      `Quel est l'angle manquant de ce triangle ?${svg}`,
      `${angles[hidden]}°`,
      [`${angles[hidden] + 10}°`, `${angles[hidden] - 10}°`, `${180 - angles[hidden]}°`, `90°`, `${angles[hidden] + 5}°`], 1,
      `La somme des angles d'un triangle = 180°. Angle = 180° − ${angles[(hidden + 1) % 3]}° − ${angles[(hidden + 2) % 3]}° = ${angles[hidden]}°`
    );
  },
  // Proportionnalité (produit en croix)
  () => {
    // Build from ratio a/b with gcd=1, then scale so cross-mult is needed
    let num, den;
    do {
      num = randInt(2, 9);
      den = randInt(2, 9);
    } while (num === den || gcd(num, den) !== 1);
    // x1 items cost/take y1 units; x2 items → y2 = ?
    const x1 = den * randInt(1, 3);        // ensures x1 divisible by den
    const y1 = num * randInt(1, 3);         // ensures y1 divisible by num
    const mult = randInt(2, 5);
    const x2 = x1 + den * mult;            // x2/x1 is NOT an integer (different scale)
    const y2 = y1 * x2 / x1;              // clean because x2 is multiple of den
    if (!Number.isInteger(y2) || y2 > 200) return GENERATORS["5eme"][9]();
    const scenarios = [
      `${x1} cahiers coûtent ${y1} €. Combien coûtent ${x2} cahiers ?`,
      `Une voiture parcourt ${y1} km en ${x1} min. Combien de km en ${x2} min ?`,
      `${x1} kg de pommes coûtent ${y1} €. Combien pour ${x2} kg ?`,
    ];
    return buildQuestion(
      randChoice(scenarios), y2, numericDistractors(y2), 2,
      `Proportionnalité : ${x2} × ${y1} / ${x1} = ${y2}`
    );
  },
  // Classement de nombres relatifs
  () => {
    const nums = new Set();
    while (nums.size < 4) nums.add(randInt(-20, 20));
    const arr = [...nums];
    const sorted = [...arr].sort((a, b) => a - b);
    const correct = sorted.join(' < ');
    const wrong1 = [...sorted].reverse().join(' < ');
    const wrong2 = [...arr].join(' < ');
    const wrong3 = [sorted[0], sorted[2], sorted[1], sorted[3]].join(' < ');
    const wrong4 = [sorted[1], sorted[0], sorted[2], sorted[3]].join(' < ');
    return buildQuestion(
      `Range dans l'ordre croissant : ${arr.join(', ')}`,
      correct, [wrong1, wrong2, wrong3, wrong4], 1,
      `Ordre croissant : ${correct}`
    );
  },
];
