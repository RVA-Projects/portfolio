import { IconButton } from '../base/IconButton'
import { IconMenu, IconClose } from '../base/Icons'
import { useLanguage } from '../../i18n'
import styles from './TopBar.module.css'

interface TopBarProps {
  /** Estado del NavigationMenu (controlled desde App). */
  menuOpen: boolean
  onToggleMenu: () => void
  /** El menú desaparece al interactuar/scroll (RF-04). */
  visible: boolean
}

/**
 * Fase 5.3: barra superior minimalista. Únicamente contiene el disparador del
 * menú: contenido permanente cero (el nombre vive en la sección introductoria).
 */
export function TopBar({ menuOpen, onToggleMenu, visible }: TopBarProps) {
  const { texts } = useLanguage()
  const className =
    visible || menuOpen ? styles.topbar : `${styles.topbar} ${styles['topbar--hidden']}`

  return (
    <header className={className}>
      <IconButton
        ariaLabel={menuOpen ? texts.nav.close : texts.nav.open}
        onClick={onToggleMenu}
        icon={menuOpen ? <IconClose /> : <IconMenu />}
      />
    </header>
  )
}
