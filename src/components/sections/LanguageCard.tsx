import { useLanguage } from '../../i18n'
import type { DocumentRef } from '../../models/common'
import type { LanguageProfile } from '../../models/LanguageProfile'
import { Button } from '../base/Button'
import { Tag } from '../base/Tag'
import styles from './LanguageCard.module.css'

interface LanguageCardProps {
  item: LanguageProfile
  /** Abre DocumentViewerOverlay (la sección posee el estado del overlay). */
  onOpenDocument: (document: DocumentRef) => void
}

/**
 * Tarjeta de idioma (RF-19): puramente representativa. Muestra el idioma y su
 * nivel único (MCER o etiqueta del propietario; D04). Con certificado en
 * `document`, botón que abre el visor genérico.
 */
export function LanguageCard({ item, onOpenDocument }: LanguageCardProps) {
  const { language, texts } = useLanguage()
  const document = item.document
  /* C1/B2 son notación MCER universal y se muestran tal cual; las etiquetas
     propias del propietario (nativo/starter) se traducen en i18n. Sin nivel
     (campo opcional en el modelo) no se muestra etiqueta. */
  let levelLabel: string | null = null
  if (item.cefr !== undefined) {
    levelLabel =
      item.cefr === 'nativo' || item.cefr === 'starter'
        ? texts.languages.levels[item.cefr]
        : item.cefr
  }

  return (
    <article className={styles.card}>
      <h3 className={styles.title}>{item.name[language]}</h3>
      <p className={styles.meta}>
        {levelLabel !== null && <Tag label={levelLabel} variant="category" />}
      </p>

      {document !== undefined && (
        <div className={styles.actions}>
          <Button
            label={texts.languages.openCertificate}
            onClick={() => {
              onOpenDocument(document)
            }}
          />
        </div>
      )}
    </article>
  )
}
