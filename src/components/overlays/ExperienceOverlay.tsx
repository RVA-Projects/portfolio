import type { EducationalTextItem, Project } from '../../models/Project'
import { useLanguage } from '../../i18n'
import type { Experience } from '../../models/Experience'
import { IconButton } from '../base/IconButton'
import { IconClose } from '../base/Icons'
import { Button } from '../base/Button'
import { Modal } from '../base/Modal'
import { Tag } from '../base/Tag'
import { technologyNameById } from '../../data/technologies'
import styles from './ExperienceOverlay.module.css'

/**
 * Título del dialog: id estático porque solo existe un overlay abierto a la vez.
 */
const TITLE_ID = 'experience-overlay-title'

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

interface ExperienceOverlayProps {
  experience: Experience | null
  onClose: () => void
  /**
   * Fase 5: «Ver proyecto» cierra ESTE overlay y abre el ProjectOverlay de la
   * ficha asociada (la sección coordina ambos estados; sin doble Escape).
   */
  onOpenProject: (projectId: string) => void
  /** Catálogo de proyectos (resuelto por la sección; sin imports de datos). */
  projects: Project[]
}

/**
 * Overlay de experiencia (Fase 5): compone sobre Modal (focus-trap, Escape,
 * clic-fuera, scroll-lock, restauración de foco) con los mismos patrones
 * visuales del ProjectOverlay (header + bloques de info). Sin galería ni
 * prev/next: contenido en una columna con scroll del panel.
 */
export function ExperienceOverlay({
  experience,
  onClose,
  onOpenProject,
  projects,
}: ExperienceOverlayProps) {
  const { language, texts } = useLanguage()

  if (experience === null) return null

  const periodLabel =
    experience.period === undefined
      ? null
      : `${experience.period.start} – ${experience.period.end ?? texts.experience.current}`

  const associated = (experience.projectIds ?? [])
    .map((projectId) => projects.find((project) => project.id === projectId))
    .filter((project) => project !== undefined)

  return (
    <Modal open onClose={onClose} labelledById={TITLE_ID}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <h2 id={TITLE_ID} className={styles.title}>
              {experience.organization[language]}
            </h2>
            <p className={styles.meta}>
              {experience.role !== undefined && <span>{experience.role[language]}</span>}
              {periodLabel !== null && <span>{periodLabel}</span>}
            </p>
          </div>
          <div className={styles.navRow}>
            <IconButton
              ariaLabel={texts.experienceOverlay.close}
              onClick={onClose}
              icon={<IconClose />}
            />
          </div>
        </header>

        <div className={styles.body}>
          {experience.description !== undefined && (
            <InfoBlock heading={texts.experienceOverlay.description}>
              <p>{experience.description[language]}</p>
            </InfoBlock>
          )}

          {experience.responsibilities.length > 0 && (
            <InfoBlock heading={texts.experience.responsibilities}>
              <ItemsList items={experience.responsibilities} />
            </InfoBlock>
          )}

          {experience.outcomes !== undefined && experience.outcomes.length > 0 && (
            <InfoBlock heading={texts.experience.outcomes}>
              <ItemsList items={experience.outcomes} />
            </InfoBlock>
          )}

          {experience.technologyIds.length > 0 && (
            <div className={styles.tags}>
              {experience.technologyIds.map((technologyId) => (
                <Tag key={technologyId} label={technologyNameById(technologyId)} />
              ))}
            </div>
          )}

          {experience.links !== undefined && experience.links.length > 0 && (
            <div className={styles.links}>
              {experience.links.map((link) => (
                <Button
                  key={link.id}
                  label={
                    link.url.includes('upwork.com')
                      ? texts.experience.upwork
                      : link.url.includes('github.com')
                        ? texts.projectOverlay.links.github
                        : texts.projectOverlay.links.web
                  }
                  href={link.url}
                  external
                />
              ))}
            </div>
          )}

          {associated.length > 0 && (
            <InfoBlock heading={texts.experienceOverlay.associatedProjects}>
              <div className={styles.associated}>
                {associated.map((project) => (
                  <Button
                    key={project.id}
                    label={`${texts.experienceOverlay.viewProject}: ${project.name[language]}`}
                    onClick={() => {
                      onOpenProject(project.id)
                    }}
                  />
                ))}
              </div>
            </InfoBlock>
          )}
        </div>
      </div>
    </Modal>
  )
}
