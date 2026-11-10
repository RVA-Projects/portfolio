import type { BaseEntity, DocumentRef, LocalizedText } from './common'

export interface LanguageProfile extends BaseEntity {
  /** Código ISO del idioma (ej. 'ca' valenciano, 'de' alemán). */
  code: string
  name: LocalizedText
  /** 'Nativo' | 'C1' | 'B2' | 'Starter'… (D04). */
  cefr?: string
  spoken?: string
  written?: string
  /** Valenciano C1 e Inglés B2 llevan certificado; reutiliza DocumentViewerOverlay. */
  document?: DocumentRef
}
