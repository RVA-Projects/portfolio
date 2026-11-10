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
    <header className="section-heading">
      <p className="section-heading__kicker">{kicker}</p>
      <h2 className="section-heading__title">{title}</h2>
      {subtitle !== undefined && <p className="section-heading__subtitle">{subtitle}</p>}
    </header>
  )
}
