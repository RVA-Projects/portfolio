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
 * D27 — Sección Stack propia (tras Proyectos), centrada, con dos niveles:
 * core y explored. Blindamos estructura: títulos + listas completas con
 * icono + nombre por tecnología.
 */
describe('Sección Stack (D27)', () => {
  it('existe la sección #stack con los dos niveles como títulos', () => {
    render(<App />)
    expect(document.getElementById('stack')).not.toBeNull()
    expect(screen.getByRole('heading', { level: 2, name: 'Stack' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Stack principal' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'Tecnologías con las que he experimentado' }),
    ).toBeInTheDocument()
  })

  it('cada nivel lista icono + nombre para TODAS las tecnologías de su tier', () => {
    render(<App />)
    const expected = [
      { title: 'Stack principal', tier: technologiesByTier('core') },
      { title: 'Tecnologías con las que he experimentado', tier: technologiesByTier('explored') },
    ]
    for (const { title, tier } of expected) {
      const grid = screen.getByText(title).nextElementSibling as HTMLElement
      expect(grid.tagName).toBe('UL')
      expect(within(grid).getAllByRole('listitem')).toHaveLength(tier.length)
      for (const tech of tier) {
        const item = within(grid).getByText(tech.name).closest('li') as HTMLElement
        /* Icono decorativo SIEMPRE presente: <img>, <svg> o silueta mono D28
           (<span> con mask-image + currentColor, aria-hidden). */
        const icon = item.firstElementChild as HTMLElement
        expect(icon.getAttribute('aria-hidden')).toBe('true')
        expect(icon.hasAttribute('data-tech-icon')).toBe(true)
        expect(icon.tagName === 'IMG' || icon.tagName === 'svg' || icon.tagName === 'SPAN').toBe(
          true,
        )
        if (icon.tagName === 'SPAN') {
          expect(icon.style.maskImage).toContain('url(')
        }
      }
    }
  })

  it('la entrada "Stack" está presente en la navegación permanente (ronda 5 F2)', () => {
    render(<App />)
    const nav = screen.getByRole('navigation')
    expect(within(nav).getByRole('link', { name: 'Stack' })).toBeInTheDocument()
  })
})

/**
 * D24/D26 — Clicker: botón circular con diana; contador en caja propia.
 * El fondo (D23) reacciona a cada pulsación; aquí se blinda contador y a11y.
 */
describe('Clicker (D24/D26)', () => {
  it('empieza a 0 y cuenta cada click con el aria-label nuevo', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: 'Clicker: añade un clic' })

    const counter = button.nextElementSibling as HTMLElement
    expect(counter).toHaveTextContent('0')

    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)
    expect(counter).toHaveTextContent('3')
  })
})
