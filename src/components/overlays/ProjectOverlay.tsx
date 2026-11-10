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

  if (project === null) return null

  const prevHandler = hasPrev ? onPrev : undefined
  const nextHandler = hasNext ? onNext : undefined

  return (
    <Modal open onClose={onClose} labelledById={TITLE_ID} flush>
      <div
        className={styles.inner}
        onKeyDown={(event) => {
          /* F6.4 teclado: ←/→ cambian de proyecto salvo que la galería los
             consuma (ella hace stopPropagation). */
          if (event.key === 'ArrowLeft' && hasPrev && onPrev !== undefined) {
            event.preventDefault()
            onPrev()
          }
          if (event.key === 'ArrowRight' && hasNext && onNext !== undefined) {
            event.preventDefault()
            onNext()
          }
        }}
      >
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
            {onPrev !== undefined && (
              <IconButton
                ariaLabel={texts.projectOverlay.prev}
                onClick={prevHandler ?? (() => {})}
                disabled={!hasPrev}
                icon={<IconChevronLeft />}
              />
            )}
            {onNext !== undefined && (
              <IconButton
                ariaLabel={texts.projectOverlay.next}
                onClick={nextHandler ?? (() => {})}
                disabled={!hasNext}
                icon={<IconChevronRight />}
              />
            )}
            <IconButton
              ariaLabel={texts.projectOverlay.close}
              onClick={onClose}
              icon={<IconClose />}
            />
          </div>
        </header>

        <div className={styles.body}>
          <div className={styles.mediaSide}>
            {/* key: remonta la galería al cambiar de proyecto (F6.4) */}
            <MediaGallery key={project.id} items={project.media} />
            <div className={styles.tags}>
              {project.technologyIds.map((technologyId) => (
                <Tag key={technologyId} label={technologyNameById(technologyId)} />
              ))}
            </div>
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
      </div>
    </Modal>
  )
}
