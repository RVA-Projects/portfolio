import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { App } from '../src/App'
import { projects } from '../src/data/projects'
import { rvaPortfolio } from '../src/data/projects/rva-portfolio'
import { technologies } from '../src/data/technologies'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

/**
 * RVA Portfolio reuses one data record in the catalog and Footer overlay.
 */
describe('Ficha RVA Portfolio (datos)', () => {
  it('id estable, está al final del catálogo y sus tech ids existen', () => {
    expect(rvaPortfolio.id).toBe('rva-portfolio')
    expect(projects.at(-1)).toBe(rvaPortfolio)
    expect(rvaPortfolio.technologyIds.length).toBeGreaterThan(0)
    expect(rvaPortfolio.technologyIds).toEqual(
      expect.arrayContaining(['typescript', 'opencodex', 'codex']),
    )
    const techIds = new Set(technologies.map((t) => t.id))
    for (const technologyId of rvaPortfolio.technologyIds) {
      expect(techIds.has(technologyId), technologyId).toBe(true)
    }
  })

  it('los textos del overlay tienen contenido es/en completo', () => {
    const texts: unknown[] = [
      rvaPortfolio.name,
      rvaPortfolio.summary,
      rvaPortfolio.goal,
      rvaPortfolio.problem,
      rvaPortfolio.role,
      rvaPortfolio.architecture,
      rvaPortfolio.outcomes,
      rvaPortfolio.learnings,
      ...rvaPortfolio.media.map((m) => m.alt),
      ...rvaPortfolio.features.map((f) => f.text),
      ...rvaPortfolio.technicalDecisions.map((d) => d.text),
    ]
    for (const value of texts) {
      const localized = value as { es: string; en: string }
      expect(localized.es.length).toBeGreaterThan(0)
      expect(localized.en.length).toBeGreaterThan(0)
    }
  })

  it('la media declarada existe en public/ (captura real del propio sitio)', () => {
    for (const item of rvaPortfolio.media) {
      const relative = item.src.replace('/portfolio/', '')
      expect(existsSync(join(process.cwd(), 'public', relative)), item.src).toBe(true)
    }
  })

  it('no promete enlaces que no existen todavía (repo remoto pendiente)', () => {
    expect(rvaPortfolio.links).toHaveLength(0)
  })
})

describe('Footer → ficha RVA Portfolio (overlay reutilizado)', () => {
  it('la línea de copyright es un botón que abre la ficha; Escape cierra', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Abrir la ficha del proyecto/ }))

    const dialog = screen.getByRole('dialog', { name: 'RVA Portfolio' })
    expect(dialog).toBeInTheDocument()
    // El goal menciona OpenCode (asistente de programación) — puede repetirse
    // en otros bloques: basta con que exista dentro del dialog
    expect(within(dialog).getAllByText(/OpenCode/).length).toBeGreaterThan(0)

    // La ficha única NO ofrece navegación prev/next
    expect(screen.queryByRole('button', { name: 'Proyecto anterior' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Proyecto siguiente' })).not.toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
