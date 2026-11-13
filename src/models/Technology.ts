import type { BaseEntity } from './common'

export type TechnologyTier = 'core' | 'explored'

export interface Technology extends BaseEntity {
  /** Nombre canónico, igual en ambos idiomas. */
  name: string
  /** Nivel: stack principal | explorado (proyectos y experimentos, D27). */
  tier: TechnologyTier
  /**
   * Icono: ruta/slug custom en /assets/img/icons/<x>.png (logotipos sin
   * SVG disponible) o ausente ⇒ el componente TechIcon resuelve su SVG
   * inline por `id` (sin CDN externo).
   */
  icon?: 'python' | 'unity' | 'xampp' | 'odoo'
  /**
   * D28 — adaptación visual de la marca (ronda 2, F4): 'mono' ⇒ silueta que
   * hereda el color del texto del tema (mask + currentColor; logotipos
   * monocromos oscuros: github, unity, wordpress, mysql); 'dim' ⇒ marca
   * multicolor con masa oscura: se aclara SOLO en modo oscuro (eclipse,
   * visual-studio, sqlite, csharp). Ausente ⇒ el logo funciona en ambos
   * temas tal cual.
   */
  adapt?: 'mono' | 'dim'
}
