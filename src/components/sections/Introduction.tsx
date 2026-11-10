import { useCallback, useState } from 'react'
import { useLanguage } from '../../i18n'
import { technologiesByTier } from '../../data/technologies'
import { site } from '../../data/site'
import { Button } from '../base/Button'
import { IconGitHub, IconLinkedIn } from '../base/Icons'
import { Tag } from '../base/Tag'
import styles from './Introduction.module.css'

/**
 * Fase 5.4 — Presentación (RF-01). Sin hero, sin imagen de portada, sin loader:
 * la página abre directamente con nombre, especialización única (D11),
 * ubicación, descripción, contacto rápido y tecnologías en tres niveles
 * (RF-03), con aparición progresiva y respeto a prefers-reduced-motion.
 *
 * TODO(F7): CV (pendiente de PDF del propietario) y foto personal.
 * TODO(F6.2): TechnologyFilter conecta aquí para el "acento selectivo".
 */
export function Introduction() {
  const { language, texts } = useLanguage()

  const coreTechs = technologiesByTier('core')
  const projectTechs = technologiesByTier('project')
  const toolTechs = technologiesByTier('tool')

  return (
    <section id="intro" className={styles.intro} aria-label={texts.sections.intro}>
      <h1 className={styles.name}>{site.name}</h1>

      <p className={styles.role}>{site.role[language]}</p>

      <p className={styles.location}>
        {texts.intro.basedIn} {site.location[language]}
      </p>

      <p className={styles.description}>{site.description[language]}</p>

      <div className={styles.quickLinks}>
        <p className={styles.quickLabel}>{texts.intro.available}</p>

        <Button label={site.email} href={`mailto:${site.email}`} />
        <Button
          label="GitHub"
          href={site.github}
          external
          variant="ghost"
          icon={<IconGitHub />}
          ariaLabel="GitHub: RVA-Projects"
        />
        <Button
          label="LinkedIn"
          href={site.linkedin}
          external
          variant="ghost"
          icon={<IconLinkedIn />}
          ariaLabel="LinkedIn: rva-developer"
        />
        <CopyEmailButton
          email={site.email}
          label={texts.intro.copyEmail}
          copiedLabel={texts.intro.emailCopied}
        />
      </div>

      <div className={styles.tech}>
        <div>
          <p className={styles.techTitle}>{texts.intro.mainStack}</p>
          <div className={styles.techChips}>
            {coreTechs.map((tech) => (
              <Tag key={tech.id} label={tech.name} variant="accent" />
            ))}
          </div>
        </div>

        <div>
          <p className={styles.techTitle}>{texts.intro.projectStack}</p>
          <div className={styles.techChips}>
            {projectTechs.map((tech) => (
              <Tag key={tech.id} label={tech.name} />
            ))}
          </div>
        </div>

        <div>
          <p className={styles.techTitle}>{texts.intro.tools}</p>
          <ul className={styles.techList}>
            {toolTechs.map((tech) => (
              <li key={tech.id}>{tech.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

interface CopyEmailButtonProps {
  email: string
  label: string
  copiedLabel: string
}

/** Botón discreto "copiar email" con feedback accesible vía aria-live (D02). */
function CopyEmailButton({ email, label, copiedLabel }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(() => {
    if (navigator.clipboard === undefined) return
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => setCopied(false))
  }, [email])

  return (
    <>
      <Button label={copied ? copiedLabel : label} variant="ghost" onClick={onCopy} />
      <span role="status" aria-live="polite">
        {copied ? copiedLabel : ''}
      </span>
    </>
  )
}
