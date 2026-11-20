// storage.js — Adaptador de persistencia del ranking (contrato C-4, ADR-008).
// Hoy: localStorage. Mañana: Firebase (se sustituye solo este fichero; la
// interfaz saveScore/listScores no cambia). Ni ui.js ni main.js conocen el
// backend: solo consultan este adaptador.
// El acceso a localStorage ocurre SIEMPRE dentro de los métodos, jamás al
// importar (C-0): el módulo se importa sin error en Node.

const STORAGE_KEY = 'snake.scores';
const PLAYER_KEY = 'snake.playerName';

function isValidEntry(entry) {
  if (entry === null || typeof entry !== 'object') return false;
  if (typeof entry.name !== 'string' || entry.name.trim().length === 0) return false;
  if (typeof entry.score !== 'number' || !Number.isInteger(entry.score) || entry.score < 0) return false;
  if (typeof entry.date !== 'string' || Number.isNaN(Date.parse(entry.date))) return false;
  return true;
}

function sortByScoreDesc(entries) {
  return entries.slice().sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.date === b.date) return 0;
    return a.date < b.date ? 1 : -1; // empate: la más reciente primero
  });
}

function readScores() {
  if (typeof localStorage === 'undefined') return []; // Node / entornos sin navegador
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidEntry); // datos corruptos se descartan, no se propagan
  } catch (err) {
    console.error('[storage] Datos corruptos; se inicializa limpio.', err);
    return [];
  }
}

function writeScores(entries) {
  if (typeof localStorage === 'undefined') {
    console.error('[storage] Sin almacenamiento disponible; entrada no persistida.');
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function saveScore({ name, score, date }) {
  if (!isValidEntry({ name, score, date })) {
    console.error('[storage] Entrada inválida; no se persiste.', { name, score, date });
    return;
  }
  const entries = sortByScoreDesc([...readScores(), { name: name.trim(), score, date }]);
  writeScores(entries);
}

export function listScores() {
  return sortByScoreDesc(readScores());
}

// Recuerda el nombre del jugador entre sesiones (F4, decisión del
// desarrollador). Una cadena vacía lo borra (vuelve a usarse el nombre
// por defecto de i18n); nunca lanza.
export function savePlayerName(name) {
  if (typeof localStorage === 'undefined') {
    console.error('[storage] Sin almacenamiento disponible; nombre no persistido.');
    return;
  }
  try {
    if (typeof name !== 'string') throw new Error(`nombre no es string: ${typeof name}`);
    if (name.length === 0) {
      localStorage.removeItem(PLAYER_KEY);
    } else {
      localStorage.setItem(PLAYER_KEY, name);
    }
  } catch (err) {
    console.error('[storage] No se pudo guardar el nombre del jugador.', err);
  }
}

export function loadPlayerName() {
  if (typeof localStorage === 'undefined') return '';
  try {
    return localStorage.getItem(PLAYER_KEY) ?? '';
  } catch (err) {
    console.error('[storage] No se pudo leer el nombre del jugador.', err);
    return '';
  }
}

// Preferencias de audio {music:boolean, sfx:boolean} (F6). Defaults: ambos
// activados. Corrupción/ausencia ⇒ defaults, sin romper la ejecución.
const AUDIO_KEY = 'snake.audioPrefs';
const DEFAULT_AUDIO_PREFS = { music: true, sfx: true };

export function saveAudioPrefs(prefs) {
  if (typeof localStorage === 'undefined') {
    console.error('[storage] Sin almacenamiento disponible; preferencias de audio no persistidas.');
    return;
  }
  const clean = {
    music: Boolean(prefs && prefs.music),
    sfx: Boolean(prefs && prefs.sfx),
  };
  try {
    localStorage.setItem(AUDIO_KEY, JSON.stringify(clean));
  } catch (err) {
    console.error('[storage] No se pudieron guardar las preferencias de audio.', err);
  }
}

export function loadAudioPrefs() {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_AUDIO_PREFS };
  try {
    const raw = localStorage.getItem(AUDIO_KEY);
    if (raw === null) return { ...DEFAULT_AUDIO_PREFS };
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== 'object') return { ...DEFAULT_AUDIO_PREFS };
    return {
      music: parsed.music !== false,
      sfx: parsed.sfx !== false,
    };
  } catch (err) {
    console.error('[storage] Preferencias de audio corruptas; se usa el default.', err);
    return { ...DEFAULT_AUDIO_PREFS };
  }
}
