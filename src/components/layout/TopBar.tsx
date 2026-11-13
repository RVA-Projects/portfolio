import { IconButton } from '../base/IconButton'
import { IconMenu, IconClose, IconSun, IconMoon } from '../base/Icons'
import { useLanguage } from '../../i18n'
import type { ThemeId } from '../../hooks/useTheme'
import styles from './TopBar.module.css'

interface TopBarProps {
  /** Estado del NavigationMenu (controlled desde App). */
  menuOpen: boolean
  onToggleMenu: () => void
  /**
   * RF-04 (Fase 7.1): cerca del inicio o deslizando hacia arriba ⇒ barra
   * normal; deslizando hacia abajo ⇒ COMPACTA flotante (nunca desaparece:
   * el botón de menú sigue accesible en cualquier posición de scroll).
   */
  visible: boolean
  /** Tema activo (D18): el botón ofrece el contrario. */
  theme: ThemeId
  onToggleTheme: () => void
}

/**
 * Fase 5.3/F7.1: barra superior minimalista. Disparador del menú +
 * alternador de tema (D18) + selector ES/EN (ronda 3 F5: muestra el idioma
 * ACTIVO; el click alterna — el contexto i18n persiste y no recarga).
 * Contenido permanente cero: el nombre vive en la intro. Al deslizar hacia
 * abajo se reduce (topbar--compact) en lugar de ocultarse: el menú es
 * accesible desde cualquier punto de la página.
 */
export function TopBar({ menuOpen, onToggleMenu, visible, theme, onToggleTheme }: TopBarProps) {
  const { language, texts, setLanguage } = useLanguage()
  const className =
    visible || menuOpen ? styles.topbar : `${styles.topbar} ${styles['topbar--compact']}`

  return (
    <header className={className}>
      <IconButton
        ariaLabel={theme === 'dark' ? texts.nav.toLight : texts.nav.toDark}
        onClick={onToggleTheme}
        icon={theme === 'dark' ? <IconSun /> : <IconMoon />}
      />
      {/* F5: selector de idioma — etiqueta del idioma ACTIVO (sin banderas). */}
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
      <IconButton
        ariaLabel={menuOpen ? texts.nav.close : texts.nav.open}
        onClick={onToggleMenu}
        icon={menuOpen ? <IconClose /> : <IconMenu />}
      />
    </header>
  )
}
