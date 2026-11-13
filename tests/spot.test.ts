import { describe, expect, it } from 'vitest'
import { nextSpot } from '../src/utils/spot'

/** D30 — seguimiento del punto lupa: puro, sin DOM. */
describe('nextSpot (D30)', () => {
  it('interpala linealmente hacia el objetivo (inercia del punto)', () => {
    expect(nextSpot({ x: 0, y: 0 }, { x: 100, y: 50 }, 0.25)).toEqual({ x: 25, y: 12.5 })
  })

  it('t=1 aterriza exactamente en el objetivo y t=0 no mueve', () => {
    expect(nextSpot({ x: 10, y: 20 }, { x: -30, y: 80 }, 1)).toEqual({ x: -30, y: 80 })
    expect(nextSpot({ x: 10, y: 20 }, { x: -30, y: 80 }, 0)).toEqual({ x: 10, y: 20 })
  })

  it('se satura fuera de [0,1] (sin saltos con factores inválidos)', () => {
    expect(nextSpot({ x: 0, y: 0 }, { x: 10, y: -10 }, 5)).toEqual({ x: 10, y: -10 })
    expect(nextSpot({ x: 0, y: 0 }, { x: 10, y: -10 }, -2)).toEqual({ x: 0, y: 0 })
  })
})
