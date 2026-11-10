import { useEffect, useRef, type ReactNode } from 'react'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import styles from './Modal.module.css'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** id del elemento que etiqueta el dialog (obligatorio para aria-labelledby). */
  labelledById: string
  /**
   * `flush`: el panel NO hace scroll por sí mismo (overflow hidden + flex);
   * el scroll lo gestionan las columnas hijas (layout 50/50 del ProjectOverlay).
   */
  flush?: boolean
  children: ReactNode
}

/**
 * OverlayBase: primitiva de TODOS los overlays (ProjectOverlay, DocumentViewerOverlay).
 * Comporta: aria-modal, cierre con Escape, clic en backdrop, bloqueo del scroll
 * del body (useBodyScrollLock) y focus-trap + restauración del foco al cerrar
 * (useFocusTrap).
 */
export function Modal({ open, onClose, labelledById, flush = false, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  useBodyScrollLock(open)
  useFocusTrap(panelRef, open)

  if (!open) return null

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        className={flush ? `${styles.panel} ${styles.panelFlush}` : styles.panel}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  )
}
