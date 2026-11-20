// ============================================================
// config.js — ÚNICO punto de ajuste manual del juego (R26, C-5).
// Cambia solo el valor de una constante; el resto del sistema se
// deriva automáticamente. Los rangos válidos se validan por tests.
// ============================================================

// ── TABLERO ──
export const BOARD_COLS = 64; // nº de celdas en horizontal
export const BOARD_ROWS = 30; // nº de celdas en vertical
export const CELL_SIZE  = 20; // px por celda → canvas = 64·20 × 30·20 = 1280×600

// ── VELOCIDAD (R25) ──
export const BASE_TICK_MS = 70; // ms por celda con multiplicador 1.0
export const SPEED_MIN  = 0.9;   // multiplicador al empezar la partida
export const SPEED_MAX  = 1.4;   // multiplicador máximo (cap)
export const SPEED_STEP = 0.02;  // incremento lineal por alimento

// ── OTROS ──
export const START_SNAKE_LENGTH = 3; // celdas iniciales de la serpiente

// ── COMIDA MÚLTIPLE (F7: ADR-014) ──
export const MAX_FOODS_ON_BOARD  = 6;   // alimentos simultáneos máximos (R16)
export const FOOD_SPAWN_DELAY_MS = 3000; // ms entre apariciones progresivas de comida

// ── VISUAL (colores hex; añadido en F3 por R26/R39) ──
export const BOARD_BG_COLOR   = '#0f172a'; // fondo del tablero
export const GRID_LINE_COLOR  = '#1e293b'; // líneas de la rejilla
export const SNAKE_HEAD_COLOR = '#22d3ee'; // cabeza (distinta del cuerpo, R39)
export const SNAKE_BODY_COLOR = '#15803d'; // cuerpo y cola
export const FOOD_COLOR       = '#f87171'; // alimento

// ── AUDIO (F6; ADR-013) ──
// Tema de fondo: coloca TU fichero en esa ruta (fallo silencioso si falta).
// Vías: .wav/.ogg/.mp3 — cambia la ruta solo aquí.
export const MUSIC_FILE   = 'assets/audio/theme.wav'; // ruta del tema de fondo
export const MUSIC_VOLUME = 0.5;                      // 0.0–1.0 volumen del tema
export const SFX_VOLUME   = 0.6;                      // 0.0–1.0 volumen de los sfx

// Música multi-tema (F7: ADR-015): se sondean por NOMBRE los ficheros
// theme.wav, theme1.wav, theme2.wav… de assets/audio (hasta MUSIC_MAX_TRACKS).
// Añade ficheros y funcionan solos; se reproducen en cadena con crossfade
// suave (MUSIC_FADE_MS) y al acabar la lista vuelve a la primera.
export const MUSIC_MAX_TRACKS = 8;   // límite superior del sondeo (súbelo si pones más temas)
export const MUSIC_FADE_MS    = 1500; // ms de crossfade entre temas (0 = corte en seco)

// Efectos generados con zzfx (vendor/zzfx.js): cada efecto es un array de
// hasta 21 parámetros — [volumen, aleatoriedad, frecuencia, attack, sustain,
// release, forma(0-5), curva, slide, deltaSlide, salto de tono, tiempo del
// salto, repetición, ruido, modulación, bitCrush, delay, sustainVol, decay,
// tremolo, filtro]. Solo llena los que quieras afinar; los demás quedan por
// defecto. El tono de las recetas está descentrado a la baja desde F7
// (sfx más graves y menos estridentes, decisión del desarrollador).
export const SFX_RECIPES = {
  click:   [1, , 392, .01, , .06, 1],                       // tic de botón (triángulo grave)
  food:    [1.4, , 220, .015, , .16, 1, , , 262, .08],      // al capturar comida (bajo)
  pause:   [1, , 330, .01, .03, .2, 1, , -150],             // al pausar (tono baja)
  resume:  [1, , 330, .01, .03, .2, 1, , 150],              // al reanudar (tono sube)
  gameover:[1.6, , 110, .02, .14, .55, 0, , -55, , , , , , , , , , , , .1], // fin (subgraves)
};
