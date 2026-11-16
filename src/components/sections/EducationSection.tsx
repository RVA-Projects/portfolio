import { useState } from 'react'
import { education } from '../../data/education'
import type { SectionId } from '../../data/site'
import { useLanguage } from '../../i18n'
import type { DocumentRef } from '../../models/common'
import type { Education, EducationKind } from '../../models/Education'
import { SectionHeading } from '../base/SectionHeading'
import { DocumentViewerOverlay } from '../overlays/DocumentViewerOverlay'
import { EducationRow } from './EducationRow'
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
  const { texts } = useLanguage()
  const [activeDocument, setActiveDocument] = useState<DocumentRef | null>(null)
  const groups = groupByKind(education)

  return (
    <section
      id={'education' satisfies SectionId}
      className={styles.section}
      aria-label={texts.sections.education}
    >
      <SectionHeading index={4} title={texts.sections.education} />
      {GROUP_ORDER.map((kind) => {
        const items = groups[kind]
        if (items === undefined || items.length === 0) return null
        return (
          <div key={kind} className={styles.group}>
            <h3 className={styles.groupTitle}>{texts.education.groups[kind]}</h3>
            <div className={styles.list}>
              {items.map((item) => (
                <EducationRow key={item.id} item={item} onOpenDocument={setActiveDocument} />
              ))}
            </div>
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
