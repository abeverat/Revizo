// ═══════════════════════════════════════
// ollama.js — Auto-discover & query a local Ollama server
// ═══════════════════════════════════════

const Ollama = (() => {
    const CACHE_KEY = 'cartestoto.ai.target.v1';
    const MODEL_CACHE_KEY = 'cartestoto.ai.model.v1';
    const FINAL_FALLBACK_HOSTS = ['192.168.1.229'];

    // ── State ──
    let serverUrl = null;
    let modelName = null;
    let availableModels = [];
    let discovering = false;
    let ready = false;
    let backend = null; // 'ollama' | 'lmstudio'

    // Buffered AI-generated questions per mode
    const buffer = {
        homophones:  [],
        conjugaison: [],
        nature:      [],
        accord:      []
    };

    const BUFFER_TARGET = 3;
    let filling = new Set();
    let fillQueue = [];
    let queuedModes = new Set();
    let queueRunning = false;
    let refillTimer = null;
    const MAX_FILL_RETRIES = 2;
    const RETRY_DELAY_MS = 2000;

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

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
        if (onStatusChange) onStatusChange(s, serverUrl, modelName, backend);
    }

    // ═══════════════════════════════════════
    // Probing
    // ═══════════════════════════════════════

    async function probeOllama(url, timeoutMs = 3000) {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);
            const resp = await fetch(`${url}/api/tags`, { signal: controller.signal });
            clearTimeout(timer);
            if (!resp.ok) {
                log(`  ✗ ${url} (Ollama) → HTTP ${resp.status}`);
                return null;
            }
            const data = await resp.json();
            if (data && data.models && data.models.length > 0) {
                const names = data.models.map(m => m.name || m.model);
                log(`  ✓ Ollama @ ${url} → modèles : ${names.join(', ')}`);
                return { url, models: names, backend: 'ollama' };
            }
            log(`  ✗ ${url} (Ollama) → aucun modèle chargé`);
        } catch (e) {
            if (url.includes('localhost') || url.includes('127.0.0.1')) {
                log(`  ✗ ${url} (Ollama) → ${e.name}: ${e.message}`);
            }
        }
        return null;
    }

    async function probeLMStudio(url, timeoutMs = 3000) {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);
            const resp = await fetch(`${url}/v1/models`, { signal: controller.signal });
            clearTimeout(timer);
            if (!resp.ok) {
                log(`  ✗ ${url} (LM Studio) → HTTP ${resp.status}`);
                return null;
            }
            const data = await resp.json();
            if (data && data.data && data.data.length > 0) {
                const names = data.data.map(m => m.id);
                log(`  ✓ LM Studio @ ${url} → modèles : ${names.join(', ')}`);
                return { url, models: names, backend: 'lmstudio' };
            }
            log(`  ✗ ${url} (LM Studio) → aucun modèle chargé`);
        } catch (e) {
            if (url.includes('localhost') || url.includes('127.0.0.1')) {
                log(`  ✗ ${url} (LM Studio) → ${e.name}: ${e.message}`);
            }
        }
        return null;
    }

    async function probeHost(host, timeoutMs = 3000) {
        const results = await Promise.all([
            probeOllama(`http://${host}:11434`, timeoutMs),
            probeLMStudio(`http://${host}:1234`, timeoutMs)
        ]);
        return results.find(r => r !== null) || null;
    }

    async function probeBaseUrl(baseUrl, preferredBackend = null, timeoutMs = 2500) {
        const clean = (baseUrl || '').replace(/\/$/, '');
        if (!clean) return null;

        if (preferredBackend === 'ollama') {
            return probeOllama(clean, timeoutMs);
        }
        if (preferredBackend === 'lmstudio') {
            return probeLMStudio(clean, timeoutMs);
        }

        const results = await Promise.all([
            probeOllama(clean, timeoutMs),
            probeLMStudio(clean, timeoutMs)
        ]);
        return results.find(r => r !== null) || null;
    }

    async function browserReachabilityCheck(baseUrl, path, timeoutMs = 1400) {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);
            // no-cors gives an opaque response if the host is reachable but CORS blocks reads.
            await fetch(`${baseUrl}${path}`, {
                mode: 'no-cors',
                cache: 'no-store',
                signal: controller.signal
            });
            clearTimeout(timer);
            return true;
        } catch (_) {
            return false;
        }
    }

    async function debugEndpoint(baseUrl) {
        const clean = (baseUrl || '').replace(/\/$/, '');
        if (!clean) {
            log('Debug: URL vide.', 'warn');
            return { ok: false, reason: 'invalid-url' };
        }

        log(`Debug: test de ${clean} ...`);
        const result = await probeBaseUrl(clean, null, 3500);
        if (result) {
            log(`Debug: OK via API ${result.backend} (${result.url})`);
            return { ok: true, kind: 'api', backend: result.backend, url: result.url };
        }

        const ollamaReachable = await browserReachabilityCheck(clean, '/api/tags');
        if (ollamaReachable) {
            log('Debug: hôte joignable mais lecture API bloquée (probable CORS).', 'warn');
            log(`Debug: origine page = ${window.location.origin}`, 'warn');
            log('Debug: pour Ollama distant, ajoutez cette origine dans OLLAMA_ORIGINS.', 'warn');
            return { ok: false, kind: 'cors', backend: 'ollama', url: clean };
        }

        const lmstudioReachable = await browserReachabilityCheck(clean, '/v1/models');
        if (lmstudioReachable) {
            log('Debug: hôte joignable mais lecture API LM Studio bloquée (probable CORS).', 'warn');
            log(`Debug: origine page = ${window.location.origin}`, 'warn');
            return { ok: false, kind: 'cors', backend: 'lmstudio', url: clean };
        }

        log('Debug: hôte non joignable depuis le navigateur (DNS/routage/pare-feu).', 'warn');
        return { ok: false, kind: 'network', url: clean };
    }

    function saveCachedTarget(url, backendType) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                url,
                backend: backendType,
                ts: Date.now()
            }));
        } catch (_) {}
    }

    function loadCachedTarget() {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || !data.url) return null;

            // Ignore stale cache after 14 days.
            if (!data.ts || (Date.now() - data.ts) > 14 * 24 * 60 * 60 * 1000) {
                localStorage.removeItem(CACHE_KEY);
                return null;
            }

            return { url: data.url, backend: data.backend || null };
        } catch (_) {
            return null;
        }
    }

    function clearCachedTarget() {
        try {
            localStorage.removeItem(CACHE_KEY);
        } catch (_) {}
    }

    function saveCachedModel(url, backendType, model) {
        if (!url || !backendType || !model) return;
        try {
            localStorage.setItem(MODEL_CACHE_KEY, JSON.stringify({
                url,
                backend: backendType,
                model,
                ts: Date.now()
            }));
        } catch (_) {}
    }

    function loadCachedModel(url, backendType) {
        try {
            const raw = localStorage.getItem(MODEL_CACHE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || !data.model) return null;

            // Ignore stale cache after 14 days.
            if (!data.ts || (Date.now() - data.ts) > 14 * 24 * 60 * 60 * 1000) {
                localStorage.removeItem(MODEL_CACHE_KEY);
                return null;
            }

            if (data.url !== url || data.backend !== backendType) return null;
            return data.model;
        } catch (_) {
            return null;
        }
    }

    // ═══════════════════════════════════════
    // Discovery
    // ═══════════════════════════════════════

    function buildNetworkHosts() {
        const hosts = [];
        const subnets = ['192.168.1', '192.168.0', '192.168.2', '10.0.0', '10.0.1'];

        // If the page is served from a LAN IP, prioritise that subnet
        try {
            const pageHost = window.location.hostname;
            const m = pageHost.match(/^(\d+\.\d+\.\d+)\.\d+$/);
            if (m && !subnets.includes(m[1])) {
                subnets.unshift(m[1]);
                log(`Page servie depuis ${pageHost} → sous-réseau ${m[1]}`);
            }
        } catch (_) {}

        // Priority host IPs per subnet
        const priority = [1, 2, 3, 5, 10, 15, 20, 25, 30, 42, 50, 75,
                          100, 101, 102, 110, 120, 128, 150, 200, 250, 254];
        for (const subnet of subnets) {
            for (const h of priority) {
                hosts.push(`${subnet}.${h}`);
            }
        }

        // Full sweep of primary subnet
        if (subnets.length > 0) {
            const primary = subnets[0];
            for (let i = 2; i <= 254; i++) {
                const host = `${primary}.${i}`;
                if (!hosts.includes(host)) hosts.push(host);
            }
        }

        return hosts;
    }

    function buildMdnsCandidates() {
        const common = [
            'macbook.local',
            'macbook-pro.local',
            'macbook-air.local',
            'ollama.local',
            'lmstudio.local',
            'host.docker.internal'
        ];

        try {
            const pageHost = window.location.hostname;
            if (pageHost && pageHost.endsWith('.local') && !common.includes(pageHost)) {
                common.unshift(pageHost);
            }
        } catch (_) {}

        return [...new Set(common)];
    }

    function finishDiscovery(result) {
        serverUrl = result.url;
        backend = result.backend;
        availableModels = Array.isArray(result.models) ? [...result.models] : [];
        modelName = pickBestModel(result.models);
        const cachedModel = loadCachedModel(serverUrl, backend);
        if (cachedModel && availableModels.includes(cachedModel)) {
            modelName = cachedModel;
            log(`→ Modèle mémorisé restauré : ${modelName}`);
        }
        ready = true;
        discovering = false;
        saveCachedTarget(serverUrl, backend);
        saveCachedModel(serverUrl, backend, modelName);
        const backendName = backend === 'lmstudio' ? 'LM Studio' : 'Ollama';
        log(`🎉 Serveur ${backendName} trouvé : ${serverUrl}`);
        log(`🤖 Modèle sélectionné : ${modelName}`);
        setStatus('found');
        return true;
    }

    async function discover() {
        if (discovering || ready) return ready;
        discovering = true;
        setStatus('searching');

        // Warn about file:// protocol
        if (window.location.protocol === 'file:') {
            log('⚠️  Page ouverte via file:// !', 'warn');
            log('Le navigateur BLOQUE les requêtes réseau depuis file://', 'warn');
            log('');
            log('💡 Solution : lancer un serveur local :', 'warn');
            log('   python3 -m http.server 8000', 'warn');
            log('   → puis ouvrir http://localhost:8000/grammaire.html', 'warn');
            log('');
            log('On essaie quand même...');
        }

        // ═══ Phase 0: explicit URL override (?ai=...&backend=ollama|lmstudio) ═══
        try {
            const params = new URLSearchParams(window.location.search);
            const ai = params.get('ai');
            const forcedBackend = params.get('backend');
            if (ai) {
                log(`Phase 0 : URL forcée ${ai}...`);
                let result = await probeBaseUrl(ai, forcedBackend, 3000);
                if (result) return finishDiscovery(result);
                log('  URL forcée non joignable ou sans modèle.', 'warn');
                await debugEndpoint(ai);
            }
        } catch (_) {}

        // ═══ Phase 0.5: cached endpoint from previous successful run ═══
        const cached = loadCachedTarget();
        if (cached) {
            log(`Phase 0.5 : Endpoint mémorisé ${cached.url}...`);
            let result = await probeBaseUrl(cached.url, cached.backend, 1400);
            if (result) return finishDiscovery(result);
            clearCachedTarget();
            log('  Endpoint mémorisé indisponible, cache effacé.', 'warn');
        }

        // ═══ Phase 1: same-origin proxy paths (best for nginx) ═══
        log('Phase 1 : Vérification des proxys Nginx…');
        const proxyCandidates = [
            { url: `${window.location.origin}/ollama`, backend: 'ollama' },
            { url: `${window.location.origin}/api/ollama`, backend: 'ollama' },
            { url: `${window.location.origin}/lmstudio`, backend: 'lmstudio' },
            { url: `${window.location.origin}/api/lmstudio`, backend: 'lmstudio' }
        ];
        for (const c of proxyCandidates) {
            const result = await probeBaseUrl(c.url, c.backend, 1500);
            if (result) return finishDiscovery(result);
        }

        // ═══ Phase 1.5: common mDNS hostnames (Mac/bonjour) ═══
        const mdnsHosts = buildMdnsCandidates();
        log(`Phase 1.5 : Vérification des noms locaux (${mdnsHosts.length})…`);
        for (const host of mdnsHosts) {
            const result = await probeHost(host, 1800);
            if (result) return finishDiscovery(result);
        }

        // ═══ Phase 2: localhost (fast path) ═══
        log('Phase 2 : Vérification localhost…');
        let result = await probeHost('localhost', 3000);
        if (result) return finishDiscovery(result);

        result = await probeHost('127.0.0.1', 3000);
        if (result) return finishDiscovery(result);

        // ═══ Phase 3: page host (if served from LAN) ═══
        try {
            const pageHost = window.location.hostname;
            if (pageHost && pageHost !== 'localhost' && pageHost !== '127.0.0.1') {
                log(`Phase 3 : Vérification ${pageHost}…`);
                result = await probeHost(pageHost, 3000);
                if (result) return finishDiscovery(result);
            }
        } catch (_) {}

        // ═══ Phase 4: network scan ═══
        const hosts = buildNetworkHosts();
        log(`Phase 4 : Scan réseau (${hosts.length} hôtes × 2 ports)…`);

        const BATCH = 20;
        let scanned = 0;

        for (let i = 0; i < hosts.length; i += BATCH) {
            const batch = hosts.slice(i, i + BATCH);
            const results = await Promise.all(batch.map(h => probeHost(h, 1500)));
            scanned += batch.length;

            const found = results.find(r => r !== null);
            if (found) return finishDiscovery(found);

            log(`  Scanné ${Math.min(scanned, hosts.length)}/${hosts.length}…`);
        }

        // ═══ Phase 5: explicit final fallback hosts ═══
        if (FINAL_FALLBACK_HOSTS.length > 0) {
            log(`Phase 5 : Vérification finale (${FINAL_FALLBACK_HOSTS.join(', ')})…`);
            for (const host of FINAL_FALLBACK_HOSTS) {
                const result = await probeHost(host, 5000);
                if (result) return finishDiscovery(result);

                // If direct API probing failed, run a browser-level diagnostic
                // to separate network errors from CORS blocking.
                const ollamaBase = `http://${host}:11434`;
                const lmstudioBase = `http://${host}:1234`;
                const d1 = await debugEndpoint(ollamaBase);
                if (d1 && d1.kind === 'cors') {
                    log(`Diagnostic final: ${ollamaBase} joignable mais bloqué par CORS.`, 'warn');
                }
                const d2 = await debugEndpoint(lmstudioBase);
                if (d2 && d2.kind === 'cors') {
                    log(`Diagnostic final: ${lmstudioBase} joignable mais bloqué par CORS.`, 'warn');
                }
            }
        }

        discovering = false;
        log('');
        log('❌ Aucun serveur IA trouvé.', 'warn');
        log('');
        log('Vérifiez que :', 'warn');
        log('  1. Ollama ou LM Studio est lancé', 'warn');
        log('  2. Pour Ollama distant : OLLAMA_HOST=0.0.0.0 ollama serve', 'warn');
        log('  3. Le pare-feu autorise le port (11434 ou 1234)', 'warn');
        log('  4. Cette page est servie via http:// (pas file://)', 'warn');
        log('  5. Avec Nginx, créez un proxy local (ex: /ollama -> 127.0.0.1:11434)', 'warn');
        log('  6. En secours: ?ai=http://IP:11434&backend=ollama', 'warn');
        log('  7. Si Ollama est sur Mac distant, autorisez l\'origine du site via OLLAMA_ORIGINS', 'warn');
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

    function setModel(nextModel) {
        if (!ready) return false;
        if (!nextModel || !availableModels.includes(nextModel)) return false;
        if (modelName === nextModel) return true;

        modelName = nextModel;
        saveCachedModel(serverUrl, backend, modelName);
        log(`🤖 Modèle changé : ${modelName}`);
        setStatus('found');
        return true;
    }

    // ═══════════════════════════════════════
    // Query
    // ═══════════════════════════════════════

    async function query(prompt, temperature = 0.8) {
        if (!ready || !serverUrl || !modelName) return null;

        const backendName = backend === 'lmstudio' ? 'LM Studio' : 'Ollama';
        log(`Requête vers ${modelName} (${backendName})…`);
        const startTime = Date.now();

        try {
            let resp;
            if (backend === 'lmstudio') {
                resp = await fetch(`${serverUrl}/v1/chat/completions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: modelName,
                        messages: [{ role: 'user', content: prompt }],
                        temperature,
                        max_tokens: 1500,
                        stream: false
                    })
                });
            } else {
                resp = await fetch(`${serverUrl}/api/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: modelName,
                        prompt: prompt,
                        stream: false,
                        options: { temperature, num_predict: 1500 }
                    })
                });
            }

            if (!resp.ok) {
                log(`Requête échouée : HTTP ${resp.status}`, 'error');
                return null;
            }
            const data = await resp.json();
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

            let text;
            if (backend === 'lmstudio') {
                text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || null;
            } else {
                text = data.response || null;
            }

            const len = (text || '').length;
            log(`Réponse reçue en ${elapsed}s (${len} caractères)`);
            return text;
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
Génère exactement 3 exercices d'homophones grammaticaux variés.
Utilise ces paires : a/à, et/est, son/sont, on/ont, ou/où, ce/se, ces/ses, c'est/s'est, la/là/l'a, leur/leurs.
Varie les paires entre les 3 questions.

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ni après.
Chaque objet doit avoir exactement ces clés :
- "sentence": la phrase avec ___ à la place du mot à trouver
- "answer": le bon mot
- "choices": tableau des 2 homophones possibles
- "explanation": explication courte pour un enfant de CM2

