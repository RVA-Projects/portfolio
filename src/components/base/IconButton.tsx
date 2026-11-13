import { forwardRef, type ReactNode } from 'react'
import styles from './IconButton.module.css'

interface IconButtonProps {
  ariaLabel: string
  onClick: () => void
  icon: ReactNode
  disabled?: boolean
  /** Clase extra (CSS module) para variantes visuales (p. ej. flechas flotantes). */
  className?: string
  /**
   * D24 — ancla del tooltip: 'right' (defecto) extiende hacia la izquierda
   * (botones en esquina derecha); 'left' extiende a la derecha (flechas
   * «anterior» en el borde izquierdo de los overlays).
   */
  tooltipAlign?: 'left' | 'right'
}

/**
 * Botón puramente icónico: ariaLabel OBLIGATORIO (requisito de a11y del
 * sistema). forwardRef para que las capas superpuestas (p. ej. ImageZoomOverlay,
 * Fase 3) puedan mover el foco a su botón de cierre al montarse.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { ariaLabel, onClick, icon, disabled, className, tooltipAlign = 'right' },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={className !== undefined ? `${styles.iconBtn} ${className}` : styles.iconBtn}
      aria-label={ariaLabel}
      data-tip={ariaLabel}
      data-tip-align={tooltipAlign}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  )
})
