import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

describe('ExperienceSection (RF-15)', () => {
  it('agrupa por tipo y no muestra grupos vacíos (no hay "professional")', () => {
    render(<App />)
    expect(
      screen.queryByRole('heading', { name: 'Experiencia profesional' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Freelance' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Proyectos independientes' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Colaboraciones' })).toBeInTheDocument()
  })

  it('renderiza las tarjetas con datos del inventario', () => {
    render(<App />)
    const section = document.getElementById('experience')
    expect(section).not.toBeNull()
    expect(
      within(section as HTMLElement).getByRole('heading', { name: 'Loki Home', level: 3 }),
    ).toBeInTheDocument()
    expect(
      within(section as HTMLElement).getByRole('heading', { name: 'Task Manager', level: 3 }),
    ).toBeInTheDocument()
    expect(within(section as HTMLElement).getAllByText('Funciones').length).toBeGreaterThan(0)
  })

  it('no muestra periodos (sin fechas verificadas hasta F7)', () => {
    render(<App />)
    expect(screen.queryByText(/Actualidad/)).not.toBeInTheDocument()
  })

  it('enlaza solo a repos/dominios verificados desde las tarjetas', () => {
    render(<App />)
    const section = document.getElementById('experience')
    expect(section).not.toBeNull()
    for (const link of within(section as HTMLElement).getAllByRole('link')) {
      const href = link.getAttribute('href') ?? ''
      expect(
        ['github.com', 'lokihome.com', 'centromedicosectorv.es', 'dawdam.top'].some((domain) =>
          href.includes(domain),
        ),
      ).toBe(true)
    }
  })
})
