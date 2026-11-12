import { FILTER_CATEGORY_BY_TECH, type FilterCategoryId } from '../data/technologies'
import type { Project } from '../models/Project'

/**
 * RF-07 simplificado (plan de actualización F2.2): filtrado por CATEGORÍA
 * tecnológica general, no por herramienta individual. `null` ⇒ All.
 * Funciones puras, testeables, sin lógica de DOM.
 */
export function filterProjects(projects: Project[], category: FilterCategoryId | null): Project[] {
  if (category === null) return projects
  return projects.filter((project) =>
    project.technologyIds.some((techId) => FILTER_CATEGORY_BY_TECH[techId] === category),
  )
}
