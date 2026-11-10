import { experience } from '../../data/experience'
import type { SectionId } from '../../data/site'
import type { Experience, ExperienceKind } from '../../models/Experience'
import { useLanguage } from '../../i18n'
import { SectionHeading } from '../base/SectionHeading'
import { ExperienceCard } from './ExperienceCard'
import styles from './ExperienceSection.module.css'

/** Orden estable y Semántica de grupos (inventario §5). */
const GROUP_ORDER: ExperienceKind[] = ['professional', 'freelance', 'independent', 'collab']

function groupByKind(items: Experience[]): Partial<Record<ExperienceKind, Experience[]>> {
  const groups: Partial<Record<ExperienceKind, Experience[]>> = {}
  for (const item of items) {
    const list = groups[item.kind] ?? []
    list.push(item)
    groups[item.kind] = list
  }
  return groups
}

/**
 * Sección de experiencia (RF-15): agrupa por tipo (freelance, independiente,
 * colaboración, profesional si existiera) y renderiza ExperienceCard por
 * datos. Sin lógica de presentación más allá del agrupado (puro).
 */
export function ExperienceSection() {
  const { texts } = useLanguage()
  const groups = groupByKind(experience)

  return (
    <section
      id={'experience' satisfies SectionId}
      className={styles.section}
      aria-label={texts.sections.experience}
    >
      <SectionHeading kicker="03 — Experience" title={texts.sections.experience} />
      {GROUP_ORDER.map((kind) => {
        const items = groups[kind]
        if (items === undefined || items.length === 0) return null
        return (
          <div key={kind} className={styles.group}>
            <h3 className={styles.groupTitle}>{texts.experience.groups[kind]}</h3>
            <div className={styles.cards}>
              {items.map((item) => (
                <ExperienceCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}
