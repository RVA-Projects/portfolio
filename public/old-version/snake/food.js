// food.js — Colocación del alimento (contrato C-1, R16).
// Puro y DOM-free (C-0). Sin estado: la responsabilidad es elegir al azar
// una celda entre las libres que la lógica le pasa. `rng` es inyectable
// para pruebas deterministas; Math.random en producción.

export class Food {
  /**
   * freeCells: celdas del tablero libres y sin serpiente.
   * Devuelve Cell | null: null solo si NO queda ninguna libre (R22 → victoria).
   */
  place(freeCells, rng = Math.random) {
    if (!Array.isArray(freeCells) || freeCells.length === 0) return null;
    const index = Math.floor(rng() * freeCells.length);
    return { ...freeCells[index] };
  }
}
