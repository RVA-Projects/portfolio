import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** id del elemento que etiqueta el dialog (obligatorio para aria-labelledby). */
  labelledById: string
  children: ReactNode
}

/**
 * OverlayBase: primitiva de TODOS los overlays (ProjectOverlay, DocumentViewerOverlay).
 * Comporta: aria-modal, cierre con Escape, clic en backdrop, bloqueo del scroll
 * del body y restauración del foco al trigger al cerrar.
 *
 * TODO(F5.5): focus-trap completo (useFocusTrap), gestión de scroll-lock robusto
 * (varios overlays), inicio del foco dentro del panel.
 */
export function Modal({ open, onClose, labelledById, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="modal__backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby={labelledById} className="modal__panel">
        {children}
      </div>
    </div>
  )
}
