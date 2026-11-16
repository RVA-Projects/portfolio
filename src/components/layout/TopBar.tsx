import { useEffect, useRef } from 'react'
import { SECTIONS, type SectionId } from '../../data/site'
import { IconButton } from '../base/IconButton'
import { IconSun, IconMoon } from '../base/Icons'
import { useLanguage } from '../../i18n'
import type { ThemeId } from '../../hooks/useTheme'
import styles from './TopBar.module.css'

interface TopBarProps {
  /** Sección activa (useScrollSpy): resalta el enlace de navegación. */
  activeId: SectionId | null
  /** Ancla nativa con scroll suave (App posee smoothBehavior + history). */
  onNavigate: (id: SectionId) => void
  /** Tema activo (D18): el botón ofrece el contrario. */
  theme: ThemeId
  onToggleTheme: () => void
}

/**
 * Ronda 5 F2 (D-B/D-C) — navegación horizontal PERMANENTE en la barra
 * superior (adiós al menú desplegable D22 y a su botón hamburguesa):
 * secciones a la IZQUIERDA (enlace directo por ancla, indicador de sección
 * activa de useScrollSpy) y controles de tema + idioma agrupados a la
 * DERECHA. La barra es fija y SIEMPRE visible, con el fondo translúcido y
 * blur de la antigua pastilla compacta. En pantallas estrechas la fila de
 * secciones hace scroll horizontal interno (swipe, scrollbar oculta y la
 * sección activa se auto-alinea): acceso directo a todas, sin hamburguesa.
 */
export function TopBar({ activeId, onNavigate, theme, onToggleTheme }: TopBarProps) {
  const { language, texts, setLanguage } = useLanguage()
  const navRef = useRef<HTMLElement>(null)

  /* Móvil: al cambiar la sección activa, el enlace queda a la vista dentro
     del scroll horizontal de la nav (sin tocar el scroll de la página). */
  useEffect(() => {
    if (activeId === null) return
    const nav = navRef.current
    const active = nav?.querySelector<HTMLElement>('[aria-current="true"]') ?? null
    if (nav === null || active === null) return
    const { offsetLeft, offsetWidth } = active
    const { scrollLeft, clientWidth } = nav
    if (offsetLeft < scrollLeft) {
      nav.scrollLeft = offsetLeft - 8
    } else if (offsetLeft + offsetWidth > scrollLeft + clientWidth) {
      nav.scrollLeft = offsetLeft + offsetWidth - clientWidth + 8
    }
  }, [activeId])

  return (
    <header className={styles.topbar}>
      <div className={styles.inner}>
        <nav ref={navRef} className={styles.nav} aria-label={texts.nav.label}>
          {SECTIONS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={
                id === activeId ? `${styles.navLink} ${styles['navLink--active']}` : styles.navLink
              }
              aria-current={id === activeId ? 'true' : undefined}
              onClick={(event) => {
                event.preventDefault()
                onNavigate(id)
              }}
            >
              {texts.sections[id]}
            </a>
          ))}
        </nav>

        <div className={styles.controls}>
          <IconButton
            ariaLabel={theme === 'dark' ? texts.nav.toLight : texts.nav.toDark}
            onClick={onToggleTheme}
            icon={theme === 'dark' ? <IconSun /> : <IconMoon />}
          />
          {/* Selector de idioma — etiqueta del idioma ACTIVO (sin banderas). */}
          <button
            type="button"
            className={styles.langBtn}
            aria-label={language === 'es' ? texts.nav.toEnglish : texts.nav.toSpanish}
            onClick={() => {
              setLanguage(language === 'es' ? 'en' : 'es')
            }}
          >
            {language.toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  )
}
