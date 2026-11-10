import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { LanguageId } from '../models/common'
import { es, type Texts } from './texts.es'
import { en } from './texts.en'

const STORAGE_KEY = 'rva-portfolio-language'

export interface LanguageContextValue {
  language: LanguageId
  /** Tabla de textos de interfaz del idioma activo (estructura de texts.es). */
  texts: Texts
  setLanguage: (language: LanguageId) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

/**
 * D12: idioma inicial = 1) valor persistido del usuario, 2) detección por
 * navigator.language(s), 3) fallback español. La elección manual es la única
 * que se persiste.
 */
function detectInitialLanguage(): LanguageId {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'es' || stored === 'en') return stored
  const candidates = window.navigator.languages ?? [window.navigator.language]
  for (const tag of candidates) {
    const base = tag.slice(0, 2).toLowerCase()
    if (base === 'es') return 'es'
    if (base === 'en') return 'en'
  }
  return 'es'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageId>(detectInitialLanguage)

  useEffect(() => {
    // Sincroniza el atributo lang del documento con el idioma activo (a11y).
    document.documentElement.lang = language
  }, [language])

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      texts: language === 'en' ? en : es,
      setLanguage: (next) => {
        window.localStorage.setItem(STORAGE_KEY, next)
        setLanguageState(next)
      },
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (ctx === null) throw new Error('useLanguage debe usarse dentro de <LanguageProvider>')
  return ctx
}
