import { useCallback, useEffect, useState } from 'react'

export type ThemeId = 'dark' | 'light'

const STORAGE_KEY = 'rva-portfolio-theme'

/**
 * D18 — Tema del portfolio. Inicial: 1) preferencia persistida del usuario,
 * 2) `prefers-color-scheme` del sistema (fallback oscuro — identidad base).
 * Solo la elección manual se persiste; se aplica vía `data-theme` en <html>
 * (`:root` = oscuro, `[data-theme='light']` reescribe las vars de color).
 */
function detectInitialTheme(): ThemeId {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  /* matchMedia puede no existir (navegadores antiguos/SSR): fallback oscuro. */
  if (typeof window.matchMedia !== 'function') return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function useTheme(): { theme: ThemeId; toggleTheme: () => void } {
  const [theme, setTheme] = useState<ThemeId>(detectInitialTheme)

  useEffect(() => {
    if (theme === 'dark') {
      // Oscuro = estado base del sistema visual; sin atributo (tokens :root).
      delete document.documentElement.dataset.theme
    } else {
      document.documentElement.dataset.theme = 'light'
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      window.localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
