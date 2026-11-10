import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { App } from '../src/App'

const MENU_OPEN_LABEL = 'Abrir menú de navegación'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  // D12: fuerza español para aserciones estables (elección manual persistida)
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

function openMenu() {
  fireEvent.click(screen.getByRole('button', { name: MENU_OPEN_LABEL }))
}

describe('NavigationMenu (RF-04)', () => {
  it('abre con el botón superior y muestra las anclas de sección', () => {
    render(<App />)
    openMenu()
    const menu = screen.getByTestId('navigation-menu')
    expect(menu).toBeInTheDocument()
    expect(withinMenu(menu).length).toBeGreaterThan(0)
  })

  it('cierra con Escape', () => {
    render(<App />)
    openMenu()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByTestId('navigation-menu')).not.toBeInTheDocument()
  })

  it('cierra al pulsar fuera del panel', () => {
    render(<App />)
    openMenu()
    fireEvent.click(screen.getByTestId('menu-backdrop'))
    expect(screen.queryByTestId('navigation-menu')).not.toBeInTheDocument()
  })

  it('cierra al seleccionar una sección (navegación por ancla)', () => {
    render(<App />)
    openMenu()
    fireEvent.click(screen.getAllByRole('link', { name: 'Contacto' })[0])
    expect(screen.queryByTestId('navigation-menu')).not.toBeInTheDocument()
  })
})

function withinMenu(menu: HTMLElement) {
  return Array.from(menu.querySelectorAll('a')).map((a) => a.textContent)
}

describe('i18n (RF-25/D12)', () => {
  it('usa inglés cuando el navegador es en-US y no hay elección persistida', () => {
    window.localStorage.clear()
    render(<App />)
    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toBeInTheDocument()
  })

  it('hace fallback a español cuando el navegador no es es/en y no hay elección persistida', () => {
    window.localStorage.clear()
    Object.defineProperty(window.navigator, 'languages', {
      value: ['fr-FR', 'de-DE'],
      configurable: true,
    })
    render(<App />)
    expect(screen.getByRole('button', { name: MENU_OPEN_LABEL })).toBeInTheDocument()
    Object.defineProperty(window.navigator, 'languages', { value: ['en-US'], configurable: true })
  })
})
