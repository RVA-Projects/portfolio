import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

describe('ExperienceSection (RF-15)', () => {
  it('agrupa por tipo (sin freelance, decisión propietario) y no muestra grupos vacíos', () => {
    render(<App />)
    expect(screen.queryByRole('heading', { name: 'Freelance' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Profesional' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Proyectos independientes' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Colaboraciones' })).toBeInTheDocument()
  })

  it('renderiza las tarjetas del inventario validado, incluida Snake', () => {
    render(<App />)
    const section = document.getElementById('experience')
    expect(section).not.toBeNull()
    expect(
      within(section as HTMLElement).getByRole('heading', { name: 'Loki Home', level: 3 }),
    ).toBeInTheDocument()
    expect(
      within(section as HTMLElement).getByRole('heading', { name: 'Snake', level: 3 }),
    ).toBeInTheDocument()
    expect(
      within(section as HTMLElement).getByRole('heading', { name: 'Task Manager', level: 3 }),
    ).toBeInTheDocument()
    expect(within(section as HTMLElement).getAllByText('Funciones').length).toBeGreaterThan(0)
  })

  it('muestra los periodos reales y las entradas sin fecha no muestran periodo', () => {
    render(<App />)
    const section = document.getElementById('experience')
    expect(section).not.toBeNull()
    // Fechas verificadas por el propietario
    expect(within(section as HTMLElement).getAllByText(/Actualidad/).length).toBeGreaterThan(0)
    // Snake: 2026 – Actualidad (asegurado dentro de SU tarjeta)
    const snakeHeading = within(section as HTMLElement).getByRole('heading', {
      name: 'Snake',
      level: 3,
    })
    const snakeCard = snakeHeading.closest('article')
    expect(snakeCard).not.toBeNull()
    expect(within(snakeCard as HTMLElement).getByText('2026 – Actualidad')).toBeInTheDocument()
  })

  it('enlaza solo a repos/dominios verificados desde las tarjetas (incl. perfil Upwork real)', () => {
    render(<App />)
    const section = document.getElementById('experience')
    expect(section).not.toBeNull()
    for (const link of within(section as HTMLElement).getAllByRole('link')) {
      const href = link.getAttribute('href') ?? ''
      expect(
        ['github.com', 'lokihome.com', 'centromedicosectorv.es', 'dawdam.top', 'upwork.com'].some(
          (domain) => href.includes(domain),
        ),
      ).toBe(true)
    }
  })

  it('las entradas vía Upwork enlazan con la etiqueta "Perfil de Upwork"', () => {
    render(<App />)
    const section = document.getElementById('experience')
    expect(section).not.toBeNull()
    const upworkLinks = within(section as HTMLElement)
      .getAllByRole('link')
      .filter((link) => (link.getAttribute('href') ?? '').includes('upwork.com'))
    expect(upworkLinks.length).toBe(2)
    for (const link of upworkLinks) {
      expect(link).toHaveAccessibleName('Perfil de Upwork')
    }
  })
})