Exemple de format :
[{"sentence":"Il ___ un vélo rouge.","answer":"a","choices":["a","à"],"explanation":"« a » = verbe avoir. On peut remplacer par « avait »."}]`,

        conjugaison: `Tu es un professeur de français pour des élèves de CM2 (10-11 ans).
Génère exactement 3 exercices de conjugaison variés.
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
Génère exactement 3 exercices sur la nature des mots (classe grammaticale).
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
Génère exactement 3 exercices sur l'accord des adjectifs (genre et nombre).
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

    function repairTruncatedJson(str) {
        // Try to salvage a truncated JSON array by closing open strings/objects/arrays
        let s = str.trim();
        if (!s.startsWith('[')) return null;

        // Find the last complete object (ends with })
        const lastComplete = s.lastIndexOf('}');
        if (lastComplete < 0) return null;

        // Cut after last complete object and close the array
        s = s.substring(0, lastComplete + 1);
        // Remove trailing comma if present
        s = s.replace(/,\s*$/, '');
        s += ']';

        try {
            const arr = JSON.parse(s);
            if (Array.isArray(arr) && arr.length > 0) return arr;
        } catch (_) {}
        return null;
    }

    function parseQuestions(raw, mode) {
        if (!raw) return [];

        let jsonStr = raw;
        const match = raw.match(/\[[\s\S]*\]/);
        if (match) jsonStr = match[0];

        let questions;
        try {
            questions = JSON.parse(jsonStr);
        } catch (e) {
            log(`Parsing JSON partiel (${mode})…`, 'warn');
            // Attempt to recover truncated output
            const repaired = repairTruncatedJson(raw);
            if (repaired) {
                log(`Récupéré ${repaired.length} question(s) depuis réponse tronquée`);
                questions = repaired;
            } else {
                log(`Échec du parsing JSON (${mode}): ${e.message}`, 'warn');
                log(`Réponse brute (200 premiers chars): ${raw.substring(0, 200)}`, 'warn');
                return [];
            }
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

    function enqueueFill(mode, priority = false) {
        if (!ready || !buffer[mode]) return;
        if (buffer[mode].length >= BUFFER_TARGET) return;
        if (filling.has(mode) || queuedModes.has(mode)) return;

        if (priority) {
            fillQueue.unshift(mode);
        } else {
            fillQueue.push(mode);
        }
        queuedModes.add(mode);
        pumpFillQueue();
    }

    async function pumpFillQueue() {
        if (queueRunning || !ready) return;
        queueRunning = true;

        while (fillQueue.length > 0 && ready) {
            const mode = fillQueue.shift();
            queuedModes.delete(mode);
            await fillBuffer(mode);
        }

        queueRunning = false;
    }

    async function fillBuffer(mode, attempt = 1) {
        if (!ready || filling.has(mode)) return;
        if (buffer[mode].length >= BUFFER_TARGET) return;

        filling.add(mode);
        log(`Génération en arrière-plan (${mode})...`);

        try {
            const raw = await query(PROMPTS[mode], 0.7);
            const questions = parseQuestions(raw, mode);

            if (questions.length > 0) {
                buffer[mode].push(...questions);
                log(`+${questions.length} questions ${mode} (buffer: ${buffer[mode].length})`);
                return;
            }

            if (attempt <= MAX_FILL_RETRIES) {
                log(`Réessai ${mode} (${attempt}/${MAX_FILL_RETRIES})...`, 'warn');
                await sleep(RETRY_DELAY_MS * attempt);
                return fillBuffer(mode, attempt + 1);
            }

            log(`Aucune question valide générée pour ${mode}`, 'warn');
        } finally {
            filling.delete(mode);
        }
    }

    let activeMode = null;

    function startBackgroundRefill(mode) {
        activeMode = mode;
        if (refillTimer) clearInterval(refillTimer);
        refillTimer = setInterval(() => {
            if (!ready || !activeMode) return;
            if (buffer[activeMode].length < BUFFER_TARGET) {
                enqueueFill(activeMode);
            }
        }, 2000);
    }

    function stopBackgroundRefill() {
        activeMode = null;
        if (refillTimer) {
            clearInterval(refillTimer);
            refillTimer = null;
        }
        fillQueue = [];
        queuedModes.clear();
    }

    function getQuestion(mode) {
        if (buffer[mode].length < BUFFER_TARGET) {
            enqueueFill(mode, true);
        }
        if (buffer[mode].length === 0) return null;
        return buffer[mode].shift();
    }

    async function prefill(modes) {
        if (!ready) return;
        for (const mode of modes) {
            enqueueFill(mode);
        }
        pumpFillQueue();
    }

    // ═══════════════════════════════════════
    // Public API
    // ═══════════════════════════════════════

    return {
        discover,
        debugEndpoint,
        setModel,
        getQuestion,
        prefill,
        fillBuffer,
        startBackgroundRefill,
        stopBackgroundRefill,
        attachLog,
        get isReady()  { return ready; },
        get server()   { return serverUrl; },
        get model()    { return modelName; },
        get models()   { return [...availableModels]; },
        get backendType() { return backend; },
        get logs()     { return logLines; },
        get isGenerating() { return filling.size > 0 || fillQueue.length > 0; },
        bufferCount(mode) { return (buffer[mode] || []).length; },
        set onStatus(fn) { onStatusChange = fn; },
    };
})();
