import { useCallback, useState } from 'react'
import { decodeEmail } from '../../data/site'
import { useLanguage } from '../../i18n'
import { IconButton } from '../base/IconButton'
import { IconCopy } from '../base/Icons'
import styles from './EmailReveal.module.css'

/**
 * D26 — EmailReveal: protección anti-scraping pasiva del email.
 *
 * El correo NO viaja en el bundle ni en el HTML: vive codificado (XOR) en
 * `data/site.ts` y solo se ensambla en memoria cuando la persona completa
 * el slider (input[type=range]: teclado nativo con flechas, táctil nativo,
 * no depende del ratón). Al revelar: email + botón copiar (tooltip del
 * sistema, IconButton) con confirmación transient aria-live.
 *
 * Límite documentado (decisions.md D26): es mitigación contra recolección
 * pasiva, NO seguridad fuerte — un scraper que ejecute el JS podría
 * decodificar. En hosting estático (GitHub Pages) no existe validación en
 * servidor posible; no se simula CAPTCHA.
 */
export function EmailReveal() {
  const { texts } = useLanguage()
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  /** El slider llega a 100 (drag, tap en la pista o flechas) ⇒ revelado. */
  const onSlide = useCallback((value: number) => {
    if (value >= 100) setRevealed(true)
  }, [])

  const onCopy = useCallback(() => {
    const email = decodeEmail()
    if (navigator.clipboard === undefined) return
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => setCopied(false))
  }, [])

  if (revealed) {
    return (
      <div className={styles.revealed}>
        <span className={styles.email}>{decodeEmail()}</span>
        <IconButton ariaLabel={texts.intro.copyEmail} onClick={onCopy} icon={<IconCopy />} />
        <span role="status" aria-live="polite">
          {copied ? texts.intro.emailCopied : ''}
        </span>
      </div>
    )
  }

  return (
    <div className={styles.box}>
      <label className={styles.label} htmlFor="email-reveal">
        {texts.intro.slideToReveal}
      </label>
      <input
        id="email-reveal"
        className={styles.slider}
        type="range"
        min={0}
        max={100}
        step={1}
        defaultValue={0}
        onChange={(event) => onSlide(Number(event.target.value))}
        aria-label={texts.intro.slideToReveal}
      />
      <span role="status" aria-live="polite">
        {revealed ? texts.intro.emailRevealed : ''}
      </span>
    </div>
  )
}
