import { IconButton } from '../base/IconButton'
import { IconMenu, IconClose, IconSun, IconMoon } from '../base/Icons'
import { useLanguage } from '../../i18n'
import type { ThemeId } from '../../hooks/useTheme'
import styles from './TopBar.module.css'

interface TopBarProps {
  /** Estado del NavigationMenu (controlled desde App). */
  menuOpen: boolean
  onToggleMenu: () => void
  /** El menú desaparece al interactuar/scroll (RF-04). */
  visible: boolean
  /** Tema activo (D18): el botón ofrece el contrario. */
  theme: ThemeId
  onToggleTheme: () => void
}

/**
 * Fase 5.3: barra superior minimalista. Disparador del menú + alternador de
 * tema (D18). Contenido permanente cero: el nombre vive en la intro.
 */
export function TopBar({ menuOpen, onToggleMenu, visible, theme, onToggleTheme }: TopBarProps) {
  const { texts } = useLanguage()
  const className =
    visible || menuOpen ? styles.topbar : `${styles.topbar} ${styles['topbar--hidden']}`

  return (
    <header className={className}>
      <IconButton
        ariaLabel={theme === 'dark' ? texts.nav.toLight : texts.nav.toDark}
        onClick={onToggleTheme}
        icon={theme === 'dark' ? <IconSun /> : <IconMoon />}
      />
      <IconButton
        ariaLabel={menuOpen ? texts.nav.close : texts.nav.open}
        onClick={onToggleMenu}
        icon={menuOpen ? <IconClose /> : <IconMenu />}
      />
    </header>
  )
}
