import type { BaseEntity, CategoryId, LocalizedText } from './common'

export type MediaKind = 'image' | 'gif' | 'video-local' | 'video-youtube' | 'external-demo'

export interface MediaItem extends BaseEntity {
  kind: MediaKind
  /** Ruta local bajo /media/projects/<slug>/ o URL externa validada. */
  src: string
  /** Obligatorio para imágenes; descripción accesible en vídeo. */
  alt: LocalizedText
  thumbnail?: string
}

export type ProjectLinkId = 'github' | 'demo' | 'web' | 'docs'

export interface ProjectLink {
  id: ProjectLinkId
  url: string
}

/** Texto estructurado de listas (features, decisiones…). */
export interface EducationalTextItem {
  id: string
  text: LocalizedText
}

export interface Project extends BaseEntity {
  /** Coincide con la carpeta de media y con el fichero de datos. */
  slug: string
  /** Año de realización si se conoce; ausente si no hay dato verificado. */
  year?: number
  name: LocalizedText
  /** Texto breve de la tarjeta. */
  summary: LocalizedText
  category: CategoryId
  /** Referencias a Technology por id (catálogo de src/data/technologies.ts). */
  technologyIds: string[]
  /** ≥1 item; el primero es la media principal. */
  media: MediaItem[]
  /** Solo los enlaces que existan. Prohibido inventar repos. */
  links: ProjectLink[]
  /**
   * URL jugable embebida: el ProjectOverlay ofrece un botón «Jugar» que
   * carga este juego en un iframe a pantalla completa del overlay. Solo
   * para proyectos realmente jugables en navegador (snake).
   */
  playUrl?: string

  /* Detalle del overlay (RF-12) */
  goal: LocalizedText
  problem: LocalizedText
  role: LocalizedText
  architecture: LocalizedText
  features: EducationalTextItem[]
  technicalDecisions: EducationalTextItem[]
  outcomes: LocalizedText
  learnings: LocalizedText
}
