/** Primitivas comunes compartidas por todos los modelos. Ver docs/contracts.md. */

export type LanguageId = 'es' | 'en'

/** Cualquier contenido de entidad localizable: ES y EN obligatorios. */
export interface LocalizedText {
  es: string
  en: string
}

/** Categoría de proyecto. `ai-assisted`: desarrollado con agentes IA (OpenCode). */
export type CategoryId = 'web' | 'desktop' | 'android' | 'collab' | 'ai-assisted'

export type GlobalLinkId = 'github' | 'demo' | 'web' | 'docs' | 'cv' | 'older-portfolio'

export interface GlobalLink {
  id: GlobalLinkId
  url: string
  ariaLabel: LocalizedText
}

export interface BaseEntity {
  /** Identificador estable (kebab-case). NUNCA se usa el nombre visible como id. */
  id: string
}

/**
 * Referencia a un documento acreditativo (PDF). D03: se sirve local bajo
 * /docs/ (o URL externa validada). El visor tolera fichero ausente con
 * estado de error controlado.
 */
export interface DocumentRef {
  /** Ruta local (/docs/…) o URL externa validada. */
  src: string
  /** Nombre del documento en el visor. */
  name: LocalizedText
}
