import { Introduction } from './components/sections/Introduction'

/**
 * TODO(F5/F6): orquestación de la SPA. Orden de secciones por anclas:
 * intro → projects → experience → education → languages → contact.
 * Overlays (project/document) se montan aquí desde OverlayContext (F6).
 * Este esqueleto (F3) solo garantiza la estructura semántica y el build.
 */
export function App() {
  return (
    <>
      <main>
        <Introduction />
      </main>
    </>
  )
}
