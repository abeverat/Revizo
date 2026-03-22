// ═══════════════════════════════════════
// Quiz QCM — Ollama-powered
// ═══════════════════════════════════════

// ── State ──
let ollamaBaseURL = '';
let selectedModel = '';
let selectedSubject = 'Mathématiques CM2';
let questions = [];
let questionIndex = 0;

// ── DOM ──
const discoveryScreen = document.getElementById('discovery-screen');
const configScreen    = document.getElementById('config-screen');
const loadingScreen   = document.getElementById('loading-screen');
const questionArea    = document.getElementById('question-area');
const explanationEl   = document.getElementById('explanation');

// ═══════════════════════════════════════
// Network scanning for Ollama
// ═══════════════════════════════════════

const OLLAMA_PORT = 11434;
const SCAN_TIMEOUT_MS = 1500;
const BATCH_SIZE = 20;

function ollamaURL(host) {
    return `http://${host}:${OLLAMA_PORT}`;
}

async function probeOllama(host) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SCAN_TIMEOUT_MS);
    try {
        const resp = await fetch(`${ollamaURL(host)}/api/tags`, {
            signal: controller.signal
        });
        clearTimeout(timer);
        if (resp.ok) {
            const data = await resp.json();
            return { host, models: data.models || [] };
        }
    } catch {
        clearTimeout(timer);
    }
    return null;
}

function logScan(msg) {
    const log = document.getElementById('scan-log');
    log.textContent = msg;
}

function setProgress(pct) {
    document.getElementById('scan-progress').style.width = pct + '%';
}

function buildScanTargets() {
    const targets = [];
    targets.push('127.0.0.1');
    targets.push('localhost');

    const subnets = ['192.168.1', '192.168.0', '10.0.0', '192.168.2', '172.16.0'];
    for (const subnet of subnets) {
        for (let i = 1; i <= 254; i++) {
            targets.push(`${subnet}.${i}`);
        }
    }
    return targets;
}

async function scanNetwork() {
    const statusEl = document.getElementById('scan-status');
    const foundEl  = document.getElementById('scan-found');
    const btnConf  = document.getElementById('btn-to-config');

    // 1. Check localStorage for previously found server
    const savedURL = localStorage.getItem('cartestoto_ollama_url');
    if (savedURL) {
        statusEl.textContent = 'Vérification du serveur précédent…';
        setProgress(5);
        try {
            const host = new URL(savedURL).hostname;
            const result = await probeOllama(host);
            if (result) {
                onServerFound(result.host, result.models);
                return;
            }
        } catch { /* URL parse failed, continue scanning */ }
        logScan('Serveur précédent non disponible, scan en cours…');
    }

    // 2. Full scan
    const targets = buildScanTargets();
    const total = targets.length;
    let scanned = 0;

    statusEl.textContent = 'Scan du réseau en cours…';

    for (let i = 0; i < total; i += BATCH_SIZE) {
        const batch = targets.slice(i, i + BATCH_SIZE);
        const promises = batch.map(host => probeOllama(host));
        const results = await Promise.all(promises);

        scanned += batch.length;
        setProgress(Math.round((scanned / total) * 100));
        logScan(`Testé ${scanned} / ${total} adresses…`);

        const found = results.find(r => r !== null);
        if (found) {
            onServerFound(found.host, found.models);
            return;
        }
    }

    statusEl.textContent = '❌ Aucun serveur Ollama trouvé';
    setProgress(100);
    logScan('Scan terminé. Entrez l\'adresse IP manuellement ci-dessous.');
}

function onServerFound(host, models) {
    const url = ollamaURL(host);
    ollamaBaseURL = url;
    localStorage.setItem('cartestoto_ollama_url', url);

    document.getElementById('scan-status').textContent = '✅ Serveur trouvé !';
    setProgress(100);

    const foundEl = document.getElementById('scan-found');
    foundEl.style.display = 'block';
    document.getElementById('found-url').textContent = `${url} — ${models.length} modèle(s)`;

    document.getElementById('btn-to-config').style.display = 'inline-block';

    window._discoveredModels = models;
}

