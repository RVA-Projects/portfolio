import type { TechnologyFilterValue } from '../components/projects/TechnologyFilter'
import type { Project } from '../models/Project'
import type { Technology } from '../models/Technology'

/**
 * RF-07: filtrado independiente de la representación. `null` ⇒ All.
 * Funciones puras, testeables, sin lógica de DOM.
 */
export function filterProjects(projects: Project[], tech: TechnologyFilterValue): Project[] {
  if (tech === null) return projects
  return projects.filter((project) => project.technologyIds.includes(tech))
}

/**
 * Tecnologías a indexar en el filtro: SOLO las que usan los proyectos actuales,
 * ordenadas por nombre (estable). Las del catálogo sin uso en proyectos no aparecen.
 */
export function collectFilterTechnologies(
  projects: Project[],
  catalog: Technology[],
): Technology[] {
  const used = new Set<string>()
  for (const project of projects) {
    for (const id of project.technologyIds) used.add(id)
  }
  return catalog
    .filter((tech) => used.has(tech.id))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}
