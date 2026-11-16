import { useLanguage } from '../../i18n'
import type { DocumentRef } from '../../models/common'
import type { Education } from '../../models/Education'
import { Button } from '../base/Button'
import styles from './EducationRow.module.css'

interface EducationRowProps {
  item: Education
  /** Abre DocumentViewerOverlay (la sección posee el estado del overlay). */
  onOpenDocument: (document: DocumentRef) => void
}

/**
 * Fila de formación (RF-16 + ronda 4 F3): lista vertical a ancho completo
 * en lugar de tarjetas — título + emisor/descripción en línea y la acción
 * de acreditación a la derecha. Todas las categorías comparten el MISMO
 * sistema de fila (3.4); la formación oficial solo se destaca tipográficam-
 * ente (título mayor). Emisor en mono versalitas: las certificaciones se
 * leen como acreditaciones profesionales (Cisco/Pearson/Oracle), no como
 * cursos informales. Puramente representativa: el emisor solo si existe en
 * la fuente (no se inventa).
 *
 * Apertura POR TIPO DE RECURSO (ronda 4 F4/D-E): `kind: 'pdf'` abre el
 * DocumentViewerOverlay (comportamiento intacto); `kind: 'external'`
 * (Credly/CertView, que rechazan el iframe) abre la URL en PESTAÑA NUEVA
 * vía `Button href` + `external` (target=_blank + rel noopener noreferrer).
 */
export function EducationRow({ item, onOpenDocument }: EducationRowProps) {
  const { language, texts } = useLanguage()
  const document = item.document
  const official = item.kind === 'official'
  const hasMeta = item.issuer !== undefined || item.description !== undefined

  return (
    <article className={official ? `${styles.row} ${styles.official}` : styles.row}>
      <div className={styles.info}>
        <h3 className={styles.title}>{item.name[language]}</h3>
        {hasMeta && (
          <p className={styles.meta}>
            {item.issuer !== undefined && <span className={styles.issuer}>{item.issuer}</span>}
            {item.description !== undefined && <span>{item.description[language]}</span>}
          </p>
        )}
      </div>

      {document !== undefined && (
        <div className={styles.actions}>
          {document.kind === 'external' ? (
            <Button label={texts.education.openDocument} href={document.src} external />
          ) : (
            <Button
              label={texts.education.openDocument}
              onClick={() => {
                onOpenDocument(document)
              }}
            />
          )}
        </div>
      )}
    </article>
  )
}
