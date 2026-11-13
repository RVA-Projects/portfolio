import { technologyById } from '../../data/technologies'
import { useLanguage } from '../../i18n'
import type { Experience } from '../../models/Experience'
import { TechIcon } from '../base/TechIcon'
import styles from './ExperienceCard.module.css'

interface ExperienceCardProps {
  item: Experience
  /** Abre ExperienceOverlay (la sección posee el estado del overlay). */
  onOpen: (experienceId: string) => void
}

/**
 * Tarjeta de experiencia minimalista (Fase 5, plan de actualización): solo
 * título (organización), periodo y pequeños indicadores visuales de las
 * tecnologías (TechIcon). La descripción/funciones/logros/enlaces viven en
 * ExperienceOverlay. Patrón "stretched button": el botón cubre toda la
 * tarjeta (nunca solo-hover; accesible por teclado y táctil) con aria-label
 * explícito, SIN envolver los encabezados (HTML válido).
 */
export function ExperienceCard({ item, onOpen }: ExperienceCardProps) {
  const { language, texts } = useLanguage()

  const periodLabel =
    item.period === undefined
      ? null
      : `${item.period.start} – ${item.period.end ?? texts.experience.current}`

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={`${texts.experience.open} ${item.organization[language]}`}
        onClick={() => {
          onOpen(item.id)
        }}
      />
      <h3 className={styles.title}>{item.organization[language]}</h3>
      {periodLabel !== null && <p className={styles.period}>{periodLabel}</p>}
      {item.technologyIds.length > 0 && (
        <div className={styles.techs}>
          {item.technologyIds.map((technologyId) => {
            const technology = technologyById(technologyId)
            return (
              <TechIcon
                key={technologyId}
                technologyId={technologyId}
                icon={technology?.icon}
                adapt={technology?.adapt}
              />
            )
          })}
        </div>
      )}
    </article>
  )
}
