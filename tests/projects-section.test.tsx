import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

describe('ProjectsSection (RF-06/RF-07/RF-08)', () => {
  it('muestra 10 proyectos con el filtro All, incluido RVA Portfolio', () => {
    render(<App />)
    expect(screen.getByText('10 proyectos')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Abrir proyecto: RVA Portfolio' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Carrusel de proyectos' })).toBeInTheDocument()
  })

  it('las tarjetas muestran badges de categorías de filtro (Signature admite dos)', () => {
    render(<App />)
    const signature = screen
      .getByRole('button', { name: 'Abrir proyecto: Signature Application' })
      .closest('article') as HTMLElement
    const badges = signature.querySelector('[class*="categoryBadge"]') as HTMLElement
    expect(within(badges).getByText('Web')).toBeInTheDocument()
    expect(within(badges).getByText('C#')).toBeInTheDocument()
  })

  it('la tarjeta RVA Portfolio abre la ficha existente dentro del carrusel', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Abrir proyecto: RVA Portfolio' }))
    const dialog = screen.getByRole('dialog', { name: 'RVA Portfolio' })
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByText('TypeScript')).toBeInTheDocument()
    expect(within(dialog).getByText('Codex')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Proyecto anterior' })).toBeEnabled()
  })

  it('filtra por categoría Android y actualiza el total de resultados (F2.2)', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Android' }))
    expect(screen.getByText('2 proyectos')).toBeInTheDocument()
    expect(
      within(screen.getByRole('region', { name: 'Carrusel de proyectos' })).getAllByRole('button', {
        name: /^Abrir proyecto:/,
      }),
    ).toHaveLength(2)
  })

  it('las 5 categorías están SIEMPRE visibles, incluso Python/Java con 0 proyectos', () => {
    render(<App />)
    for (const label of ['Android', 'Web', 'C#', 'Python', 'Java']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
    fireEvent.click(screen.getByRole('button', { name: 'Python' }))
    expect(screen.getByText('0 proyectos')).toBeInTheDocument()
  })

  it('el botón Todas restaura la colección completa', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Web' }))
    expect(screen.getByText('6 proyectos')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Todas' }))
    expect(screen.getByText('10 proyectos')).toBeInTheDocument()
  })

  it('el carrusel navega con botones prev/next y se deshabilita en extremos', () => {
    render(<App />)
    const prev = screen.getByRole('button', { name: 'Desplazar a proyectos anteriores' })
    const next = screen.getByRole('button', { name: 'Desplazar a proyectos siguientes' })
    expect(prev).toBeDisabled()
    expect(next).toBeEnabled()
    fireEvent.scroll(screen.getByRole('region', { name: 'Carrusel de proyectos' }))
  })
})
