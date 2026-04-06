/**
 * Kangourou — Générateurs : utilitaires partagés
 *
 * Chaque générateur retourne un objet :
 *   { question, choices: [5 strings], answer (index 0-4), difficulty: 1|2|3, explanation }
 */

// ─── UTILS ──────────────────────────────────────────────
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function round2(x) {
  return Math.round(x * 100) / 100;
}

/** Build a question object from correct answer + distractors */
function buildQuestion(question, correct, distractors, difficulty, explanation) {
  correct = String(correct);
  let dists = [...new Set(distractors.map(String))].filter(d => d !== correct);
  let safety = 0;
  while (dists.length < 4 && safety++ < 50) {
    const numCorrect = parseFloat(correct);
    if (!isNaN(numCorrect)) {
      const offset = randInt(1, 10) * randChoice([-1, 1]);
      const fake = String(numCorrect + offset);
      if (fake !== correct && !dists.includes(fake)) dists.push(fake);
    } else {
      const fallback = "Réponse " + String.fromCharCode(65 + dists.length);
      if (!dists.includes(fallback)) dists.push(fallback);
    }
  }
  // Fallback: sequential offsets if random failed
  for (let i = 1; dists.length < 4; i++) {
    const numCorrect = parseFloat(correct);
    const fake = !isNaN(numCorrect) ? String(numCorrect + i) : "Option " + (dists.length + 1);
    if (fake !== correct && !dists.includes(fake)) dists.push(fake);
  }
  dists = dists.slice(0, 4);

  const answerIndex = randInt(0, 4);
  const choices = [];
  let distIdx = 0;
  for (let i = 0; i < 5; i++) {
    if (i === answerIndex) {
      choices.push(correct);
    } else {
      choices.push(dists[distIdx++]);
    }
  }

  return { question, choices, answer: answerIndex, difficulty, explanation };
}

/** Make nearby-value distractors for a numeric answer */
function numericDistractors(correct, count = 6) {
  const results = new Set();
  for (const d of [-2, -1, 1, 2, 3, -3, 5, -5, 10, -10]) {
    const v = correct + d;
    if (v !== correct && v > 0) results.add(v);
  }
  results.add(correct * 2);
  results.add(Math.abs(correct - 1));
  return [...results].map(String).slice(0, count);
}

function fractionStr(num, den) {
  if (den === 1) return String(num);
  return `${num}/${den}`;
}

// ─── SVG HELPERS ────────────────────────────────────────
/**
 * Draw a triangle with optional angle labels.
 * The triangle shape is computed from actual angles using the sine rule.
 * @param {object} opts - { labels: ['A','B','C'], angles: [60, 80, 40], showAngles: [true, true, false], highlight: 2 }
 */
