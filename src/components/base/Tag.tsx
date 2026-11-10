import styles from './Tag.module.css'

export type TagVariant = 'tech' | 'category' | 'accent'

interface TagProps {
  label: string
  variant?: TagVariant
}

/**
 * Chip de etiqueta. `tech` para tecnologías (monoespaciada), `category` para
 * el badge de categoría de proyecto, `accent` para el estado activo del filtro.
 * No clicable: la interacción del filtro la lleva TechnologyFilter.
 */
export function Tag({ label, variant = 'tech' }: TagProps) {
  const variantClass = styles[`tag--${variant}`]
  return (
    <span className={variantClass !== undefined ? `${styles.tag} ${variantClass}` : styles.tag}>
      {label}
    </span>
  )
}
