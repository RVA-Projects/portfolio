import type { ReactNode } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps {
  label: string
  variant?: ButtonVariant
  onClick?: () => void
  /** Si se define, renderiza un <a>; enlaces de contacto, CV, etc. */
  href?: string
  external?: boolean
  /** Solo con `href`: añade el atributo download (documentos del visor). */
  download?: boolean
  icon?: ReactNode
  ariaLabel?: string
  disabled?: boolean
}

/**
 * Botón base del sistema visual. `primary` (acento rojo) reservado a las
 * acciones protagonistas; consecuencia del budget de acento del design system.
 * Todo target cumple ≥44px de zona táctil (RNF-01).
 */
export function Button({
  label,
  variant = 'secondary',
  onClick,
  href,
  external,
  download,
  icon,
  ariaLabel,
  disabled,
}: ButtonProps) {
  const className = `${styles.btn} ${btnVariantClass(variant)}`

  if (href !== undefined && !disabled) {
    return (
      <a
        className={className}
        href={href}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        {...(download === true ? { download: '' } : {})}
      >
        {icon}
        <span>{label}</span>
      </a>
    )
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function btnVariantClass(variant: ButtonVariant): string {
  return styles[`btn--${variant}`] ?? ''
}
