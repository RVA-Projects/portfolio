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
  /**
   * Contenido complementario DEL LADO del panel (p. ej. flechas flotantes de
   * navegación del ProjectOverlay, position:fixed): se renderiza dentro del
   * backdrop —fuera del `overflow` del panel— y por tanto dentro del
   * focus-trap (el trap abarca todo el backdrop).
   */
  aside?: ReactNode
  /**
   * `false`: clic en el backdrop y Escape NO cierran (modo juego del
   * ProjectOverlay: no se pierde la partida por clic accidental). El
   * componente cliente conserva el cierre con su botón X del header y gestiona
   * sus propias salidas de teclado (a11y 2.1.2: siempre hay escape por teclado).
   */
  dismissable?: boolean
  children: ReactNode
}

/**
 * OverlayBase: primitiva de TODOS los overlays (ProjectOverlay, DocumentViewerOverlay).
 * Comporta: aria-modal, cierre con Escape, clic en backdrop, bloqueo del scroll
 * del body (useBodyScrollLock) y focus-trap + restauración del foco al cerrar
 * (useFocusTrap). El trap usa el BACKDROP completo, así que los nodos `aside`
 * quedan atrapados sin abandonar el overflow del panel.
 */
export function Modal({
  open,
  onClose,
  labelledById,
  flush = false,
  aside,
  dismissable = true,
  children,
}: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !dismissable) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, dismissable])

  useBodyScrollLock(open)
  useFocusTrap(backdropRef, open)

  if (!open) return null

  return (
    <div
      ref={backdropRef}
      className={styles.backdrop}
      onClick={(e) => {
        if (dismissable && e.target === e.currentTarget) onClose()
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
      {aside}
    </div>
  )
}
