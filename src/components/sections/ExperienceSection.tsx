import { useCallback, useState } from 'react'
import { experience } from '../../data/experience'
import { projects } from '../../data/projects'
import type { SectionId } from '../../data/site'
import { useLanguage } from '../../i18n'
import { SectionHeading } from '../base/SectionHeading'
import { ExperienceOverlay } from '../overlays/ExperienceOverlay'
import { ProjectOverlay } from '../overlays/ProjectOverlay'
import { ExperienceCard } from './ExperienceCard'
import styles from './ExperienceSection.module.css'

/**
 * Sección de experiencia (RF-15, Fase 5/6): lista plana de tarjetas
 * minimalistas + overlay de detalle (patrón del visor de proyectos). El
 * estado vive aquí: tarjeta → ExperienceOverlay; «Ver proyecto» cierra el
 * overlay de experiencia y abre el ProjectOverlay de la ficha asociada
 * (sin navegación prev/next: no hay lista de proyectos activa aquí).
 */
export function ExperienceSection() {
  const { texts } = useLanguage()
  /** Experiencia abierta (id); null ⇒ overlay cerrado. */
  const [activeExperienceId, setActiveExperienceId] = useState<string | null>(null)
  /** Ficha de proyecto abierta desde el overlay de experiencia. */
  const [openProjectId, setOpenProjectId] = useState<string | null>(null)

  const activeExperience = experience.find((item) => item.id === activeExperienceId) ?? null
  const openProject = projects.find((project) => project.id === openProjectId) ?? null

  const openExperience = useCallback((id: string) => {
    setActiveExperienceId(id)
  }, [])

  const openAssociatedProject = useCallback((projectId: string) => {
    /* El overlay de experiencia se cierra: evita dos Modales superpuestos
       y el doble Escape (decisión aprobada, Fase 5). */
    setActiveExperienceId(null)
    setOpenProjectId(projectId)
  }, [])

  const closeExperience = useCallback(() => {
    setActiveExperienceId(null)
  }, [])

  const closeProject = useCallback(() => {
    setOpenProjectId(null)
  }, [])

  return (
    <section
      id={'experience' satisfies SectionId}
      className={styles.section}
      aria-label={texts.sections.experience}
    >
      <SectionHeading kicker="04 — Experience" title={texts.sections.experience} />
      <div className={styles.cards}>
        {experience.map((item) => (
          <ExperienceCard key={item.id} item={item} onOpen={openExperience} />
        ))}
      </div>

      <ExperienceOverlay
        experience={activeExperience}
        onClose={closeExperience}
        onOpenProject={openAssociatedProject}
        projects={projects}
      />
      <ProjectOverlay
        project={openProject}
        onClose={closeProject}
        hasPrev={false}
        hasNext={false}
      />
    </section>
  )
}
