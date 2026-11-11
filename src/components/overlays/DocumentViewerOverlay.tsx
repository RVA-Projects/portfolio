import { useEffect, useState } from 'react'
import { useLanguage } from '../../i18n'
import type { DocumentRef } from '../../models/common'
import { googleDriveEmbedUrl } from '../../utils/media'
import { Button } from '../base/Button'
import { IconClose } from '../base/Icons'
import { IconButton } from '../base/IconButton'
import { Modal } from '../base/Modal'
import styles from './DocumentViewerOverlay.module.css'

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

/** Id estático del título: solo existe un visor abierto a la vez. */
const TITLE_ID = 'document-viewer-title'

/** Espera máxima del iframe antes de declarar fallo controlado (RF-18). */
const LOAD_TIMEOUT_MS = 8000

type ViewerState = 'loading' | 'ready' | 'error'

/**
 * DocumentViewerOverlay genérico (RF-18, D03). Reutilizado por formación
 * (F6.6) e idiomas (F6.7): solo cambia el documento.
 * - PDF embebido dentro del overlay (NUNCA pestaña nueva como visor).
 * - Google Drive: transforma la URL de visor a `/preview` para embeber.
 * - Si el documento no está disponible (PDF pendiente de subida, badge
 *   externo que bloquea el embebido), muestra un estado de error controlado
 *   (título + cuerpo traducidos) con acciones de abrir/descargar; NUNCA crashea.
 * - Cierre: botón + Escape + clic fuera (delega en `Modal`, que gestiona
 *   focus-trap, scroll-lock y restauración del foco).
 */
export function DocumentViewerOverlay({ document, onClose, ui }: DocumentViewerOverlayProps) {
  const { language } = useLanguage()
  const [state, setState] = useState<ViewerState>('loading')

  const src = document?.src ?? null

  /* Por cada documento: reset a carga + temporizador de fallo controlado.
     jsdom/navegadores no emiten error fiable cuando el embebido es bloqueado
     (X-Frame-Options) o 404, así que el timeout es el detector de fallo. */
  useEffect(() => {
    if (src === null) return
    setState('loading')
    const timer = window.setTimeout(() => {
      setState((current) => (current === 'loading' ? 'error' : current))
    }, LOAD_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [src])

  if (document === null) return null

  const embedSrc = googleDriveEmbedUrl(document.src) ?? document.src

  return (
    <Modal open onClose={onClose} labelledById={TITLE_ID}>
      <div className={styles.viewer}>
        <header className={styles.header}>
          <h2 id={TITLE_ID} className={styles.title}>
            {document.name[language]}
          </h2>
          <IconButton ariaLabel={ui.close} onClick={onClose} icon={<IconClose />} />
        </header>

        {state === 'error' ? (
          <div className={styles.error}>
            <p className={styles.errorTitle}>{ui.errorTitle}</p>
            <p className={styles.errorBody}>{ui.errorBody}</p>
            <div className={styles.errorActions}>
              <Button label={ui.openNewTab} href={document.src} external />
              <Button label={ui.download} href={document.src} download />
            </div>
          </div>
        ) : (
          <iframe
            className={styles.frame}
            src={embedSrc}
            title={document.name[language]}
            onLoad={() => {
              setState((current) => (current === 'loading' ? 'ready' : current))
            }}
          />
        )}
      </div>
    </Modal>
  )
}
