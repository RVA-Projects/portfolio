import { useEffect } from 'react'

/**
 * Bloquea el scroll del body mientras `active` (RF-14) y restaura el valor
 * original al desactivar. Robusto para múltiples activaciones consecutivas.
 */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [active])
}
