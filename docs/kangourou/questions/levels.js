/**
 * Kangourou des Mathématiques — Configuration des niveaux
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

const QUESTIONS = {};
