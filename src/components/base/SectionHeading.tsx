import styles from './SectionHeading.module.css'

interface SectionHeadingProps {
  /**
   * Número de sección (ronda 3 F4): la Hero es conceptualmente la 0 pero no
   * muestra número; el kicker visible es SOLO el número (sin nombre — el
   * título grande ya identifica la sección y antes duplicaba en inglés).
   */
  index: number
  title: string
  subtitle?: string
}

/**
 * Cabecera tipificada de sección: kicker (número) + h2 + subtítulo opcional.
 * Se usa una única implementación en TODAS las secciones (cohesión visual).
 */
export function SectionHeading({ index, title, subtitle }: SectionHeadingProps) {
  return (
    <header className={styles.heading}>
      <p className={styles.kicker}>{String(index).padStart(2, '0')}</p>
      <h2 className={styles.title}>{title}</h2>
      {subtitle !== undefined && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  )
}
