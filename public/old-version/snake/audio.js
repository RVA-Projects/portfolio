// audio.js — Motor de audio del juego (F6, ADR-013).
// Módulo de PRESENTACIÓN (como ui.js): usa APIs del navegador
// (AudioContext/HTMLAudio) y por eso queda excluido de las pruebas Node
// del C-0; su sintaxis entra en `npm run check`.
// - SFX: sintetizados con zzfx (vendor/zzfx.js), recetas ajustables en
//   config.js (sección AUDIO).
// - Música: multi-tema por sondeo de nombre (theme, theme1, …) con
//   crossfade entre temas; sonando SOLO mientras la partida corre
//   (main.js lo gobierna según el estado).
// Ni la lógica (C-1) ni ui.js saben que este módulo existe: main.js es el
// único orquestador (C-2).

import { zzfx, ZZFX } from './vendor/zzfx.js';
import {
  MUSIC_FILE, MUSIC_VOLUME, MUSIC_MAX_TRACKS, MUSIC_FADE_MS,
  SFX_VOLUME, SFX_RECIPES,
} from './config.js';

const $audio = {
  musicOn: true,
  sfxOn: true,
  playlist: null,      // temas reproducibles detectados (sondeo perezoso)
  probePromise: null,  // sondeo en curso (se hace UNA sola vez)
  trackIndex: 0,       // índice del tema actual en la playlist
  bag: [],             // bolsa barajada de pistas pendientes de sonar (F7: aleatorio)
  slots: [null, null], // dos <audio> alternos para el crossfade (F7)
  activeSlot: 0,       // cuál de los slots suena ahora
  fadeTimer: null,     // interval del crossfade en curso
  chainStarted: false, // evita encadenar dos veces el mismo final de tema
};

// Aplica las preferencias persistidas ({music:boolean, sfx:boolean}).
export function initAudio(prefs = {}) {
  $audio.musicOn = prefs.music !== false;
  $audio.sfxOn = prefs.sfx !== false;
}

// ── Efectos de sonido (sintetizados) ──
export function sfx(name) {
  if (!$audio.sfxOn) return;
  const recipe = SFX_RECIPES[name];
  if (!recipe) {
    console.error(`[audio] Receta de sfx desconocida: "${name}"`);
    return;
  }
  try {
    ensureAudioUnlock();
    // Escala el volumen global del sfx sobre el de la receta, sin mutar config.
    zzfx(...recipe.map((v, i) => (i === 0 ? v * SFX_VOLUME : v)));
  } catch (err) {
    console.error(`[audio] No se pudo reproducir el sfx "${name}".`, err);
  }
}

// El navegador bloquea el audio hasta un gesto del usuario: se reanuda el
// contexto al primer uso (siempre el sfx de click de un botón o tecla).
function ensureAudioUnlock() {
  if (ZZFX.audioContext && ZZFX.audioContext.state === 'suspended') {
    ZZFX.audioContext.resume().catch(() => {});
  }
}

// ── Música de fondo multi-tema (F7, ADR-015; solo suena en partida) ──
// Detección automática POR NOMBRE (decisión del desarrollador): se sondean
// theme.wav, theme1.wav, theme2.wav… hasta MUSIC_MAX_TRACKS. Los que existan
// se reproducen con crossfade suave (MUSIC_FADE_MS) en ORDEN ALEATORIO: sin
// repetir ninguno hasta agotar la lista completa; al agotarla, se vuelve a
// barajar. Sondear ficheros inexistentes puede dejar avisos de red en la
// consola del navegador: son inofensivos.

