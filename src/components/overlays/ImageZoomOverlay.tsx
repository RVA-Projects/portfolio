import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useLanguage } from '../../i18n'
import type { MediaItem } from '../../models/Project'
import { IconButton } from '../base/IconButton'
import { IconChevronLeft, IconChevronRight, IconClose, IconZoom, IconZoomOut } from '../base/Icons'
import styles from './ImageZoomOverlay.module.css'

const MIN_SCALE = 1
const MAX_SCALE = 4

interface ImageZoomOverlayProps {
  /** Solo media image/gif (lo garantiza MediaGallery/ProjectOverlay). */
  items: MediaItem[]
  /** Índice COMPARTIDO con la galería (ProjectOverlay lo posee). */
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

/**
 * Visor ampliado de imágenes (Fase 3): capa a pantalla completa renderizada
 * en el slot `aside` del Modal del proyecto (NO es un segundo Modal: queda
 * dentro del backdrop y del focus-trap existente). Zoom con botones +/-,
 * rueda y pellizco; pan por arrastre cuando el zoom excede el viewport;
 * swipe cambia de imagen a zoom 1:1. Escape (fase captura) cierra SOLO esta
 * capa y devuelve al overlay del proyecto — la segunda pulsación cierra el
 * proyecto (mismo patrón por capas del modo juego, D17).
 */
export function ImageZoomOverlay({ items, index, onIndexChange, onClose }: ImageZoomOverlayProps) {
  const { language, texts } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<{ distance: number; scale: number } | null>(null)
  const drag = useRef<{
    startX: number
    startY: number
    baseX: number
    baseY: number
    moved: boolean
  } | null>(null)
  const scaleRef = useRef(scale)
  scaleRef.current = scale

  const current = items[Math.min(index, items.length - 1)]

  /* Reset del transform al cambiar de imagen (zoom 1:1 para navegar). */
  useEffect(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [index])

  /* Foco inicial: el usuario viene de pulsar la lupa (que se desmonta). */
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  /* Escape en fase captura: consume la tecla ANTES de que llegue al Modal
     (listener en burbuja) → cierra solo esta capa; la 2ª pulsación cierra el
     overlay del proyecto. ←/→ navegan imágenes y NO deben cambiar de proyecto:
     también se consumen aquí (stopPropagation). */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault()
        event.stopPropagation()
        onIndexChange(index - 1)
      }
      if (event.key === 'ArrowRight' && index < items.length - 1) {
        event.preventDefault()
        event.stopPropagation()
        onIndexChange(index + 1)
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
    }
  }, [onClose, onIndexChange, index, items.length])

  /* Rueda del ratón: listener NATIVO no pasivo (React hace preventDefault
     poco fiable con wheel). Zoom hacia el cursor simplificado: centrado. */
  useEffect(() => {
    const el = containerRef.current
    if (el === null) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      setScale((prev) => {
        const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * (1 - event.deltaY * 0.002)))
        if (next === MIN_SCALE) setOffset({ x: 0, y: 0 })
        return next
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
    }
  }, [])

  const clampOffset = (x: number, y: number, activeScale: number): { x: number; y: number } => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect === undefined || activeScale <= MIN_SCALE) return { x: 0, y: 0 }
    const maxX = (rect.width * (activeScale - 1)) / 2
    const maxY = (rect.height * (activeScale - 1)) / 2
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    }
  }

  const zoomBy = (factor: number) => {
    setScale((prev) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * factor))
      if (next === MIN_SCALE) setOffset({ x: 0, y: 0 })
      else setOffset((prevOffset) => clampOffset(prevOffset.x, prevOffset.y, next))
      return next
    })
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    /* F1.1: los controles (flechas, zoom, X) gestionan su propio click. Si la
       capa capturara el puntero aquí, el click posterior se retargetizaría al
       contenedor y se interpretaría como «clic fuera» cerrando la capa. */
    if ((event.target as HTMLElement).closest('button, a') !== null) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    event.currentTarget.setPointerCapture(event.pointerId)
    if (pointers.current.size === 1) {
      drag.current = {
        startX: event.clientX,
        startY: event.clientY,
        baseX: offset.x,
        baseY: offset.y,
        moved: false,
      }
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinch.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), scale: scaleRef.current }
      drag.current = null
    }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    /* Pellizco (2 dedos): escala relativa a la distancia inicial. */
    if (pointers.current.size === 2 && pinch.current !== null) {
      const [a, b] = [...pointers.current.values()]
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      const next = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, pinch.current.scale * (distance / pinch.current.distance)),
      )
      setScale(next)
      if (next === MIN_SCALE) setOffset({ x: 0, y: 0 })
      return
    }

    /* Arrastre: pan con zoom activo; swipe cambia de imagen a zoom 1:1. */
    const d = drag.current
    if (d === null) return
    const dx = event.clientX - d.startX
    const dy = event.clientY - d.startY
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) d.moved = true
    if (scaleRef.current > MIN_SCALE) {
      setOffset(clampOffset(dx + d.baseX, dy + d.baseY, scaleRef.current))
    }
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size < 2) pinch.current = null
    const d = drag.current
    if (pointers.current.size === 0 && d !== null) {
      drag.current = null
      const dx = event.clientX - d.startX
      const dy = event.clientY - d.startY
      /* Swipe horizontal a zoom 1:1 ⇒ imagen anterior/siguiente. */
      if (
        scaleRef.current === MIN_SCALE &&
        d.moved &&
        Math.abs(dx) > 60 &&
        Math.abs(dx) > Math.abs(dy)
      ) {
        if (dx < 0 && index < items.length - 1) onIndexChange(index + 1)
        if (dx > 0 && index > 0) onIndexChange(index - 1)
      }
    }
  }

  const isCurrentImage = current.kind === 'image' || current.kind === 'gif'
  if (!isCurrentImage) return null

  return (
    <div
      ref={containerRef}
      className={styles.layer}
      role="presentation"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={(event) => {
        /* Clic fuera de la imagen (en el fondo de la capa) cierra la capa. */
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <img
        src={current.src}
        alt={current.alt[language]}
        className={styles.image}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
        }}
        draggable={false}
      />

      <div className={styles.toolbar}>
        <IconButton
          ariaLabel={texts.zoomOverlay.out}
          onClick={() => zoomBy(1 / 1.5)}
          disabled={scale === MIN_SCALE}
          icon={<IconZoomOut size={20} />}
        />
        <IconButton
          ariaLabel={texts.zoomOverlay.in}
          onClick={() => zoomBy(1.5)}
          disabled={scale === MAX_SCALE}
          icon={<IconZoom size={20} />}
        />
      </div>

      {index > 0 && (
        <IconButton
          ariaLabel={texts.zoomOverlay.prev}
          onClick={() => onIndexChange(index - 1)}
          icon={<IconChevronLeft size={24} />}
          className={styles.navPrev}
          tooltipAlign="left"
        />
      )}
      {index < items.length - 1 && (
        <IconButton
          ariaLabel={texts.zoomOverlay.next}
          onClick={() => onIndexChange(index + 1)}
          icon={<IconChevronRight size={24} />}
          className={styles.navNext}
        />
      )}

      <IconButton
        ref={closeRef}
        ariaLabel={texts.zoomOverlay.close}
        onClick={onClose}
        icon={<IconClose size={24} />}
        className={styles.closeBtn}
      />

      <p className={styles.counter} aria-live="polite">
        {index + 1} / {items.length}
      </p>
    </div>
  )
}
