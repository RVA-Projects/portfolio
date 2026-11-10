import type { Technology } from '../models/Technology'

/**
 * Catálogo de tecnologías (modelo `Technology`, fase F6.2). Clasificación por
 * niveles (RF-03) extraída del inventario del portfolio anterior:
 * core ⇒ principales · project ⇒ usadas en proyectos · tool ⇒ complementarias.
 *
 * NOTA: distribución provisional; el propietario la ajusta en Fase 7.
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

  // ——— Usadas en proyectos (inventario: Signature, TaskManager, GB-Utility, Flashcards, MiniCRM, webs)
  { id: 'csharp', name: 'C#', tier: 'project' },
  { id: 'kotlin', name: 'Kotlin', tier: 'project' },
  { id: 'wordpress', name: 'WordPress', tier: 'project' },
  { id: 'sqlite', name: 'SQLite', tier: 'project' },

  // ——— Herramientas y complementarios
  { id: 'python', name: 'Python', tier: 'tool' },
  { id: 'nodejs', name: 'Node.js', tier: 'tool' },
  { id: 'mysql', name: 'MySQL', tier: 'tool' },
  { id: 'postgresql', name: 'PostgreSQL', tier: 'tool' },
  { id: 'docker', name: 'Docker', tier: 'tool' },
  { id: 'firebase', name: 'Firebase', tier: 'tool' },
  { id: 'unity', name: 'Unity', tier: 'tool' },
  { id: 'android-studio', name: 'Android Studio', tier: 'tool' },
  { id: 'eclipse', name: 'Eclipse', tier: 'tool' },
  { id: 'netbeans', name: 'NetBeans', tier: 'tool' },
  { id: 'postman', name: 'Postman', tier: 'tool' },
  { id: 'visual-studio', name: 'Visual Studio', tier: 'tool' },
  { id: 'vscode', name: 'VS Code', tier: 'tool' },
  { id: 'xampp', name: 'XAMPP', tier: 'tool' },
]

export function technologiesByTier(tier: Technology['tier']): Technology[] {
  return technologies.filter((tech) => tech.tier === tier)
}

export function technologyNameById(id: string): string {
  const found = technologies.find((tech) => tech.id === id)
  return found !== undefined ? found.name : id
}
