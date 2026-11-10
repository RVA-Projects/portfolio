import type { Project } from '../../models/Project'

interface ProjectCardProps {
  project: Project
  /** Los textos visibles (categoría, tecnologías) traducidos inyectado al alcanzar la sección (F6.2). */
  onSelect: (projectId: string) => void
}

/**
 * TODO(F6.2): tarjeta uniforme por breakpoint (RF-06): imagen 16:10 (lazy,
 * alt accesible), nombre, resumen, tags de tecnologías y badge de categoría.
 * Tarjeta clickable con interacción por teclado incluida, sin depender de hover.
 */
export function ProjectCard(_props: ProjectCardProps) {
  return null
}
