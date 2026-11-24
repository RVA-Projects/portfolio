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
 * prev/next + teclado (←/→). Sin autoplay. La lógica
 * vive en hooks/useCarousel.ts; este componente solo presenta.
 */
export function ProjectCarousel({ projects, onSelect }: ProjectCarouselProps) {
  const state = useCarousel(projects.length)
  const { texts } = useLanguage()

  /* Con 0 proyectos (p. ej. Python/Java, F2.2) se muestra la cuenta "0
     proyectos": el filtro no desaparece ni deja hueco silencioso. */
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

      {projects.length > 0 && (
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
      )}
    </div>
  )
}