async function tryManualIP() {
    const input = document.getElementById('manual-ip').value.trim();
    if (!input) return;

    const errorEl = document.getElementById('discovery-error');
    errorEl.style.display = 'none';

    document.getElementById('scan-status').textContent = `Test de ${input}…`;
    const result = await probeOllama(input);

    if (result) {
        onServerFound(result.host, result.models);
    } else {
        errorEl.textContent = `Impossible de contacter Ollama sur ${input}:${OLLAMA_PORT}. Vérifiez que le serveur est lancé avec OLLAMA_HOST=0.0.0.0`;
        errorEl.style.display = 'block';
    }
}

// ═══════════════════════════════════════
// Config screen
// ═══════════════════════════════════════

function goToConfig() {
    discoveryScreen.style.display = 'none';
    configScreen.style.display = 'block';

    document.getElementById('server-badge').textContent = '🟢 ' + ollamaBaseURL;

    const select = document.getElementById('model-select');
    select.innerHTML = '';
    const models = window._discoveredModels || [];
    if (models.length === 0) {
        const opt = document.createElement('option');
        opt.textContent = 'Aucun modèle trouvé';
        opt.disabled = true;
        select.appendChild(opt);
    } else {
        for (const m of models) {
            const opt = document.createElement('option');
            opt.value = m.name;
            const sizeGB = m.size ? (m.size / 1e9).toFixed(1) + ' GB' : '';
            opt.textContent = m.name + (sizeGB ? ` (${sizeGB})` : '');
            select.appendChild(opt);
        }
        selectedModel = models[0].name;
        select.addEventListener('change', () => { selectedModel = select.value; });
    }
}

function selectSubject(btn, subject) {
    document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    const customInput = document.getElementById('custom-topic');
    if (subject === '__custom__') {
        customInput.style.display = 'block';
        customInput.focus();
        selectedSubject = '';
    } else {
        customInput.style.display = 'none';
        selectedSubject = subject;
    }
}

function backToDiscovery() {
    configScreen.style.display = 'none';
    discoveryScreen.style.display = 'block';
}

function backToConfig() {
    pauseScreen.style.display = 'none';
    gameScreen.style.display  = 'none';
    configScreen.style.display = 'block';
}

// ═══════════════════════════════════════
// Question generation via Ollama
// ═══════════════════════════════════════

