import type { BaseEntity, LocalizedText } from './common'
import type { EducationalTextItem } from './Project'

/**
 * Fase 6 (plan de actualización): experiencia = lista plana de trabajo
 * profesional. Los proyectos propios/colaboraciones viven en el catálogo de
 * Proyectos (fichas), no aquí — `kind` ya no existe.
 */
export interface Experience extends BaseEntity {
  /** Nombre de la organización o del contexto profesional. */
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
  /**
   * Fase 5 (plan de actualización): fichas del catálogo de Proyectos
   * asociadas a esta experiencia (ids validados contra `projects` en tests).
   * Solo donde existe relación real; ausente ⇒ sin proyectos asociados.
   */
  projectIds?: string[]
}
