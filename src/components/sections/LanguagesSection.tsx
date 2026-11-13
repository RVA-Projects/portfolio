import { useState } from 'react'
import { languages } from '../../data/languages'
import type { SectionId } from '../../data/site'
import { useLanguage } from '../../i18n'
import type { DocumentRef } from '../../models/common'
import { SectionHeading } from '../base/SectionHeading'
import { DocumentViewerOverlay } from '../overlays/DocumentViewerOverlay'
import { LanguageCard } from './LanguageCard'
import styles from './LanguagesSection.module.css'

/**
 * Sección de idiomas (RF-19): LanguageCard por datos, sin grupos (D04 define
 * 5 idiomas en lista plana). Los certificados abren el DocumentViewerOverlay
 * genérico (reutilizado de F6.6): solo cambia el documento. Sin lógica de
 * presentación más allá del mapeo de tarjetas.
 */
export function LanguagesSection() {
  const { texts } = useLanguage()
  const [activeDocument, setActiveDocument] = useState<DocumentRef | null>(null)

  return (
    <section
      id={'languages' satisfies SectionId}
      className={styles.section}
      aria-label={texts.sections.languages}
    >
      <SectionHeading kicker="06 — Languages" title={texts.sections.languages} />
      <div className={styles.cards}>
        {languages.map((item) => (
          <LanguageCard key={item.id} item={item} onOpenDocument={setActiveDocument} />
        ))}
      </div>

      <DocumentViewerOverlay
        document={activeDocument}
        onClose={() => {
          setActiveDocument(null)
        }}
        ui={texts.documentViewer}
      />
    </section>
  )
}
