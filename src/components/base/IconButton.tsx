import { forwardRef, type ReactNode } from 'react'
import styles from './IconButton.module.css'

interface IconButtonProps {
  ariaLabel: string
  onClick: () => void
  icon: ReactNode
  disabled?: boolean
  /** Clase extra (CSS module) para variantes visuales (p. ej. flechas flotantes). */
  className?: string
}

/**
 * Botón puramente icónico: ariaLabel OBLIGATORIO (requisito de a11y del
 * sistema). forwardRef para que las capas superpuestas (p. ej. ImageZoomOverlay,
 * Fase 3) puedan mover el foco a su botón de cierre al montarse.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { ariaLabel, onClick, icon, disabled, className },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={className !== undefined ? `${styles.iconBtn} ${className}` : styles.iconBtn}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  )
})
