import type { FilterCategoryId } from '../models/common'
import type { Project } from '../models/Project'

/**
 * RF-07 simplificado (plan de actualización F2.2): filtrado por CATEGORÍA
 * tecnológica general, no por herramienta individual. `null` ⇒ All.
 * Funciones puras, testeables, sin lógica de DOM.
 */
export function filterProjects(projects: Project[], category: FilterCategoryId | null): Project[] {
  if (category === null) return projects
  return projects.filter((project) => project.filterCategories.includes(category))
}
