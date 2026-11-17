import { describe, expect, it } from 'vitest'
import {
  CAPTCHA_PIECE,
  CAPTCHA_TOLERANCE,
  CAPTCHA_WIDTH,
  createRng,
  generateChallenge,
  isSolved,
  nextSeed,
  pieceLeftFromSlider,
} from '../src/utils/captcha'

/**
 * Ronda 6 F3 — lógica pura del CAPTCHA puzzle: RNG determinista, desafíos
 * con margen en extremos, mapeo slider→posición y tolerancia de encaje.
 */
describe('utils/captcha (ronda 6 F3)', () => {
  it('createRng es determinista: misma semilla ⇒ misma secuencia', () => {
    const a = createRng(42)
    const b = createRng(42)
    const seqA = [a(), a(), a(), a()]
    const seqB = [b(), b(), b(), b()]
    expect(seqA).toEqual(seqB)
    expect(seqA.every((v) => v >= 0 && v < 1)).toBe(true)
  })

  it('semillas distintas ⇒ secuencias (casi con seguridad) distintas', () => {
    const a = createRng(1)
    const b = createRng(2)
    expect([a(), a(), a()]).not.toEqual([b(), b(), b()])
  })

  it('generateChallenge coloca el hueco dentro del tablero con margen', () => {
    for (const seed of [0, 1, 42, 123456, 987654321]) {
      const challenge = generateChallenge(seed)
      expect(challenge.seed).toBe(seed)
      const travel = CAPTCHA_WIDTH - CAPTCHA_PIECE
      expect(challenge.targetLeft).toBeGreaterThanOrEqual(0.15 * travel - 0.001)
      expect(challenge.targetLeft).toBeLessThanOrEqual(0.85 * travel + 0.001)
    }
  })

  it('desafíos de semillas distintas difieren en posición (no todos iguales)', () => {
    const positions = new Set(
      Array.from({ length: 50 }, (_, i) => generateChallenge(i * 7919).targetLeft.toFixed(4)),
    )
    expect(positions.size).toBeGreaterThan(45)
  })

  it('pieceLeftFromSlider mapea 0–100 al recorrido completo', () => {
    expect(pieceLeftFromSlider(0)).toBe(0)
    expect(pieceLeftFromSlider(100)).toBe(CAPTCHA_WIDTH - CAPTCHA_PIECE)
    expect(pieceLeftFromSlider(50)).toBe((CAPTCHA_WIDTH - CAPTCHA_PIECE) / 2)
    /* valores fuera de rango: clampeados */
    expect(pieceLeftFromSlider(-5)).toBe(0)
    expect(pieceLeftFromSlider(150)).toBe(CAPTCHA_WIDTH - CAPTCHA_PIECE)
  })

  it('isSolved respeta la tolerancia (±CAPTCHA_TOLERANCE)', () => {
    const target = 120
    expect(isSolved(target, target)).toBe(true)
    expect(isSolved(target - CAPTCHA_TOLERANCE, target)).toBe(true)
    expect(isSolved(target + CAPTCHA_TOLERANCE, target)).toBe(true)
    expect(isSolved(target - CAPTCHA_TOLERANCE - 1, target)).toBe(false)
    expect(isSolved(target + CAPTCHA_TOLERANCE + 1, target)).toBe(false)
  })

  it('nextSeed devuelve enteros no negativos y variados', () => {
    const seeds = new Set(Array.from({ length: 20 }, () => nextSeed()))
    expect(seeds.size).toBeGreaterThan(15)
    for (const seed of seeds) {
      expect(seed).toBeGreaterThanOrEqual(0)
      expect(Number.isInteger(seed)).toBe(true)
    }
  })

  it('la geometría cabe: pieza + pestaña dentro del tablero', () => {
    expect(CAPTCHA_PIECE + CAPTCHA_TOLERANCE).toBeLessThan(CAPTCHA_WIDTH)
  })
})
