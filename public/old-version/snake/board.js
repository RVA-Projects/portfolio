// board.js — Tablero como rejilla de celdas (contrato C-1).
// Puro y DOM-free (C-0). La geometría se toma de config.js por defecto
// (R13/R26: Board se instancia con esos valores desde logic.js), pero el
// constructor acepta cualquiera: cambiar una constante no rompe (AC-6).

export const DIRS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export class Board {
  constructor(cols, rows) {
    if (!Number.isInteger(cols) || cols < 1 || !Number.isInteger(rows) || rows < 1) {
      throw new Error(`[board] Dimensiones inválidas: ${cols}×${rows}`);
    }
    this.cols = cols;
    this.rows = rows;
  }

  // Devuelve todos los ({x,y}) del tablero, fila a fila.
  allCells() {
    const cells = [];
    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.cols; x += 1) {
        cells.push({ x, y });
      }
    }
    return cells;
  }

  // Bordes infinitos: la celda reaparece por el lado opuesto (R23).
  wrap(cell) {
    return { x: mod(cell.x, this.cols), y: mod(cell.y, this.rows) };
  }

  isInside(cell) {
    return cell.x >= 0 && cell.x < this.cols && cell.y >= 0 && cell.y < this.rows;
  }

  // ¿Está `cell` copada por alguna de las celdas de cuerpo indicadas?
  // La lógica pasa el cuerpo ya descontando la celda que la cola libera
  // este tick (R27); aquí solo se compara.
  occupiedBySnake(cell, bodyCells) {
    return bodyCells.some((c) => c.x === cell.x && c.y === cell.y);
  }
}

// Resto entero con wrap (soporta negativos): garantiza 0 ≤ r < m.
function mod(n, m) {
  return ((n % m) + m) % m;
}
