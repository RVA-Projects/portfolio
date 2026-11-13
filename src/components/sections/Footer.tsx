import { useState } from 'react'
import { rvaPortfolio } from '../../data/projects/rva-portfolio'
import { site } from '../../data/site'
import { useLanguage } from '../../i18n'
import { ProjectOverlay } from '../overlays/ProjectOverlay'
import styles from './Footer.module.css'

/**
 * RF-22: pie con copyright + enlace discreto "Older Portfolio" → /portfolio/old/.
 *
 * Ronda 3 F6: la línea de copyright es PULSABLE y abre la ficha del propio
 * portfolio (RVA Portfolio) reutilizando el ProjectOverlay existente, sin
 * prev/next (ficha única). Piel de footer: texto mono/muted con subrayado
 * punteado discreto como indicador de pulsable; NUNCA un botón llamativo.
 * El hint accesible (sr-only) comunica la acción a lectores de pantalla.
 */
export function Footer() {
  const { texts } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <footer className={styles.footer}>
      <button type="button" className={styles.projectLink} onClick={() => setOpen(true)}>
        © {new Date().getFullYear()} — {texts.footer.madeBy} <strong>{site.name}</strong>
        <span className="visually-hidden"> — {texts.footer.projectHint}</span>
      </button>
      <a className={styles.olderLink} href={site.olderPortfolioUrl}>
        {texts.footer.older}
      </a>

      <ProjectOverlay
        project={open ? rvaPortfolio : null}
        onClose={() => setOpen(false)}
        hasPrev={false}
        hasNext={false}
      />
    </footer>
  )
}
