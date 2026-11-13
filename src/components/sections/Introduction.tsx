import { useLanguage } from '../../i18n'
import type { LanguageId } from '../../models/common'
import { site, clickerCounter } from '../../data/site'
import { useGlobalCounter } from '../../hooks/useGlobalCounter'
import { Button } from '../base/Button'
import { IconButton } from '../base/IconButton'
import { IconGitHub, IconLinkedIn, IconTarget } from '../base/Icons'
import { EmailReveal } from './EmailReveal'
import styles from './Introduction.module.css'

/**
 * Fase 5.4 — Presentación (RF-01). Sin hero, sin imagen de portada, sin loader:
 * la página abre directamente con nombre, especialización única (D11/D25),
 * ubicación, descripción, contacto rápido y clicker (D24/D26).
 *
 * D27: los grids de tecnologías viven en TechStackSection (sección propia
 * tras proyectos). TODO(F7): CV (pendiente de PDF del propietario). Sin foto
 * (D10 cancelada): presentación solo tipográfica.
 */
export function Introduction() {
  const { language, texts } = useLanguage()

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
          language={language}
        />
      </div>
    </section>
  )
}

interface ClickerButtonProps {
  ariaLabel: string
  /** D38: texto del tooltip del número (clave i18n intro.clickerTotal). */
  totalLabel: string
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
 * D38 — contador GLOBAL (ronda 3, petición del propietario): la cifra es
 * el total de clicks de TODAS las visitas desde la publicación, leído del
 * servicio externo al montar (useGlobalCounter) y persistente entre
 * deploys. Cada click suma al instante (optimista) y dispara el
 * incremento fire-and-forget. Sin aria-live (no spamea al lector de
 * pantalla en clicks rápidos).
 */
function ClickerButton({ ariaLabel, totalLabel, language }: ClickerButtonProps) {
  const { count, increment } = useGlobalCounter(
    `${clickerCounter.baseUrl}/get/${clickerCounter.namespace}/${clickerCounter.key}`,
    `${clickerCounter.baseUrl}/hit/${clickerCounter.namespace}/${clickerCounter.key}`,
  )

  return (
    <div className={styles.clicker}>
      <IconButton
        ariaLabel={ariaLabel}
        onClick={increment}
        icon={<IconTarget />}
        className={styles.clickerBtn}
      />
      <span className={styles.clickerCount} title={totalLabel}>
        {count.toLocaleString(language)}
        <span className="visually-hidden">{totalLabel}</span>
      </span>
    </div>
  )
}
