import { useCallback, useMemo, useState } from 'react'
import { projects } from '../../data/projects'
import { technologies } from '../../data/technologies'
import type { SectionId } from '../../data/site'
import { useLanguage } from '../../i18n'
import { collectFilterTechnologies, filterProjects } from '../../utils/filter'
import { SectionHeading } from '../base/SectionHeading'
import { ProjectOverlay } from '../overlays/ProjectOverlay'
import { ProjectCarousel } from '../projects/ProjectCarousel'
import type { TechnologyFilterValue } from '../projects/TechnologyFilter'
import { TechnologyFilter } from '../projects/TechnologyFilter'
import styles from './ProjectsSection.module.css'

/** Índice del filtro estable: deriva del catálogo COMPLETO, no del filtrado. */
const FILTER_TECHNOLOGIES = collectFilterTechnologies(projects, technologies)

/**
 * Sección principal (RF-06/RF-07/RF-10): cabecera + índice de tecnologías +
 * carrusel + overlay de proyecto. El estado (filtro e índice abierto) vive
 * aquí; el derivado (proyectos visibles) se calcula con useMemo.
 *
 * F6.4: la navegación del overlay usa índices DENTRO de filteredProjects,
 * de modo que prev/next respeta el filtro activo (RF-10).
 */
export function ProjectsSection() {
  const { texts } = useLanguage()
  const [activeTech, setActiveTech] = useState<TechnologyFilterValue>(null)
  /** Índice abierto dentro de filteredProjects; null ⇒ overlay cerrado. */
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filteredProjects = useMemo(() => filterProjects(projects, activeTech), [activeTech])

  const openProject = openIndex !== null ? (filteredProjects[openIndex] ?? null) : null

  const onSelect = useCallback(
    (projectId: string) => {
      const index = filteredProjects.findIndex((project) => project.id === projectId)
      setOpenIndex(index >= 0 ? index : null)
    },
    [filteredProjects],
  )

  const goPrev = useCallback(() => {
    setOpenIndex((current) => (current !== null && current > 0 ? current - 1 : current))
  }, [])

  const goNext = useCallback(() => {
    setOpenIndex((current) =>
      current !== null && current < filteredProjects.length - 1 ? current + 1 : current,
    )
  }, [filteredProjects.length])

  const closeOverlay = useCallback(() => {
    setOpenIndex(null)
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

      <ProjectOverlay
        project={openProject}
        onClose={closeOverlay}
        onPrev={openIndex !== null ? goPrev : undefined}
        onNext={openIndex !== null ? goNext : undefined}
        hasPrev={openIndex !== null && openIndex > 0}
        hasNext={openIndex !== null && openIndex < filteredProjects.length - 1}
      />
    </section>
  )
}
