import { useState } from 'react'
import { technologyNameById } from '../../data/technologies'
import { useLanguage } from '../../i18n'
import type { Project } from '../../models/Project'
import { Tag } from '../base/Tag'
import styles from './ProjectCard.module.css'

interface ProjectCardProps {
  project: Project
  onSelect: (projectId: string) => void
}

const MAX_VISIBLE_TAGS = 4

/**
 * Tarjeta de proyecto (RF-06): uniforme por breakpoint, imagen con alt
 * accesible y fallback si el asset aún no existe (F7), nombre, resumen,
 * tecnologías (≤4 + "+n") y badge de categoría. La interacción es un botón
 * a toda tarjeta: no depende de hover y es apta para teclado.
 */
export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const { language, texts } = useLanguage()
  const [imageFailed, setImageFailed] = useState(false)

  const cover = project.media[0]
  const techNames = project.technologyIds.map(technologyNameById)
  const visibleTags = techNames.slice(0, MAX_VISIBLE_TAGS)
  const overflowCount = techNames.length - visibleTags.length

  return (
    <article className={styles.card}>
      <div className={styles.media} aria-hidden="true">
        {cover !== undefined && cover.kind !== 'video-local' && !imageFailed ? (
          <img
            className={styles.image}
            src={cover.src}
            alt={cover.alt[language]}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <p className={styles.mediaFallback}>{project.name[language]}</p>
        )}
        {cover?.kind === 'video-local' && <span className={styles.mediaFallback}>▶</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{project.name[language]}</h3>
        <p className={styles.summary}>{project.summary[language]}</p>
        <div className={styles.tags}>
          {visibleTags.map((name) => (
            <Tag key={name} label={name} />
          ))}
          {overflowCount > 0 && <Tag label={`+${overflowCount}`} />}
        </div>
      </div>

      {/* Botón invisible a toda tarjeta (a11y: nombre explícito, no hover) */}
      <button
        type="button"
        className={styles.openButton}
        onClick={() => onSelect(project.id)}
        aria-label={`${texts.projectOverlay.open}: ${project.name[language]}`}
      />
      <div className={styles.categoryBadge}>
        <Tag label={texts.categories[project.category]} variant="category" />
      </div>
    </article>
  )
}
