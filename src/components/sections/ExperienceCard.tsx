import { technologyNameById } from '../../data/technologies'
import { useLanguage } from '../../i18n'
import type { Experience } from '../../models/Experience'
import { Button } from '../base/Button'
import { Tag } from '../base/Tag'
import styles from './ExperienceCard.module.css'

interface ExperienceCardProps {
  item: Experience
}

/**
 * Tarjeta de experiencia (RF-15): puramente representativa. Muestra la
 * organización, tipo, periodo (solo si existe dato verificado), rol,
 * descripción, funciones, logros, tecnologías y enlaces existentes.
 */
export function ExperienceCard({ item }: ExperienceCardProps) {
  const { language, texts } = useLanguage()

  const periodLabel =
    item.period === undefined
      ? null
      : `${item.period.start} – ${item.period.end ?? texts.experience.current}`

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{item.organization[language]}</h3>
          <p className={styles.meta}>
            <Tag label={texts.experience.groups[item.kind]} variant="category" />
            {item.role !== undefined && <span>{item.role[language]}</span>}
            {periodLabel !== null && <span>{periodLabel}</span>}
          </p>
        </div>
      </div>

      {item.description !== undefined && (
        <p className={styles.description}>{item.description[language]}</p>
      )}

      {item.responsibilities.length > 0 && (
        <div>
          <p className={styles.listLabel}>{texts.experience.responsibilities}</p>
          <ul className={styles.list}>
            {item.responsibilities.map((item2) => (
              <li key={item2.id}>{item2.text[language]}</li>
            ))}
          </ul>
        </div>
      )}

      {item.outcomes !== undefined && item.outcomes.length > 0 && (
        <div>
          <p className={styles.listLabel}>{texts.experience.outcomes}</p>
          <ul className={styles.list}>
            {item.outcomes.map((item2) => (
              <li key={item2.id}>{item2.text[language]}</li>
            ))}
          </ul>
        </div>
      )}

      {item.technologyIds.length > 0 && (
        <div className={styles.footer}>
          {item.technologyIds.map((technologyId) => (
            <Tag key={technologyId} label={technologyNameById(technologyId)} />
          ))}
        </div>
      )}

      {item.links !== undefined && item.links.length > 0 && (
        <div className={styles.links}>
          {item.links.map((link) => {
            const label =
              link.id === 'github'
                ? texts.projectOverlay.links.github
                : texts.projectOverlay.links.web
            return <Button key={link.id} label={label} href={link.url} external />
          })}
        </div>
      )}
    </article>
  )
}
