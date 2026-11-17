import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

function openExperience(name: string) {
  cleanup()
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: `Abrir experiencia: ${name}` }))
  return screen.getByRole('dialog', { name })
}

describe('ExperienceSection (Fase 5/6 — tarjetas minimalistas + overlay)', () => {
  it('las tarjetas son minimalistas: título + periodo, SIN descripción ni listas', () => {
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
    // Minimalista: las descripciones/listas viven SOLO en el overlay
    expect(within(section as HTMLElement).queryByText('Funciones')).not.toBeInTheDocument()
    expect(
      within(section as HTMLElement).queryByText(/Página web oficial del centro/),
    ).not.toBeInTheDocument()
  })

  it('cada tarjeta es un botón accesible con aria-label explícito (nunca solo-hover)', () => {
    render(<App />)
    const section = document.getElementById('experience')
    const buttons = within(section as HTMLElement).getAllByRole('button', {
      name: /^Abrir experiencia:/,
    })
    expect(buttons).toHaveLength(7)
  })

  it('la tarjeta muestra periodo real y entradas sin fecha no muestran periodo', () => {
    render(<App />)
    const section = document.getElementById('experience')
    expect(within(section as HTMLElement).getAllByText(/Actualidad/).length).toBeGreaterThan(0)
    // Smarti DATA (sin fecha confirmada): su tarjeta no muestra "–"
    const smarti = screen
      .getByRole('button', {
        name: 'Abrir experiencia: Smarti DATA — vía Upwork',
      })
      .closest('article')
    expect(within(smarti as HTMLElement).queryByText(/–/)).not.toBeInTheDocument()
  })

  it('el overlay muestra la info ampliada: descripción, funciones, enlaces y tecnologías', () => {
    const dialog = openExperience('Loki Home')
    expect(within(dialog).getByText(/Página web oficial de la marca/)).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: 'Funciones' })).toBeInTheDocument()
    // Enlaces de la experiencia al overlay (ya no en la tarjeta)
    expect(within(dialog).getByRole('link', { name: 'Ver sitio web' })).toHaveAttribute(
      'href',
      'https://lokihome.com/',
    )
    // La tarjeta minimalista ya no contiene el enlace (vive en el overlay)
    const section = document.getElementById('experience') as HTMLElement
    const lokiCard = within(section)
      .getByRole('heading', { name: 'Loki Home', level: 3 })
      .closest('article')
    expect(lokiCard).not.toBeNull()
    expect(
      within(lokiCard as HTMLElement).queryByRole('link', { name: 'Ver sitio web' }),
    ).not.toBeInTheDocument()
  })

  it('el overlay de Centro Médico (web) lista su proyecto asociado y navega a su ficha', () => {
    const dialog = openExperience('Centro Médico Sector V — web')
    expect(within(dialog).getByRole('heading', { name: 'Logros' })).toBeInTheDocument()
    const viewButton = within(dialog).getByRole('button', {
      name: 'Ver proyecto: Centro Médico Sector V',
    })
    fireEvent.click(viewButton)
    // El overlay de experiencia se cierra; abre el ProjectOverlay de la ficha
    expect(
      screen.queryByRole('dialog', { name: 'Centro Médico Sector V — web' }),
    ).not.toBeInTheDocument()
    const projectDialog = screen.getByRole('dialog', { name: 'Centro Médico Sector V' })
    expect(
      within(projectDialog).getByRole('region', { name: 'Galería del proyecto' }),
    ).toBeInTheDocument()
  })

  it('sin proyectos asociados (Upwork) el overlay no muestra la sección', () => {
    const dialog = openExperience('Smarti DATA — vía Upwork')
    expect(
      within(dialog).queryByRole('heading', { name: 'Proyectos asociados' }),
    ).not.toBeInTheDocument()
  })

  it('el overlay se cierra con Escape y con la X', () => {
    openExperience('Loki Home')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    openExperience('Loki Home')
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar detalles de la experiencia' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('sin grupos ni etiquetas de kind (Fase 6)', () => {
    render(<App />)
    const section = document.getElementById('experience')
    expect(section).not.toBeNull()
    expect(
      within(section as HTMLElement).queryByRole('heading', { name: 'Profesional' }),
    ).not.toBeInTheDocument()
    expect(
      within(section as HTMLElement).queryByRole('heading', { name: 'Colaboraciones' }),
    ).not.toBeInTheDocument()
  })
})

describe('Carrusel de experiencia (ronda 6 F1 — misma arquitectura que Proyectos)', () => {
  it('el carrusel muestra contador, indicador 1/N y las 7 tarjetas', () => {
    render(<App />)
    const section = document.getElementById('experience') as HTMLElement
    expect(within(section).getAllByText('7 experiencias')).toHaveLength(2)
    expect(within(section).getByText('1 / 7')).toBeInTheDocument()
    expect(within(section).getAllByRole('button', { name: /^Abrir experiencia:/ })).toHaveLength(7)
    expect(
      within(section).getByRole('region', { name: 'Carrusel de experiencia' }),
    ).toBeInTheDocument()
  })

  it('las flechas del carrusel deshabilitan extremos y navegan por teclado', () => {
    render(<App />)
    const section = document.getElementById('experience') as HTMLElement
    const prev = within(section).getByRole('button', {
      name: 'Desplazar a experiencias anteriores',
    })
    const next = within(section).getByRole('button', {
      name: 'Desplazar a experiencias siguientes',
    })
    expect(prev).toBeDisabled()
    expect(next).toBeEnabled()
  })

  it('el overlay navega entre experiencias SIN cerrarse (flechas del header)', () => {
    const dialog = openExperience('Centro Médico Sector V — web')
    /* Primera experiencia: prev deshabilitado, next activo */
    const prev = within(dialog).getByRole('button', { name: 'Experiencia anterior' })
    const next = within(dialog).getByRole('button', { name: 'Experiencia siguiente' })
    expect(prev).toBeDisabled()
    expect(next).toBeEnabled()
    fireEvent.click(next)
    /* El MISMO dialog sigue abierto con el contenido de la 2ª experiencia */
    expect(
      screen.getByRole('dialog', { name: 'Centro Médico Sector V — redes sociales' }),
    ).toBeInTheDocument()
  })

  it('←/→ a nivel documento cambian de experiencia sin cerrar', () => {
    openExperience('Loki Home')
    fireEvent.keyDown(document, { key: 'ArrowRight' })
    expect(screen.getByRole('dialog', { name: 'Smarti DATA — vía Upwork' })).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(screen.getByRole('dialog', { name: 'Loki Home' })).toBeInTheDocument()
    /* Escape sigue cerrando */
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
