import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { BackgroundCanvas } from '../src/components/layout/BackgroundCanvas'

/**
 * D23 — hook useParticleGrid / BackgroundCanvas. jsdom no implementa
 * Canvas 2D: se stubbea getContext; rAF se controla manualmente para
 * avanzar frames deterministas. matchMedia se stubbea con soporte de
 * 'change' (prefers-reduced-motion).
 */

interface CtxStub extends Record<string, unknown> {
  clearRect: ReturnType<typeof vi.fn>
  fillRect: ReturnType<typeof vi.fn>
  beginPath: ReturnType<typeof vi.fn>
  fill: ReturnType<typeof vi.fn>
  moveTo: ReturnType<typeof vi.fn>
  lineTo: ReturnType<typeof vi.fn>
  stroke: ReturnType<typeof vi.fn>
  arc: ReturnType<typeof vi.fn>
  setTransform: ReturnType<typeof vi.fn>
  fillStyle: string
  strokeStyle: string
  lineWidth: number
}

function makeCtxStub(): CtxStub {
  return {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    fill: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    setTransform: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
  }
}

let ctx: CtxStub
let rafId: number
const rafQueue = new Map<number, FrameRequestCallback>()

interface MqStub {
  query: string
  matches: boolean
  listeners: Set<() => void>
}
const mediaQueries: MqStub[] = []

function mockMatchMedia(reduced: boolean): void {
  mediaQueries.length = 0
  vi.spyOn(window, 'matchMedia').mockImplementation((query: string): MediaQueryList => {
    /* El objeto devuelto DEBE ser el mismo que recibe los listeners:
       si el hook lee `matches` de una copia, nunca ve el cambio. */
    const stub = {
      query,
      matches: query.includes('prefers-reduced-motion') ? reduced : false,
      listeners: new Set<() => void>(),
      media: query,
      onchange: null,
      dispatchEvent: () => false,
    }
    const withListeners = stub as typeof stub & {
      addEventListener: (type: string, cb: () => void) => void
      removeEventListener: (type: string, cb: () => void) => void
      addListener: (cb: () => void) => void
      removeListener: (cb: () => void) => void
    }
    withListeners.addEventListener = (_type, cb) => {
      stub.listeners.add(cb)
    }
    withListeners.removeEventListener = (_type, cb) => {
      stub.listeners.delete(cb)
    }
    withListeners.addListener = (cb) => {
      stub.listeners.add(cb)
    }
    withListeners.removeListener = (cb) => {
      stub.listeners.delete(cb)
    }
    mediaQueries.push(stub)
    return withListeners as unknown as MediaQueryList
  })
}

/** Alterna prefers-reduced-motion y notifica a los listeners registrados. */
function setReduced(value: boolean): void {
  for (const mq of mediaQueries) {
    if (!mq.query.includes('prefers-reduced-motion')) continue
    mq.matches = value
    for (const cb of [...mq.listeners]) cb()
  }
}

/** Avanza N frames de 16ms drenando la cola de rAF (el tick se re-engancha). */
function stepFrames(count: number): void {
  let now = performance.now()
  for (let i = 0; i < count; i += 1) {
    now += 16
    const callbacks = [...rafQueue.values()]
    rafQueue.clear()
    for (const cb of callbacks) cb(now)
  }
}

function pointerEvent(type: string, x: number, y: number): Event {
  const event = new Event(type) as Event & {
    clientX: number
    clientY: number
    pointerType: string
  }
  event.clientX = x
  event.clientY = y
  event.pointerType = 'mouse'
  return event
}

beforeEach(() => {
  ctx = makeCtxStub()
  rafId = 0
  rafQueue.clear()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D,
  )
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    rafId += 1
    rafQueue.set(rafId, cb)
    return rafId
  })
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    rafQueue.delete(id)
  })
  /* El hook lee clientWidth/Height para construir el grid (jsdom = 0). */
  Object.defineProperty(HTMLCanvasElement.prototype, 'clientWidth', {
    value: 1024,
    configurable: true,
  })
  Object.defineProperty(HTMLCanvasElement.prototype, 'clientHeight', {
    value: 768,
    configurable: true,
  })
  mockMatchMedia(false)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  /* Elimina el override del prototype: recupera el getter heredado. */
  delete (HTMLCanvasElement.prototype as { clientWidth?: unknown }).clientWidth
  delete (HTMLCanvasElement.prototype as { clientHeight?: unknown }).clientHeight
})

