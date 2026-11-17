/**
 * Ronda 6 F3 — lógica PURA del CAPTCHA puzzle (sin canvas, sin React):
 * RNG determinista por semilla, generación del desafío y comprobación de
 * tolerancia. El dibujo (Canvas 2D) vive en el componente; aquí solo
 * geometría y decisión, para poder testearlo sin jsdom-canvas.
 */

/** PRNG mulberry32: misma semilla ⇒ misma secuencia (determinista). */
export function createRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Geometría lógica del tablero (px CSS; el canvas escala por devicePixelRatio). */
export const CAPTCHA_WIDTH = 320
export const CAPTCHA_HEIGHT = 180
export const CAPTCHA_PIECE = 56
/** Radio de la pestaña/muesca circular de la pieza. */
export const CAPTCHA_TAB = 12
/** Tolerancia de encaje: ±px lógicos entre el borde de la pieza y el hueco. */
export const CAPTCHA_TOLERANCE = 10
/** El hueco nunca nace en los extremos: siempre hay recorrido a ambos lados. */
const TARGET_MIN_FRACTION = 0.15
const TARGET_MAX_FRACTION = 0.85

export interface CaptchaChallenge {
  /** Semilla del patrón: fondo y recorte de pieza salen de LA MISMA secuencia. */
  seed: number
  /** Posición objetivo del borde izquierdo de la pieza (px lógicos). */
  targetLeft: number
}

/** Genera un desafío: hueco en x aleatoria con margen en los extremos. */
export function generateChallenge(seed: number): CaptchaChallenge {
  const rng = createRng(seed)
  const travel = CAPTCHA_WIDTH - CAPTCHA_PIECE
  const min = TARGET_MIN_FRACTION * travel
  const max = TARGET_MAX_FRACTION * travel
  return { seed, targetLeft: min + rng() * (max - min) }
}

/** Nuevo intento ⇒ nueva semilla (posiciones distintas entre intentos). */
export function nextSeed(): number {
  return Math.floor(Math.random() * 2 ** 31)
}

/** Posición de la pieza (borde izquierdo, px) a partir del slider 0–100. */
export function pieceLeftFromSlider(value: number, width = CAPTCHA_WIDTH): number {
  const travel = width - CAPTCHA_PIECE
  const clamped = Math.min(100, Math.max(0, value))
  return (clamped / 100) * travel
}

/** ¿Encaja? |posición de la pieza − hueco| ≤ tolerancia. */
export function isSolved(pieceLeft: number, targetLeft: number): boolean {
  return Math.abs(pieceLeft - targetLeft) <= CAPTCHA_TOLERANCE
}
