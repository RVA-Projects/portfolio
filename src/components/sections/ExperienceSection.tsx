import { experience } from '../../data/experience'
import type { SectionId } from '../../data/site'
import { useLanguage } from '../../i18n'
import { SectionHeading } from '../base/SectionHeading'
import { ExperienceCard } from './ExperienceCard'
import styles from './ExperienceSection.module.css'

/**
 * Sección de experiencia (RF-15, Fase 6): lista plana de trabajo profesional
 * (los proyectos propios/colaboraciones viven en Proyectos). Sin lógica de
 * presentación más allá del mapeo de tarjetas.
 */
export function ExperienceSection() {
  const { texts } = useLanguage()

  return (
    <section
      id={'experience' satisfies SectionId}
      className={styles.section}
      aria-label={texts.sections.experience}
    >
      <SectionHeading kicker="03 — Experience" title={texts.sections.experience} />
      <div className={styles.cards}>
        {experience.map((item) => (
          <ExperienceCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