describe('BackgroundCanvas / useParticleGrid (D23)', () => {
  it('sin Canvas 2D (getContext null) no crashea y no añade listeners', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const addSpy = vi.spyOn(window, 'addEventListener')
    const { container } = render(<BackgroundCanvas theme="dark" />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
    expect(addSpy).not.toHaveBeenCalledWith('pointermove', expect.any(Function), expect.anything())
  })

  it('arranca el loop, dibuja puntos del grid y limpia TODO al desmontar', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { container, unmount } = render(<BackgroundCanvas theme="dark" />)
    const canvas = container.querySelector('canvas')

    expect(canvas).toHaveAttribute('aria-hidden', 'true')
    expect(rafQueue.size).toBe(1) // el tick está vivo

    stepFrames(3)
    expect(ctx.arc).toHaveBeenCalled() // puntos redondos (D31)
    expect(ctx.setTransform).toHaveBeenCalled() // DPR aplicado

    unmount()
    expect(rafQueue.size).toBe(0) // rAF cancelado

    /* Todos los listeners añadidos se retiran en el unmount */
    const added = addSpy.mock.calls.map((call) => call[0])
    const removed = new Set(removeSpy.mock.calls.map((call) => call[0]))
    for (const type of added) {
      expect(removed, `sin cleanup de ${type}`).toContain(type)
    }
  })

  it('el cursor atrae (puntero fino) y el clic colapsa con eco de anillo', () => {
    render(<BackgroundCanvas theme="dark" />)
    stepFrames(2)

    window.dispatchEvent(pointerEvent('pointermove', 500, 400))
    stepFrames(10)
    const arcCallsBefore = ctx.arc.mock.calls.length
    expect(arcCallsBefore).toBeGreaterThan(0)

    window.dispatchEvent(pointerEvent('pointerdown', 500, 400))
    stepFrames(2)
    /* Eco del clic dibujado (arc del anillo) + la simulación sigue activa */
    expect(ctx.arc).toHaveBeenCalledWith(500, 400, expect.any(Number), 0, Math.PI * 2)
    expect(ctx.arc.mock.calls.length).toBeGreaterThan(arcCallsBefore)
  })

  it('prefers-reduced-motion: grid estático sin loop; al desactivarlo arranca', () => {
    mockMatchMedia(true)
    const { container } = render(<BackgroundCanvas theme="dark" />)
    const canvas = container.querySelector('canvas')
    expect(canvas).not.toBeNull()
    expect(rafQueue.size).toBe(0) // sin rAF
    expect(ctx.arc).toHaveBeenCalled() // grid estático dibujado una vez (puntos redondos)

    stepFrames(2)
    expect(rafQueue.size).toBe(0) // sigue sin animar

    setReduced(false)
    expect(rafQueue.size).toBe(1) // arranca el loop

    setReduced(true)
    expect(rafQueue.size).toBe(0) // vuelve al estático
  })

  it('visibilitychange pausa al ocultar y reanuda al volver', () => {
    render(<BackgroundCanvas theme="dark" />)
    expect(rafQueue.size).toBe(1)

    Object.defineProperty(document, 'hidden', { value: true, configurable: true })
    document.dispatchEvent(new Event('visibilitychange'))
    expect(rafQueue.size).toBe(0)

    Object.defineProperty(document, 'hidden', { value: false, configurable: true })
    document.dispatchEvent(new Event('visibilitychange'))
    expect(rafQueue.size).toBe(1)
  })

  it('el tema claro cambia el color objetivo (blanco → pizarra D29)', () => {
    const { rerender } = render(<BackgroundCanvas theme="dark" />)
    stepFrames(1)
    expect(ctx.fillStyle).toContain('rgba(255, 255, 255,')

    rerender(<BackgroundCanvas theme="light" />)
    stepFrames(120) // ~2s: la interpolación exponencial converge del todo
    expect(ctx.fillStyle).toContain('rgba(63, 78, 92,')
  })
})
