import { useLanguage } from '../../i18n'
import { technologiesByTier } from '../../data/technologies'
import { SectionHeading } from '../base/SectionHeading'
import { TechIcon } from '../base/TechIcon'
import styles from './TechStackSection.module.css'

/**
 * D27 — Sección propia del stack (tras Proyectos), con TODO centrado:
 * cabecera, títulos de grupo y las dos listas (core / explored). Los grids
 * salen de la Introduction (F2 los quitó) y viven aquí como única fuente.
 * Cada entrada es icono decorativo + nombre canónico, igual que antes.
 */
export function TechStackSection() {
  const { texts } = useLanguage()

  return (
    <section id="stack" className={styles.section} aria-label={texts.sections.stack}>
      <SectionHeading kicker="03 — Stack" title={texts.sections.stack} />

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>{texts.stack.mainTitle}</h3>
        <TechGrid technologies={technologiesByTier('core')} />
      </div>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>{texts.stack.exploredTitle}</h3>
        <TechGrid technologies={technologiesByTier('explored')} />
      </div>
    </section>
  )
}

interface TechGridProps {
  technologies: ReturnType<typeof technologiesByTier>
}

/** Lista icono + nombre, reutilizada por los dos niveles del stack. */
function TechGrid({ technologies }: TechGridProps) {
  return (
    <ul className={styles.techGrid}>
      {technologies.map((tech) => (
        <li key={tech.id} className={styles.techItem}>
          <TechIcon technologyId={tech.id} icon={tech.icon} />
          <span>{tech.name}</span>
        </li>
      ))}
    </ul>
  )
}
