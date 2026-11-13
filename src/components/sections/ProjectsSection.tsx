import { useCallback, useMemo, useState } from 'react'
import { projects } from '../../data/projects'
import { FILTER_CATEGORIES } from '../../data/technologies'
import type { SectionId } from '../../data/site'
import { useLanguage } from '../../i18n'
import { filterProjects } from '../../utils/filter'
import { SectionHeading } from '../base/SectionHeading'
import { ProjectOverlay } from '../overlays/ProjectOverlay'
import { ProjectCarousel } from '../projects/ProjectCarousel'
import type { FilterCategoryValue } from '../projects/TechnologyFilter'
import { TechnologyFilter } from '../projects/TechnologyFilter'
import styles from './ProjectsSection.module.css'

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
  const [activeCategory, setActiveCategory] = useState<FilterCategoryValue>(null)
  /** Índice abierto dentro de filteredProjects; null ⇒ overlay cerrado. */
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filteredProjects = useMemo(() => filterProjects(projects, activeCategory), [activeCategory])

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
        <SectionHeading index={1} title={texts.sections.projects} />
        <TechnologyFilter
          categories={FILTER_CATEGORIES}
          activeId={activeCategory}
          onChange={setActiveCategory}
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
