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
 * (git, sqlite, room, sql, react…) no participan del filtrado;
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
 * (RF-03, D27): core ⇒ stack principal (Kotlin entra, TypeScript fuera —
 * nunca usado) · explored ⇒ «Tecnologías con las que he experimentado»
 * (proyectos publicados Y experimentos: estar aquí no exige aparecer en
 * una ficha). Los iconos PNG custom (python, unity, xampp) viven en
 * `public/assets/img/icons/`; el resto los resuelve TechIcon con SVG inline.
 *
 * NUNCA inventar tecnologías fuera de este catálogo.
 */
export const technologies: Technology[] = [
  // ——— Stack principal
  { id: 'javascript', name: 'JavaScript', tier: 'core' },
  { id: 'react', name: 'React', tier: 'core' },
  { id: 'html', name: 'HTML', tier: 'core' },
  { id: 'css', name: 'CSS', tier: 'core' },
  { id: 'sql', name: 'SQL', tier: 'core' },
  { id: 'git', name: 'Git', tier: 'core' },
  { id: 'java', name: 'Java', tier: 'core' },
  { id: 'python', name: 'Python', tier: 'core', icon: 'python' },
  { id: 'csharp', name: 'C#', tier: 'core' },
  { id: 'kotlin', name: 'Kotlin', tier: 'core' },

  // ——— Tecnologías con las que he experimentado (D27: unificado)
  /* D28: adapt flags — mono = silueta con color del tema; dim = aclara solo en oscuro. */
  { id: 'wordpress', name: 'WordPress', tier: 'explored', adapt: 'mono' },
  { id: 'room', name: 'Room', tier: 'explored' },
  { id: 'sqlite', name: 'SQLite', tier: 'explored', adapt: 'dim' },
  { id: 'android-studio', name: 'Android Studio', tier: 'explored' },
  { id: 'nodejs', name: 'Node.js', tier: 'explored' },
  { id: 'mysql', name: 'MySQL', tier: 'explored', adapt: 'mono' },
  { id: 'postgresql', name: 'PostgreSQL', tier: 'explored' },
  { id: 'docker', name: 'Docker', tier: 'explored' },
  { id: 'firebase', name: 'Firebase', tier: 'explored' },
  { id: 'unity', name: 'Unity', tier: 'explored', icon: 'unity', adapt: 'mono' },
  { id: 'xampp', name: 'XAMPP', tier: 'explored', icon: 'xampp' },
  { id: 'eclipse', name: 'Eclipse', tier: 'explored', adapt: 'dim' },
  { id: 'netbeans', name: 'NetBeans', tier: 'explored' },
  { id: 'postman', name: 'Postman', tier: 'explored' },
  { id: 'visual-studio', name: 'Visual Studio', tier: 'explored', adapt: 'dim' },
  { id: 'vscode', name: 'VS Code', tier: 'explored' },
  { id: 'github', name: 'GitHub', tier: 'explored', adapt: 'mono' },
]

export function technologiesByTier(tier: Technology['tier']): Technology[] {
  return technologies.filter((tech) => tech.tier === tier)
}

export function technologyNameById(id: string): string {
  const found = technologies.find((tech) => tech.id === id)
  return found !== undefined ? found.name : id
}

/** Catálogo completo por id (undefined si no existe): para TechIcon (icon PNG). */
export function technologyById(id: string): Technology | undefined {
  return technologies.find((tech) => tech.id === id)
}
