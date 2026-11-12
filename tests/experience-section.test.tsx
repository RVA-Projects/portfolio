import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

describe('ExperienceSection (RF-15, Fase 6 — lista plana)', () => {
  it('NO muestra grupos (ni encabezados de proyectos independientes o colaboraciones)', () => {
    render(<App />)
    expect(screen.queryByRole('heading', { name: 'Profesional' })).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Proyectos independientes' }),
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Colaboraciones' })).not.toBeInTheDocument()
  })

  it('renderiza las 7 entradas profesionales, SIN las fichas movidas a Proyectos', () => {
    render(<App />)
    const section = document.getElementById('experience')
    expect(section).not.toBeNull()
    const headings = within(section as HTMLElement)
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent)
    expect(headings).toEqual([
      'Centro Médico Sector V — web',
      'Centro Médico Sector V — redes sociales',
      'Centro Médico Sector V — agente IA de asesoramiento',
      'Centro Médico Sector V — firma digital',
      'Loki Home',
      'Smarti DATA — vía Upwork',
      'Captación de comandos de voz — vía Upwork',
    ])
    // Snake/MiniCRM/etc. ya no están en experiencia: están en Proyectos
    expect(headings).not.toContain('Snake')
    expect(headings).not.toContain('MiniCRM (Android)')
    expect(headings).not.toContain('dawdam.top')
  })

  it('sin etiqueta de grupo en las tarjetas (sin chips Profesional/Colaboraciones)', () => {
    render(<App />)
    const section = document.getElementById('experience')
    expect(section).not.toBeNull()
    expect(within(section as HTMLElement).queryByText('Profesional')).not.toBeInTheDocument()
    expect(within(section as HTMLElement).queryByText('Colaboración')).not.toBeInTheDocument()
  })

  it('muestra los periodos reales y las entradas sin fecha no muestran periodo', () => {
    render(<App />)
    const section = document.getElementById('experience')
    expect(section).not.toBeNull()
    // Fechas verificadas por el propietario
    expect(within(section as HTMLElement).getAllByText(/Actualidad/).length).toBeGreaterThan(0)
    // Loki Home: 2025 – Actualidad (dentro de SU tarjeta)
    const lokiHeading = within(section as HTMLElement).getByRole('heading', {
      name: 'Loki Home',
      level: 3,
    })
    const lokiCard = lokiHeading.closest('article')
    expect(lokiCard).not.toBeNull()
    expect(within(lokiCard as HTMLElement).getByText('2025 – Actualidad')).toBeInTheDocument()
  })

  it('enlaza solo a dominios verificados desde las tarjetas (incl. perfil Upwork real)', () => {
    render(<App />)
    const section = document.getElementById('experience')
    expect(section).not.toBeNull()
    for (const link of within(section as HTMLElement).getAllByRole('link')) {
      const href = link.getAttribute('href') ?? ''
      expect(
        ['lokihome.com', 'centromedicosectorv.es', 'upwork.com'].some((domain) =>
          href.includes(domain),
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
