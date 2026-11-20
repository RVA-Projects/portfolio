// main.js — Bootstrap y orquestación (contrato C-2): conecta botones,
// overlays, idioma, teclado y el BUCLE de ticks del juego. No aplica reglas:
// la lógica vive en logic.js (R10); el guardado pasa SIEMPRE por storage.js
// (C-4). El intervalo del tick se recalcula tras cada comida (R25).

import { BASE_TICK_MS, FOOD_SPAWN_DELAY_MS } from './config.js';
import { createInitialState, startInDirection, step, togglePause, spawnFood } from './logic.js';
import {
  initAudio, sfx, startMusic, stopMusic, resetMusic,
  setMusicEnabled, setSfxEnabled,
} from './audio.js';
import { DEFAULT_LANGUAGE, LANGUAGES, getActiveLanguage, setLanguage, t } from './i18n.js';
import { listScores, saveScore, savePlayerName, loadPlayerName, saveAudioPrefs, loadAudioPrefs } from './storage.js';
import * as ui from './ui.js';

const $ = (id) => document.getElementById(id);

// Mapeo tecla → nombre de DIRS: WASD (R15) y flechas del teclado
// (enmienda F7: equivalentes, con preventDefault para que no haya scroll).
const KEY_TO_DIRECTION = {
  w: 'UP',
  a: 'LEFT',
  s: 'DOWN',
  d: 'RIGHT',
  ArrowUp: 'UP',
  ArrowLeft: 'LEFT',
  ArrowDown: 'DOWN',
  ArrowRight: 'RIGHT',
};

// ── Estado de la sesión ──
let state = createInitialState(); // partida preparada en pausa (R19)
let playerName = null;
let pendingInput = null; // dirección tecleada; se aplica en el próximo tick
let timerId = null; // id del setTimeout del bucle (null = detenido)
let audioSettings = { music: true, sfx: true }; // se restauran al arrancar
// Temporizador del spawn progresivo de comida (F7, C-2): marca de tiempo del
// próximo spawn; null = congelado (pausa / fin / partida no empezada).
let nextSpawnAt = null;

function armNextSpawn() {
  nextSpawnAt = Date.now() + FOOD_SPAWN_DELAY_MS;
}

function freezeSpawn() {
  nextSpawnAt = null;
}

// ── Bucle de ticks (R14/R25): intervalo = BASE_TICK_MS / velocidad ──
function startLoop() {
  if (timerId === null) scheduleNextTick();
}

function scheduleNextTick() {
  timerId = setTimeout(runTick, BASE_TICK_MS / state.speedMult);
}

function stopLoop() {
  clearTimeout(timerId);
  timerId = null;
}

function runTick() {
  timerId = null;
  const { state: next, events } = step(state, pendingInput);
  pendingInput = null;
  state = next;
  ui.renderGame(state);

  if (events.includes('food')) sfx('food');
  if (events.includes('gameover') || events.includes('victory')) {
    freezeSpawn(); // no más spawns: la partida terminó (C-2)
    stopMusic();
    resetMusic(); // la próxima partida empieza con el tema desde el principio
    sfx('gameover');
    onGameEnded(events);
    return;
  }

  // Spawn progresivo de comida (F7, ADR-014): el ritmo lo lleva main.js.
  // La lógica solo coloca si procede (máximo, celdas libres).
  if (nextSpawnAt !== null && Date.now() >= nextSpawnAt) {
    armNextSpawn(); // el próximo ya queda programado
    const spawn = spawnFood(state);
    if (spawn.events.includes('spawn')) {
      state = spawn.state;
      ui.renderGame(state);
    }
  }

  scheduleNextTick(); // la velocidad nueva se aplica ya al próximo intervalo
}

// ── Fin de partida (R24/R28/R33): guardar y mostrar pantalla en canvas ──
function onGameEnded(events) {
  saveScore({
    name: playerName,
    score: state.score,
    date: new Date().toISOString(),
  });
  console.info(`[game] ${events.includes('victory') ? 'Victoria' : 'Game over'} · ${playerName}: ${state.score}`);
}

