import { useLanguage } from '../../i18n'
import type { DocumentRef } from '../../models/common'
import type { Education } from '../../models/Education'
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
    <article className={styles.card}>
      <h3 className={styles.title} title={item.name[language]}>
        {item.name[language]}
      </h3>
      {item.issuer !== undefined && <p className={styles.issuer}>{item.issuer}</p>}
      {item.description !== undefined && (
        <p className={styles.description}>{item.description[language]}</p>
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
