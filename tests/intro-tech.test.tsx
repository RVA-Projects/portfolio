import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { App } from '../src/App'
import { technologiesByTier } from '../src/data/technologies'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

/**
 * Fase 7.2 — grid de tecnologías de la introducción: más grande y
 * jerárquico (los ajustes visuales son CSS; aquí se blinda la estructura
 * de los tres niveles con icono + nombre por tecnología).
 */
describe('Grid de tecnologías de la intro (Fase 7.2)', () => {
  it('mantiene los tres niveles jerárquicos con título y entradas', () => {
    render(<App />)
    for (const title of [
      'Stack principal',
      'Tecnologías usadas en proyectos',
      'Herramientas y complementos',
    ]) {
      expect(screen.getByText(title)).toBeInTheDocument()
    }
  })

  it('cada nivel lista icono + nombre para TODAS las tecnologías de su tier', () => {
    render(<App />)
    const expected = [
      { title: 'Stack principal', tier: technologiesByTier('core') },
      { title: 'Tecnologías usadas en proyectos', tier: technologiesByTier('project') },
      { title: 'Herramientas y complementos', tier: technologiesByTier('tool') },
    ]
    for (const { title, tier } of expected) {
      const grid = screen.getByText(title).nextElementSibling as HTMLElement
      expect(grid.tagName).toBe('UL')
      const names = tier.map((tech) => tech.name)
      expect(within(grid).getAllByRole('listitem')).toHaveLength(tier.length)
      for (const name of names) {
        const item = within(grid).getByText(name).closest('li') as HTMLElement
        /* Icono decorativo SIEMPRE presente junto al nombre */
        expect(item.querySelectorAll('img')).toHaveLength(1)
      }
    }
  })
})

/**
 * D24 — Clicker: botón juguete al extremo del contacto rápido, con contador.
 * El fondo (D23) reacciona a cada pulsación; aquí se blinda contador y a11y.
 */
describe('Clicker (D24)', () => {
  it('empieza a 0 y cuenta cada click; el aria-label es estable', () => {
    render(<App />)
    const button = screen.getByRole('button', {
      name: 'Clicker: contador de clics, pulsa todas las veces que quieras',
    })

    const counter = button.nextElementSibling as HTMLElement
    expect(counter).toHaveTextContent('0')

    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)
    expect(counter).toHaveTextContent('3')
  })
})
