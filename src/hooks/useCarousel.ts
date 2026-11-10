import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react'

export interface CarouselState {
  ref: RefObject<HTMLDivElement | null>
  /** Índice 0-based de la primera tarjeta visible. */
  index: number
  count: number
  canPrev: boolean
  canNext: boolean
  scrollPrev: () => void
  scrollNext: () => void
  scrollToIndex: (index: number) => void
  onScroll: () => void
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
}

/**
 * Fase 6.2 (RF-08): lógica del carrusel sin librerías. scroll-snap CSS +
 * desplazamiento programático con step = ancho de tarjeta. Índice sincronizado
 * con rAF throttle. El swipe táctil lo da el scroll nativo del contenedor.
 */
export function useCarousel(itemCount: number): CarouselState {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  const [index, setIndex] = useState(0)

  /** Ancho real de la primera tarjeta (+gap) como step de scroll. */
  const getStep = useCallback((): number => {
    const container = ref.current
    if (container === null) return 0
    const first = container.firstElementChild as HTMLElement | null
    if (first === null) return container.clientWidth
    const gap = parseFloat(getComputedStyle(container).columnGap || '0')
    return first.getBoundingClientRect().width + gap
  }, [])

  /** Lee el índice visible tras cada scroll (rAF-throttled). */
  const onScroll = useCallback(() => {
    if (frame.current !== 0) return
    frame.current = window.requestAnimationFrame(() => {
      frame.current = 0
      const container = ref.current
      if (container === null) return
      const step = getStep()
      if (step === 0) return
      setIndex(Math.min(itemCount - 1, Math.max(0, Math.round(container.scrollLeft / step))))
    })
  }, [getStep, itemCount])

  useEffect(() => {
    return () => {
      if (frame.current !== 0) window.cancelAnimationFrame(frame.current)
    }
  }, [])

  /** Reset cuando el filtrado cambia de número de tarjetas (RF-07). */
  useEffect(() => {
    setIndex(0)
    ref.current?.scrollTo({ left: 0, behavior: 'auto' })
  }, [itemCount])

  const scrollTo = useCallback(
    (nextIndex: number) => {
      const container = ref.current
      if (container === null) return
      const step = getStep()
      if (step === 0) return
      container.scrollTo({
        left: nextIndex * step,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
    },
    [getStep],
  )

  const scrollToIndex = useCallback(
    (i: number) => {
      const clamped = Math.min(Math.max(0, i), itemCount - 1)
      scrollTo(clamped)
      setIndex(clamped)
    },
    [itemCount, scrollTo],
  )

  return {
    ref,
    index,
    count: itemCount,
    canPrev: index > 0,
    canNext: index < itemCount - 1,
    scrollPrev: () => scrollToIndex(index - 1),
    scrollNext: () => scrollToIndex(index + 1),
    scrollToIndex,
    onScroll,
    onKeyDown: (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        scrollToIndex(index - 1)
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        scrollToIndex(index + 1)
      }
    },
  }
}
