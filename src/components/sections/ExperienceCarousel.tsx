import { useCarousel } from '../../hooks/useCarousel'
import { useLanguage } from '../../i18n'
import type { Experience } from '../../models/Experience'
import { IconButton } from '../base/IconButton'
import { IconChevronLeft, IconChevronRight } from '../base/Icons'
import { ExperienceCard } from './ExperienceCard'
/* Ronda 6 F1 — reutilización máxima: mismo carrusel visual que Proyectos
   (controles arriba, viewport scroll-snap, indicador 1/N). El CSS module
   se IMPORTA en vez de duplicarse; los anchos por breakpoint de tarjeta
   viven en ExperienceCard.module.css. */
import carouselStyles from '../projects/ProjectCarousel.module.css'

interface ExperienceCarouselProps {
  experiences: Experience[]
  onSelect: (experienceId: string) => void
}

/**
 * Carrusel de experiencia (ronda 6 F1): la MISMA arquitectura del carrusel
 * de Proyectos (RF-08, hook useCarousel sin librerías): scroll-snap nativo
 * (swipe táctil) + botones prev/next + indicador de posición + teclado
 * (←/→). Sin autoplay. Sin imágenes: las tarjetas son las minimalistas de
 * siempre (título + periodo + TechIcon).
 */
export function ExperienceCarousel({ experiences, onSelect }: ExperienceCarouselProps) {
  const state = useCarousel(experiences.length)
  const { texts } = useLanguage()

  return (
    <div>
      <div className={carouselStyles.controlsRow}>
        <p className={carouselStyles.count} aria-live="polite">
          {texts.experience.count(experiences.length)}
        </p>
        <div className={carouselStyles.buttons}>
          <IconButton
            ariaLabel={texts.experience.prev}
            onClick={state.scrollPrev}
            disabled={!state.canPrev}
            icon={<IconChevronLeft />}
          />
          <IconButton
            ariaLabel={texts.experience.next}
            onClick={state.scrollNext}
            disabled={!state.canNext}
            icon={<IconChevronRight />}
          />
        </div>
      </div>

      <div
        ref={state.ref}
        className={carouselStyles.viewport}
        onScroll={state.onScroll}
        onKeyDown={state.onKeyDown}
        tabIndex={0}
        role="region"
        aria-label={texts.experience.viewport}
      >
        {experiences.map((item) => (
          <ExperienceCard key={item.id} item={item} onOpen={onSelect} />
        ))}
      </div>

      <p
        className={carouselStyles.count}
        aria-live="polite"
        aria-atomic="true"
        role="status"
        style={{ marginTop: 'var(--space-2)' }}
      >
        {/* Indicador de posición 1/N (mismo patrón que Proyectos) */}
        <span aria-hidden="true">
          {state.index + 1} / {state.count}
        </span>
        <span className="visually-hidden">{texts.experience.count(state.count)}</span>
      </p>
    </div>
  )
}
