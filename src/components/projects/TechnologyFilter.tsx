import { useLanguage } from '../../i18n'
import type { Technology } from '../../models/Technology'
import styles from './TechnologyFilter.module.css'

export type TechnologyFilterValue = string | null

interface TechnologyFilterProps {
  /** Índice derivado de los proyectos (utils/filter.ts), no del catálogo global. */
  technologies: Technology[]
  /** null ⇒ All. */
  activeId: TechnologyFilterValue
  onChange: (id: TechnologyFilterValue) => void
}

/**
 * Índice horizontal de tecnologías (RF-07). Botones con aria-pressed; el
 * estado activo usa el acento del sistema. "All" es null (nunca un id).
 */
export function TechnologyFilter({ technologies, activeId, onChange }: TechnologyFilterProps) {
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
      {technologies.map((technology) => {
        const active = technology.id === activeId
        return (
          <button
            key={technology.id}
            type="button"
            className={chipClass(active)}
            aria-pressed={active}
            onClick={() => onChange(technology.id)}
          >
            {technology.name}
          </button>
        )
      })}
    </div>
  )
}
