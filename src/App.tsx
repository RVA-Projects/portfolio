import { useCallback } from 'react'
import type { SectionId } from './data/site'
import { SECTIONS } from './data/site'
import { LanguageProvider } from './i18n'
import { useMenuVisibility } from './hooks/useMenuVisibility'
import { useScrollSpy } from './hooks/useScrollSpy'
import { useDisclosure } from './hooks/useDisclosure'
import { useTheme } from './hooks/useTheme'
import { NavigationMenu } from './components/layout/NavigationMenu'
import { TopBar } from './components/layout/TopBar'
import { BackgroundCanvas } from './components/layout/BackgroundCanvas'
import { Introduction } from './components/sections/Introduction'
import { ProjectsSection } from './components/sections/ProjectsSection'
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
 * Orquestación de la SPA. Orden de secciones por anclas:
 * intro → projects → experience → education → languages → contact.
 * Las secciones de F6 se añaden al main conforme se implementen.
 */
function AppRoutes() {
  const menu = useDisclosure(false)
  const menuVisible = useMenuVisibility()
  const activeSection = useScrollSpy(SECTIONS)
  const { theme, toggleTheme } = useTheme()

  /** Ancla nativa con desplazamiento suave (institucional, no mecánico) */
  const onSelect = useCallback(
    (id: SectionId) => {
      menu.onClose()
      const target = document.getElementById(id)
      target?.scrollIntoView({ behavior: smoothBehavior(), block: 'start' })
      window.history.replaceState(null, '', `#${id}`)
    },
    [menu],
  )

  return (
    <>
      <BackgroundCanvas theme={theme} />
      <TopBar
        menuOpen={menu.open}
        onToggleMenu={menu.onToggle}
        visible={menuVisible}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <NavigationMenu
        open={menu.open}
        activeId={activeSection}
        onClose={menu.onClose}
        onSelect={onSelect}
      />
      <main>
        <Introduction />
        <ProjectsSection />
        <ExperienceSection />
        <EducationSection />
        <LanguagesSection />
      </main>
      <Footer />
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
