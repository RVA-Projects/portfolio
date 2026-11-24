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
  const card = screen.getByRole('heading', { name, level: 3 }).closest('article')
  if (card === null) throw new Error(`No se encontró la tarjeta de experiencia: ${name}`)
  fireEvent.click(within(card).getByRole('button'))
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
      'Desarrollo de web empresarial',
      'Gestión de redes sociales',
      'Desarrollo de agente de IA para asesoramiento',
      'Desarrollo de aplicación de firma digital',
      'Desarrollo de web para materiales de construcción y decoración',
      'Registro y verificación de datos conversacionales para entrenamiento de IA',
      'Grabación y verificación de comandos de activación para asistentes de IA',
    ])
    expect(within(section as HTMLElement).getAllByText('Centro Médico Sector V')).toHaveLength(4)
    expect(within(section as HTMLElement).getByText('Loki Home')).toBeInTheDocument()
    // Minimalista: las descripciones/listas viven SOLO en el overlay
    expect(within(section as HTMLElement).queryByText('Funciones')).not.toBeInTheDocument()
    expect(
      within(section as HTMLElement).queryByText(/Sitio oficial del centro/),
    ).not.toBeInTheDocument()
  })

  it('cada tarjeta es un botón accesible con aria-label explícito (nunca solo-hover)', () => {
    render(<App />)
    const section = document.getElementById('experience')
    const buttons = within(section as HTMLElement).getAllByRole('button', {
      name: /^Abrir experiencia:/,
    })
    expect(buttons).toHaveLength(7)
    expect(buttons[0]).toHaveAccessibleName(
      'Abrir experiencia: Desarrollo de web empresarial: Centro Médico Sector V',
    )
  })

  it('la tarjeta muestra periodo real y entradas sin fecha no muestran periodo', () => {
    render(<App />)
    const section = document.getElementById('experience')
    expect(within(section as HTMLElement).getAllByText('2025')).toHaveLength(3)
    expect(within(section as HTMLElement).getAllByText('2026')).toHaveLength(2)
    expect(within(section as HTMLElement).queryByText(/Actualidad/)).not.toBeInTheDocument()
    // Smarti DATA (sin fecha confirmada): su tarjeta no muestra "–"
    const smarti = screen
      .getByRole('button', {
        name: 'Abrir experiencia: Registro y verificación de datos conversacionales para entrenamiento de IA: Smarti DATA · Upwork',
      })
      .closest('article')
    expect(within(smarti as HTMLElement).queryByText(/–/)).not.toBeInTheDocument()
  })

  it('el overlay muestra la info ampliada: descripción, funciones, enlaces y tecnologías', () => {
    const dialog = openExperience('Desarrollo de web para materiales de construcción y decoración')
    expect(
      within(dialog).getByText(/Sitio web de Loki Home para su actividad comercial/),
    ).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: 'Funciones' })).toBeInTheDocument()
    expect(within(dialog).getByText('2025')).toBeInTheDocument()
    expect(within(dialog).queryByText(/Actualidad/)).not.toBeInTheDocument()
    // Enlaces de la experiencia al overlay (ya no en la tarjeta)
    expect(within(dialog).getByRole('link', { name: 'Ver sitio web' })).toHaveAttribute(
      'href',
      'https://lokihome.com/',
    )
    // La tarjeta minimalista ya no contiene el enlace (vive en el overlay)
    const section = document.getElementById('experience') as HTMLElement
    const lokiCard = within(section)
      .getByRole('heading', {
        name: 'Desarrollo de web para materiales de construcción y decoración',
        level: 3,
      })
      .closest('article')
    expect(lokiCard).not.toBeNull()
    expect(
      within(lokiCard as HTMLElement).queryByRole('link', { name: 'Ver sitio web' }),
    ).not.toBeInTheDocument()
  })

  it('asocia Meta Business Suite y Google Gemini a las experiencias correspondientes', () => {
    const socialDialog = openExperience('Gestión de redes sociales')
    expect(within(socialDialog).getByText('Meta Business Suite')).toBeInTheDocument()

    const agentDialog = openExperience('Desarrollo de agente de IA para asesoramiento')
    expect(within(agentDialog).getByText('Google Gemini')).toBeInTheDocument()
  })

  it('el overlay de Centro Médico (web) lista su proyecto asociado y navega a su ficha', () => {
    const dialog = openExperience('Desarrollo de web empresarial')
    expect(within(dialog).getByRole('heading', { name: 'Logros' })).toBeInTheDocument()
    const viewButton = within(dialog).getByRole('button', {
      name: 'Ver proyecto: Centro Médico Sector V',
    })
    fireEvent.click(viewButton)
    // El overlay de experiencia se cierra; abre el ProjectOverlay de la ficha
    expect(
      screen.queryByRole('dialog', { name: 'Desarrollo de web empresarial' }),
    ).not.toBeInTheDocument()
    const projectDialog = screen.getByRole('dialog', { name: 'Centro Médico Sector V' })
    expect(
      within(projectDialog).getByRole('region', { name: 'Galería del proyecto' }),
    ).toBeInTheDocument()
  })

  it('sin proyectos asociados (Upwork) el overlay no muestra la sección', () => {
    const dialog = openExperience(
      'Registro y verificación de datos conversacionales para entrenamiento de IA',
    )
    expect(
      within(dialog).queryByRole('heading', { name: 'Proyectos asociados' }),
    ).not.toBeInTheDocument()
  })

  it('el overlay se cierra con Escape y con la X', () => {
    openExperience('Desarrollo de web para materiales de construcción y decoración')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    openExperience('Desarrollo de web para materiales de construcción y decoración')
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
  it('el carrusel muestra el total y las 7 tarjetas sin indicador de posición', () => {
    render(<App />)
    const section = document.getElementById('experience') as HTMLElement
    expect(within(section).getByText('7 experiencias')).toBeInTheDocument()
    expect(within(section).queryByText('1 / 7')).not.toBeInTheDocument()
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
    const dialog = openExperience('Desarrollo de web empresarial')
    /* Primera experiencia: prev deshabilitado, next activo */
    const prev = within(dialog).getByRole('button', { name: 'Experiencia anterior' })
    const next = within(dialog).getByRole('button', { name: 'Experiencia siguiente' })
    expect(prev).toBeDisabled()
    expect(next).toBeEnabled()
    fireEvent.click(next)
    /* El MISMO dialog sigue abierto con el contenido de la 2ª experiencia */
    expect(screen.getByRole('dialog', { name: 'Gestión de redes sociales' })).toBeInTheDocument()
  })

  it('←/→ a nivel documento cambian de experiencia sin cerrar', () => {
    openExperience('Desarrollo de web para materiales de construcción y decoración')
    fireEvent.keyDown(document, { key: 'ArrowRight' })
    expect(
      screen.getByRole('dialog', {
        name: 'Registro y verificación de datos conversacionales para entrenamiento de IA',
      }),
    ).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(
      screen.getByRole('dialog', {
        name: 'Desarrollo de web para materiales de construcción y decoración',
      }),
    ).toBeInTheDocument()
    /* Escape sigue cerrando */
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
