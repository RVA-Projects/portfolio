import { useCallback } from 'react'
import type { SectionId } from './data/site'
import { SECTIONS } from './data/site'
import { LanguageProvider } from './i18n'
import { useScrollSpy } from './hooks/useScrollSpy'
import { useTheme } from './hooks/useTheme'
import { TopBar } from './components/layout/TopBar'
import { BackgroundCanvas } from './components/layout/BackgroundCanvas'
import { CursorSpot } from './components/layout/CursorSpot'
import { Introduction } from './components/sections/Introduction'
import { ProjectsSection } from './components/sections/ProjectsSection'
import { TechStackSection } from './components/sections/TechStackSection'
import { ExperienceSection } from './components/sections/ExperienceSection'
import { EducationSection } from './components/sections/EducationSection'
import { LanguagesSection } from './components/sections/LanguagesSection'
import { Footer } from './components/sections/Footer'

/** Respeta prefers-reduced-motion al navegar por anclas (RF-04/RNF-02). */
function smoothBehavior(): ScrollBehavior {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return reduce ? 'auto' : 'smooth'
}

/**
 * Orquestación de la SPA. Orden de secciones por anclas (D27):
 * intro → projects → stack → experience → education → languages.
 * Ronda 5 F2 (D-B): navegación horizontal permanente en TopBar — fuera el
 * menú desplegable (NavigationMenu, hamburguesa, useDisclosure) y el estado
 * compacto (useMenuVisibility): la barra es fija y SIEMPRE visible.
 */
function AppRoutes() {
  const activeSection = useScrollSpy(SECTIONS)
  const { theme, toggleTheme } = useTheme()

  /** Ancla nativa con desplazamiento suave (institucional, no mecánico) */
  const onNavigate = useCallback((id: SectionId) => {
    const target = document.getElementById(id)
    target?.scrollIntoView({ behavior: smoothBehavior(), block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
  }, [])

  return (
    <>
      <BackgroundCanvas theme={theme} />
      <TopBar
        activeId={activeSection}
        onNavigate={onNavigate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main>
        <Introduction />
        <ProjectsSection />
        <TechStackSection />
        <ExperienceSection />
        <EducationSection />
        <LanguagesSection />
      </main>
      <Footer />
      {/* D30 — punto lupa: tras el <main> en el DOM para pintar ENCIMA del
          canvas/scrim (ambos z -1) y DEBAJO de todo el texto (z auto). */}
      <CursorSpot />
    </>
  )
}

export function App() {
  return (
    <LanguageProvider>
      <AppRoutes />
    </LanguageProvider>
  )
}