async function generateQuestions(subject) {
    const prompt = `Tu es un enseignant pour élèves de CM2 (10-11 ans) en France.
Génère exactement 10 questions QCM (quiz à choix multiples) sur le sujet : "${subject}".

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ni après. Format :
[
  {
    "question": "La question ici ?",
    "choices": ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
    "answer": 0,
    "explanation": "Courte explication de la bonne réponse."
  }
]

Règles :
- Exactement 4 choix par question
- "answer" est l'index (0, 1, 2 ou 3) de la bonne réponse
- Questions variées et adaptées au niveau CM2
- Tout en français
- Ne répète pas les mêmes questions`;

    const resp = await fetch(`${ollamaBaseURL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: selectedModel,
            prompt: prompt,
            stream: false,
            options: { temperature: 0.8 }
        })
    });

    if (!resp.ok) {
        throw new Error(`Erreur serveur : ${resp.status} ${resp.statusText}`);
    }

    const data = await resp.json();
    const text = data.response || '';

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
        throw new Error('Le LLM n\'a pas retourné de JSON valide.');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Le JSON ne contient pas de questions.');
    }

    for (const q of parsed) {
        if (!q.question || !Array.isArray(q.choices) || q.choices.length < 2 ||
            typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.choices.length) {
            throw new Error('Format de question invalide.');
        }
    }

    return parsed;
}

// ═══════════════════════════════════════
// Quiz flow
// ═══════════════════════════════════════

async function startQuiz() {
    if (selectedSubject === '__custom__' || selectedSubject === '') {
        selectedSubject = document.getElementById('custom-topic').value.trim();
    }
    if (!selectedSubject) return;
    if (!selectedModel) return;

    configScreen.style.display  = 'none';
    loadingScreen.style.display = 'block';

    const errorEl = document.getElementById('loading-error');
    errorEl.style.display = 'none';

    try {
        document.getElementById('loading-text').textContent = 'Le LLM prépare tes questions…';
        questions = await generateQuestions(selectedSubject);
        questionIndex = 0;

        loadingScreen.style.display = 'none';

        document.getElementById('card-mode-label').textContent = selectedSubject;
        startGame();
    } catch (err) {
        document.getElementById('loading-text').textContent = 'Erreur de génération';
        errorEl.textContent = err.message;
        errorEl.style.display = 'block';

        setTimeout(() => {
            errorEl.innerHTML = err.message +
                '<br><br><button class="btn-small" onclick="retryGeneration()">🔄 Réessayer</button>' +
                ' <button class="btn-small" onclick="backToConfigFromLoading()">← Retour</button>';
        }, 100);
    }
}

function retryGeneration() {
    loadingScreen.style.display = 'none';
    startQuiz();
}

function backToConfigFromLoading() {
    loadingScreen.style.display = 'none';
    configScreen.style.display  = 'block';
}

async function continueQuiz() {
    pauseScreen.style.display = 'none';

    loadingScreen.style.display = 'block';
    document.getElementById('loading-error').style.display = 'none';
    document.getElementById('loading-text').textContent = 'Nouvelles questions en préparation…';

    try {
        questions = await generateQuestions(selectedSubject);
        questionIndex = 0;
        loadingScreen.style.display = 'none';
        continueGame();
    } catch (err) {
        document.getElementById('loading-text').textContent = 'Erreur de génération';
        const errorEl = document.getElementById('loading-error');
        errorEl.textContent = err.message;
        errorEl.style.display = 'block';
        setTimeout(() => {
            errorEl.innerHTML = err.message +
                '<br><br><button class="btn-small" onclick="continueQuiz()">🔄 Réessayer</button>' +
                ' <button class="btn-small" onclick="backToConfig()">← Menu</button>';
        }, 100);
    }
}

// ═══════════════════════════════════════
// Interface required by shared.js
// ═══════════════════════════════════════

function generateQuestion() {
    const q = questions[questionIndex % questions.length];
    questionIndex++;

    questionArea.innerHTML = `<div class="question-text">${escapeHtml(q.question)}</div>`;

    const zone = document.getElementById('answer-zone');
    zone.innerHTML = '<div class="choice-btns" id="choice-btns"></div>';
    const btnsContainer = document.getElementById('choice-btns');

    q.choices.forEach((choice, idx) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice;
        btn.onclick = () => submitChoice(idx);
        btnsContainer.appendChild(btn);
    });

    window._currentQ = q;
}

function submitChoice(chosenIdx) {
    const q = window._currentQ;
    const isCorrect = (chosenIdx === q.answer);
    const correctText = q.choices[q.answer];

    explanationEl.textContent = q.explanation || '';
    showResult(isCorrect, correctText);
}

function validateAnswer() {
    // Not used — choices are validated via button clicks
}

function getFocusInput() {
    const firstBtn = document.querySelector('#choice-btns .choice-btn');
    return firstBtn || null;
}

function canEnterValidate() {
    return false;
}

// ═══════════════════════════════════════
// Utilities
// ═══════════════════════════════════════

function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// ═══════════════════════════════════════
// Init — start scanning on page load
// ═══════════════════════════════════════
(function init() {
    startScreen.style.display     = 'none';
    gameScreen.style.display      = 'none';
    discoveryScreen.style.display = 'block';

    scanNetwork();
})();
