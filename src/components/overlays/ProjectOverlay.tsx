import type { LocalizedText } from '../../models/common'
import type { EducationalTextItem, Project, ProjectLink } from '../../models/Project'

interface ProjectOverlayProps {
  project: Project | null
  onClose: () => void
  // TODO(F6.4): navega respetando el filtro activo; deshabilitado en los extremos.
  onPrev?: () => void
  onNext?: () => void
  hasPrev: boolean
  hasNext: boolean
  /** TODO(F6.9): strings de UI (prev/next/close…) traducidos e inyectados. */
  ui: {
    close: string
    prev: string
    next: string
  }
  labels: {
    goal: LocalizedText
    problem: LocalizedText
    role: LocalizedText
    architecture: LocalizedText
    features: LocalizedText
    technicalDecisions: LocalizedText
    outcomes: LocalizedText
    learnings: LocalizedText
  }
  /** Resolución de EducationalTextItem → string (i18n / idioma activo). */
  translateItem: (item: EducationalTextItem) => string
  linkAriaLabels: Record<Exclude<ProjectLink['id'], never>, string>
}

/**
 * TODO(F6.3/F6.4): overlay de proyecto (RF-10 a RF-14).
 * - Escritorio 50/50: galería izquierda / info técnica con scroll independiente.
 * - Móvil: apilado (galería arriba, info debajo), scroll vertical único.
 * - Navega prev/next sin cerrar; swipe táctil + teclado.
 * - Compone sobre `Modal`; no existe página independiente del proyecto.
 */
export function ProjectOverlay(_props: ProjectOverlayProps) {
  return null
}
