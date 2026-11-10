import type { ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps {
  label: string
  variant?: ButtonVariant
  onClick?: () => void
  icon?: ReactNode
  ariaLabel?: string
  disabled?: boolean
}

/**
 * Botón base del sistema visual. `primary` (acento rojo) reservado a las
 * acciones protagonistas; consecuencia del budget de acento del design system.
 * Todo target debe cumplir ≥44px de zona táctil (RNF-01).
 */
export function Button({
  label,
  variant = 'secondary',
  onClick,
  icon,
  ariaLabel,
  disabled,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn--${variant}`}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
