import { useLanguage } from '../../i18n'
import { technologiesByTier } from '../../data/technologies'
import { SectionHeading } from '../base/SectionHeading'
import { TechIcon } from '../base/TechIcon'
import styles from './TechStackSection.module.css'

/**
 * D27 — Sección propia del stack (tras Proyectos): única fuente de los
 * grids (salieron de la Introduction en la F2 de ronda 3); cada entrada es
 * icono decorativo + nombre canónico. Ronda 4 F2: TODO el contenido vive
 * en una tarjeta translúcida como la Hero; el título y los títulos de
 * grupo van a la izquierda y los grids siguen centrados.
 */
export function TechStackSection() {
  const { texts } = useLanguage()

  return (
    <section id="stack" className={styles.section} aria-label={texts.sections.stack}>
      <SectionHeading index={2} title={texts.sections.stack} />

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
          <TechIcon technologyId={tech.id} icon={tech.icon} adapt={tech.adapt} />
          <span>{tech.name}</span>
        </li>
      ))}
    </ul>
  )
}
