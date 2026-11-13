/**
 * D30 — geometría del punto lupa (CursorSpot): puro y testeable.
 * El punto "persigue" al cursor con interpolación lineal (efecto de
 * inercia suave); t fuera de [0,1] se satura.
 */
export interface Point {
  x: number
  y: number
}

export function nextSpot(from: Point, to: Point, t: number): Point {
  const k = Math.min(1, Math.max(0, t))
  return {
    x: from.x + (to.x - from.x) * k,
    y: from.y + (to.y - from.y) * k,
  }
}