function svgTriangle(opts = {}) {
  const { labels = ['A','B','C'], angles = [60, 80, 40], showAngles = [true, true, false], highlight = -1 } = opts;
  const toRad = d => d * Math.PI / 180;
  const W = 300, H = 200, M = 35;

  // Compute actual triangle shape from angles (sine rule)
  // A at origin, B on x-axis, C from angle at A
  const aRad = toRad(angles[0]), bRad = toRad(angles[1]), cRad = toRad(angles[2]);
  const ac = Math.sin(bRad) / Math.sin(cRad); // AB = 1
  const raw = [[0, 0], [1, 0], [ac * Math.cos(aRad), ac * Math.sin(aRad)]];

  // Scale and center into SVG viewBox
  const xs = raw.map(p => p[0]), ys = raw.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const rX = maxX - minX || 1, rY = maxY - minY || 1;
  const scale = Math.min((W - 2 * M) / rX, (H - 2 * M) / rY);
  const oX = M + ((W - 2 * M) - rX * scale) / 2;
  const oY = M + ((H - 2 * M) - rY * scale) / 2;
  const pts = raw.map(([x, y]) => [
    oX + (x - minX) * scale,
    oY + (maxY - y) * scale   // flip y for SVG
  ]);

  // Centroid for offset directions
  const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3;
  const cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;

  let svg = `<svg viewBox="0 0 ${W} ${H}" width="260" height="180" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<polygon points="${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}" fill="none" stroke="currentColor" stroke-width="2"/>`;

  // Angle arcs
  for (let i = 0; i < 3; i++) {
    if (!showAngles[i] && i !== highlight) continue;
    const prev = pts[(i + 2) % 3], curr = pts[i], next = pts[(i + 1) % 3];
    const d1x = prev[0] - curr[0], d1y = prev[1] - curr[1];
    const d2x = next[0] - curr[0], d2y = next[1] - curr[1];
    const len1 = Math.sqrt(d1x * d1x + d1y * d1y);
    const len2 = Math.sqrt(d2x * d2x + d2y * d2y);
    const r = Math.min(22, len1 * 0.25, len2 * 0.25);
    const a1 = Math.atan2(d1y, d1x), a2 = Math.atan2(d2y, d2x);
    const p1x = curr[0] + r * Math.cos(a1), p1y = curr[1] + r * Math.sin(a1);
    const p2x = curr[0] + r * Math.cos(a2), p2y = curr[1] + r * Math.sin(a2);
    let sweep = a2 - a1;
    if (sweep > Math.PI) sweep -= 2 * Math.PI;
    if (sweep < -Math.PI) sweep += 2 * Math.PI;
    const sweepFlag = sweep > 0 ? 1 : 0;
    const color = i === highlight ? '#ff6b6b' : 'currentColor';
    svg += `<path d="M${p1x.toFixed(1)},${p1y.toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 ${sweepFlag} ${p2x.toFixed(1)},${p2y.toFixed(1)}" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.6"/>`;
  }

  // Vertex labels (offset away from centroid)
  for (let i = 0; i < 3; i++) {
    const dx = pts[i][0] - cx, dy = pts[i][1] - cy;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const lx = pts[i][0] + dx / len * 18;
    const ly = pts[i][1] + dy / len * 18;
    svg += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" fill="currentColor" font-size="14" font-weight="bold" text-anchor="middle" dominant-baseline="central">${labels[i]}</text>`;
  }

  // Angle values (offset towards centroid, inside triangle)
  for (let i = 0; i < 3; i++) {
    const dx = cx - pts[i][0], dy = cy - pts[i][1];
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ax = pts[i][0] + dx / len * 30;
    const ay = pts[i][1] + dy / len * 30;
    if (showAngles[i] && angles[i] != null) {
      const color = i === highlight ? '#ff6b6b' : '#6c63ff';
      svg += `<text x="${ax.toFixed(1)}" y="${ay.toFixed(1)}" fill="${color}" font-size="13" text-anchor="middle" dominant-baseline="central">${angles[i]}°</text>`;
    } else if (i === highlight) {
      svg += `<text x="${ax.toFixed(1)}" y="${ay.toFixed(1)}" fill="#ff6b6b" font-size="15" text-anchor="middle" dominant-baseline="central" font-weight="bold">?</text>`;
    }
  }
  svg += `</svg>`;
  return svg;
}

/**
 * Draw a circle with radius label.
 * @param {number} r - displayed radius value
 * @param {string} label - e.g. "r = 5 cm"
 */
function svgCircle(r, label) {
  let svg = `<svg viewBox="0 0 200 200" width="180" height="180" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<circle cx="100" cy="100" r="75" fill="rgba(108,99,255,0.1)" stroke="currentColor" stroke-width="2"/>`;
  svg += `<circle cx="100" cy="100" r="3" fill="currentColor"/>`;
  svg += `<line x1="100" y1="100" x2="175" y2="100" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4,3"/>`;
  svg += `<text x="138" y="93" fill="#6c63ff" font-size="13" text-anchor="middle" font-weight="bold">${label}</text>`;
  svg += `</svg>`;
  return svg;
}

/**
 * Draw a named shape for symmetry questions.
 * Returns { svg, axes } where axes is the number of axes of symmetry.
 */
