import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { App } from '../src/App'

/**
 * D18 — Tema. jsdom no implementa matchMedia: el setup real de la app llama
 * window.matchMedia en useTheme. Verificamos que exista (los tests actuales
 * ya lo usan) y controlamos la preferencia simulada cuando hace falta.
 */
beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
  document.documentElement.removeAttribute('data-theme')
})

afterEach(() => {
  window.localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  vi.restoreAllMocks()
})

/** Stub de matchMedia para jsdom: solo evalúa prefers-color-scheme: light. */
function mockMatchMedia(options: { prefersLight: boolean }): void {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string): MediaQueryList =>
      ({
        matches: options.prefersLight && query === '(prefers-color-scheme: light)',
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  )
}

describe('useTheme + TopBar (Fase 1, D18)', () => {
  it('por defecto (sistema sin preferencia clara) aplica el tema oscuro sin data-theme', () => {
    mockMatchMedia({ prefersLight: false })
    render(<App />)
    expect(document.documentElement.dataset.theme).toBeUndefined()
    // En oscuro, el toggle ofrece el modo claro (icono sol)
    expect(screen.getByRole('button', { name: 'Cambiar a modo claro' })).toBeInTheDocument()
  })

  it('con prefers-color-scheme: light del sistema, arranca en claro', () => {
    mockMatchMedia({ prefersLight: true })
    render(<App />)
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(screen.getByRole('button', { name: 'Cambiar a modo oscuro' })).toBeInTheDocument()
  })

  it('la preferencia persistida del usuario tiene prioridad sobre el sistema', () => {
    window.localStorage.setItem('rva-portfolio-theme', 'light')
    mockMatchMedia({ prefersLight: false })
    render(<App />)
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('el toggle alterna data-theme y persiste la elección manual', () => {
    mockMatchMedia({ prefersLight: false })
    render(<App />)

    const toggle = screen.getByRole('button', { name: 'Cambiar a modo claro' })
    fireEvent.click(toggle)
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(window.localStorage.getItem('rva-portfolio-theme')).toBe('light')
    // El botón ahora ofrece volver a oscuro
    expect(screen.getByRole('button', { name: 'Cambiar a modo oscuro' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cambiar a modo oscuro' }))
    expect(document.documentElement.dataset.theme).toBeUndefined()
    expect(window.localStorage.getItem('rva-portfolio-theme')).toBe('dark')
  })
})
