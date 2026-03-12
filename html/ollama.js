// ═══════════════════════════════════════
// ollama.js — Auto-discover & query a local Ollama server
// ═══════════════════════════════════════

const Ollama = (() => {
    // ── State ──
    let serverUrl = null;
    let modelName = null;
    let discovering = false;
    let ready = false;

    // Buffered AI-generated questions per mode
    const buffer = {
        homophones:  [],
        conjugaison: [],
        nature:      [],
        accord:      []
    };

    const BUFFER_TARGET = 5;
    let filling = new Set();

    // ── Logging ──
    let logLines = [];
    let logEl = null;

    function log(msg, level = 'info') {
        const ts = new Date().toLocaleTimeString();
        const line = `[${ts}] ${msg}`;
        logLines.push(line);
        if (level === 'error') {
            console.error('[Ollama]', msg);
        } else if (level === 'warn') {
            console.warn('[Ollama]', msg);
        } else {
            console.log('[Ollama]', msg);
        }
        if (logEl) {
            logEl.textContent = logLines.slice(-40).join('\n');
            logEl.scrollTop = logEl.scrollHeight;
        }
    }

    function attachLog(el) {
        logEl = el;
        if (logLines.length > 0) {
            logEl.textContent = logLines.slice(-40).join('\n');
        }
    }

    // ── Status callbacks ──
    let onStatusChange = null;
    function setStatus(s) {
        if (onStatusChange) onStatusChange(s, serverUrl, modelName);
    }

    // ═══════════════════════════════════════
    // Discovery
    // ═══════════════════════════════════════

    async function probe(url) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 2500);
            const resp = await fetch(`${url}/api/tags`, {
                signal: controller.signal
            });
            clearTimeout(timeout);
            if (!resp.ok) {
                log(`  ✗ ${url} → HTTP ${resp.status}`);
                return null;
            }
            const data = await resp.json();
            if (data && data.models && data.models.length > 0) {
                const names = data.models.map(m => m.name || m.model);
                log(`  ✓ FOUND ${url} → models: ${names.join(', ')}`);
                return { url, models: names };
            }
            log(`  ✗ ${url} → responded but no models loaded`);
        } catch (e) {
            // Only log details for localhost — too noisy otherwise
            if (url.includes('localhost') || url.includes('127.0.0.1')) {
                log(`  ✗ ${url} → ${e.name}: ${e.message}`);
            }
        }
        return null;
    }

    function buildCandidates() {
        const candidates = [];
        const port = 11434;

        // 1. Localhost
        candidates.push(`http://localhost:${port}`);
        candidates.push(`http://127.0.0.1:${port}`);

        // 2. Subnets
        const subnets = ['192.168.1', '192.168.0', '192.168.2', '10.0.0', '10.0.1', '172.16.0'];

        // If the page is served from a LAN IP, prioritise that subnet
        try {
            const pageHost = window.location.hostname;
            const m = pageHost.match(/^(\d+\.\d+\.\d+)\.\d+$/);
            if (m) {
                if (!subnets.includes(m[1])) subnets.unshift(m[1]);
                log(`Page served from ${pageHost} → subnet ${m[1]}`);
            }
        } catch (_) {}

        // Priority host IPs per subnet
        for (const subnet of subnets) {
            const priority = [1, 2, 3, 5, 10, 15, 20, 25, 30, 42, 50, 75,
                              99, 100, 101, 102, 110, 120, 126, 128, 137,
                              150, 175, 178, 189, 198, 200, 210, 222, 225,
                              227, 229, 240, 248, 250, 253, 254];
            for (const host of priority) {
                candidates.push(`http://${subnet}.${host}:${port}`);
            }
        }

        // 3. Full sweep of first two subnets (most likely)
        for (const subnet of subnets.slice(0, 2)) {
            for (let i = 2; i <= 254; i++) {
                const url = `http://${subnet}.${i}:${port}`;
                if (!candidates.includes(url)) candidates.push(url);
            }
        }

        return [...new Set(candidates)];
    }

    async function discover() {
        if (discovering || ready) return ready;
        discovering = true;
        setStatus('searching');

        // Warn about file:// protocol
        if (window.location.protocol === 'file:') {
            log('⚠️  Page ouverte via file:// !', 'warn');
            log('Le navigateur BLOQUE les requêtes réseau depuis file://', 'warn');
            log('', 'warn');
            log('💡 Solution : lancer un serveur local :', 'warn');
            log('   cd "' + (window.location.pathname.replace(/\/[^/]*$/, '') || '.') + '"', 'warn');
            log('   python3 -m http.server 8000', 'warn');
            log('   → puis ouvrir http://localhost:8000/grammaire.html', 'warn');
            log('');
            log('On essaie quand même...');
        }

        const candidates = buildCandidates();
        log(`Scanning ${candidates.length} candidate addresses...`);

        const BATCH = 50;
        let scanned = 0;

        for (let i = 0; i < candidates.length; i += BATCH) {
            const batch = candidates.slice(i, i + BATCH);
            const results = await Promise.all(batch.map(probe));
            scanned += batch.length;

            const found = results.find(r => r !== null);
            if (found) {
                serverUrl = found.url;
                modelName = pickBestModel(found.models);
                ready = true;
                discovering = false;
                log(`🎉 Serveur Ollama trouvé : ${serverUrl}`);
                log(`🤖 Modèle sélectionné : ${modelName}`);
                setStatus('found');
                return true;
            }

            // Progress
            log(`  Scanned ${Math.min(scanned, candidates.length)}/${candidates.length}...`);
        }

        discovering = false;
        log('');
        log('❌ Aucun serveur Ollama trouvé.', 'warn');
        log('');
        log('Vérifiez que :', 'warn');
        log('  1. Ollama est lancé sur une machine du réseau', 'warn');
        log('  2. Il écoute sur toutes les interfaces :', 'warn');
        log('     OLLAMA_HOST=0.0.0.0 ollama serve', 'warn');
        log('  3. Le pare-feu autorise le port 11434', 'warn');
        log('  4. Cette page est servie via http:// (pas file://)', 'warn');
        setStatus('offline');
        return false;
    }

    function pickBestModel(models) {
        if (!models || models.length === 0) return null;
        log(`Modèles disponibles : ${models.join(', ')}`);

        // Preference order (higher index = more preferred)
        const prefs = ['tinyllama', 'phi', 'gemma', 'llama', 'mistral', 'qwen', 'deepseek', 'command-r'];
        let best = models[0];
        let bestScore = -1;

        for (const m of models) {
            const lower = m.toLowerCase();
            let score = 0;
            for (let i = 0; i < prefs.length; i++) {
                if (lower.includes(prefs[i])) score = i + 1;
            }
            if (lower.includes('instruct') || lower.includes('chat')) score += 0.5;
            if (score > bestScore) {
                bestScore = score;
                best = m;
            }
        }

        log(`→ Modèle choisi : ${best} (score: ${bestScore})`);
        return best;
    }

    // ═══════════════════════════════════════
    // Query
    // ═══════════════════════════════════════

    async function query(prompt, temperature = 0.8) {
        if (!ready || !serverUrl || !modelName) return null;

        log(`Requête vers ${modelName}...`);
        const startTime = Date.now();

        try {
            const resp = await fetch(`${serverUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: modelName,
                    prompt: prompt,
                    stream: false,
                    options: { temperature, num_predict: 2048 }
                })
            });

            if (!resp.ok) {
                log(`Requête échouée : HTTP ${resp.status}`, 'error');
                return null;
            }
            const data = await resp.json();
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            const len = (data.response || '').length;
            log(`Réponse reçue en ${elapsed}s (${len} caractères)`);
            return data.response || null;
        } catch (e) {
            log(`Erreur requête : ${e.message}`, 'error');
            return null;
        }
    }

    // ═══════════════════════════════════════
    // Prompts
    // ═══════════════════════════════════════

    const PROMPTS = {
        homophones: `Tu es un professeur de français pour des élèves de CM2 (10-11 ans).
Génère exactement 5 exercices d'homophones grammaticaux variés.
Utilise ces paires : a/à, et/est, son/sont, on/ont, ou/où, ce/se, ces/ses, c'est/s'est, la/là/l'a, leur/leurs.
Varie les paires entre les 5 questions.

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ni après.
Chaque objet doit avoir exactement ces clés :
- "sentence": la phrase avec ___ à la place du mot à trouver
- "answer": le bon mot
- "choices": tableau des 2 homophones possibles
- "explanation": explication courte pour un enfant de CM2

Exemple de format :
[{"sentence":"Il ___ un vélo rouge.","answer":"a","choices":["a","à"],"explanation":"« a » = verbe avoir. On peut remplacer par « avait »."}]`,

        conjugaison: `Tu es un professeur de français pour des élèves de CM2 (10-11 ans).
Génère exactement 5 exercices de conjugaison variés.
Utilise ces temps : présent, imparfait, futur simple, passé composé.
Utilise des verbes variés des 3 groupes + être et avoir.
Varie les pronoms sujets (je, tu, il/elle, nous, vous, ils/elles).

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ni après.
Chaque objet doit avoir exactement ces clés :
- "sentence": la phrase avec ___ à la place du verbe conjugué, et le verbe à l'infinitif entre parenthèses
- "answer": le verbe correctement conjugué
- "hint": "infinitif – temps – pronom" (ex: "manger – présent – nous")
- "explanation": explication courte

Exemple de format :
[{"sentence":"Nous ___ (manger) à midi.","answer":"mangeons","hint":"manger – présent – nous","explanation":"Manger au présent avec « nous » → mangeons."}]`,

        nature: `Tu es un professeur de français pour des élèves de CM2 (10-11 ans).
Génère exactement 5 exercices sur la nature des mots (classe grammaticale).
Le mot à identifier doit être entouré de ** dans la phrase (ex: "Le **chat** dort").
Utilise ces natures : nom, verbe, adjectif, adverbe, pronom, déterminant.
Propose 4 choix par question.

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ni après.
Chaque objet doit avoir exactement ces clés :
- "sentence": la phrase avec le mot entre ** (ex: "Le **soleil** brille.")
- "answer": la nature du mot (en minuscules)
- "choices": tableau de 4 natures possibles
- "explanation": explication courte

Exemple de format :
[{"sentence":"Le **chat** dort sur le canapé.","answer":"nom","choices":["nom","verbe","adjectif","adverbe"],"explanation":"« chat » = nom commun (un être vivant)."}]`,

        accord: `Tu es un professeur de français pour des élèves de CM2 (10-11 ans).
Génère exactement 5 exercices sur l'accord des adjectifs (genre et nombre).
La phrase contient ___ à la place de l'adjectif à accorder.
Propose 4 formes : masculin singulier, féminin singulier, masculin pluriel, féminin pluriel.

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ni après.
Chaque objet doit avoir exactement ces clés :
- "sentence": la phrase avec ___ à la place de l'adjectif
- "answer": la forme correctement accordée
- "choices": tableau des 4 formes possibles
- "explanation": explication courte

Exemple de format :
[{"sentence":"Les filles sont ___.","answer":"contentes","choices":["content","contente","contents","contentes"],"explanation":"Féminin pluriel → contentes (les filles)."}]`
    };

    // ═══════════════════════════════════════
    // Parse & validate
    // ═══════════════════════════════════════

    function parseQuestions(raw, mode) {
        if (!raw) return [];

        let jsonStr = raw;
        const match = raw.match(/\[[\s\S]*\]/);
        if (match) jsonStr = match[0];

        let questions;
        try {
            questions = JSON.parse(jsonStr);
        } catch (e) {
            log(`Échec du parsing JSON (${mode}): ${e.message}`, 'warn');
            log(`Réponse brute (200 premiers chars): ${raw.substring(0, 200)}`, 'warn');
            return [];
        }

        if (!Array.isArray(questions)) return [];

        const valid = questions.filter(q => {
            if (!q.sentence || !q.answer || !q.explanation) return false;
            if (mode === 'homophones' || mode === 'accord') {
                if (!Array.isArray(q.choices) || q.choices.length < 2) return false;
            }
            if (mode === 'nature') {
                if (q.sentence.includes('**')) {
                    q.sentence = q.sentence.replace(
                        /\*\*(.+?)\*\*/g,
                        "<span class='highlight'>$1</span>"
                    );
                }
                if (!Array.isArray(q.choices) || q.choices.length < 2) return false;
            }
            if (mode === 'conjugaison') {
                if (!q.hint) q.hint = '';
            }
            return true;
        });

        log(`Parsed ${valid.length}/${questions.length} valid questions for ${mode}`);
        return valid;
    }

    // ═══════════════════════════════════════
    // Buffer management
    // ═══════════════════════════════════════

    async function fillBuffer(mode) {
        if (!ready || filling.has(mode)) return;
        if (buffer[mode].length >= BUFFER_TARGET) return;

        filling.add(mode);
        log(`Génération de questions ${mode}...`);

        const raw = await query(PROMPTS[mode], 0.9);
        const questions = parseQuestions(raw, mode);

        if (questions.length > 0) {
            buffer[mode].push(...questions);
            log(`+${questions.length} questions ${mode} (buffer: ${buffer[mode].length})`);
        } else {
            log(`Aucune question valide générée pour ${mode}`, 'warn');
        }

        filling.delete(mode);
    }

    function getQuestion(mode) {
        if (buffer[mode].length <= BUFFER_TARGET) {
            fillBuffer(mode);
        }
        if (buffer[mode].length === 0) return null;
        return buffer[mode].shift();
    }

    async function prefill(modes) {
        if (!ready) return;
        for (const mode of modes) {
            fillBuffer(mode);
        }
    }

    // ═══════════════════════════════════════
    // Public API
    // ═══════════════════════════════════════

    return {
        discover,
        getQuestion,
        prefill,
        fillBuffer,
        attachLog,
        get isReady()  { return ready; },
        get server()   { return serverUrl; },
        get model()    { return modelName; },
        get logs()     { return logLines; },
        set onStatus(fn) { onStatusChange = fn; },
    };
})();
