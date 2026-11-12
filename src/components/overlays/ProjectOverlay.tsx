import { useEffect, useState } from 'react'
import { technologyNameById } from '../../data/technologies'
import { useLanguage } from '../../i18n'
import type { EducationalTextItem, Project } from '../../models/Project'
import { Button } from '../base/Button'
import { IconButton } from '../base/IconButton'
import { IconChevronLeft, IconChevronRight, IconClose } from '../base/Icons'
import { Modal } from '../base/Modal'
import { Tag } from '../base/Tag'
import { MediaGallery } from './MediaGallery'
import styles from './ProjectOverlay.module.css'

/**
 * Título del dialog: id estático porque solo existe un overlay abierto a la vez.
 */
const TITLE_ID = 'project-overlay-title'

function InfoBlock({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className={styles.block}>
      <h3>{heading}</h3>
      {children}
    </div>
  )
}

function ItemsList({ items }: { items: EducationalTextItem[] }) {
  const { language } = useLanguage()
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.text[language]}</li>
      ))}
    </ul>
  )
}

interface ProjectOverlayProps {
  project: Project | null
  onClose: () => void
  /** Navegación entre proyectos (F6.4): respeta el filtro activo; null ⇒ ocultos. */
  onPrev?: () => void
  onNext?: () => void
  hasPrev: boolean
  hasNext: boolean
}

/**
 * Overlay de proyecto (RF-10/RF-12/RF-13/RF-14): compone sobre Modal
 * (focus-trap, Escape, clic-fuera, scroll-lock, restauración de foco).
 * Escritorio 50/50 (galería | info con scroll independiente); móvil apilado.
 * La navegación prev/next NO cierra el overlay y respeta el filtro activo.
 * Las flechas flotan FUERA del panel (slot `aside` del Modal, ocultas <768px:
 * swipe + teclado cubren móvil) y ←/→ se escuchan a nivel documento — la
 * galería consume sus flechas con stopPropagation, igual que antes (F6.4).
 */
export function ProjectOverlay({
  project,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: ProjectOverlayProps) {
  const { language, texts } = useLanguage()

  /** Modo juego (RF-10/F7): iframe del juego a todo el panel del overlay. */
  const [playing, setPlaying] = useState(false)

  /* Al cambiar de proyecto o cerrar el overlay, sale del modo juego. */
  useEffect(() => {
    setPlaying(false)
  }, [project?.id])

  /* En modo juego: Escape cierra SOLO el juego (no el overlay); Modal es
     `dismissable: false`, así que ni backdrop ni Escape cierran el overlay. */
  useEffect(() => {
    if (!playing) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPlaying(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
    }
  }, [playing])

  useEffect(() => {
    if (project === null || playing) return
    const onKey = (event: KeyboardEvent) => {
      /* F6.4 teclado: ←/→ cambian de proyecto salvo que la galería los
         consuma (ella hace stopPropagation, así que no llegan aquí). */
      if (event.key === 'ArrowLeft' && hasPrev && onPrev !== undefined) {
        event.preventDefault()
        onPrev()
      }
      if (event.key === 'ArrowRight' && hasNext && onNext !== undefined) {
        event.preventDefault()
        onNext()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
    }
  }, [project, hasPrev, hasNext, onPrev, onNext, playing])

  if (project === null) return null

  const prevHandler = hasPrev ? onPrev : undefined
  const nextHandler = hasNext ? onNext : undefined

  const floatingNav =
    onPrev === undefined && onNext === undefined ? undefined : (
      <>
        {onPrev !== undefined && (
          <IconButton
            ariaLabel={texts.projectOverlay.prev}
            onClick={prevHandler ?? (() => {})}
            disabled={!hasPrev}
            icon={<IconChevronLeft />}
            className={`${styles.navArrow} ${styles.navPrev}`}
          />
        )}
        {onNext !== undefined && (
          <IconButton
            ariaLabel={texts.projectOverlay.next}
            onClick={nextHandler ?? (() => {})}
            disabled={!hasNext}
            icon={<IconChevronRight />}
            className={`${styles.navArrow} ${styles.navNext}`}
          />
        )}
      </>
    )

  return (
    <Modal
      open
      onClose={onClose}
      labelledById={TITLE_ID}
      flush
      aside={playing ? undefined : floatingNav}
      dismissable={!playing}
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <h2 id={TITLE_ID} className={styles.title}>
              {project.name[language]}
            </h2>
            <p className={styles.meta}>
              <Tag label={texts.categories[project.category]} variant="category" />
              {project.year !== undefined && (
                <span>
                  {texts.projectOverlay.year} {project.year}
                </span>
              )}
            </p>
          </div>
          <div className={styles.navRow}>
            <IconButton
              ariaLabel={texts.projectOverlay.close}
              onClick={onClose}
              icon={<IconClose />}
            />
          </div>
        </header>

        {playing ? (
          <div className={styles.playArea}>
            <iframe
              className={styles.playFrame}
              src={project.playUrl}
              title={project.name[language]}
              /* F4.2: el juego (GitHub Pages) entra en fullscreen solo si el
                 iframe lo delega: atributo legacy + allow modernos. */
              allow="fullscreen"
              allowFullScreen
            />
            <div className={styles.playBar}>
              <Button
                label={texts.projectOverlay.playClose}
                variant="primary"
                onClick={() => {
                  setPlaying(false)
                }}
              />
            </div>
          </div>
        ) : (
          <div className={styles.body}>
            <div className={styles.mediaSide}>
              {/* key: remonta la galería al cambiar de proyecto (F6.4) */}
              <MediaGallery key={project.id} items={project.media} />
              <div className={styles.tags}>
                {project.technologyIds.map((technologyId) => (
                  <Tag key={technologyId} label={technologyNameById(technologyId)} />
                ))}
              </div>
              {project.playUrl !== undefined && (
                <Button
                  label={texts.projectOverlay.play}
                  variant="primary"
                  onClick={() => {
                    setPlaying(true)
                  }}
                />
              )}
              {project.links.length > 0 && (
                <div className={styles.links}>
                  {project.links.map((link) => (
                    <Button
                      key={link.id}
                      label={texts.projectOverlay.links[link.id]}
                      href={link.url}
                      external
                    />
                  ))}
                </div>
              )}
            </div>

            <div className={styles.infoSide}>
              <InfoBlock heading={texts.projectOverlay.labels.goal}>
                <p>{project.goal[language]}</p>
              </InfoBlock>
              <InfoBlock heading={texts.projectOverlay.labels.problem}>
                <p>{project.problem[language]}</p>
              </InfoBlock>
              <InfoBlock heading={texts.projectOverlay.labels.role}>
                <p>{project.role[language]}</p>
              </InfoBlock>
              <InfoBlock heading={texts.projectOverlay.labels.architecture}>
                <p>{project.architecture[language]}</p>
              </InfoBlock>
              {project.features.length > 0 && (
                <InfoBlock heading={texts.projectOverlay.labels.features}>
                  <ItemsList items={project.features} />
                </InfoBlock>
              )}
              {project.technicalDecisions.length > 0 && (
                <InfoBlock heading={texts.projectOverlay.labels.technicalDecisions}>
                  <ItemsList items={project.technicalDecisions} />
                </InfoBlock>
              )}
              <InfoBlock heading={texts.projectOverlay.labels.outcomes}>
                <p>{project.outcomes[language]}</p>
              </InfoBlock>
              <InfoBlock heading={texts.projectOverlay.labels.learnings}>
                <p>{project.learnings[language]}</p>
              </InfoBlock>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
