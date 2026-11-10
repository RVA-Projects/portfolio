import type { BaseEntity, LocalizedText } from './common'
import type { EducationalTextItem } from './Project'

export type ExperienceKind = 'professional' | 'freelance' | 'independent' | 'collab'

export interface Experience extends BaseEntity {
  kind: ExperienceKind
  /** Nombre de la organización o del proyecto independiente. */
  organization: LocalizedText
  /** "YYYY-MM"; end ausente ⇒ periodo abierto (actualidad). */
  period: { start: string; end?: string }
  role?: LocalizedText
  responsibilities: EducationalTextItem[]
  description?: LocalizedText
  /** Referencias a Technology por id. */
  technologyIds: string[]
  outcomes?: EducationalTextItem[]
  links?: { id: string; url: string }[]
}
