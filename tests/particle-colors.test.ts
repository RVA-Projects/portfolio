import { describe, expect, it } from 'vitest'
import { lerpRgb, resolveThemeRgb, rgbaString } from '../src/canvas/particleColors'

/** D23 — colores del fondo animado: puro, sin canvas ni DOM. */
describe('particleColors (D23)', () => {
  it('oscuro = blanco puro; claro = pizarra frío del D29 (visible sobre #eef1f4)', () => {
    expect(resolveThemeRgb('dark')).toEqual({ r: 255, g: 255, b: 255 })
    expect(resolveThemeRgb('light')).toEqual({ r: 63, g: 78, b: 92 })
  })

  it('lerpRgb interpala linealmente (flotantes) y se satura fuera de [0,1]', () => {
    const from = resolveThemeRgb('dark')
    const to = resolveThemeRgb('light')
    expect(lerpRgb(from, to, 0)).toEqual(from)
    expect(lerpRgb(from, to, 1)).toEqual(to)
    expect(lerpRgb(from, to, 0.5)).toEqual({ r: 159, g: 166.5, b: 173.5 })
    expect(lerpRgb(from, to, 2)).toEqual(to)
    expect(lerpRgb(from, to, -1)).toEqual(from)
  })

  it('rgbaString formatea con alfa acotado', () => {
    expect(rgbaString({ r: 10, g: 20, b: 30 }, 0.5)).toBe('rgba(10, 20, 30, 0.5)')
    expect(rgbaString({ r: 0, g: 0, b: 0 }, 5)).toBe('rgba(0, 0, 0, 1)')
    expect(rgbaString({ r: 0, g: 0, b: 0 }, -3)).toBe('rgba(0, 0, 0, 0)')
  })
})
