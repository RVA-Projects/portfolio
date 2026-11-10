import type { ReactNode } from 'react'
import styles from './IconButton.module.css'

interface IconButtonProps {
  ariaLabel: string
  onClick: () => void
  icon: ReactNode
  disabled?: boolean
}

/** Botón puramente icónico: ariaLabel OBLIGATORIO (requisito de a11y del sistema). */
export function IconButton({ ariaLabel, onClick, icon, disabled }: IconButtonProps) {
  return (
    <button
      type="button"
      className={styles.iconBtn}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  )
}
