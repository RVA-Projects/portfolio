import type { BaseEntity, DocumentRef, LocalizedText } from './common'

export type EducationKind = 'official' | 'certification' | 'course'

export interface Education extends BaseEntity {
  kind: EducationKind
  name: LocalizedText
  /**
   * Organismo emisor, tal como se publica. Opcional: solo se declara con
   * dato en la fuente (ronda 4 F3/D-D: el propietario aportó ILERNA para el
   * DAM; ningún otro emisor se inventa).
   */
  issuer?: string
  /** ISO 8601 parcial: "YYYY-MM" o "YYYY". Ausente si no hay dato verificado. */
  date?: string
  /** Duración en formato libre ("40 h"). */
  duration?: string
  description?: LocalizedText
  /** Presente ⇒ el ítem es clicable y abre DocumentViewerOverlay. */
  document?: DocumentRef
}
