import { useRef } from 'react'
import { useCursorSpot } from '../../hooks/useCursorSpot'
import styles from './CursorSpot.module.css'

/**
 * D30 — Punto lupa: círculo translúcido que sigue al cursor y se ilumina con
 * un glow neón al pulsar. Va DETRÁS del texto (z-index -1): el cursor queda
 * encima y el halo crea contraste bajo la prosa (petición del propietario).
 * Decorativo puro: aria-hidden + pointer-events:none; oculto en táctil y con
 * prefers-reduced-motion. La lógica vive en `useCursorSpot`.
 */
export function CursorSpot() {
  const ref = useRef<HTMLDivElement>(null)
  const enabled = useCursorSpot(ref)

  return <div ref={ref} className={enabled ? styles.spot : styles.spotOff} aria-hidden="true" />
}
