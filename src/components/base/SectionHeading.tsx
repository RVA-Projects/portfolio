import styles from './SectionHeading.module.css'

interface SectionHeadingProps {
  /** Rótulo pequeño (número de sección o etiqueta tipo "Section 01"). */
  kicker: string
  title: string
  subtitle?: string
}

/**
 * Cabecera tipificada de sección: kicker + h2 + subtítulo opcional.
 * Se usa una única implementación en TODAS las secciones (cohesión visual).
 */
export function SectionHeading({ kicker, title, subtitle }: SectionHeadingProps) {
  return (
    <header className={styles.heading}>
      <p className={styles.kicker}>{kicker}</p>
      <h2 className={styles.title}>{title}</h2>
      {subtitle !== undefined && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  )
}
