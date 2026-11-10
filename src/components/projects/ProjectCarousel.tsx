import { useCarousel } from '../../hooks/useCarousel'
import { useLanguage } from '../../i18n'
import type { Project } from '../../models/Project'
import { IconButton } from '../base/IconButton'
import { IconChevronLeft, IconChevronRight } from '../base/Icons'
import { ProjectCard } from './ProjectCard'
import styles from './ProjectCarousel.module.css'

interface ProjectCarouselProps {
  /** Proyectos ya filtrados (la sección resuelve el filtro, RF-07). */
  projects: Project[]
  onSelect: (projectId: string) => void
}

/**
 * Carrusel horizontal (RF-08): scroll-snap nativo (swipe táctil) + botones
 * prev/next + indicador de posición + teclado (←/→). Sin autoplay. La lógica
 * vive en hooks/useCarousel.ts; este componente solo presenta.
 */
export function ProjectCarousel({ projects, onSelect }: ProjectCarouselProps) {
  const state = useCarousel(projects.length)
  const { texts } = useLanguage()

  if (projects.length === 0) return null

  return (
    <div>
      <div className={styles.controlsRow}>
        <p className={styles.count} aria-live="polite">
          {texts.filter.count(projects.length)}
        </p>
        <div className={styles.buttons}>
          <IconButton
            ariaLabel={texts.carousel.prev}
            onClick={state.scrollPrev}
            disabled={!state.canPrev}
            icon={<IconChevronLeft />}
          />
          <IconButton
            ariaLabel={texts.carousel.next}
            onClick={state.scrollNext}
            disabled={!state.canNext}
            icon={<IconChevronRight />}
          />
        </div>
      </div>

      <div
        ref={state.ref}
        className={styles.viewport}
        onScroll={state.onScroll}
        onKeyDown={state.onKeyDown}
        tabIndex={0}
        role="region"
        aria-label={texts.carousel.viewport}
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onSelect={onSelect} />
        ))}
      </div>

      <p
        className={styles.count}
        aria-live="polite"
        aria-atomic="true"
        role="status"
        style={{ marginTop: 'var(--space-2)' }}
      >
        {/* Indicador de posición 1/N (RF-08) */}
        <span aria-hidden="true">
          {state.index + 1} / {state.count}
        </span>
        <span className="visually-hidden">{texts.filter.a11yCount(state.count)}</span>
      </p>
    </div>
  )
}
