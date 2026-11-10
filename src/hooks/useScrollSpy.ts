import { useEffect, useState } from 'react'
import type { SectionId } from '../data/site'

/**
 * Indicador de sección activa (RF-04) vía IntersectionObserver.
 * Ignora secciones aún no montadas (fases F6 pendientes).
 */
export function useScrollSpy(ids: SectionId[]): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null)

  useEffect(() => {
    // Guard: jsdom/entornos sin IntersectionObserver (tests) no rompen la app.
    if (typeof IntersectionObserver === 'undefined') return
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId)
        }
      },
      // Franja vertical central: la sección que "posee" la mitad de la vista.
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [ids])

  return active
}
