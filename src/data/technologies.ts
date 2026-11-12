import type { Technology } from '../models/Technology'

/**
 * Categorías del filtro (RF-07 simplificado, plan de actualización F2.2):
 * categorías tecnológicas GENERALES, no herramientas individuales.
 * SQLite y Room NO tienen categoría: nunca filtran solas (decisión del
 * propietario), solo aparecen en las fichas de sus proyectos.
 */
export type FilterCategoryId = 'android' | 'web' | 'csharp' | 'python' | 'java'

/** Orden estable del índice: las 5 categorías SIEMPRE visibles (con 0 proyectos si no hay). */
export const FILTER_CATEGORIES: readonly FilterCategoryId[] = [
  'android',
  'web',
  'csharp',
  'python',
  'java',
]

/**
 * Mapeo technologyId → categoría de filtro. Las tecnologías sin entrada
 * (git, sqlite, room, sql, react, typescript…) no participan del filtrado;
 * el resto conservan su tecnología en las fichas (esto no toca datos).
 */
export const FILTER_CATEGORY_BY_TECH: Record<string, FilterCategoryId> = {
  'android-studio': 'android',
  kotlin: 'android',
  html: 'web',
  css: 'web',
  javascript: 'web',
  wordpress: 'web',
  csharp: 'csharp',
  python: 'python',
  java: 'java',
}

/**
 * Catálogo de tecnologías (modelo `Technology`). Clasificación por niveles
 * (RF-03) confirmada con el propietario: core ⇒ stack principal (añade
 * Python, C#, Java) · project ⇒ usadas en proyectos · tool ⇒ complementarias.
 * Los iconos PNG custom (python, unity, xampp) viven en
 * `public/assets/img/icons/`; el resto los resuelve TechIcon con SVG inline.
 *
 * NUNCA inventar tecnologías fuera de este catálogo.
 */
export const technologies: Technology[] = [
  // ——— Stack principal
  { id: 'javascript', name: 'JavaScript', tier: 'core' },
  { id: 'typescript', name: 'TypeScript', tier: 'core' },
  { id: 'react', name: 'React', tier: 'core' },
  { id: 'html', name: 'HTML', tier: 'core' },
  { id: 'css', name: 'CSS', tier: 'core' },
  { id: 'sql', name: 'SQL', tier: 'core' },
  { id: 'git', name: 'Git', tier: 'core' },
  { id: 'java', name: 'Java', tier: 'core' },
  { id: 'python', name: 'Python', tier: 'core', icon: 'python' },
  { id: 'csharp', name: 'C#', tier: 'core' },

  // ——— Usadas en proyectos
  { id: 'wordpress', name: 'WordPress', tier: 'project' },
  { id: 'kotlin', name: 'Kotlin', tier: 'project' },
  { id: 'room', name: 'Room', tier: 'project' },
  { id: 'sqlite', name: 'SQLite', tier: 'project' },
  { id: 'android-studio', name: 'Android Studio', tier: 'project' },

  // ——— Herramientas y complementarios (grid del portfolio original)
  { id: 'nodejs', name: 'Node.js', tier: 'tool' },
  { id: 'mysql', name: 'MySQL', tier: 'tool' },
  { id: 'postgresql', name: 'PostgreSQL', tier: 'tool' },
  { id: 'docker', name: 'Docker', tier: 'tool' },
  { id: 'firebase', name: 'Firebase', tier: 'tool' },
  { id: 'unity', name: 'Unity', tier: 'tool', icon: 'unity' },
  { id: 'xampp', name: 'XAMPP', tier: 'tool', icon: 'xampp' },
  { id: 'eclipse', name: 'Eclipse', tier: 'tool' },
  { id: 'netbeans', name: 'NetBeans', tier: 'tool' },
  { id: 'postman', name: 'Postman', tier: 'tool' },
  { id: 'visual-studio', name: 'Visual Studio', tier: 'tool' },
  { id: 'vscode', name: 'VS Code', tier: 'tool' },
  { id: 'github', name: 'GitHub', tier: 'tool' },
]

export function technologiesByTier(tier: Technology['tier']): Technology[] {
  return technologies.filter((tech) => tech.tier === tier)
}

export function technologyNameById(id: string): string {
  const found = technologies.find((tech) => tech.id === id)
  return found !== undefined ? found.name : id
}
