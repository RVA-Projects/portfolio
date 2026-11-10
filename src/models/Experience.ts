import type { BaseEntity, LocalizedText } from './common'
import type { EducationalTextItem } from './Project'

export type ExperienceKind = 'professional' | 'independent' | 'collab'

export interface Experience extends BaseEntity {
  kind: ExperienceKind
  /** Nombre de la organización o del proyecto independiente. */
  organization: LocalizedText
  /**
   * Periodo con fecha real verificada por el propietario. `start`/`end`
   * aceptan "YYYY" o "YYYY-MM"; `end` ausente ⇒ periodo abierto (actualidad).
   * Opcional: las entradas sin fecha confirmada NO la declaran.
   */
  period?: { start: string; end?: string }
  role?: LocalizedText
  responsibilities: EducationalTextItem[]
  description?: LocalizedText
  /** Referencias a Technology por id. */
  technologyIds: string[]
  outcomes?: EducationalTextItem[]
  links?: { id: string; url: string }[]
}
