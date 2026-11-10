import type { Project } from '../../models/Project'

interface ProjectCarouselProps {
  /** Proyectos ya filtrados (uso interno del hook useCarousel). */
  projects: Project[]
  onSelect: (projectId: string) => void
}

/**
 * TODO(F6.2): carrusel horizontal (RF-08) — scroll-snap + botón prev/next +
 * swipe táctil + indicadores de posición. Sin autoplay. La lógica vive en
 * hooks/useCarousel.ts (unitaria, testeable); el componente solo renderiza.
 */
export function ProjectCarousel(_props: ProjectCarouselProps) {
  return null
}
