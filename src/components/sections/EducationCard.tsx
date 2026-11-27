import { useLanguage } from '../../i18n'
import type { DocumentRef } from '../../models/common'
import type { Education } from '../../models/Education'
import { technologyById } from '../../data/technologies'
import { TechIcon } from '../base/TechIcon'
import { Button } from '../base/Button'
import styles from './EducationCard.module.css'

interface EducationCardProps {
  item: Education
  onOpenDocument: (document: DocumentRef) => void
}

/** Vista compacta de Formación; mantiene el nombre completo y la acción original. */
export function EducationCard({ item, onOpenDocument }: EducationCardProps) {
  const { language, texts } = useLanguage()
  const document = item.document

  return (
    <article
      className={`${styles.card} ${item.kind === 'official' ? styles.official : ''} ${item.kind === 'certification' ? styles.certification : ''} ${item.kind === 'course' ? styles.course : ''}`}
    >
      <h3 className={styles.title} title={item.name[language]}>
        {item.name[language]}
      </h3>
      {item.issuer !== undefined && <p className={styles.issuer}>{item.issuer}</p>}
      {item.description !== undefined && (
        <p className={styles.description}>{item.description[language]}</p>
      )}
      {item.supplementalDescription !== undefined && (
        <p className={styles.supplemental}>{item.supplementalDescription[language]}</p>
      )}
      {item.technologyIds !== undefined && item.technologyIds.length > 0 && (
        <section className={styles.technologies} aria-label={texts.education.technologiesTitle}>
          <h4 className={styles.technologiesTitle}>{texts.education.technologiesTitle}</h4>
          <ul className={styles.technologyList}>
            {item.technologyIds.map((technologyId) => {
              const technology = technologyById(technologyId)
              return technology === undefined ? null : (
                <li className={styles.technology} key={technologyId}>
                  <TechIcon
                    technologyId={technologyId}
                    icon={technology.icon}
                    adapt={technology.adapt}
                  />
                  <span>{technology.name}</span>
                </li>
              )
            })}
          </ul>
        </section>
      )}
      {document !== undefined && (
        <div className={styles.actions}>
          {document.kind === 'external' ? (
            <Button label={texts.education.openDocument} href={document.src} external />
          ) : (
            <Button label={texts.education.openDocument} onClick={() => onOpenDocument(document)} />
          )}
        </div>
      )}
    </article>
  )
}
