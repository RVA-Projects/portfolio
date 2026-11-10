import { useEffect, type RefObject } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/** Focusables internos en orden de pintado del DOM. */
function getFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
}

/**
 * Fase 5.5 (RF-14): al activar, guarda el foco previo, lo mueve dentro del
 * contenedor y atrapa Tab dentro de él. Al desactivar, restaura el foco
 * al elemento disparador.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    if (!active) return
    const container = ref.current
    if (container === null) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const focusables = getFocusables(container)
    ;(focusables[0] ?? container).focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = getFocusables(container)
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const current = container.ownerDocument.activeElement
      if (event.shiftKey && (current === first || !container.contains(current))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (current === last || !container.contains(current))) {
        event.preventDefault()
        first.focus()
      }
    }

    container.ownerDocument.addEventListener('keydown', onKeyDown)

    return () => {
      container.ownerDocument.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused instanceof HTMLElement && document.contains(previouslyFocused)) {
        previouslyFocused.focus()
      }
    }
  }, [ref, active])
}
