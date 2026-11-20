// snake.js — Serpiente como lista de celdas (contrato C-1).
// Puro y DOM-free (C-0). NO conoce el tablero (regla de dependencias:
// `snake → {config}`): la resolución del wrap la hace logic.js con Board,
// y Snake.step(nextHead) avanza exactamente a la celda que recibe.
// Direcciones como vectores {x, y}; la validación de nombres vive en
// logic.js contra DIRS (board.js).

import { START_SNAKE_LENGTH } from './config.js';

export class Snake {
  /**
   * Cuerpo reconstruido detrás de la cabeza: celda[i] = cabeza - dir·i.
   * head = startCell; startCell - dir; startCell - 2·dir; …
   */
  constructor(startCell, dir, length = START_SNAKE_LENGTH) {
    const body = [];
    for (let i = 0; i < length; i += 1) {
      body.push({ x: startCell.x - dir.x * i, y: startCell.y - dir.y * i });
    }
    this.body = body; // índice 0 = cabeza
    this.dir = { ...dir }; // dirección vigente
    this.pendingDir = undefined; // dir para el siguiente tick, si hubo giro
    this.pendingGrow = 0; // celdas que la cola conserva en los próximos ticks
  }

  headCell() {
    return { ...this.body[0] };
  }

  bodyCells() {
    return this.body.map((cell) => ({ ...cell }));
  }

  // Ignora la inversión de 180° respecto a la dir vigente (no media vuelta
  // sobre su propio cuerpo). Si la entrada no es un vector válido, se ignora.
  setDirection(dirVec) {
    const vector = dirVec;
    if (!vector || Number.isInteger(vector.x) === false || Number.isInteger(vector.y) === false) {
      console.error('[snake] Dirección inválida ignorada.');
      return;
    }
    if (vector.x === -this.dir.x && vector.y === -this.dir.y) return;
    this.pendingDir = { ...vector };
  }

  // Celda destino del próximo avance SIN aplicarla (ni wrap ni colisión):
  // cabeza + dir pendiente, o la vigente si no hay giro encolado.
  peekNext() {
    const dir = this.pendingDir ?? this.dir;
    return { x: this.body[0].x + dir.x, y: this.body[0].y + dir.y };
  }

  // Avanza EXACTAMENTE a nextHead (la lógica ya le aplicó wrap). Si hay
  // crecimiento encolado, la cola no se recorta este tick: freedCell = null.
  step(nextHead) {
    this.dir = { ...(this.pendingDir ?? this.dir) };
    this.pendingDir = undefined;
    this.body.unshift({ ...nextHead });
    let freedCell = null;
    if (this.pendingGrow > 0) {
      this.pendingGrow -= 1; // crece este tick: cola intacta
    } else {
      freedCell = this.body.pop(); // la cola libera su celda (R27)
    }
    return { head: this.headCell(), freedCell };
  }

  // Encola el crecimiento de los próximos ticks (R16: 1 por alimento).
  grow(n = 1) {
    this.pendingGrow += n;
  }

  // GameState guarda una copia PLANA y serializable de la serpiente.
  toSnapshot() {
    return { body: this.bodyCells(), dir: { ...this.dir }, pendingGrow: this.pendingGrow };
  }

  // Reconstruye una serpiente a partir de un snapshot del GameState.
  static fromSnapshot(snapshot) {
    const snake = Object.create(Snake.prototype);
    snake.body = snapshot.body.map((cell) => ({ ...cell }));
    snake.dir = { ...snapshot.dir };
    snake.pendingDir = undefined;
    snake.pendingGrow = snapshot.pendingGrow;
    return snake;
  }
}
