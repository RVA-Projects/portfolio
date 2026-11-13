import { useEffect, useState, type RefObject } from 'react'
import { nextSpot, type Point } from '../utils/spot'

const FOLLOW_EASE = 0.22
const SPOT_SIZE = 38

/**
 * D30 — Punto lupa (CursorSpot): círculo decorativo que sigue al cursor con
 * inercia y, al pulsar, enciende un glow neón (tokens --color-spot*).
 * Queda DETRÁS del texto (z-index -1, encima del canvas y del scrim de la
 * intro): el cursor pasa por encima y el círculo crea un halo de contraste
 * bajo la prosa. Decorativo: aria-hidden, pointer-events:none, sin foco ni
 * semántica. Solo punteros finos (ratón/trackpad) y SIN prefers-reduced-motion
 * (decoración animada ⇒ oculto, igual que el canvas D23). rAF se pausa solo
 * con la pestaña oculta (el navegador no dispara rAF en background).
 */
export function useCursorSpot(ref: RefObject<HTMLDivElement | null>): boolean {
  const [enabled] = useState(() => {
    if (typeof window.matchMedia !== 'function') return false
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return fine && !reduce
  })

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (el === null) return

    const target: Point = { x: -SPOT_SIZE, y: -SPOT_SIZE }
    const pos: Point = { x: -SPOT_SIZE, y: -SPOT_SIZE }
    let raf = 0
    let visible = false

    const frame = () => {
      const next = nextSpot(pos, target, FOLLOW_EASE)
      pos.x = next.x
      pos.y = next.y
      el.style.transform = `translate3d(${pos.x - SPOT_SIZE / 2}px, ${pos.y - SPOT_SIZE / 2}px, 0)`
      raf = window.requestAnimationFrame(frame)
    }

    const show = () => {
      if (visible) return
      visible = true
      el.style.opacity = '1'
      raf = window.requestAnimationFrame(frame)
    }

    const onMove = (event: MouseEvent) => {
      target.x = event.clientX
      target.y = event.clientY
      show()
    }
    const onLeave = () => {
      /* Cursor fuera de la ventana: el punto se desvanece */
      visible = false
      el.style.opacity = '0'
      window.cancelAnimationFrame(raf)
    }
    const onPress = () => {
      el.dataset.press = 'true'
    }
    const onRelease = () => {
      el.dataset.press = 'false'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown', onPress)
    window.addEventListener('mouseup', onRelease)
    window.addEventListener('blur', onRelease)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onPress)
      window.removeEventListener('mouseup', onRelease)
      window.removeEventListener('blur', onRelease)
    }
  }, [enabled, ref])

  return enabled
}
