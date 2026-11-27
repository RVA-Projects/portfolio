import { useState } from 'react'
import { education } from '../../data/education'
import type { SectionId } from '../../data/site'
import { useLanguage } from '../../i18n'
import { sortByLocalizedName } from '../../utils/naturalSort'
import type { DocumentRef } from '../../models/common'
import type { Education, EducationKind } from '../../models/Education'
import { SectionHeading } from '../base/SectionHeading'
import { DocumentViewerOverlay } from '../overlays/DocumentViewerOverlay'
import { EducationRow } from './EducationRow'
import { EducationCard } from './EducationCard'
import styles from './EducationSection.module.css'

/** Orden estable y semántico de grupos: jerarquía RF-16 (oficial arriba). */
const GROUP_ORDER: EducationKind[] = ['official', 'certification', 'course']

function groupByKind(items: Education[]): Partial<Record<EducationKind, Education[]>> {
  const groups: Partial<Record<EducationKind, Education[]>> = {}
  for (const item of items) {
    const list = groups[item.kind] ?? []
    list.push(item)
    groups[item.kind] = list
  }
  return groups
}

/**
 * Sección de formación (RF-16 + ronda 4 F3): agrupa por jerarquía (oficial,
 * certificaciones, cursos) y renderiza EducationRow por datos — lista
 * vertical a ancho completo con separadores, misma fila para todas las
 * categorías (solo cambia el tamaño del título en la oficial). Los ítems con
 * documento abren el DocumentViewerOverlay genérico (RF-18), cuyo estado
 * vive aquí. Grupos vacíos no se renderizan. Sin lógica de presentación más
 * allá del agrupado.
 */
export function EducationSection() {
  const { language, texts } = useLanguage()
  const [activeDocument, setActiveDocument] = useState<DocumentRef | null>(null)
  const [view, setView] = useState<'cards' | 'list'>('cards')
  const groups = groupByKind(education)

  return (
    <section
      id={'education' satisfies SectionId}
      className={styles.section}
      aria-label={texts.sections.education}
    >
      <SectionHeading index={4} title={texts.sections.education} />
      <div className={styles.viewToggle} role="group" aria-label={texts.education.viewLabel}>
        {(['cards', 'list'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            className={styles.viewButton}
            aria-pressed={view === mode}
            onClick={() => setView(mode)}
          >
            <svg
              className={styles.viewIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {mode === 'cards' ? (
                <>
                  <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
                  <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
                  <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
                  <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
                </>
              ) : (
                <>
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </>
              )}
            </svg>
            <span className="visually-hidden">{texts.education.views[mode]}</span>
          </button>
        ))}
      </div>
      {GROUP_ORDER.map((kind) => {
        const groupItems = groups[kind]
        const items =
          groupItems === undefined ? undefined : sortByLocalizedName(groupItems, language)
        if (items === undefined || items.length === 0) return null
        return (
          <div key={kind} className={styles.group}>
            <h3 className={styles.groupTitle}>{texts.education.groups[kind]}</h3>
            {view === 'list' ? (
              <div className={styles.list}>
                {items.map((item) =>
                  item.kind === 'official' ? (
                    <EducationCard key={item.id} item={item} onOpenDocument={setActiveDocument} />
                  ) : (
                    <EducationRow key={item.id} item={item} onOpenDocument={setActiveDocument} />
                  ),
                )}
              </div>
            ) : (
              <div className={styles.cards}>
                {items.map((item) => (
                  <EducationCard key={item.id} item={item} onOpenDocument={setActiveDocument} />
                ))}
              </div>
            )}
          </div>
        )
      })}

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
