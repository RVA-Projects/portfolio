export type TagVariant = 'tech' | 'category' | 'accent'

interface TagProps {
  label: string
  variant?: TagVariant
}

/**
 * Chip de etiqueta. `tech` para tecnologías (monoespaciada), `category` para
 * el badge de categoría de proyecto, `accent` para el estado activo del filtro.
 * No clickable: la interacción del filtro es indiciada POR el componente
 * TechnologyFilter, no por la etiqueta.
 */
export function Tag({ label, variant = 'tech' }: TagProps) {
  return <span className={`tag tag--${variant}`}>{label}</span>
}
