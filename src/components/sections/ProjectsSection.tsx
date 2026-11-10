import { useCallback, useMemo, useState } from 'react'
import { projects } from '../../data/projects'
import { technologies } from '../../data/technologies'
import type { SectionId } from '../../data/site'
import { useLanguage } from '../../i18n'
import { collectFilterTechnologies, filterProjects } from '../../utils/filter'
import { SectionHeading } from '../base/SectionHeading'
import { ProjectCarousel } from '../projects/ProjectCarousel'
import type { TechnologyFilterValue } from '../projects/TechnologyFilter'
import { TechnologyFilter } from '../projects/TechnologyFilter'
import styles from './ProjectsSection.module.css'

/** Índice del filtro estable: deriva del catálogo COMPLETO, no del filtrado. */
const FILTER_TECHNOLOGIES = collectFilterTechnologies(projects, technologies)

/**
 * Sección principal (RF-06/RF-07): cabecera + índice de tecnologías + carrusel.
 * El estado del filtro vive aquí (estado compartido de la sección); el derivado
 * (proyectos visibles) se calcula con useMemo, sin duplicación.
 *
 * TODO(F6.3/F6.4): ProjectOverlay + MediaGallery al seleccionar (openProjectId);
 * TODO(F6.9): LanguageProvider ya inyecta textos via useLanguage.
 */
export function ProjectsSection() {
  const { texts } = useLanguage()
  const [activeTech, setActiveTech] = useState<TechnologyFilterValue>(null)

  const filteredProjects = useMemo(() => filterProjects(projects, activeTech), [activeTech])

  const onSelect = useCallback((_projectId: string) => {
    // TODO(F6.3): abrir ProjectOverlay aquí (OverlayContext en F6).
  }, [])

  return (
    <section
      id={'projects' satisfies SectionId}
      className={styles.section}
      aria-label={texts.sections.projects}
    >
      <div className={styles.filterRow}>
        <SectionHeading kicker="02 — Projects" title={texts.sections.projects} />
        <TechnologyFilter
          technologies={FILTER_TECHNOLOGIES}
          activeId={activeTech}
          onChange={setActiveTech}
        />
      </div>
      <ProjectCarousel projects={filteredProjects} onSelect={onSelect} />
    </section>
  )
}
