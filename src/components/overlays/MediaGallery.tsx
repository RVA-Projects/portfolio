import { useState, type KeyboardEvent, type SyntheticEvent } from 'react'
import { useLanguage } from '../../i18n'
import type { MediaItem } from '../../models/Project'
import { extractYouTubeId } from '../../utils/media'
import { IconButton } from '../base/IconButton'
import { IconChevronLeft, IconChevronRight, IconZoom } from '../base/Icons'
import styles from './MediaGallery.module.css'

interface MediaGalleryProps {
  /** ≥1 item. El componente se remonta por proyecto (key en el padre). */
  items: MediaItem[]
  /** Fase 3: índice CONTROLADO por ProjectOverlay (compartido con el zoom). */
  index: number
  onIndexChange: (index: number) => void
  /** Abre el visor ampliado (solo ofrece el botón para image/gif). */
  onOpenZoom: () => void
}

type ImageFailedState = Record<number, boolean>

/**
 * Galería de media (RF-11): media principal + miniaturas + prev/next +
 * indicador "1/N" (aria-live). Teclado ←/→. YouTube/iframes SOLO cargan al
 * activarlos (facade con botón de reproducción). Fase 3: el índice vive en
 * ProjectOverlay (galería controlada) y las imágenes ofrecen botón de lupa
 * para el visor ampliado (siempre visible: accesible sin hover, también táctil).
 */
export function MediaGallery({ items, index, onIndexChange, onOpenZoom }: MediaGalleryProps) {
  const { language, texts } = useLanguage()
  const [playing, setPlaying] = useState(false)
  const [imageFailed, setImageFailed] = useState<ImageFailedState>({})

  if (items.length === 0) return null

  const active = Math.min(index, items.length - 1)
  const current = items[active]

  const goTo = (next: number) => {
    const clamped = Math.min(Math.max(0, next), items.length - 1)
    setPlaying(false)
    onIndexChange(clamped)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // stopPropagation: el overlay no debe reaccionar a ←/→ de la galería
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      event.stopPropagation()
      goTo(active - 1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      event.stopPropagation()
      goTo(active + 1)
    }
  }

  const onImageError = (failedIndex: number, event: SyntheticEvent<HTMLImageElement>) => {
    setImageFailed((prev) => ({ ...prev, [failedIndex]: true }))
    event.currentTarget.style.display = 'none'
  }

  const renderMain = () => {
    switch (current.kind) {
      case 'image':
      case 'gif': {
        if (imageFailed[active]) {
          return <p className={styles.fallback}>{texts.gallery.unavailable}</p>
        }
        return (
          <img
            src={current.src}
            alt={current.alt[language]}
            loading="lazy"
            onError={(event) => onImageError(active, event)}
          />
        )
      }
      case 'video-local':
        return <video src={current.src} controls preload="metadata" />
      case 'video-youtube': {
        const videoId = extractYouTubeId(current.src)
        if (videoId === null) {
          return <p className={styles.fallback}>{texts.gallery.unavailable}</p>
        }
        if (playing) {
          return (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
              title={current.alt[language]}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          )
        }
        return (
          <button
            type="button"
            className={styles.playBtn}
            onClick={() => setPlaying(true)}
            aria-label={texts.gallery.play}
          >
            ▶
          </button>
        )
      }
      case 'external-demo':
        /* Demo externa: se muestra la miniatura y el enlace real vive en info */
        return current.thumbnail !== undefined ? (
          <img
            src={current.thumbnail}
            alt={current.alt[language]}
            loading="lazy"
            onError={(event) => onImageError(active, event)}
          />
        ) : (
          <p className={styles.fallback}>{current.alt[language]}</p>
        )
    }
  }

  const zoomable = (current.kind === 'image' || current.kind === 'gif') && !imageFailed[active]

  return (
    <div
      className={styles.gallery}
      role="region"
      aria-label={texts.projectOverlay.gallery}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className={styles.main}>
        {renderMain()}
        {zoomable && (
          <IconButton
            ariaLabel={texts.projectOverlay.zoom}
            onClick={onOpenZoom}
            icon={<IconZoom size={20} />}
            className={styles.zoomBtn}
          />
        )}
      </div>

      {items.length > 1 && (
        <div className={styles.thumbsRow}>
          <div className={styles.controls}>
            <IconButton
              ariaLabel={texts.gallery.prev}
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              icon={<IconChevronLeft size={20} />}
            />
            <IconButton
              ariaLabel={texts.gallery.next}
              onClick={() => goTo(active + 1)}
              disabled={active === items.length - 1}
              icon={<IconChevronRight size={20} />}
            />
          </div>
          <div className={styles.thumbs}>
            {items.map((item, thumbIndex) => {
              const isImage = item.kind === 'image' || item.kind === 'gif'
              return (
                <button
                  key={item.id}
                  type="button"
                  className={
                    thumbIndex === active
                      ? `${styles.thumb} ${styles['thumb--active']}`
                      : styles.thumb
                  }
                  onClick={() => goTo(thumbIndex)}
                  aria-label={`[${thumbIndex + 1}] ${item.alt[language]}`}
                  aria-current={thumbIndex === active}
                >
                  {isImage && item.thumbnail !== undefined ? (
                    <img src={item.thumbnail} alt="" loading="lazy" />
                  ) : isImage ? (
                    <img src={item.src} alt="" loading="lazy" />
                  ) : (
                    <span className={styles.thumbGlyph} aria-hidden="true">
                      ▶
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <p className={styles.counter} aria-live="polite" aria-atomic="true">
            {active + 1} / {items.length}
          </p>
        </div>
      )}
    </div>
  )
}
