QUESTIONS["6eme"] = [
  // --- Faciles (Q1-Q8) ---
  { question: "Combien font 25 × 4 ?", choices: ["80", "90", "100", "110", "120"], answer: 2, difficulty: 1, explanation: "25 × 4 = 100" },
  { question: "Quel est le plus petit nombre premier ?", choices: ["0", "1", "2", "3", "4"], answer: 2, difficulty: 1, explanation: "2 est le plus petit nombre premier." },
  { question: "Marie a 3 fois plus de billes que Paul. Ensemble, ils ont 24 billes. Combien Paul en a-t-il ?", choices: ["3", "4", "6", "8", "12"], answer: 2, difficulty: 1, explanation: "Paul = x, Marie = 3x. x + 3x = 24 → 4x = 24 → x = 6." },
  { question: "On écrit tous les nombres de 1 à 20. Combien de fois écrit-on le chiffre 1 ?", choices: ["2", "3", "10", "11", "12"], answer: 4, difficulty: 1, explanation: "Unités : 1, 11 → 2 fois. Dizaines : 10–19 → 10 fois. Total = 12." },
  { question: "Que vaut 1/2 + 1/2 ?", choices: ["1/4", "1/2", "1", "2", "3/2"], answer: 2, difficulty: 1, explanation: "1/2 + 1/2 = 1" },
  { question: "Dans un carré magique, la somme de chaque ligne est la même. Si les cases contiennent les nombres 1 à 9, quelle est cette somme ?", choices: ["12", "13", "14", "15", "18"], answer: 3, difficulty: 1, explanation: "Somme totale = 1+2+…+9 = 45. Il y a 3 lignes, donc 45 ÷ 3 = 15." },
  { question: "Quel est le double de 35 ?", choices: ["60", "65", "70", "75", "80"], answer: 2, difficulty: 1, explanation: "35 × 2 = 70" },
  { question: "Combien de faces a un cube ?", choices: ["4", "5", "6", "8", "12"], answer: 2, difficulty: 1, explanation: "Un cube a 6 faces." },

  // --- Moyens (Q9-Q16) ---
  { question: "Si un rectangle a pour longueur 8 cm et largeur 5 cm, quel est son périmètre ?", choices: ["13 cm", "26 cm", "40 cm", "30 cm", "21 cm"], answer: 1, difficulty: 2, explanation: "P = 2 × (8 + 5) = 26 cm" },
  { question: "Quel est le reste de la division de 47 par 6 ?", choices: ["1", "2", "3", "5", "7"], answer: 3, difficulty: 2, explanation: "47 = 6 × 7 + 5, reste = 5" },
  { question: "Combien font 3/4 de 60 ?", choices: ["15", "30", "40", "45", "48"], answer: 3, difficulty: 2, explanation: "3/4 × 60 = 45" },
  { question: "Un livre coûte 12 €. Après une réduction de 25%, quel est son prix ?", choices: ["3 €", "6 €", "8 €", "9 €", "10 €"], answer: 3, difficulty: 2, explanation: "25% de 12 = 3 €, donc 12 - 3 = 9 €" },
  { question: "Combien y a-t-il de dizaines dans 3 450 ?", choices: ["34", "45", "345", "3", "5"], answer: 2, difficulty: 2, explanation: "3 450 ÷ 10 = 345. Il y a 345 dizaines dans 3 450. (Attention à ne pas confondre avec le chiffre des dizaines, qui est 5.)" },
  { question: "Quel nombre est à la fois multiple de 3 et de 5 parmi ceux-ci ?", choices: ["10", "12", "20", "25", "30"], answer: 4, difficulty: 2, explanation: "30 = 3 × 10 = 5 × 6" },
  { question: "L'aire d'un carré de côté 7 cm est :", choices: ["14 cm²", "21 cm²", "28 cm²", "49 cm²", "56 cm²"], answer: 3, difficulty: 2, explanation: "Aire = 7² = 49 cm²" },
  { question: "Si je parcours 15 km en 3 heures, quelle est ma vitesse ?", choices: ["3 km/h", "5 km/h", "12 km/h", "18 km/h", "45 km/h"], answer: 1, difficulty: 2, explanation: "v = 15 / 3 = 5 km/h" },

  // --- Difficiles (Q17-Q24) ---
  { question: "Combien de nombres entiers entre 1 et 100 sont divisibles par 7 ?", choices: ["10", "12", "14", "15", "16"], answer: 2, difficulty: 3, explanation: "100 ÷ 7 = 14,28… → 14 nombres." },
  { question: "Un escargot grimpe 3 m le jour et glisse de 2 m la nuit. En combien de jours atteint-il le haut d'un mur de 10 m ?", choices: ["7", "8", "9", "10", "12"], answer: 1, difficulty: 3, explanation: "Après 7 jours : il est à 7 m le soir du 7e jour (net +1/jour). Le 8e jour il grimpe à 10 m. Réponse : 8 jours." },
  { question: "Quel est le PGCD de 36 et 48 ?", choices: ["4", "6", "8", "12", "24"], answer: 3, difficulty: 3, explanation: "36 = 2² × 3², 48 = 2⁴ × 3. PGCD = 2² × 3 = 12." },
  { question: "Dans une classe de 30 élèves, 18 aiment les maths et 20 aiment le français. Au minimum, combien aiment les deux ?", choices: ["2", "4", "6", "8", "10"], answer: 3, difficulty: 3, explanation: "Au minimum : 18 + 20 - 30 = 8." },
  { question: "Un fermier a des poules et des lapins. Il compte 20 têtes et 56 pattes. Combien a-t-il de lapins ?", choices: ["6", "8", "10", "12", "14"], answer: 1, difficulty: 3, explanation: "p + l = 20, 2p + 4l = 56 → l = 8." },
  { question: "Combien vaut 2⁰ + 2¹ + 2² + 2³ + 2⁴ ?", choices: ["15", "16", "30", "31", "32"], answer: 3, difficulty: 3, explanation: "1 + 2 + 4 + 8 + 16 = 31." },
  { question: "On lance deux dés. Quelle est la probabilité d'obtenir une somme de 7 ?", choices: ["1/12", "1/6", "5/36", "7/36", "1/4"], answer: 1, difficulty: 3, explanation: "6 combinaisons sur 36 → 6/36 = 1/6." },
  { question: "Un palindrome est un nombre qui se lit de la même façon dans les deux sens. Combien y a-t-il de palindromes à 3 chiffres ?", choices: ["80", "90", "100", "81", "99"], answer: 1, difficulty: 3, explanation: "Le 1er chiffre : 9 choix (1-9), le 2e : 10 choix (0-9), le 3e = le 1er. 9 × 10 = 90." },
];
