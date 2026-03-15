/**
 * Kangourou des Mathématiques — Banque de questions
 *
 * Structure :
 *   QUESTIONS[niveau] = [
 *     { question, choices: [A,B,C,D,E], answer (index 0-4), difficulty: 1|2|3, explanation? }
 *   ]
 *
 * Difficulté : 1 = facile (3 pts), 2 = moyen (4 pts), 3 = difficile (5 pts)
 * Barème Kangourou : bonne réponse = pts, mauvaise = -1/4 des pts, sans réponse = 0
 */

const LEVELS = [
  { id: "6eme",     label: "6ème",     color: "#4CAF50", questions: 24, timeMinutes: 50 },
  { id: "5eme",     label: "5ème",     color: "#2196F3", questions: 24, timeMinutes: 50 },
  { id: "4eme",     label: "4ème",     color: "#9C27B0", questions: 24, timeMinutes: 50 },
  { id: "3eme",     label: "3ème",     color: "#FF9800", questions: 24, timeMinutes: 50 },
  { id: "2nde",     label: "2nde",     color: "#F44336", questions: 24, timeMinutes: 50 },
  { id: "1ere",     label: "1ère",     color: "#00BCD4", questions: 24, timeMinutes: 50 },
  { id: "terminale",label: "Terminale",color: "#795548", questions: 24, timeMinutes: 50 },
];

