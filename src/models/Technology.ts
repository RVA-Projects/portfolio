import type { BaseEntity } from './common'

export type TechnologyTier = 'core' | 'project' | 'tool'

export interface Technology extends BaseEntity {
  /** Nombre canónico, igual en ambos idiomas. */
  name: string
  /** Nivel: principal | usada en proyectos | herramienta complementaria. */
  tier: TechnologyTier
}
