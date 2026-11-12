import type { FilterCategoryId } from '../../data/technologies'
import { useLanguage } from '../../i18n'
import styles from './TechnologyFilter.module.css'

export type FilterCategoryValue = FilterCategoryId | null

interface TechnologyFilterProps {
  /** Las 5 categorías SIEMPRE (constante FILTER_CATEGORIES), con o sin proyectos. */
  categories: readonly FilterCategoryId[]
  /** null ⇒ All. */
  activeId: FilterCategoryValue
  onChange: (id: FilterCategoryValue) => void
}

/**
 * Índice de categorías de filtrado (RF-07 simplificado, F2.2). Botones con
 * aria-pressed; el estado activo usa el acento del sistema. "Todas" es null.
 * Las etiquetas vienen de i18n (`filter.categories`); las categorías sin
 * proyectos (python/java hoy) se muestran igualmente (decisión del
 * propietario: las rellenará más adelante).
 */
export function TechnologyFilter({ categories, activeId, onChange }: TechnologyFilterProps) {
  const { texts } = useLanguage()

  const chipClass = (active: boolean) =>
    active ? `${styles.chip} ${styles['chip--active']}` : styles.chip

  return (
    <div role="group" aria-label={texts.filter.label} className={styles.grid}>
      <button
        type="button"
        className={chipClass(activeId === null)}
        aria-pressed={activeId === null}
        onClick={() => onChange(null)}
      >
        {texts.filter.all}
      </button>
      {categories.map((category) => {
        const active = category === activeId
        return (
          <button
            key={category}
            type="button"
            className={chipClass(active)}
            aria-pressed={active}
            onClick={() => onChange(category)}
          >
            {texts.filter.categories[category]}
          </button>
        )
      })}
    </div>
  )
}