// ── Teclado de partida ──
function handleDirection(dirName) {
  if (state.status === 'ready') {
    // Primer arranque (R20): la dirección de la tecla define el rumbo.
    state = startInDirection(state, dirName);
    ui.hideStartOverlay();
    ui.renderGame(state);
    armNextSpawn(); // F7: el primer spawn extra llega tras FOOD_SPAWN_DELAY_MS
    startMusic(); // el tema suena SOLO mientras la partida corre (F6)
    startLoop();
  } else if (state.status === 'running' || state.status === 'paused') {
    pendingInput = dirName; // la última tecla tecleada gana entre ticks
  }
  // En 'over'/'victory' las direcciones no hacen nada (solo Enter, R28).
}

// Pausa/reanudación (R21): espacio o botón; NUNCA inicia ni reinicia.
function togglePlayPause() {
  const now = togglePause(state);
  state = now;
  ui.renderGame(state);
  if (state.status === 'paused') {
    sfx('pause');
    freezeSpawn(); // el spawn se congela con la partida (C-2)
    stopMusic(); // la música solo suena en partida (F6)
    stopLoop();
  } else if (state.status === 'running') {
    sfx('resume');
    armNextSpawn(); // al reanudar el temporizador de spawn recomienza (C-2)
    startMusic(); // retoma la música por donde iba
    startLoop();
  }
}

// Enter tras game over/victoria (R28): partida nueva preparada en pausa.
function restartIfEnded() {
  if (state.status !== 'over' && state.status !== 'victory') return;
  state = createInitialState();
  pendingInput = null;
  freezeSpawn(); // la nueva partida empieza 'ready'; se arma al arrancar (R19)
  ui.renderGame(state);
  ui.showStartOverlay(); // R19: la siguiente dirección WASD arranca (R20)
}

// ── Botones ──
function cycleLanguage() {
  const current = getActiveLanguage();
  const next = LANGUAGES[(LANGUAGES.indexOf(current) + 1) % LANGUAGES.length];
  document.documentElement.lang = next;
  setLanguage(next);
  ui.applyLabels();
  ui.renderGame(state); // reetiqueta los mensajes dibujados en canvas
  if (ui.isScreenOverlayOpen('overlay-ranking')) {
    ui.renderRanking(listScores()); // reetiqueta fechas y vacío del ranking
  }
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}

function saveNameFromInput() {
  const input = $('player-name-input');
  const value = input.value.trim();
  playerName = value.length > 0 ? value : t('defaultPlayerName');
  savePlayerName(value); // vacío borra el nombre guardado (R32)
  ui.setPlayerName(playerName);
  input.value = '';
  ui.hideScreenOverlay('overlay-name');
}

function wireButtons() {
  // Sonido de click en TODOS los botones (toolbar y overlays): listener
  // delegado en fase de captura, para que suene antes de cualquier toggle.
  document.addEventListener('click', (event) => {
    if (event.target instanceof HTMLButtonElement) sfx('click');
  }, true);

  $('btn-name').addEventListener('click', () => {
    ui.showScreenOverlay('overlay-name');
    $('player-name-input').focus();
  });
  $('btn-save-name').addEventListener('click', saveNameFromInput);
  $('btn-close-name').addEventListener('click', () => ui.hideScreenOverlay('overlay-name'));
  $('player-name-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') saveNameFromInput();
  });
  $('btn-ranking').addEventListener('click', () => {
    ui.renderRanking(listScores());
    ui.showScreenOverlay('overlay-ranking');
  });
  $('btn-close-ranking').addEventListener('click', () => ui.hideScreenOverlay('overlay-ranking'));
  $('btn-fullscreen').addEventListener('click', toggleFullscreen);
  $('btn-language').addEventListener('click', cycleLanguage);
  $('btn-music').addEventListener('click', () => {
    audioSettings = { ...audioSettings, music: !audioSettings.music };
    saveAudioPrefs(audioSettings); // persistente entre sesiones (F6)
    setMusicEnabled(audioSettings.music); // desactivar para ya; activar solo si corre
    if (audioSettings.music && state.status === 'running') startMusic();
    ui.applyAudioLabels(audioSettings.music, audioSettings.sfx);
  });
  $('btn-sfx').addEventListener('click', () => {
    audioSettings = { ...audioSettings, sfx: !audioSettings.sfx };
    saveAudioPrefs(audioSettings);
    setSfxEnabled(audioSettings.sfx);
    ui.applyAudioLabels(audioSettings.music, audioSettings.sfx);
  });
  $('btn-playpause').addEventListener('click', togglePlayPause);
}

