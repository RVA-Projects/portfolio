import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

/**
 * Ronda 3 F5 — selector ES/EN del TopBar: muestra el idioma ACTIVO, alterna
 * sin recargar y persiste. La infraestructura i18n ya existía (D12): esto
 * prueba el acceso por UI (no traduce contenido: las entidades ya traen es/en).
 */
describe('Selector de idioma ES/EN (TopBar, F5)', () => {
  it('muestra el idioma activo y alterna a EN sin recargar', () => {
    render(<App />)
    const toggle = screen.getByRole('button', { name: 'Cambiar a inglés' })
    expect(toggle).toHaveTextContent('ES')

    fireEvent.click(toggle)
    // Tras el cambio, los aria-labels se emiten en el idioma ACTIVO (en)
    expect(screen.getByRole('button', { name: 'Switch to Spanish' })).toHaveTextContent('EN')
    // El contenido de interfaz cambia al inglés (Proyectos -> Projects)
    expect(screen.getByRole('heading', { name: 'Projects', level: 2 })).toBeInTheDocument()
    expect(window.localStorage.getItem('rva-portfolio-language')).toBe('en')
  })

  it('vuelve a ES y el idioma persistido es la única fuente (sin recarga)', () => {
    window.localStorage.setItem('rva-portfolio-language', 'en')
    render(<App />)
    expect(screen.getByRole('button', { name: 'Switch to Spanish' })).toHaveTextContent('EN')

    fireEvent.click(screen.getByRole('button', { name: 'Switch to Spanish' }))
    expect(screen.getByRole('button', { name: 'Cambiar a inglés' })).toHaveTextContent('ES')
    expect(screen.getByRole('heading', { name: 'Proyectos', level: 2 })).toBeInTheDocument()
    expect(window.localStorage.getItem('rva-portfolio-language')).toBe('es')
  })
})
