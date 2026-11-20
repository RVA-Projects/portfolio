// logic.js — Composición de las reglas del juego (contrato C-1).
// Puro y DOM-free (C-0): no conoce DOM, textos, colores ni tiempo real.
// Las funciones devuelven estados NUEVOS (no mutan el de entrada). El único
// azar del núcleo es el rng de Food (inyectable). El temporizador (ms) vive
// en main.js (C-2): aquí no existe la noción de tick en milisegundos.

import { Board, DIRS } from './board.js';
import { Snake } from './snake.js';
import { Food } from './food.js';
import {
  BOARD_COLS, BOARD_ROWS,
  SPEED_MIN, SPEED_MAX, SPEED_STEP,
  MAX_FOODS_ON_BOARD,
} from './config.js';

// ── Creación de estado ──

// Partida preparada en pausa (R19): serpiente centrada mirando a la
// derecha, alimento ya visible (R16: la partida empieza con 1 comida) y
// velocidad inicial SPEED_MIN (R25). El resto aparece progresivamente
// (spawnFood desde main.js, C-2).
export function createInitialState({ cols = BOARD_COLS, rows = BOARD_ROWS } = {}, rng = Math.random) {
  const board = new Board(cols, rows);
  const snake = new Snake(centerCell(board), DIRS.RIGHT);
  const state = {
    cols,
    rows,
    snake: snake.toSnapshot(),
    foods: [], // hasta MAX_FOODS_ON_BOARD alimentos (enmienda F7)
    score: 0,
    speedMult: SPEED_MIN,
    status: 'ready',
  };
  const food = placeFood(board, snake.bodyCells(), [], rng);
  if (food !== null) state.foods.push(food);
  return state;
}

// Primer arranque (R20): la dirección de la tecla pulsada (WASD o flecha
// enmienda F7) define el rumbo.
// La serpiente se reconstruye con la misma cabeza central y el cuerpo en
// contra de esa dirección: así cualquier dirección inicial es segura.
// En cualquier estado distinto de 'ready' no cambia nada.
export function startInDirection(state, dirName) {
  if (!state || state.status !== 'ready') return state;
  const dir = resolveDirection(dirName);
  const head = state.snake.body[0];
  const snake = new Snake(head, dir, state.snake.body.length);
  return { ...state, snake: snake.toSnapshot(), status: 'running' };
}

// ── Pausa (R21): solo entre 'running' y 'paused' ──
export function togglePause(state) {
  if (!state || (state.status !== 'running' && state.status !== 'paused')) return state;
  return { ...state, status: state.status === 'running' ? 'paused' : 'running' };
}

// ── Tick completo ──
// input: nombre de dirección (clave de DIRS) aplicado al INICIO de este
// tick, o null. Devuelve { state: nuevo, events: [] } sin mutar el original.
export function step(state, input = null, rng = Math.random) {
  // Solo corre con partida activa (contrato: avances solo en 'running').
  if (!state || state.status !== 'running') {
    return { state, events: [] };
  }

  const board = new Board(state.cols, state.rows);
  const snake = Snake.fromSnapshot(state.snake);

  // 1) Dirección: la entrada de este tick manda; si no, la pendiente previa.
  if (input) {
    snake.setDirection(resolveDirection(input));
  }

  // 2) Destino del avance, con bordes infinitos (R23).
  const nextHead = board.wrap(snake.peekNext());

  // 3) Colisión (R24/R27): solo hay choque si tras el avance coexisten dos
  //    bloques en la misma celda. La celda que la cola liberará EN este tick
  //    cuenta libre (R27); si este tick la serpiente come O ya estaba
  //    creciendo, la cola no se libera.
  const eatsIndex = state.foods.findIndex((f) => f.x === nextHead.x && f.y === nextHead.y);
  const eats = eatsIndex !== -1;
  const bodyNow = snake.bodyCells();
  const tailWillFree = snake.pendingGrow === 0 && !eats;
  const occupied = tailWillFree ? bodyNow.slice(0, -1) : bodyNow;
  if (board.occupiedBySnake(nextHead, occupied)) {
    // Muerte: el estado se congela en 'over' y la serpiente no avanza.
    return { state: { ...state, status: 'over' }, events: ['gameover'] };
  }

  // 4) Avance efectivo sobre la copia de trabajo: al comer, la cola no se
  //    mueve este tick (crece una celda de inmediato, R16).
  if (eats) snake.grow(1);
  snake.step(nextHead);

  const events = [];
  let score = state.score;
  let speedMult = state.speedMult;
  let status = state.status;
  let foods = state.foods;

  if (eats) {
    events.push('food');
    score += 1; // R18: +1 por alimento
    // R25: progresión lineal. Recalcular a partir del score es exacto y
    // determinista: SPEED_MIN + SPEED_STEP·n (cap SPEED_MAX).
    speedMult = Math.min(SPEED_MAX, SPEED_MIN + SPEED_STEP * score);
    // Enmienda F7: se retira SOLO el alimento comido; la reposición no es
    // inmediata — la añade spawnFood con su ritmo (main.js, C-2).
    foods = state.foods.filter((_, i) => i !== eatsIndex);
    // R22: victoria cuando el cuerpo ocupa TODAS las celdas del tablero.
    if (snake.bodyCells().length >= state.cols * state.rows) {
      status = 'victory';
      events.push('victory');
    }
  }

  const next = {
    ...state,
    snake: snake.toSnapshot(),
    foods,
    score,
    speedMult,
    status,
  };
  return { state: next, events };
}

// ── Spawn progresivo de comida (enmienda F7, ADR-014; ritmo en main.js) ──
// Añade UN alimento si la partida corre y no se alcanzó el máximo; en
// cualquier otro caso es un no-op idéntico (sin eventos).
export function spawnFood(state, rng = Math.random) {
  if (!state || state.status !== 'running') return { state, events: [] };
  if (state.foods.length >= MAX_FOODS_ON_BOARD) return { state, events: [] };
  const board = new Board(state.cols, state.rows);
  // Celdas bloqueadas: cuerpo de la serpiente + alimentos ya presentes.
  const bodyCells = Snake.fromSnapshot(state.snake).bodyCells();
  const food = placeFood(board, bodyCells, state.foods, rng);
  if (food === null) return { state, events: [] }; // sin celda libre: no-op
  return { state: { ...state, foods: [...state.foods, food] }, events: ['spawn'] };
}

// ── Internos ──

function centerCell(board) {
  return { x: Math.floor((board.cols - 1) / 2), y: Math.floor((board.rows - 1) / 2) };
}

function resolveDirection(dirName) {
  if (!(dirName in DIRS)) {
    throw new Error(`[logic] Dirección inválida: "${dirName}". Solo se aceptan las claves de DIRS`);
  }
  return DIRS[dirName];
}

// Coloca alimento en una celda libre del tablero; null si no queda ninguna.
// bodyCells: cuerpo vigente; existingFoods: alimentos ya en tablero (F7) —
// la comida nueva no puede caer ni sobre la serpiente ni sobre otra comida.
function placeFood(board, bodyCells, existingFoods = [], rng) {
  const occupied = new Set(
    [...bodyCells, ...existingFoods].map((cell) => `${cell.x},${cell.y}`),
  );
  const freeCells = board.allCells().filter((cell) => !occupied.has(`${cell.x},${cell.y}`));
  return new Food().place(freeCells, rng);
}
