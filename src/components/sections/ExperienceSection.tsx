import { useCallback, useState } from 'react'
import { experience } from '../../data/experience'
import { projects } from '../../data/projects'
import type { SectionId } from '../../data/site'
import { useLanguage } from '../../i18n'
import { SectionHeading } from '../base/SectionHeading'
import { ExperienceCarousel } from './ExperienceCarousel'
import { ExperienceOverlay } from '../overlays/ExperienceOverlay'
import { ProjectOverlay } from '../overlays/ProjectOverlay'
import styles from './ExperienceSection.module.css'

/**
 * Sección de experiencia (RF-15, Fase 5/6; carrusel desde ronda 6 F1):
 * carrusel horizontal con la MISMA arquitectura que Proyectos (useCarousel,
 * scroll-snap, flechas) + overlay de detalle (patrón del visor de proyectos).
 * El estado vive aquí: tarjeta → ExperienceOverlay (prev/next mantiene el
 * overlay abierto); «Ver proyecto» cierra el overlay de experiencia y abre
 * el ProjectOverlay de la ficha asociada (sin navegación prev/next: no hay
 * lista de proyectos activa aquí).
 */
export function ExperienceSection() {
  const { texts } = useLanguage()
  /** Experiencia abierta (id); null ⇒ overlay cerrado. */
  const [activeExperienceId, setActiveExperienceId] = useState<string | null>(null)
  /** Ficha de proyecto abierta desde el overlay de experiencia. */
  const [openProjectId, setOpenProjectId] = useState<string | null>(null)

  const activeIndex = experience.findIndex((item) => item.id === activeExperienceId)
  const activeExperience = activeIndex >= 0 ? experience[activeIndex] : null
  const openProject = projects.find((project) => project.id === openProjectId) ?? null

  const openExperience = useCallback((id: string) => {
    setActiveExperienceId(id)
  }, [])

  /** Ronda 6 F1: cambia de experiencia SIN cerrar el overlay (sin wrap). */
  const stepExperience = useCallback((delta: 1 | -1) => {
    setActiveExperienceId((current) => {
      const index = experience.findIndex((item) => item.id === current)
      const next = index + delta
      if (index < 0 || next < 0 || next >= experience.length) return current
      return experience[next].id
    })
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
      <SectionHeading index={3} title={texts.sections.experience} />
      <ExperienceCarousel experiences={experience} onSelect={openExperience} />

      <ExperienceOverlay
        experience={activeExperience}
        onClose={closeExperience}
        onOpenProject={openAssociatedProject}
        projects={projects}
        onPrev={activeExperience === null ? undefined : () => stepExperience(-1)}
        onNext={activeExperience === null ? undefined : () => stepExperience(1)}
        hasPrev={activeExperience !== null && activeIndex > 0}
        hasNext={activeExperience !== null && activeIndex < experience.length - 1}
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
