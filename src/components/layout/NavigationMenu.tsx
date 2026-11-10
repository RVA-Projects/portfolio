import { useEffect, useRef } from 'react'
import { SECTIONS, type SectionId } from '../../data/site'
import { useLanguage } from '../../i18n'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import styles from './NavigationMenu.module.css'

interface NavigationMenuProps {
  open: boolean
  activeId: SectionId | null
  onClose: () => void
  /** Navegación mediante anclas + cierre del menú (RF-04). */
  onSelect: (id: SectionId) => void
}

/**
 * Menu desplegable (RF-04): anclas, indicador de sección activa, cierre por
 * selección, clic fuera y Escape. Táctil y con targets ≥44px.
 */
export function NavigationMenu({ open, activeId, onClose, onSelect }: NavigationMenuProps) {
  const { texts } = useLanguage()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  useFocusTrap(panelRef, open)

  if (!open) return null

  return (
    <>
      {/* Backdrop transparente: captura clics fuera del menú */}
      <div
        className={styles.backdrop}
        onClick={onClose}
        aria-hidden="true"
        data-testid="menu-backdrop"
      />
      <div
        ref={panelRef}
        className={styles.menu}
        role="navigation"
        aria-label={texts.nav.label}
        tabIndex={-1}
        data-testid="navigation-menu"
      >
        <ul className={styles.list}>
          {SECTIONS.map((id) => (
            <li key={id}>
              <a
                className={`${styles.itemLink} ${id === activeId ? styles['itemLink--active'] : ''}`.trim()}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault()
                  onSelect(id)
                }}
              >
                <span className={styles.itemDot} aria-hidden="true" />
                <span>{texts.sections[id]}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