// Fisher–Yates sobre una copia: no muta la playlist original.
function shuffleIndexes(length) {
  const indexes = Array.from({ length }, (_, i) => i);
  for (let i = indexes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

// Rellena la bolsa barajada evitando que la PRÓXIMA pista sea `avoid`
// (sin doblar el tema actual cuando se reanuda el ciclo).
function refillBag(avoid) {
  const bag = shuffleIndexes($audio.playlist.length);
  const last = bag.length - 1;
  if (last > 0 && bag[last] === avoid) {
    const swapWith = Math.floor(Math.random() * last); // alguna otra posición
    [bag[last], bag[swapWith]] = [bag[swapWith], bag[last]];
  }
  $audio.bag = bag;
}

// Saca la siguiente pista al azar; bolsa vacía ⇒ se vuelve a barajar.
function pickFromBag(avoid) {
  if ($audio.bag.length === 0) refillBag(avoid);
  return $audio.bag.pop();
}

// Candidatos derivados del nombre/config de MUSIC_FILE (candidato nº1).
function candidateUrls() {
  const slash = MUSIC_FILE.lastIndexOf('/');
  const dir = slash >= 0 ? MUSIC_FILE.slice(0, slash + 1) : '';
  const dot = slash >= 0 ? MUSIC_FILE.indexOf('.', slash) : MUSIC_FILE.indexOf('.');
  const base = dot >= 0 ? MUSIC_FILE.slice(dir.length, dot) : MUSIC_FILE.slice(dir.length);
  const ext = dot >= 0 ? MUSIC_FILE.slice(dot) : '';
  const urls = [MUSIC_FILE];
  for (let i = 1; i < MUSIC_MAX_TRACKS; i += 1) {
    urls.push(`${dir}${base}${i}${ext}`);
  }
  return urls;
}

// ¿Existe y es reproducible? Resuelve true/false sin romper nada.
function canPlay(url) {
  return new Promise((resolve) => {
    const probe = new Audio();
    let settled = false;
    const done = (ok) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      probe.removeAttribute('src'); // libera el intento sin evento extra
      probe.load();
      resolve(ok);
    };
    const timer = setTimeout(() => done(false), 4000); // por si cuelga la red
    probe.preload = 'auto';
    probe.addEventListener('canplaythrough', () => done(true), { once: true });
    probe.addEventListener('error', () => done(false), { once: true });
    probe.src = url;
    probe.load();
  });
}

// Sondea los candidatos una sola vez y cachea la lista reproducible.
function probePlaylist() {
  if ($audio.playlist) return Promise.resolve($audio.playlist);
  if ($audio.probePromise) return $audio.probePromise;
  $audio.probePromise = (async () => {
    const playlist = [];
    for (const url of candidateUrls()) {
      if (playlist.length >= MUSIC_MAX_TRACKS) break;
      if (await canPlay(url)) playlist.push(url);
    }
    console.info(`[audio] Temas de música detectados: ${playlist.length} de ${MUSIC_MAX_TRACKS} sondeados.`);
    $audio.playlist = playlist;
    return playlist;
  })();
  return $audio.probePromise;
}

function slotForTrack(index) {
  const position = index % 2;
  let slot = $audio.slots[position];
  if (!slot) {
    slot = new Audio();
    slot.volume = 0;
    slot.loop = false;
    slot.addEventListener('timeupdate', () => onTimeUpdate(slot));
    slot.addEventListener('ended', () => onEnded(slot));
    $audio.slots[position] = slot;
  }
  return slot;
}

function playSlot(slot, volume) {
  slot.volume = volume;
  slot.play().catch(() => {
    // Si el navegador lo bloquea (sin gesto), se reintenta en la próxima
    // interacción: los sfx de click desbloquean el AudioContext y los
    // HTMLAudio parten del mismo gesto de usuario.
  });
}

// Crossfade: el slot nuevo sube desde 0 hasta el volumen configurado
// mientras el viejo baja hasta silenciarse y pausarse. Un solo fade a la vez.
function crossfade(incoming, outgoing) {
  clearInterval($audio.fadeTimer);
  $audio.activeSlot = $audio.slots.indexOf(incoming);
  const steps = Math.max(1, Math.round(MUSIC_FADE_MS / 50));
  let step = 0;
  $audio.fadeTimer = setInterval(() => {
    step += 1;
    const t = Math.min(1, step / steps);
    incoming.volume = MUSIC_VOLUME * t;
    outgoing.volume = MUSIC_VOLUME * (1 - t);
    if (t >= 1) {
      clearInterval($audio.fadeTimer);
      $audio.fadeTimer = null;
      outgoing.pause();
      outgoing.currentTime = 0;
      $audio.chainStarted = false;
    }
  }, 50);
}

// Queda poco tema: arranca el siguiente AL AZAR en el otro slot (o reinicia
// el mismo si solo hay un tema… pero entonces va con loop y no entra aquí).
function chainNext() {
  if ($audio.chainStarted) return;
  const playlist = $audio.playlist;
  if (!playlist || playlist.length < 2) return;
  $audio.chainStarted = true;
  const current = $audio.slots[$audio.activeSlot];
  const nextIndex = pickFromBag($audio.trackIndex);
  $audio.trackIndex = nextIndex;
  const incoming = slotForTrack(nextIndex);
  incoming.src = playlist[nextIndex];
  incoming.currentTime = 0;
  incoming.loop = false;
  playSlot(incoming, 0);
  crossfade(incoming, current);
}

function onTimeUpdate(slot) {
  if (slot !== $audio.slots[$audio.activeSlot] || slot.paused) return;
  if (!slot.duration || Number.isNaN(slot.duration)) return;
  const remainingMs = (slot.duration - slot.currentTime) * 1000;
  if (remainingMs <= Math.max(MUSIC_FADE_MS, 100)) chainNext();
}

// Red de seguridad si el crossfade nunca saltó (pestaña ralentizada…).
function onEnded(slot) {
  if (slot !== $audio.slots[$audio.activeSlot]) return;
  $audio.chainStarted = false;
  chainNext();
}

// Arranca (o retoma) la música; NO duplica reproduciones en marcha.
export function startMusic() {
  if (!$audio.musicOn) return;
  probePlaylist().then((playlist) => {
    if (!$audio.musicOn || playlist.length === 0) return;
    const current = $audio.slots[$audio.activeSlot];
    // Retoma la posición (p. ej., reanudar tras pausa).
    if (current && current.src && current.currentTime > 0) {
      playSlot(current, Math.max(current.volume, MUSIC_VOLUME));
      return;
    }
    // Arranque nuevo: el primer tema sale AL AZAR de la bolsa (F7.1).
    $audio.trackIndex = pickFromBag($audio.trackIndex);
    const slot = slotForTrack($audio.trackIndex);
    if (slot.currentTime > 0) {
      playSlot(slot, MUSIC_VOLUME); // resume el tema en curso
      return;
    }
    slot.src = playlist[$audio.trackIndex];
    slot.currentTime = 0;
    // Con un único tema detectado, loop natural sin crossfade.
    slot.loop = playlist.length === 1;
    $audio.activeSlot = $audio.slots.indexOf(slot);
    playSlot(slot, MUSIC_VOLUME);
  });
}

// Detiene la música SIN descartar la posición: al volver a jugar retoma
// por donde iba (p. ej. reanudar tras pausa).
export function stopMusic() {
  clearInterval($audio.fadeTimer);
  $audio.fadeTimer = null;
  for (const slot of $audio.slots) {
    if (slot && !slot.paused) slot.pause();
  }
}

// Reinicia la música a cero (p. ej. al acabar partida). La bolsa barajada
// se conserva entre partidas: el azar sigue sin repetir temas de sesión.
export function resetMusic() {
  stopMusic();
  $audio.chainStarted = false;
  for (const slot of $audio.slots) {
    if (slot) slot.currentTime = 0;
  }
}

// ── Mutes (persistentes desde storage; su estado lo decide main.js) ──
// Al activar la música NO arranca aquí: main.js decide cuándo (solo corre
// mientras el estado es 'running'). Al desactivar se para al instante.
export function setMusicEnabled(on) {
  $audio.musicOn = Boolean(on);
  if (!$audio.musicOn) stopMusic();
}

export function setSfxEnabled(on) {
  $audio.sfxOn = Boolean(on);
}

export function audioPrefs() {
  return { music: $audio.musicOn, sfx: $audio.sfxOn };
}
