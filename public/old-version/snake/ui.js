// ui.js — Capa de presentación (contrato C-2): dibuja estados y gestiona
// overlays/botones; NO calcula reglas del juego ni toca el backend de
// almacenamiento (recibe datos listos de main.js).
// Los textos provienen SIEMPRE de i18n (R31); la geometría y los colores
// del juego derivan de config.js (R26): aquí no hay px ni hex del canvas.

import {
  BOARD_COLS, BOARD_ROWS, CELL_SIZE,
  BOARD_BG_COLOR, GRID_LINE_COLOR,
  SNAKE_HEAD_COLOR, SNAKE_BODY_COLOR, FOOD_COLOR,
} from './config.js';
import { t, getActiveLanguage } from './i18n.js';
import { formatDate } from './utils.js';

const $ = (id) => document.getElementById(id);

// ── Canvas (deriva todo de config.js) ──
export function initCanvas() {
  const canvas = $('game-canvas');
  canvas.width = BOARD_COLS * CELL_SIZE;
  canvas.height = BOARD_ROWS * CELL_SIZE;
}

// Dibuja el fondo del tablero (fondo + rejilla) a partir de config.js.
function drawBackdrop(ctx, canvas) {
  ctx.fillStyle = BOARD_BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = GRID_LINE_COLOR;
  ctx.beginPath();
  for (let gx = CELL_SIZE; gx < canvas.width; gx += CELL_SIZE) {
    ctx.moveTo(gx + 0.5, 0);
    ctx.lineTo(gx + 0.5, canvas.height);
  }
  for (let gy = CELL_SIZE; gy < canvas.height; gy += CELL_SIZE) {
    ctx.moveTo(0, gy + 0.5);
    ctx.lineTo(canvas.width, gy + 0.5);
  }
  ctx.stroke();
}

// Render completo del juego (C-2): lee el GameState serializable y pinta.
// No calcula reglas. Pantallas de fin dibujadas en el propio canvas (R28).
export function renderGame(state) {
  const canvas = $('game-canvas');
  const ctx = canvas.getContext('2d');
  drawBackdrop(ctx, canvas);

  // Comidas (enmienda F7: hasta MAX_FOODS_ON_BOARD simultáneas).
  ctx.fillStyle = FOOD_COLOR;
  for (const food of state.foods) {
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  // Cuerpo (R39: la cabeza con color distintivo).
  ctx.fillStyle = SNAKE_BODY_COLOR;
  for (let i = 1; i < state.snake.body.length; i += 1) {
    drawCell(ctx, state.snake.body[i]);
  }
  ctx.fillStyle = SNAKE_HEAD_COLOR;
  drawCell(ctx, state.snake.body[0]);

  if (state.status === 'over') {
    drawCanvasMessage(ctx, canvas, t('overlayGameOver'), t('overlayEnterToPlay'));
  } else if (state.status === 'victory') {
    drawCanvasMessage(ctx, canvas, t('overlayVictory'), t('overlayEnterToPlay'));
  } else if (state.status === 'paused') {
    // Aviso de pausa sobre la última imagen del juego (R21: la partida
    // queda congelada pero visible). Difiere del game over: velo ligero y
    // texto neutro, sin la carga roja de fin de partida.
    drawCanvasMessage(ctx, canvas, t('overlayPause'), '', {
      titleSize: 40,
      veil: 'rgba(2, 6, 23, 0.45)',
      titleColor: '#e2e8f0',
    });
  }
}

function drawCell(ctx, cell) {
  ctx.fillRect(cell.x * CELL_SIZE + 1, cell.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
}

function drawCanvasMessage(ctx, canvas, title, subtitle, { titleSize = 48, titleColor = '#f87171', veil = 'rgba(2, 6, 23, 0.65)' } = {}) {
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.fillStyle = titleColor;
  ctx.font = `700 ${titleSize}px system-ui, sans-serif`;
  ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 8);
  if (subtitle) {
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 34);
  }
}

// ── Etiquetas i18n (R31: reetiquetado total en caliente) ──
export function applyLabels() {
  $('game-title').textContent = t('title');
  $('player-name-label').textContent = t('playerName');
  $('btn-name').textContent = t('btnName');
  $('btn-ranking').textContent = t('btnRanking');
  $('btn-fullscreen').textContent = t('btnFullscreen');
  $('btn-language').textContent = t('btnLanguage');
  $('btn-playpause').textContent = t('btnPause');
  applyAudioLabels($audioLabels.music, $audioLabels.sfx);
  $('overlay-start-text').textContent = t('overlayStart');
  $('dpad-up').setAttribute('aria-label', t('dpadUp'));
  $('dpad-down').setAttribute('aria-label', t('dpadDown'));
  $('dpad-left').setAttribute('aria-label', t('dpadLeft'));
  $('dpad-right').setAttribute('aria-label', t('dpadRight'));
  $('player-name-input-label').textContent = t('playerName');
  $('player-name-input').placeholder = t('nameInputPlaceholder');
  $('btn-save-name').textContent = t('btnSaveName');
  $('btn-close-name').textContent = t('btnCloseOverlay');
  $('rank-title').textContent = t('rankTitle');
  $('rank-empty').textContent = t('rankEmpty');
  $('btn-close-ranking').textContent = t('btnCloseOverlay');
}

// ── Botones de audio (F6): etiqueta = acción + estado actual ──
const $audioLabels = { music: true, sfx: true };

export function applyAudioLabels(musicOn, sfxOn) {
  if (typeof musicOn === 'boolean') $audioLabels.music = musicOn;
  if (typeof sfxOn === 'boolean') $audioLabels.sfx = sfxOn;
  $('btn-music').textContent = `${t('btnMusic')}: ${$audioLabels.music ? t('audioOn') : t('audioOff')}`;
  $('btn-sfx').textContent = `${t('btnSfx')}: ${$audioLabels.sfx ? t('audioOn') : t('audioOff')}`;
}

// ── Nombre del jugador (R29/R32) ──
export function setPlayerName(name) {
  $('player-name').textContent = name;
}

// ── Overlays de pantalla (R30/R35): solo uno visible a la vez ──
const SCREEN_OVERLAYS = ['overlay-name', 'overlay-ranking'];

function setHidden(id, hidden) {
  $(id).classList.toggle('hidden', hidden);
}

export function showScreenOverlay(id) {
  if (!SCREEN_OVERLAYS.includes(id)) {
    console.error(`[ui] Overlay desconocido: ${id}`);
    return;
  }
  for (const other of SCREEN_OVERLAYS) setHidden(other, other !== id);
}

export function hideScreenOverlay(id) {
  setHidden(id, true);
}

export function hideScreenOverlays() {
  for (const id of SCREEN_OVERLAYS) setHidden(id, true);
}

export function isScreenOverlayOpen(id) {
  return SCREEN_OVERLAYS.includes(id) && !$(id).classList.contains('hidden');
}

// ── Overlay inicial sobre el canvas (R19; se gestiona desde F4) ──
export function showStartOverlay() {
  $('overlay-start').classList.remove('hidden');
}

export function hideStartOverlay() {
  $('overlay-start').classList.add('hidden');
}

// ── Ranking (R30/R33): render; los datos llegan de main.js, no de storage ──
export function renderRanking(entries) {
  const empty = $('rank-empty');
  const list = $('ranking-list');
  empty.classList.toggle('hidden', entries.length > 0);
  list.replaceChildren();
  for (const entry of entries) {
    const li = document.createElement('li');
    li.textContent = `${entry.name} · ${entry.score} · ${formatDate(entry.date, getActiveLanguage())}`;
    list.appendChild(li);
  }
}
