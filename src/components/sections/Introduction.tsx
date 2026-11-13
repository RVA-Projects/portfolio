import { useCallback, useState } from 'react'
import { useLanguage } from '../../i18n'
import type { LanguageId } from '../../models/common'
import { technologiesByTier } from '../../data/technologies'
import type { Technology } from '../../models/Technology'
import { site } from '../../data/site'
import { Button } from '../base/Button'
import { IconGitHub, IconLinkedIn } from '../base/Icons'
import { TechIcon } from '../base/TechIcon'
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
        <ClickerButton
          label={texts.intro.clicker}
          ariaLabel={texts.intro.clickerAria}
          language={language}
        />
      </div>

      <div className={styles.tech}>
        <div>
          <p className={styles.techTitle}>{texts.intro.mainStack}</p>
          <TechGrid techs={coreTechs} />
        </div>

        <div>
          <p className={styles.techTitle}>{texts.intro.projectStack}</p>
          <TechGrid techs={projectTechs} />
        </div>

        <div>
          <p className={styles.techTitle}>{texts.intro.tools}</p>
          <TechGrid techs={toolTechs} />
        </div>
      </div>
    </section>
  )
}

/** Grid declarativo icono + nombre para un tier del catálogo (RF-03). */
function TechGrid({ techs }: { techs: Technology[] }) {
  return (
    <ul className={styles.techGrid}>
      {techs.map((tech) => (
        <li key={tech.id} className={styles.techItem}>
          <TechIcon technologyId={tech.id} icon={tech.icon} />
          <span>{tech.name}</span>
        </li>
      ))}
    </ul>
  )
}

interface CopyEmailButtonProps {
  email: string
  label: string
  copiedLabel: string
} /** Botón discreto "copiar email" con feedback accesible vía aria-live (D02). */
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

interface ClickerButtonProps {
  label: string
  ariaLabel: string
  language: LanguageId
}

/**
 * D24 — Clicker: botón juguetón para pulsar sin parar; el contador queda
 * al lado. La diversión la pone el fondo animado (D23 reacciona a CADA
 * pulsación: colapso + anillo). Estado local, sin persistencia: es un
 * juguete de sesión. El contador es texto plano navegable (sin aria-live
 * para no spamear al lector de pantalla en clicks rápidos).
 */
function ClickerButton({ label, ariaLabel, language }: ClickerButtonProps) {
  const [count, setCount] = useState(0)

  return (
    <div className={styles.clicker}>
      <Button
        label={label}
        variant="ghost"
        onClick={() => setCount((current) => current + 1)}
        ariaLabel={ariaLabel}
      />
      <span className={styles.clickerCount}>{count.toLocaleString(language)}</span>
    </div>
  )
}
