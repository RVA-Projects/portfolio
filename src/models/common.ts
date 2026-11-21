/** Primitivas comunes compartidas por todos los modelos. Ver docs/contracts.md. */

export type LanguageId = 'es' | 'en'

/** Cualquier contenido de entidad localizable: ES y EN obligatorios. */
export interface LocalizedText {
  es: string
  en: string
}

/** Categoría de proyecto. `ai-assisted`: desarrollado con agentes IA (OpenCode). */
export type CategoryId = 'web' | 'desktop' | 'android' | 'collab' | 'ai-assisted'

/** Categorías que aparecen como badges en tarjetas y en el filtro de proyectos. */
export type FilterCategoryId = 'android' | 'web' | 'csharp' | 'python' | 'java'

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
  /**
   * Tipo de recurso (ronda 4 F4, D-E) OBLIGATORIO — nada de detectarlo por
   * nombre o categoría: 'pdf' se abre en el visor overlay (iframe con error
   * controlado); 'external' se abre en PESTAÑA NUEVA (target=_blank +
   * rel noopener noreferrer) porque proveedores como Credly/CertView
   * rechazan el iframe (X-Frame-Options).
   */
  kind: 'pdf' | 'external'
  /** Nombre del documento en el visor. */
  name: LocalizedText
}
