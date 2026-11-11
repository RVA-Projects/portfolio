import { useLanguage } from '../../i18n'
import type { DocumentRef } from '../../models/common'
import type { Education } from '../../models/Education'
import { Button } from '../base/Button'
import { Tag } from '../base/Tag'
import styles from './EducationCard.module.css'

interface EducationCardProps {
  item: Education
  /** Abre DocumentViewerOverlay (la sección posee el estado del overlay). */
  onOpenDocument: (document: DocumentRef) => void
}

/**
 * Tarjeta de formación (RF-16): puramente representativa. Muestra el nombre,
 * categoría, organismo emisor (solo si existe en la fuente, no se inventa) y
 * descripción opcional. Con documento acreditativo, botón que abre el visor.
 */
export function EducationCard({ item, onOpenDocument }: EducationCardProps) {
  const { language, texts } = useLanguage()
  const document = item.document

  return (
    <article className={styles.card}>
      <h3 className={styles.title}>{item.name[language]}</h3>
      <p className={styles.meta}>
        <Tag label={texts.education.groups[item.kind]} variant="category" />
        {item.issuer !== undefined && <span>{item.issuer}</span>}
      </p>

      {item.description !== undefined && (
        <p className={styles.description}>{item.description[language]}</p>
      )}

      {document !== undefined && (
        <div className={styles.actions}>
          <Button
            label={texts.education.openDocument}
            onClick={() => {
              onOpenDocument(document)
            }}
          />
        </div>
      )}
    </article>
  )
}
