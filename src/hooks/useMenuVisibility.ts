import { useLayoutEffect, useState } from 'react'

/**
 * RF-04: el menú no permanece fijo. Devuelve `visible`:
 * cerca del inicio o deslizando hacia arriba ⇒ visible;
 * deslizando hacia abajo pasado el umbral ⇒ se oculta.
 */
export function useMenuVisibility(threshold = 320): boolean {
  const [visible, setVisible] = useState(true)

  useLayoutEffect(() => {
    let previousScrollY = window.scrollY
    let frame = 0

    const onScroll = () => {
      if (frame !== 0) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const current = window.scrollY
        const goingDown = current > previousScrollY
        setVisible(current < threshold || !goingDown)
        previousScrollY = current
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [threshold])

  return visible
}
