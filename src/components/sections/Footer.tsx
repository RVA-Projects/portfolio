import { site } from '../../data/site'
import { useLanguage } from '../../i18n'
import styles from './Footer.module.css'

/**
 * RF-22: pie con copyright + enlace discreto "Older Portfolio" → /portfolio/old/
 * TODO(F6.8/ D01): cuando exista la copia en public/old/ se confirma la ruta.
 */
export function Footer() {
  const { texts } = useLanguage()
  return (
    <footer className={styles.footer}>
      <p>
        © {new Date().getFullYear()} — {texts.footer.madeBy} <strong>{site.name}</strong>
      </p>
      <a className={styles.olderLink} href={site.olderPortfolioUrl}>
        {texts.footer.older}
      </a>
    </footer>
  )
}
