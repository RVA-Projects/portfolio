import { useState, type KeyboardEvent, type SyntheticEvent } from 'react'
import { useLanguage } from '../../i18n'
import type { MediaItem } from '../../models/Project'
import { extractYouTubeId } from '../../utils/media'
import { IconButton } from '../base/IconButton'
import { IconChevronLeft, IconChevronRight } from '../base/Icons'
import styles from './MediaGallery.module.css'

interface MediaGalleryProps {
  /** ≥1 item. El componente se remonta por proyecto (key en el padre). */
  items: MediaItem[]
}

type ImageFailedState = Record<number, boolean>

/**
 * Galería de media (RF-11): media principal + miniaturas + prev/next +
 * indicador "1/N" (aria-live). Teclado ←/→. YouTube/iframes SOLO cargan al
 * activarlos (facade con botón de reproducción). Si la media es de video y
 * aún no existe (F7), muestra texto de no disponible, sin crash.
 */
export function MediaGallery({ items }: MediaGalleryProps) {
  const { language, texts } = useLanguage()
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [imageFailed, setImageFailed] = useState<ImageFailedState>({})

  if (items.length === 0) return null

  const current = items[Math.min(active, items.length - 1)]

  const goTo = (index: number) => {
    const clamped = Math.min(Math.max(0, index), items.length - 1)
    setPlaying(false)
    setActive(clamped)
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

  const onImageError = (index: number, event: SyntheticEvent<HTMLImageElement>) => {
    setImageFailed((prev) => ({ ...prev, [index]: true }))
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

  return (
    <div
      className={styles.gallery}
      role="region"
      aria-label={texts.projectOverlay.gallery}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className={styles.main}>{renderMain()}</div>

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
            {items.map((item, index) => {
              const isImage = item.kind === 'image' || item.kind === 'gif'
              return (
                <button
                  key={item.id}
                  type="button"
                  className={
                    index === active ? `${styles.thumb} ${styles['thumb--active']}` : styles.thumb
                  }
                  onClick={() => goTo(index)}
                  aria-label={`[${index + 1}] ${item.alt[language]}`}
                  aria-current={index === active}
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