// ── Teclado global ──
function wireKeyboard() {
  document.addEventListener('keydown', (event) => {
    // Con el textbox del nombre con foco, ninguna tecla del juego reacciona (AC-7).
    if (event.target instanceof HTMLInputElement) return;
    if (ui.isScreenOverlayOpen('overlay-name') || ui.isScreenOverlayOpen('overlay-ranking')) return;

    if (event.key === 'Escape') {
      ui.hideScreenOverlays();
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      return;
    }
    if (event.key === 'Enter') {
      restartIfEnded();
      return;
    }
    if (event.key === ' ') {
      // El espacio nunca inicia ni reinicia (R21); solo pausa una en marcha.
      event.preventDefault(); // evita el scroll de la página
      if (state.status === 'running' || state.status === 'paused') togglePlayPause();
      return;
    }
    const dirName = KEY_TO_DIRECTION[event.key] ?? KEY_TO_DIRECTION[event.key.toLowerCase()];
    if (dirName) {
      event.preventDefault(); // las flechas no hacen scroll (enmienda F7, R15)
      handleDirection(dirName);
    }
  });
}

// ── D-pad táctil (R40, enmienda F7) ──
// Mismo camino que WASD/flechas: handleDirection. Con pointerdown no hay
// retardo de click en móvil y el click normal sigue dando el sfx (F6).
function wireDpad() {
  const DPAD = {
    'dpad-up': 'UP',
    'dpad-down': 'DOWN',
    'dpad-left': 'LEFT',
    'dpad-right': 'RIGHT',
  };
  for (const [id, dirName] of Object.entries(DPAD)) {
    $(id).addEventListener('pointerdown', (event) => {
      event.preventDefault(); // sin foco ni selección al pulsar en táctil
      handleDirection(dirName);
    });
  }
}

// ── Fullscreen escalado (enmienda F7, R34) ──
// En fullscreen TODO el contenido (#stage) se reescala con zoom para llenar
// la ventana al máximo posible, centrado y sin scrollbar (capturado el
// desbordamiento con la clase .fullscreen). Fuera de fullscreen, sin cambio.
function fitStageToViewport() {
  const stage = $('stage');
  if (!document.fullscreenElement) {
    stage.style.transform = '';
    document.body.classList.remove('fullscreen');
    return;
  }
  document.body.classList.add('fullscreen');
  // Margen del 0,5%: evita el recorte de 1 px por redondeo del navegador.
  const scale = 0.995 * Math.min(
    window.innerWidth / stage.offsetWidth,
    window.innerHeight / stage.offsetHeight,
  );
  // translate(-50%,-50%) centra el bloque en el viewport y scale crece o
  // encoge DESDE SU PROPIO centro: nada queda fuera en ninguna pantalla.
  stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function wireFullscreenScaling() {
  window.addEventListener('resize', fitStageToViewport);
  document.addEventListener('fullscreenchange', fitStageToViewport);
}

// ── Arranque (script type="module": el DOM ya está listo) ──
document.documentElement.lang = DEFAULT_LANGUAGE;
audioSettings = loadAudioPrefs(); // mutes restaurados (defaults: activados)
initAudio(audioSettings);
ui.initCanvas();
const savedName = loadPlayerName();
playerName = savedName.length > 0 ? savedName : t('defaultPlayerName');
savePlayerName(savedName); // sesión sin nombre guardado ⇒ no persistir nada
ui.setPlayerName(playerName);
ui.applyLabels();
ui.applyAudioLabels(audioSettings.music, audioSettings.sfx);
ui.renderGame(state);
ui.showStartOverlay(); // R19
wireButtons();
wireKeyboard();
wireDpad();
wireFullscreenScaling();