function svgShape(type) {
  const shapes = {
    equilateral: {
      name: 'triangle équilatéral', axes: 3,
      svg: `<polygon points="100,20 185,170 15,170" fill="rgba(108,99,255,0.1)" stroke="currentColor" stroke-width="2"/>`
    },
    square: {
      name: 'carré', axes: 4,
      svg: `<rect x="40" y="40" width="120" height="120" fill="rgba(108,99,255,0.1)" stroke="currentColor" stroke-width="2"/>`
    },
    rectangle: {
      name: 'rectangle', axes: 2,
      svg: `<rect x="25" y="55" width="150" height="90" fill="rgba(108,99,255,0.1)" stroke="currentColor" stroke-width="2"/>`
    },
    isosceles: {
      name: 'triangle isocèle', axes: 1,
      svg: `<polygon points="100,20 170,170 30,170" fill="rgba(108,99,255,0.1)" stroke="currentColor" stroke-width="2"/>`
    },
    regular_hexagon: {
      name: 'hexagone régulier', axes: 6,
      svg: (() => {
        const pts = [];
        for (let i = 0; i < 6; i++) {
          const a = Math.PI / 3 * i - Math.PI / 2;
          pts.push(`${100 + 75 * Math.cos(a)},${100 + 75 * Math.sin(a)}`);
        }
        return `<polygon points="${pts.join(' ')}" fill="rgba(108,99,255,0.1)" stroke="currentColor" stroke-width="2"/>`;
      })()
    },
    regular_pentagon: {
      name: 'pentagone régulier', axes: 5,
      svg: (() => {
        const pts = [];
        for (let i = 0; i < 5; i++) {
          const a = 2 * Math.PI / 5 * i - Math.PI / 2;
          pts.push(`${100 + 75 * Math.cos(a)},${100 + 75 * Math.sin(a)}`);
        }
        return `<polygon points="${pts.join(' ')}" fill="rgba(108,99,255,0.1)" stroke="currentColor" stroke-width="2"/>`;
      })()
    },
    circle: {
      name: 'cercle', axes: '∞',
      svg: `<circle cx="100" cy="100" r="75" fill="rgba(108,99,255,0.1)" stroke="currentColor" stroke-width="2"/>`
    }
  };
  const s = shapes[type];
  const full = `<svg viewBox="0 0 200 200" width="160" height="160" xmlns="http://www.w3.org/2000/svg">${s.svg}</svg>`;
  return { svg: full, axes: s.axes, name: s.name };
}

/**
 * Draw a Thales configuration: two lines from a point, cut by two parallels.
 * @param {object} opts - { a, b, c, d, missing: 'c'|'d' }
 * a/b on one secant, c/d on the other. OA=a, OA'=b, OB=c, OB'=d.
 */
function svgThales(opts) {
  const { a, b, c, d, missing } = opts;
  let svg = `<svg viewBox="0 0 300 220" width="280" height="200" xmlns="http://www.w3.org/2000/svg">`;
  // Point O at top
  svg += `<circle cx="150" cy="20" r="3" fill="currentColor"/>`;
  svg += `<text x="155" y="16" fill="currentColor" font-size="13" font-weight="bold">O</text>`;
  // Left secant: O → A → A'
  svg += `<line x1="150" y1="20" x2="50" y2="200" stroke="currentColor" stroke-width="1.5"/>`;
  // Right secant: O → B → B'
  svg += `<line x1="150" y1="20" x2="250" y2="200" stroke="currentColor" stroke-width="1.5"/>`;
  // First parallel (AB) at 40% height
  svg += `<line x1="110" y1="92" x2="190" y2="92" stroke="#6c63ff" stroke-width="2"/>`;
  // Second parallel (A'B') at 85% height
  svg += `<line x1="65" y1="173" x2="235" y2="173" stroke="#6c63ff" stroke-width="2"/>`;
  // Labels
  svg += `<text x="98" y="88" fill="currentColor" font-size="12" font-weight="bold">A</text>`;
  svg += `<text x="192" y="88" fill="currentColor" font-size="12" font-weight="bold">B</text>`;
  svg += `<text x="46" y="190" fill="currentColor" font-size="12" font-weight="bold">A'</text>`;
  svg += `<text x="238" y="190" fill="currentColor" font-size="12" font-weight="bold">B'</text>`;
  // Length labels
  const clr = '#6c63ff';
  const unk = '#ff6b6b';
  svg += `<text x="118" y="55" fill="${missing === 'a' ? unk : clr}" font-size="11" text-anchor="middle">${missing === 'a' ? '?' : a}</text>`;
  svg += `<text x="84" y="140" fill="${missing === 'b' ? unk : clr}" font-size="11" text-anchor="middle">${missing === 'b' ? '?' : b}</text>`;
  svg += `<text x="182" y="55" fill="${missing === 'c' ? unk : clr}" font-size="11" text-anchor="middle">${missing === 'c' ? '?' : c}</text>`;
  svg += `<text x="218" y="140" fill="${missing === 'd' ? unk : clr}" font-size="11" text-anchor="middle">${missing === 'd' ? '?' : d}</text>`;
  svg += `</svg>`;
  return svg;
}

const GENERATORS = {};
