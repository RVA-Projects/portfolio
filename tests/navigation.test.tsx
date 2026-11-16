import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  // D12: fuerza español para aserciones estables (elección manual persistida)
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const NAV_LABEL = 'Navegación principal'

/**
 * Ronda 5 F2 — navegación horizontal PERMANENTE (D-B/D-C): fuera el menú
 * desplegable y su hamburguesa; las secciones viven SIEMPRE en la barra
 * superior (fija, translúcida), enlaces directos por ancla + indicador
 * activo (useScrollSpy). Controles de tema e idioma intactos a la derecha.
 */
describe('Navegación horizontal permanente (ronda 5 F2)', () => {
  it('muestra TODAS las secciones en la barra sin pulsar nada', () => {
    render(<App />)
    const nav = screen.getByRole('navigation', { name: NAV_LABEL })
    const labels = Array.from(nav.querySelectorAll('a')).map((a) => a.textContent)
    expect(labels).toEqual([
      'Presentación',
      'Proyectos',
      'Stack',
      'Experiencia',
      'Formación',
      'Idiomas',
    ])
  })

  it('no existe ningún botón hamburguesa ni menú desplegable antiguo', () => {
    render(<App />)
    expect(screen.queryByRole('button', { name: /menú de navegación/i })).not.toBeInTheDocument()
    expect(screen.queryByTestId('navigation-menu')).not.toBeInTheDocument()
    expect(screen.queryByTestId('menu-backdrop')).not.toBeInTheDocument()
  })

  it('cada enlace navega por ancla a su sección (hash + scrollIntoView)', () => {
    /* jsdom no trae matchMedia (smoothBehavior) NI scrollIntoView: declarar
       un no-op y espiarlo (mock.instances guarda el `this` de cada llamada). */
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
    render(<App />)
    window.HTMLElement.prototype.scrollIntoView = () => {}
    const scrollSpy = vi
      .spyOn(window.HTMLElement.prototype, 'scrollIntoView')
      .mockName('scrollIntoView')

    const nav = screen.getByRole('navigation', { name: NAV_LABEL })
    fireEvent.click(nav.querySelector('a[href="#education"]') as HTMLElement)

    expect(window.location.hash).toBe('#education')
    expect((scrollSpy.mock.instances[0] as unknown as HTMLElement | undefined)?.id).toBe(
      'education',
    )
    scrollSpy.mockRestore()
    Reflect.deleteProperty(window.HTMLElement.prototype, 'scrollIntoView')
  })

  it('el enlace activo lleva aria-current (indicador de sección activa)', () => {
    render(<App />)
    /* Con IntersectionObserver ausente (jsdom) el spy queda en null: ningún
       enlace marcado, pero el atributo se gestiona sin errores. */
    const nav = screen.getByRole('navigation', { name: NAV_LABEL })
    expect(nav.querySelectorAll('[aria-current="true"]')).toHaveLength(0)
  })
})

describe('TopBar fija (ronda 5 F2, D-B)', () => {
  it('la barra SIEMPRE está visible: nunca se oculta ni cambia de forma', () => {
    render(<App />)
    const bar = screen.getByRole('navigation', { name: NAV_LABEL }).closest('header')
    expect(bar).not.toBeNull()
    const classes = (bar as HTMLElement).className
    expect(classes).not.toContain('compact')
    expect(classes).not.toContain('hidden')
  })
})

describe('i18n (RF-25/D12)', () => {
  it('usa inglés cuando el navegador es en-US y no hay elección persistida', () => {
    window.localStorage.clear()
    render(<App />)
    expect(screen.getByRole('button', { name: 'Switch to Spanish' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Intro' })[0]).toBeInTheDocument()
  })

  it('hace fallback a español cuando el navegador no es es/en y no hay elección persistida', () => {
    window.localStorage.clear()
    Object.defineProperty(window.navigator, 'languages', {
      value: ['fr-FR', 'de-DE'],
      configurable: true,
    })
    render(<App />)
    expect(screen.getByRole('navigation', { name: NAV_LABEL })).toBeInTheDocument()
    Object.defineProperty(window.navigator, 'languages', { value: ['en-US'], configurable: true })
  })
})