const QUESTIONS = {

  // ═══════════════════════════════════════
  // 6ÈME
  // ═══════════════════════════════════════
  "6eme": [
    // --- Faciles (Q1-Q8) ---
    { question: "Combien font 25 × 4 ?", choices: ["80", "90", "100", "110", "120"], answer: 2, difficulty: 1, explanation: "25 × 4 = 100" },
    { question: "Quel est le plus petit nombre premier ?", choices: ["0", "1", "2", "3", "4"], answer: 2, difficulty: 1, explanation: "2 est le plus petit nombre premier." },
    { question: "Combien y a-t-il de minutes dans 2 heures ?", choices: ["60", "90", "100", "120", "150"], answer: 3, difficulty: 1, explanation: "2 × 60 = 120 minutes." },
    { question: "Un triangle a combien de côtés ?", choices: ["2", "3", "4", "5", "6"], answer: 1, difficulty: 1, explanation: "Un triangle a 3 côtés." },
    { question: "Que vaut 1/2 + 1/2 ?", choices: ["1/4", "1/2", "1", "2", "3/2"], answer: 2, difficulty: 1, explanation: "1/2 + 1/2 = 1" },
    { question: "Combien font 999 + 1 ?", choices: ["990", "1000", "1001", "9991", "10000"], answer: 1, difficulty: 1, explanation: "999 + 1 = 1000" },
    { question: "Quel est le double de 35 ?", choices: ["60", "65", "70", "75", "80"], answer: 2, difficulty: 1, explanation: "35 × 2 = 70" },
    { question: "Combien de faces a un cube ?", choices: ["4", "5", "6", "8", "12"], answer: 2, difficulty: 1, explanation: "Un cube a 6 faces." },

    // --- Moyens (Q9-Q16) ---
    { question: "Si un rectangle a pour longueur 8 cm et largeur 5 cm, quel est son périmètre ?", choices: ["13 cm", "26 cm", "40 cm", "30 cm", "21 cm"], answer: 1, difficulty: 2, explanation: "P = 2 × (8 + 5) = 26 cm" },
    { question: "Quel est le reste de la division de 47 par 6 ?", choices: ["1", "2", "3", "5", "7"], answer: 3, difficulty: 2, explanation: "47 = 6 × 7 + 5, reste = 5" },
    { question: "Combien font 3/4 de 60 ?", choices: ["15", "30", "40", "45", "48"], answer: 3, difficulty: 2, explanation: "3/4 × 60 = 45" },
    { question: "Un livre coûte 12 €. Après une réduction de 25%, quel est son prix ?", choices: ["3 €", "6 €", "8 €", "9 €", "10 €"], answer: 3, difficulty: 2, explanation: "25% de 12 = 3 €, donc 12 - 3 = 9 €" },
    { question: "Combien y a-t-il de dizaines dans 3 450 ?", choices: ["34", "45", "345", "3", "5"], answer: 2, difficulty: 2, explanation: "Le chiffre des dizaines dans 3 450 est 5, et il y a 345 dizaines au total. Le chiffre des dizaines est 5." },
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
  ],

  // ═══════════════════════════════════════
  // 5ÈME
  // ═══════════════════════════════════════
  "5eme": [
    { question: "Combien vaut (-3) × (-5) ?", choices: ["-15", "-8", "8", "15", "0"], answer: 3, difficulty: 1, explanation: "Moins × moins = plus. (-3)×(-5)=15" },
    { question: "Quelle fraction est égale à 0,75 ?", choices: ["1/2", "2/3", "3/4", "4/5", "7/10"], answer: 2, difficulty: 1, explanation: "3/4 = 0,75" },
    { question: "Un angle droit mesure :", choices: ["45°", "60°", "90°", "120°", "180°"], answer: 2, difficulty: 1, explanation: "Un angle droit = 90°." },
    { question: "Combien font 15% de 200 ?", choices: ["15", "20", "25", "30", "35"], answer: 3, difficulty: 1, explanation: "15% × 200 = 30" },
    { question: "Si x + 7 = 12, alors x = ?", choices: ["3", "4", "5", "7", "19"], answer: 2, difficulty: 1, explanation: "x = 12 - 7 = 5" },
    { question: "Combien de cm³ y a-t-il dans 1 litre ?", choices: ["10", "100", "1 000", "10 000", "100 000"], answer: 2, difficulty: 1, explanation: "1 L = 1 000 cm³" },
    { question: "La somme des angles d'un triangle vaut :", choices: ["90°", "120°", "180°", "270°", "360°"], answer: 2, difficulty: 1, explanation: "La somme des angles d'un triangle = 180°." },
    { question: "Quel est l'opposé de -8 ?", choices: ["-8", "0", "8", "1/8", "-1/8"], answer: 2, difficulty: 1, explanation: "L'opposé de -8 est 8." },

    { question: "Dans un triangle rectangle, les côtés de l'angle droit mesurent 3 et 4. Que vaut l'hypoténuse ?", choices: ["5", "6", "7", "√7", "12"], answer: 0, difficulty: 2, explanation: "3² + 4² = 25, √25 = 5" },
    { question: "Combien vaut 2/3 + 3/4 ?", choices: ["5/7", "5/12", "17/12", "11/12", "1"], answer: 2, difficulty: 2, explanation: "2/3 + 3/4 = 8/12 + 9/12 = 17/12" },
    { question: "Un article à 80 € est soldé à -30%. Son nouveau prix est :", choices: ["24 €", "50 €", "54 €", "56 €", "60 €"], answer: 3, difficulty: 2, explanation: "30% de 80 = 24, 80 - 24 = 56 €" },
    { question: "Le symétrique du point A(2, 3) par rapport à l'origine est :", choices: ["(2, -3)", "(-2, 3)", "(-2, -3)", "(3, 2)", "(-3, -2)"], answer: 2, difficulty: 2, explanation: "Symétrique par rapport à O : (-2, -3)" },
    { question: "Combien vaut 5! (factorielle 5) ?", choices: ["15", "25", "60", "120", "720"], answer: 3, difficulty: 2, explanation: "5! = 5×4×3×2×1 = 120" },
    { question: "Quel pourcentage représente 45 sur 180 ?", choices: ["15%", "20%", "25%", "30%", "35%"], answer: 2, difficulty: 2, explanation: "45/180 = 1/4 = 25%" },
    { question: "Le volume d'un pavé droit de dimensions 3 cm, 4 cm, 5 cm est :", choices: ["12 cm³", "30 cm³", "47 cm³", "60 cm³", "120 cm³"], answer: 3, difficulty: 2, explanation: "V = 3 × 4 × 5 = 60 cm³" },
    { question: "Si 3x - 7 = 14, alors x = ?", choices: ["3", "5", "7", "9", "11"], answer: 2, difficulty: 2, explanation: "3x = 21, x = 7" },

    { question: "Un nombre est divisible par 9 si :", choices: ["Son dernier chiffre est 9", "La somme de ses chiffres est divisible par 9", "Il est impair", "Il finit par 0 ou 9", "Son chiffre des dizaines est 9"], answer: 1, difficulty: 3, explanation: "Critère de divisibilité par 9." },
    { question: "Combien de diagonales possède un hexagone régulier ?", choices: ["6", "7", "8", "9", "12"], answer: 3, difficulty: 3, explanation: "n(n-3)/2 = 6×3/2 = 9 diagonales" },
    { question: "On plie une feuille en deux, puis encore en deux, puis encore. On fait un trou. En dépliant, combien de trous y a-t-il ?", choices: ["2", "3", "4", "6", "8"], answer: 4, difficulty: 3, explanation: "Chaque pliage double le nombre de trous : 2³ = 8." },
    { question: "Quelle est la somme des 10 premiers nombres impairs ?", choices: ["55", "81", "99", "100", "110"], answer: 3, difficulty: 3, explanation: "La somme des n premiers impairs = n². 10² = 100." },
    { question: "Si a/b = 3/5 et b/c = 5/7, alors a/c = ?", choices: ["3/7", "5/7", "3/5", "7/3", "15/35"], answer: 0, difficulty: 3, explanation: "a/c = (a/b)×(b/c) = (3/5)×(5/7) = 3/7" },
    { question: "Un train de 100 m traverse un tunnel de 400 m à 50 m/s. Combien de temps met-il ?", choices: ["2 s", "8 s", "10 s", "12 s", "20 s"], answer: 2, difficulty: 3, explanation: "Distance totale = 100 + 400 = 500 m. t = 500/50 = 10 s." },
    { question: "Combien de carrés (de toutes tailles) peut-on compter sur un échiquier 4×4 ?", choices: ["16", "20", "25", "30", "36"], answer: 3, difficulty: 3, explanation: "1×1:16, 2×2:9, 3×3:4, 4×4:1 → 30" },
    { question: "Si le produit de deux entiers consécutifs est 182, quels sont ces nombres ?", choices: ["12 et 13", "13 et 14", "14 et 15", "11 et 12", "10 et 11"], answer: 1, difficulty: 3, explanation: "13 × 14 = 182" },
  ],

  // ═══════════════════════════════════════
  // 4ÈME
  // ═══════════════════════════════════════
  "4eme": [
    { question: "Que vaut √144 ?", choices: ["10", "11", "12", "13", "14"], answer: 2, difficulty: 1, explanation: "√144 = 12" },
    { question: "Si 2x = 18, alors x = ?", choices: ["6", "7", "8", "9", "10"], answer: 3, difficulty: 1, explanation: "x = 18/2 = 9" },
    { question: "Combien vaut (-2)³ ?", choices: ["-8", "-6", "6", "8", "12"], answer: 0, difficulty: 1, explanation: "(-2)³ = -8" },
    { question: "Quelle est la médiane de : 3, 7, 1, 9, 5 ?", choices: ["1", "3", "5", "7", "9"], answer: 2, difficulty: 1, explanation: "Ordonné : 1,3,5,7,9. Médiane = 5." },
    { question: "Convertir 3,5 km en mètres :", choices: ["35 m", "350 m", "3 500 m", "35 000 m", "3,5 m"], answer: 2, difficulty: 1, explanation: "3,5 × 1000 = 3 500 m" },
    { question: "Quel est l'inverse de 4 ?", choices: ["-4", "0,4", "1/4", "0,25", "1/4 et 0,25"], answer: 4, difficulty: 1, explanation: "L'inverse de 4 est 1/4 = 0,25." },
    { question: "10⁻² = ?", choices: ["-100", "-20", "0,01", "0,1", "100"], answer: 2, difficulty: 1, explanation: "10⁻² = 1/100 = 0,01" },
    { question: "Un losange a combien d'axes de symétrie ?", choices: ["0", "1", "2", "3", "4"], answer: 2, difficulty: 1, explanation: "Un losange a 2 axes de symétrie (ses diagonales)." },

    { question: "Développer : (x + 3)(x - 2) = ?", choices: ["x² + x - 6", "x² - x - 6", "x² + x + 6", "x² - 5x - 6", "x² + 5x + 6"], answer: 0, difficulty: 2, explanation: "(x+3)(x-2) = x² -2x +3x -6 = x² + x - 6" },
    { question: "La fonction f(x) = 3x - 5. Combien vaut f(4) ?", choices: ["2", "5", "7", "8", "12"], answer: 2, difficulty: 2, explanation: "f(4) = 3×4 - 5 = 7" },
    { question: "Un triangle a des angles de 40° et 75°. Que vaut le troisième ?", choices: ["55°", "60°", "65°", "70°", "75°"], answer: 2, difficulty: 2, explanation: "180 - 40 - 75 = 65°" },
    { question: "Quel est le PPCM de 12 et 18 ?", choices: ["6", "24", "36", "72", "216"], answer: 2, difficulty: 2, explanation: "12 = 2²×3, 18 = 2×3². PPCM = 2²×3² = 36" },
    { question: "Si un cercle a un rayon de 7 cm, son aire vaut environ :", choices: ["22 cm²", "44 cm²", "154 cm²", "308 cm²", "49 cm²"], answer: 2, difficulty: 2, explanation: "π × 7² ≈ 3,14 × 49 ≈ 154 cm²" },
    { question: "Résoudre : 5x + 3 = 2x + 18", choices: ["x = 3", "x = 5", "x = 7", "x = 15", "x = 21"], answer: 1, difficulty: 2, explanation: "3x = 15, x = 5" },
    { question: "La moyenne de 12, 15, 18, 9 et 6 est :", choices: ["10", "11", "12", "13", "14"], answer: 2, difficulty: 2, explanation: "(12+15+18+9+6)/5 = 60/5 = 12" },
    { question: "Deux droites parallèles coupées par une sécante forment des angles alternes-internes qui sont :", choices: ["Supplémentaires", "Complémentaires", "Égaux", "Adjacents", "Nuls"], answer: 2, difficulty: 2, explanation: "Angles alternes-internes = égaux." },

    { question: "Factoriser : x² - 9 = ?", choices: ["(x-3)²", "(x+3)²", "(x-3)(x+3)", "(x-9)(x+1)", "x(x-9)"], answer: 2, difficulty: 3, explanation: "Identité remarquable : a²-b² = (a-b)(a+b). x²-9 = (x-3)(x+3)" },
    { question: "Un rectangle a un périmètre de 40 cm et une aire de 96 cm². Quelles sont ses dimensions ?", choices: ["6 et 16", "8 et 12", "4 et 24", "10 et 10", "7 et 13"], answer: 1, difficulty: 3, explanation: "l+L=20, l×L=96 → 8 et 12." },
    { question: "Combien de nombres entiers positifs sont diviseurs de 72 ?", choices: ["8", "10", "12", "14", "16"], answer: 2, difficulty: 3, explanation: "72 = 2³×3². Nombre de diviseurs = (3+1)(2+1) = 12" },
    { question: "Soit la suite : 2, 6, 18, 54, … Quel est le 6e terme ?", choices: ["108", "162", "324", "486", "972"], answer: 3, difficulty: 3, explanation: "Suite géométrique de raison 3. u₆ = 2 × 3⁵ = 486" },
    { question: "Dans un repère, à quelle distance se trouvent les points A(1,2) et B(4,6) ?", choices: ["3", "4", "5", "7", "√13"], answer: 2, difficulty: 3, explanation: "d = √((4-1)²+(6-2)²) = √(9+16) = √25 = 5" },
    { question: "Combien y a-t-il d'anagrammes du mot « MATH » ?", choices: ["6", "12", "16", "24", "120"], answer: 3, difficulty: 3, explanation: "4! = 24 anagrammes (lettres distinctes)." },
    { question: "Le prix d'un objet augmente de 20% puis baisse de 20%. Par rapport au prix initial :", choices: ["C'est le même prix", "Il a augmenté de 4%", "Il a diminué de 4%", "Il a augmenté de 2%", "Il a diminué de 2%"], answer: 2, difficulty: 3, explanation: "1,20 × 0,80 = 0,96 → diminution de 4%." },
    { question: "Combien vaut la somme 1 + 2 + 3 + … + 100 ?", choices: ["4950", "5000", "5050", "5100", "10000"], answer: 2, difficulty: 3, explanation: "n(n+1)/2 = 100×101/2 = 5050" },
  ],

  // ═══════════════════════════════════════
  // 3ÈME
  // ═══════════════════════════════════════
  "3eme": [
    { question: "Simplifier : √50 = ?", choices: ["5√2", "2√5", "√25 + √25", "10√5", "25√2"], answer: 0, difficulty: 1, explanation: "√50 = √(25×2) = 5√2" },
    { question: "Résoudre : x² = 49. Les solutions sont :", choices: ["x = 7", "x = -7", "x = 7 ou x = -7", "x = √7", "Aucune solution"], answer: 2, difficulty: 1, explanation: "x = ±7" },
    { question: "Que vaut 3⁰ ?", choices: ["0", "1", "3", "9", "Indéfini"], answer: 1, difficulty: 1, explanation: "Tout nombre non nul à la puissance 0 vaut 1." },
    { question: "Quelle est l'écriture scientifique de 0,00042 ?", choices: ["42 × 10⁻⁵", "4,2 × 10⁻⁴", "0,42 × 10⁻³", "4,2 × 10⁻³", "42 × 10⁻⁴"], answer: 1, difficulty: 1, explanation: "0,00042 = 4,2 × 10⁻⁴" },
    { question: "Si f(x) = x² - 4x + 3, combien vaut f(1) ?", choices: ["-2", "0", "1", "2", "4"], answer: 1, difficulty: 1, explanation: "f(1) = 1 - 4 + 3 = 0" },
    { question: "Un cylindre de rayon 3 et de hauteur 10 a pour volume :", choices: ["30π", "60π", "90π", "270π", "900π"], answer: 2, difficulty: 1, explanation: "V = π×r²×h = π×9×10 = 90π" },
    { question: "Le cosinus de 60° vaut :", choices: ["0", "1/2", "√2/2", "√3/2", "1"], answer: 1, difficulty: 1, explanation: "cos(60°) = 1/2" },
    { question: "Combien vaut |−15| ?", choices: ["-15", "0", "1/15", "15", "-1/15"], answer: 3, difficulty: 1, explanation: "|−15| = 15" },

    { question: "Résoudre le système : x + y = 10 et x - y = 4", choices: ["x=6, y=4", "x=7, y=3", "x=8, y=2", "x=5, y=5", "x=4, y=6"], answer: 1, difficulty: 2, explanation: "2x = 14 → x = 7, y = 3" },
    { question: "Développer : (2x - 3)² = ?", choices: ["4x² - 9", "4x² + 9", "4x² - 12x + 9", "4x² - 6x + 9", "2x² - 12x + 9"], answer: 2, difficulty: 2, explanation: "(2x-3)² = 4x² - 12x + 9" },
    { question: "La probabilité de tirer un roi dans un jeu de 32 cartes est :", choices: ["1/13", "1/8", "4/32", "2/16", "1/8 et 4/32 et 2/16"], answer: 4, difficulty: 2, explanation: "4 rois sur 32 = 4/32 = 2/16 = 1/8. Tous sont corrects." },
    { question: "Le théorème de Thalès s'applique dans un triangle coupé par une droite parallèle à un côté. Si DE // BC, AD=3, DB=2, AE=4,5 alors EC = ?", choices: ["2", "2,5", "3", "3,5", "4"], answer: 2, difficulty: 2, explanation: "AD/AB = AE/AC → 3/5 = 4,5/AC → AC = 7,5, EC = 3." },
    { question: "Factoriser : 2x² - 8 = ?", choices: ["2(x²-4)", "2(x-2)(x+2)", "(2x-4)(x+2)", "2(x-4)(x+4)", "(x-2)(2x+4)"], answer: 1, difficulty: 2, explanation: "2x²-8 = 2(x²-4) = 2(x-2)(x+2)" },
    { question: "La fonction f(x) = -x² + 4 est-elle croissante ou décroissante sur [0, +∞[ ?", choices: ["Croissante", "Décroissante", "Constante", "Ni l'un ni l'autre", "On ne peut pas savoir"], answer: 1, difficulty: 2, explanation: "f'(x) = -2x ≤ 0 pour x ≥ 0, donc décroissante." },
    { question: "Quel est le volume d'une sphère de rayon 3 ?", choices: ["12π", "27π", "36π", "108π", "36"], answer: 2, difficulty: 2, explanation: "V = (4/3)πr³ = (4/3)π×27 = 36π" },
    { question: "Si sin(α) = 0,6 et α est aigu, que vaut cos(α) ?", choices: ["0,4", "0,6", "0,8", "1", "0,36"], answer: 2, difficulty: 2, explanation: "cos²+sin²=1 → cos²=0,64 → cos=0,8" },

    { question: "Les solutions de x² - 5x + 6 = 0 sont :", choices: ["1 et 6", "2 et 3", "-2 et -3", "1 et 5", "−1 et 6"], answer: 1, difficulty: 3, explanation: "Δ = 25-24 = 1. x = (5±1)/2 → 2 et 3." },
    { question: "Dans un cercle de rayon 5, un triangle inscrit a un angle au sommet face au diamètre. Cet angle vaut :", choices: ["30°", "45°", "60°", "90°", "120°"], answer: 3, difficulty: 3, explanation: "Théorème de Thalès : angle inscrit dans un demi-cercle = 90°." },
    { question: "On tire 2 cartes d'un jeu de 52. Combien de mains possibles ?", choices: ["104", "1 326", "2 652", "2 704", "52²"], answer: 1, difficulty: 3, explanation: "C(52,2) = 52×51/2 = 1 326" },
    { question: "Si log₁₀(x) = 3, alors x = ?", choices: ["3", "30", "100", "1000", "10³ "], answer: 3, difficulty: 3, explanation: "log₁₀(x) = 3 → x = 10³ = 1000" },
    { question: "La somme des angles intérieurs d'un polygone à 7 côtés est :", choices: ["720°", "900°", "1080°", "1260°", "1440°"], answer: 1, difficulty: 3, explanation: "(7-2)×180 = 900°" },
    { question: "Quelle est la dérivée de f(x) = x³ - 3x + 1 ?", choices: ["3x² - 3", "3x² + 1", "x² - 3", "3x³ - 3x", "3x² - 3x"], answer: 0, difficulty: 3, explanation: "f'(x) = 3x² - 3" },
    { question: "Combien y a-t-il de nombres premiers entre 1 et 50 ?", choices: ["12", "13", "14", "15", "16"], answer: 3, difficulty: 3, explanation: "2,3,5,7,11,13,17,19,23,29,31,37,41,43,47 → 15 nombres." },
    { question: "Si la suite (uₙ) est définie par u₀=2 et uₙ₊₁ = 2uₙ - 1, que vaut u₃ ?", choices: ["5", "7", "9", "11", "15"], answer: 2, difficulty: 3, explanation: "u₁=3, u₂=5, u₃=9" },
  ],

  // ═══════════════════════════════════════
  // 2NDE
  // ═══════════════════════════════════════
  "2nde": [
    { question: "Résoudre : |x - 3| = 5", choices: ["x = 2", "x = 8", "x = -2 ou x = 8", "x = 2 ou x = -8", "x = -2 ou x = -8"], answer: 2, difficulty: 1, explanation: "x-3=5 → x=8, x-3=-5 → x=-2" },
    { question: "Quel est l'ensemble de définition de f(x) = 1/(x-2) ?", choices: ["ℝ", "ℝ \\ {0}", "ℝ \\ {2}", "ℝ \\ {-2}", "[2, +∞["], answer: 2, difficulty: 1, explanation: "Interdit : x = 2 (division par 0)." },
    { question: "Si f(x) = 2x + 1, que vaut f(f(2)) ?", choices: ["9", "10", "11", "12", "13"], answer: 2, difficulty: 1, explanation: "f(2) = 5, f(5) = 11" },
    { question: "Simplifier : (x³)² = ?", choices: ["x⁵", "x⁶", "x⁹", "2x³", "x⁸"], answer: 1, difficulty: 1, explanation: "(x³)² = x⁶" },
    { question: "Quel est le coefficient directeur de la droite y = -3x + 7 ?", choices: ["-3", "3", "7", "-7", "1/3"], answer: 0, difficulty: 1, explanation: "y = mx + b, m = -3" },
    { question: "Combien vaut √(2) × √(8) ?", choices: ["2", "4", "8", "√10", "√16"], answer: 1, difficulty: 1, explanation: "√2 × √8 = √16 = 4" },
    { question: "La fonction f(x) = x² est-elle paire, impaire ou ni l'un ni l'autre ?", choices: ["Paire", "Impaire", "Ni l'un ni l'autre", "Les deux", "Ça dépend"], answer: 0, difficulty: 1, explanation: "f(-x) = (-x)² = x² = f(x) → paire." },
    { question: "Le discriminant de x² + 4x + 4 = 0 vaut :", choices: ["-4", "0", "4", "8", "16"], answer: 1, difficulty: 1, explanation: "Δ = 16 - 16 = 0" },

    { question: "L'ensemble des solutions de x² - x - 6 ≤ 0 est :", choices: ["[-2, 3]", "]-∞, -2] ∪ [3, +∞[", "[-3, 2]", "]-∞, -3] ∪ [2, +∞[", "{-2, 3}"], answer: 0, difficulty: 2, explanation: "x²-x-6 = (x-3)(x+2), négatif sur [-2, 3]." },
    { question: "Soit f(x) = (x²-1)/(x-1) pour x ≠ 1. Simplifier f(x) :", choices: ["x - 1", "x + 1", "x", "x² + 1", "1/(x+1)"], answer: 1, difficulty: 2, explanation: "x²-1 = (x-1)(x+1), on simplifie par (x-1)." },
    { question: "La droite passant par A(1,3) et B(4,9) a pour équation :", choices: ["y = 2x + 1", "y = 3x", "y = 2x - 1", "y = x + 2", "y = 3x - 3"], answer: 0, difficulty: 2, explanation: "m = (9-3)/(4-1) = 2. y = 2x + b, 3 = 2+b, b = 1." },
    { question: "Si f(x) = √(x+3), l'ensemble de définition est :", choices: ["ℝ", "[0, +∞[", "[-3, +∞[", "]-3, +∞[", "]0, +∞["], answer: 2, difficulty: 2, explanation: "x + 3 ≥ 0 → x ≥ -3" },
    { question: "Combien de solutions a le système : 2x + y = 5 et 4x + 2y = 10 ?", choices: ["0", "1", "2", "Infinité", "Impossible à déterminer"], answer: 3, difficulty: 2, explanation: "Les deux équations sont proportionnelles → infinité de solutions." },
    { question: "La variance de {2, 4, 6, 8, 10} est :", choices: ["4", "6", "8", "10", "12"], answer: 2, difficulty: 2, explanation: "Moyenne = 6. Var = ((16+4+0+4+16)/5) = 8" },
    { question: "Si cos(θ) = -1/2 et θ ∈ [0, π], alors θ = ?", choices: ["π/6", "π/3", "π/2", "2π/3", "5π/6"], answer: 3, difficulty: 2, explanation: "cos(2π/3) = -1/2" },
    { question: "Factoriser : x³ - 8 = ?", choices: ["(x-2)(x²+2x+4)", "(x-2)³", "(x-2)(x+2)²", "(x-8)(x²+1)", "(x-2)(x²-2x+4)"], answer: 0, difficulty: 2, explanation: "a³-b³ = (a-b)(a²+ab+b²)" },

    { question: "La dérivée de f(x) = x·eˣ est :", choices: ["eˣ", "xeˣ", "(1+x)eˣ", "(x-1)eˣ", "x²eˣ"], answer: 2, difficulty: 3, explanation: "f'(x) = eˣ + xeˣ = (1+x)eˣ" },
    { question: "Combien de façons de choisir 3 élèves parmi 10 ?", choices: ["30", "60", "90", "120", "720"], answer: 3, difficulty: 3, explanation: "C(10,3) = 10!/(3!×7!) = 120" },
    { question: "L'intégrale de 0 à 1 de x² dx vaut :", choices: ["1/4", "1/3", "1/2", "1", "2/3"], answer: 1, difficulty: 3, explanation: "∫x²dx = x³/3. De 0 à 1 : 1/3." },
    { question: "Si ln(a) + ln(b) = ln(6) et ln(a) - ln(b) = ln(2/3), que vaut a ?", choices: ["1", "2", "3", "4", "6"], answer: 1, difficulty: 3, explanation: "ln(ab)=ln(6), ln(a/b)=ln(2/3). ab=6, a/b=2/3 → a²=4, a=2." },
    { question: "La limite de (sin x)/x quand x → 0 est :", choices: ["0", "1", "∞", "π", "Indéterminée"], answer: 1, difficulty: 3, explanation: "Limite classique : lim(sin x/x) = 1 quand x→0." },
    { question: "Combien vaut Σ(k=1 à n) k² pour n=5 ?", choices: ["15", "25", "30", "55", "91"], answer: 3, difficulty: 3, explanation: "1+4+9+16+25 = 55" },
    { question: "L'équation x⁴ - 5x² + 4 = 0 a combien de solutions réelles ?", choices: ["0", "2", "3", "4", "Infinité"], answer: 3, difficulty: 3, explanation: "Poser X=x² : X²-5X+4=0 → X=1 ou X=4 → x=±1 ou x=±2 → 4 solutions." },
    { question: "Si z = 3 + 4i, que vaut |z| ?", choices: ["3", "4", "5", "7", "√7"], answer: 2, difficulty: 3, explanation: "|z| = √(9+16) = √25 = 5" },
  ],

  // ═══════════════════════════════════════
  // 1ÈRE
  // ═══════════════════════════════════════
  "1ere": [
    { question: "La dérivée de f(x) = 3x⁴ est :", choices: ["3x³", "4x³", "12x³", "12x⁴", "x³"], answer: 2, difficulty: 1, explanation: "f'(x) = 3×4x³ = 12x³" },
    { question: "Que vaut e⁰ ?", choices: ["0", "1", "e", "2,718", "∞"], answer: 1, difficulty: 1, explanation: "e⁰ = 1" },
    { question: "ln(e³) = ?", choices: ["1/3", "1", "3", "e³", "3e"], answer: 2, difficulty: 1, explanation: "ln(eⁿ) = n" },
    { question: "cos(π) = ?", choices: ["-1", "0", "1", "π", "-π"], answer: 0, difficulty: 1, explanation: "cos(π) = -1" },
    { question: "Combien vaut C(5,2) ?", choices: ["5", "10", "15", "20", "25"], answer: 1, difficulty: 1, explanation: "C(5,2) = 5!/(2!3!) = 10" },
    { question: "Si P(A) = 0,3 et P(B) = 0,5 avec A et B indépendants, P(A∩B) = ?", choices: ["0,15", "0,2", "0,35", "0,5", "0,8"], answer: 0, difficulty: 1, explanation: "Indépendants : P(A∩B) = P(A)×P(B) = 0,15" },
    { question: "La suite uₙ = 3n + 1 est :", choices: ["Arithmétique", "Géométrique", "Ni l'un ni l'autre", "Constante", "Alternée"], answer: 0, difficulty: 1, explanation: "uₙ₊₁ - uₙ = 3 (raison constante)." },
    { question: "Le vecteur AB⃗ avec A(1,2) et B(4,6) a pour coordonnées :", choices: ["(5,8)", "(3,4)", "(4,6)", "(1,2)", "(2,3)"], answer: 1, difficulty: 1, explanation: "AB⃗ = (4-1, 6-2) = (3, 4)" },

    { question: "La tangente à f(x) = x² au point x = 3 a pour équation :", choices: ["y = 6x - 9", "y = 6x + 9", "y = 3x - 9", "y = 3x + 9", "y = 6x - 3"], answer: 0, difficulty: 2, explanation: "f'(3) = 6, f(3) = 9. y = 6(x-3) + 9 = 6x - 9." },
    { question: "Résoudre : eˣ = 5", choices: ["x = 5/e", "x = ln 5", "x = log₁₀ 5", "x = 5", "x = e⁵"], answer: 1, difficulty: 2, explanation: "eˣ = 5 → x = ln 5" },
    { question: "Si uₙ est géométrique avec u₀ = 2 et q = 3, que vaut u₄ ?", choices: ["24", "54", "81", "162", "486"], answer: 3, difficulty: 2, explanation: "u₄ = 2 × 3⁴ = 2 × 81 = 162" },
    { question: "L'équation de la droite perpendiculaire à y = 2x + 1 passant par (0,0) est :", choices: ["y = -2x", "y = -x/2", "y = x/2", "y = -1/(2x)", "y = 2x"], answer: 1, difficulty: 2, explanation: "Pente perpendiculaire = -1/2. y = -x/2." },
    { question: "Soit X une variable aléatoire suivant la loi binomiale B(10, 0.5). E(X) = ?", choices: ["2", "3", "5", "10", "25"], answer: 2, difficulty: 2, explanation: "E(X) = np = 10 × 0,5 = 5" },
    { question: "∫₀¹ eˣ dx = ?", choices: ["1", "e", "e - 1", "e + 1", "1/e"], answer: 2, difficulty: 2, explanation: "[eˣ]₀¹ = e¹ - e⁰ = e - 1" },
    { question: "Le produit scalaire de u⃗(1,2) et v⃗(3,-1) est :", choices: ["-1", "0", "1", "5", "7"], answer: 2, difficulty: 2, explanation: "u⃗·v⃗ = 1×3 + 2×(-1) = 1" },
    { question: "La limite de (1 + 1/n)ⁿ quand n → ∞ est :", choices: ["0", "1", "2", "e", "∞"], answer: 3, difficulty: 2, explanation: "C'est la définition de e." },

    { question: "Résoudre : ln(x²-1) = 0", choices: ["x = √2", "x = ±√2", "x = 0", "x = 1", "x = 2"], answer: 1, difficulty: 3, explanation: "x²-1 = 1 → x² = 2 → x = ±√2" },
    { question: "La dérivée de f(x) = ln(x²+1) est :", choices: ["1/(x²+1)", "2x/(x²+1)", "x/(x²+1)", "2/(x²+1)", "2x·ln(x²+1)"], answer: 1, difficulty: 3, explanation: "f'(x) = 2x/(x²+1)" },
    { question: "Soit Sₙ = Σ(k=0 à n) 2ᵏ. Exprimer Sₙ :", choices: ["2ⁿ", "2ⁿ - 1", "2ⁿ⁺¹ - 1", "2ⁿ + 1", "n × 2ⁿ"], answer: 2, difficulty: 3, explanation: "Somme géométrique : (2ⁿ⁺¹ - 1)/(2-1) = 2ⁿ⁺¹ - 1" },
    { question: "La courbe de f(x) = 1/x a pour centre de symétrie :", choices: ["(0,0)", "(1,1)", "(0,1)", "(1,0)", "Aucun"], answer: 0, difficulty: 3, explanation: "f est une fonction impaire : centre de symétrie = origine." },
    { question: "∫ 1/x dx = ?", choices: ["x²/2", "ln|x| + C", "-1/x² + C", "eˣ + C", "1 + C"], answer: 1, difficulty: 3, explanation: "Primitive de 1/x = ln|x| + C" },
    { question: "Si z = 2e^(iπ/3), la partie réelle de z est :", choices: ["1", "√3", "2", "1/2", "2√3"], answer: 0, difficulty: 3, explanation: "Re(z) = 2cos(π/3) = 2×1/2 = 1" },
    { question: "La probabilité qu'une loi normale centrée réduite dépasse 0 est :", choices: ["0", "0,25", "0,5", "0,68", "1"], answer: 2, difficulty: 3, explanation: "Par symétrie, P(Z > 0) = 0,5." },
    { question: "Soit f(x) = xe⁻ˣ. f admet un maximum en :", choices: ["x = -1", "x = 0", "x = 1", "x = e", "x = 1/e"], answer: 2, difficulty: 3, explanation: "f'(x) = e⁻ˣ(1-x). f'(x)=0 → x=1. f''(1)<0 → max." },
  ],

  // ═══════════════════════════════════════
  // TERMINALE
  // ═══════════════════════════════════════
  "terminale": [
    { question: "lim(x→+∞) eˣ/x² = ?", choices: ["0", "1", "+∞", "e", "Indéterminée"], answer: 2, difficulty: 1, explanation: "Croissance comparée : eˣ >> x² → +∞" },
    { question: "La primitive de cos(x) est :", choices: ["-sin(x) + C", "sin(x) + C", "cos(x) + C", "-cos(x) + C", "tan(x) + C"], answer: 1, difficulty: 1, explanation: "∫cos(x)dx = sin(x) + C" },
    { question: "Si f'(x) > 0 sur ]a,b[, alors f est :", choices: ["Décroissante", "Croissante", "Constante", "Concave", "Convexe"], answer: 1, difficulty: 1, explanation: "f' > 0 → f croissante." },
    { question: "ln(ab) = ?", choices: ["ln(a) × ln(b)", "ln(a) + ln(b)", "ln(a) - ln(b)", "a × ln(b)", "ln(a)/ln(b)"], answer: 1, difficulty: 1, explanation: "Propriété fondamentale du logarithme." },
    { question: "Le module de z = -3 + 4i est :", choices: ["1", "5", "7", "√7", "25"], answer: 1, difficulty: 1, explanation: "|z| = √(9+16) = 5" },
    { question: "e^(ln 7) = ?", choices: ["1", "e⁷", "7", "7e", "ln 7"], answer: 2, difficulty: 1, explanation: "e^(ln x) = x" },
    { question: "∫₀^π sin(x) dx = ?", choices: ["0", "1", "2", "-1", "π"], answer: 2, difficulty: 1, explanation: "[-cos(x)]₀^π = -cos(π)+cos(0) = 1+1 = 2" },
    { question: "Si uₙ = n/(n+1), lim(n→∞) uₙ = ?", choices: ["0", "1/2", "1", "+∞", "Pas de limite"], answer: 2, difficulty: 1, explanation: "n/(n+1) → 1" },

    { question: "La dérivée de f(x) = eˢⁱⁿ⁽ˣ⁾ est :", choices: ["cos(x)·eˢⁱⁿ⁽ˣ⁾", "sin(x)·eˢⁱⁿ⁽ˣ⁾", "eᶜᵒˢ⁽ˣ⁾", "eˢⁱⁿ⁽ˣ⁾/cos(x)", "-cos(x)·eˢⁱⁿ⁽ˣ⁾"], answer: 0, difficulty: 2, explanation: "Dérivée de e^(u) = u'·e^(u). u=sin(x), u'=cos(x)." },
    { question: "∫ xe^x dx = ? (par parties)", choices: ["(x+1)e^x + C", "xe^x + e^x + C", "x²e^x/2 + C", "e^x(x²-1) + C", "(x-1)e^x + C"], answer: 4, difficulty: 2, explanation: "∫xe^x = xe^x - ∫e^x = xe^x - e^x = (x-1)e^x + C" },
    { question: "L'argument de z = -1 + i est :", choices: ["π/4", "3π/4", "-π/4", "5π/4", "π/2"], answer: 1, difficulty: 2, explanation: "z est dans le 2e quadrant. arg = π - π/4 = 3π/4." },
    { question: "La suite uₙ = (-1)ⁿ/n est :", choices: ["Convergente vers 0", "Convergente vers 1", "Divergente", "Oscillante sans limite", "Constante"], answer: 0, difficulty: 2, explanation: "|uₙ| = 1/n → 0, donc uₙ → 0." },
    { question: "Si X ~ N(100, 15²), P(X < 100) = ?", choices: ["0", "0,25", "0,5", "0,68", "1"], answer: 2, difficulty: 2, explanation: "X < μ → P = 0,5 par symétrie." },
    { question: "L'équation différentielle y' = 2y a pour solution :", choices: ["y = Ce²ˣ", "y = 2eˣ", "y = Ce²", "y = Ce^(x²)", "y = 2Ceˣ"], answer: 0, difficulty: 2, explanation: "y'/y = 2 → ln|y| = 2x + k → y = Ce²ˣ" },
    { question: "lim(x→0) (eˣ - 1)/x = ?", choices: ["0", "1", "e", "∞", "ln 2"], answer: 1, difficulty: 2, explanation: "DL : eˣ ≈ 1 + x, donc (eˣ-1)/x → 1." },
    { question: "Le nombre de surjections de {1,2,3,4} vers {a,b,c} est :", choices: ["12", "24", "36", "48", "81"], answer: 2, difficulty: 2, explanation: "Par inclusion-exclusion : 3⁴ - C(3,1)×2⁴ + C(3,2)×1⁴ = 81-48+3 = 36" },

    { question: "∫₁^e (ln x)² / x dx = ?", choices: ["1/2", "1/3", "1", "e-1", "2/3"], answer: 1, difficulty: 3, explanation: "u = ln x, du = dx/x. ∫₀¹ u² du = 1/3." },
    { question: "Si f(x) = x·ln(x) - x, alors f'(x) = ?", choices: ["ln(x)", "ln(x) + 1", "ln(x) - 1", "1/x", "x/ln(x)"], answer: 0, difficulty: 3, explanation: "f'(x) = ln(x) + x·(1/x) - 1 = ln(x)" },
    { question: "Les racines de z³ = 8 dans ℂ sont :", choices: ["2, -2, 2i", "2, 2e^(2iπ/3), 2e^(4iπ/3)", "2, -1+i√3, -1-i√3", "2 seulement", "B et C"], answer: 4, difficulty: 3, explanation: "z = 2·e^(2ikπ/3), k=0,1,2. Ce sont B et C (mêmes nombres)." },
    { question: "La série Σ 1/n² converge vers :", choices: ["1", "π²/6", "e", "ln 2", "π/4"], answer: 1, difficulty: 3, explanation: "Résultat d'Euler : ζ(2) = π²/6" },
    { question: "Si f(x) = arctan(x), alors f'(x) = ?", choices: ["1/(1+x²)", "1/(1-x²)", "1/√(1-x²)", "1/√(1+x²)", "-1/(1+x²)"], answer: 0, difficulty: 3, explanation: "Dérivée classique de arctan." },
    { question: "L'intégrale ∫₀^(+∞) e⁻ˣ dx vaut :", choices: ["0", "1", "e", "+∞", "-1"], answer: 1, difficulty: 3, explanation: "[-e⁻ˣ]₀^∞ = 0 - (-1) = 1. Intégrale convergente." },
    { question: "dim(Ker(f)) + dim(Im(f)) = ?", choices: ["dim(E)", "dim(F)", "dim(E) + dim(F)", "dim(E) × dim(F)", "0"], answer: 0, difficulty: 3, explanation: "Théorème du rang : dim(Ker f) + rg(f) = dim(E)." },
    { question: "La transformée de Laplace de f(t) = 1 est :", choices: ["1/s", "s", "1/s²", "e⁻ˢ", "δ(s)"], answer: 0, difficulty: 3, explanation: "L{1} = ∫₀^∞ e⁻ˢᵗ dt = 1/s pour Re(s) > 0." },
  ],
};
