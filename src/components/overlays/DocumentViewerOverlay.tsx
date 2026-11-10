import type { DocumentRef } from '../../models/common'

interface DocumentViewerOverlayProps {
  /** null ⇒ cerrado. */
  document: DocumentRef | null
  onClose: () => void
  /** Strings de UI traducidos (TODO(F6.9) conectará al contexto i18n). */
  ui: {
    close: string
    openNewTab: string
    download: string
    errorTitle: string
    errorBody: string
  }
}

/**
 * DocumentViewerOverlay genérico (RF-18, D03).
 * - PDF embebido dentro del overlay (NUNCA pestaña nueva).
 * - Muestra el nombre del documento; acciones secundarias: abrir/descargar.
 * - Si el PDF no está disponible (mientras el propietario lo sube), muestra
 *   un estado de error controlado (título + cuerpo traducidos), NUNCA crashea.
 * - Cierre: botón + Escape + clic fuera (usa `Modal`).
 * - Detección de fallo del iframe con timeout/estado, sin romper el layout.
 */
export function DocumentViewerOverlay(_props: DocumentViewerOverlayProps) {
  return null
}
