import { useState } from 'react'
import { useLanguage } from '../../i18n'
import type { LanguageId } from '../../models/common'
import { site, clickerCounter } from '../../data/site'
import { useGlobalCounter } from '../../hooks/useGlobalCounter'
import { Button } from '../base/Button'
import { IconButton } from '../base/IconButton'
import { IconGitHub, IconLinkedIn, IconTarget } from '../base/Icons'
import { EmailReveal } from './EmailReveal'
import { CaptchaPuzzleOverlay } from '../overlays/CaptchaPuzzleOverlay'
import styles from './Introduction.module.css'

/**
 * Fase 5.4 — Presentación (RF-01). Sin hero, sin imagen de portada, sin loader:
 * la página abre directamente con nombre, especialización única (D11/D25),
 * ubicación, descripción, contacto rápido y clicker (D24/D26).
 *
 * D27: los grids de tecnologías viven en TechStackSection (sección propia
 * tras proyectos). Ronda 6 F2/F3: botón CV → CAPTCHA puzzle → descarga del
 * PDF. Sin foto (D10 cancelada): presentación solo tipográfica.
 */
export function Introduction() {
  const { language, texts } = useLanguage()

  /* Ronda 6 F2/F3 — el botón CV abre el overlay del CAPTCHA puzzle. */
  const [cvOpen, setCvOpen] = useState(false)

  return (
    <section id="intro" className={styles.intro} aria-label={texts.sections.intro}>
      <h1 className={styles.name}>{site.name}</h1>

      <p className={styles.role}>{site.role[language]}</p>

      <p className={styles.roleNote}>{site.roleNote[language]}</p>

      <p className={styles.location}>
        {texts.intro.basedIn} {site.location[language]}
      </p>

      <p className={styles.description}>{site.description[language]}</p>

      <div className={styles.quickLinks}>
        <p className={styles.quickLabel}>{texts.intro.available}</p>

        <EmailReveal />
        {/* Ronda 6 F2 — botón CV: pill 44px idéntica a los controles de la
            TopBar (IconButton + tooltip D24 «Descargar CV»); NO descarga
            directamente: abre el CAPTCHA (F3). Entre el email y GitHub. */}
        <IconButton
          ariaLabel={texts.intro.cvTooltip}
          onClick={() => {
            setCvOpen(true)
          }}
          icon={<span className={styles.cvLabel}>{texts.intro.cv}</span>}
        />
        {/* F2.3: contenedor SIEMPRE visible (piel por defecto de Button =
            superficie + borde), equivalente a la caja del email desbloqueada. */}
        <Button
          label="GitHub"
          href={site.github}
          external
          icon={<IconGitHub />}
          ariaLabel="GitHub: RVA-Projects"
        />
        <Button
          label="LinkedIn"
          href={site.linkedin}
          external
          icon={<IconLinkedIn />}
          ariaLabel="LinkedIn: rva-developer"
        />
        <ClickerButton
          ariaLabel={texts.intro.clickerAria}
          totalLabel={texts.intro.clickerTotal}
          othersLabel={texts.intro.clickerOthers}
          language={language}
        />
      </div>

      {/* Ronda 6 F3 — CAPTCHA puzzle delante de la descarga del CV. */}
      <CaptchaPuzzleOverlay open={cvOpen} onClose={() => setCvOpen(false)} />
    </section>
  )
}

interface ClickerButtonProps {
  ariaLabel: string
  /** D38: texto del tooltip del número (clave i18n intro.clickerTotal). */
  totalLabel: string
  /** D38.1: pista transient cuando otros visitantes suman clicks. */
  othersLabel: string
  language: LanguageId
}

/**
 * D24/D26 — Clicker: botón juguetón circular (diana) para pulsar sin parar;
 * el contador queda en su propia caja al lado. La diversión la pone el
 * fondo animado (D23 reacciona a CADA pulsación: colapso + anillo). El
 * tooltip del BOTÓN lo da el IconButton (data-tip = ariaLabel); el del
 * NÚMERO es nativo (title) + hint accesible sr-only (D38: «Recuento de
 * clicks»).
 *
 * D38/D38.1 — contador GLOBAL en vivo: la cifra es el total de clicks de
 * TODAS las visitas desde la publicación; se lee al montar y el stream
 * SSE empuja las actualizaciones (incluidos los clicks de otros
 * visitantes, señalados ~4s con pulso + tooltip «Otros visitantes están
 * acumulando clicks!», D38.1). Cada click propio suma al instante
 * (optimista) y dispara el incremento. Sin aria-live (no spamea al lector
 * de pantalla en clicks rápidos).
 */
function ClickerButton({ ariaLabel, totalLabel, othersLabel, language }: ClickerButtonProps) {
  const { count, increment, othersActive } = useGlobalCounter(
    `${clickerCounter.baseUrl}/get/${clickerCounter.namespace}/${clickerCounter.key}`,
    `${clickerCounter.baseUrl}/hit/${clickerCounter.namespace}/${clickerCounter.key}`,
    `${clickerCounter.baseUrl}/stream/${clickerCounter.namespace}/${clickerCounter.key}`,
  )

  return (
    <div className={styles.clicker}>
      <IconButton
        ariaLabel={ariaLabel}
        onClick={increment}
        icon={<IconTarget />}
        className={styles.clickerBtn}
      />
      <span
        className={
          othersActive ? `${styles.clickerCount} ${styles.countPulse}` : styles.clickerCount
        }
        title={othersActive ? othersLabel : totalLabel}
      >
        {count.toLocaleString(language)}
        <span className="visually-hidden">{totalLabel}</span>
      </span>
    </div>
  )
}
