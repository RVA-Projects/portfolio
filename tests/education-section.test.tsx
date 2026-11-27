import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

describe('EducationSection (F6.6, RF-16)', () => {
  it('usa tarjetas por defecto y permite cambiar a la lista completa y volver', () => {
    render(<App />)
    const section = document.getElementById('education') as HTMLElement
    const cards = within(section).getByRole('group', { name: 'Vista de formación' })
    expect(within(cards).getByRole('button', { name: 'Tarjetas' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(section).getAllByRole('article')).toHaveLength(11)
    fireEvent.click(within(cards).getByRole('button', { name: 'Lista' }))
    expect(within(cards).getByRole('button', { name: 'Lista' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(section).getAllByRole('article')).toHaveLength(11)
    expect(within(section).getAllByRole('button', { name: 'Ver acreditación' })).toHaveLength(6)
    expect(within(section).getAllByRole('link', { name: 'Ver acreditación' })).toHaveLength(3)
    fireEvent.click(within(cards).getByRole('button', { name: 'Tarjetas' }))
    expect(within(cards).getByRole('button', { name: 'Tarjetas' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('mantiene la ficha completa del DAM en ambas vistas', () => {
    render(<App />)
    const section = document.getElementById('education') as HTMLElement
    const toggle = within(section).getByRole('group', { name: 'Vista de formación' })
    const damTitle = 'Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)'
    const getDamCard = () =>
      within(section).getByRole('heading', { name: damTitle }).closest('article') as HTMLElement

    expect(
      within(getDamCard()).getByText('Tecnologías y herramientas estudiadas'),
    ).toBeInTheDocument()
    expect(
      within(getDamCard()).getByText(/Todas las asignaturas del ciclo están superadas/),
    ).toBeInTheDocument()
    expect(
      within(getDamCard())
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual([
      'C#',
      'SQL',
      'Java',
      'HTML',
      'CSS',
      'JavaScript',
      'Kotlin',
      'Python',
      'Unity',
      'Visual Studio',
      'Eclipse',
      'NetBeans',
      'Room',
      'Git',
    ])

    fireEvent.click(within(toggle).getByRole('button', { name: 'Lista' }))
    expect(getDamCard()).toHaveClass(/official/)
    expect(
      within(getDamCard()).getByText('Tecnologías y herramientas estudiadas'),
    ).toBeInTheDocument()
    expect(within(getDamCard()).getAllByRole('listitem')).toHaveLength(14)
  })

  it('agrupa por jerarquía y no muestra grupos vacíos', () => {
    render(<App />)
    const section = document.getElementById('education')
    expect(section).not.toBeNull()
    expect(
      within(section as HTMLElement).getByRole('heading', { name: 'Formación oficial' }),
    ).toBeInTheDocument()
    expect(
      within(section as HTMLElement).getByRole('heading', { name: 'Certificaciones' }),
    ).toBeInTheDocument()
    expect(
      within(section as HTMLElement).getByRole('heading', { name: 'Cursos' }),
    ).toBeInTheDocument()
  })

  it('renderiza las 11 entradas del inventario §4', () => {
    render(<App />)
    const section = document.getElementById('education')
    expect(
      within(section as HTMLElement).getByRole('heading', {
        name: 'Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)',
        level: 3,
      }),
    ).toBeInTheDocument()
    expect(
      within(section as HTMLElement).getByRole('heading', {
        name: 'Cisco Certified Support Technician Cybersecurity (CCST Cybersecurity)',
        level: 3,
      }),
    ).toBeInTheDocument()
    expect(
      within(section as HTMLElement).getByRole('heading', {
        name: 'Oracle Java Foundations',
        level: 3,
      }),
    ).toBeInTheDocument()
    expect(
      within(section as HTMLElement).getByRole('heading', { name: 'Kotlin', level: 3 }),
    ).toBeInTheDocument()
  })

  it('Java Foundations (sin acreditación) no ofrece documento; el resto sí (6 overlay + 3 external)', () => {
    render(<App />)
    const section = document.getElementById('education')
    const javaRow = within(section as HTMLElement)
      .getByRole('heading', { name: 'Oracle Java Foundations', level: 3 })
      .closest('article')
    expect(within(javaRow as HTMLElement).queryByRole('button')).not.toBeInTheDocument()
    expect(within(javaRow as HTMLElement).queryByRole('link')).not.toBeInTheDocument()

    const sectionEl = section as HTMLElement
    // kind 'pdf' ⇒ botón que abre el overlay (6 cursos OpenWebinars)
    const buttons = within(sectionEl).getAllByRole('button', { name: 'Ver acreditación' })
    expect(buttons).toHaveLength(6)
    // kind 'external' ⇒ enlace a pestaña nueva (Credly ×2 + CertView)
    const links = within(sectionEl).getAllByRole('link', { name: 'Ver acreditación' })
    expect(links).toHaveLength(3)
    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
      expect(link.getAttribute('rel')).toContain('noreferrer')
    }
  })

  it('los badges externos NO abren el overlay (kind external ⇒ pestaña nueva)', () => {
    render(<App />)
    const section = document.getElementById('education')
    const ccstRow = within(section as HTMLElement)
      .getByRole('heading', {
        name: 'Cisco Certified Support Technician Cybersecurity (CCST Cybersecurity)',
        level: 3,
      })
      .closest('article')
    const link = within(ccstRow as HTMLElement).getByRole('link', { name: 'Ver acreditación' })
    expect(link).toHaveAttribute('href', expect.stringContaining('credly.com'))
    fireEvent.click(link)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('abre DocumentViewerOverlay con el documento del ítem pulsado (kind pdf)', () => {
    render(<App />)
    const section = document.getElementById('education')
    const reactRow = within(section as HTMLElement)
      .getByRole('heading', { name: 'React fundamentals', level: 3 })
      .closest('article')
    fireEvent.click(
      within(reactRow as HTMLElement).getByRole('button', { name: 'Ver acreditación' }),
    )
    const dialog = screen.getByRole('dialog', {
      name: 'Certificado — React fundamentals (OpenWebinars)',
    })
    const frame = within(dialog).getByTitle('Certificado — React fundamentals (OpenWebinars)')
    expect(frame.getAttribute('src')).toContain('react-fundamentals.pdf')
  })

  it('cierra el visor con Escape', () => {
    render(<App />)
    const section = document.getElementById('education')
    // Solo los kind 'pdf' son botones: el primero es el primer curso
    fireEvent.click(
      within(section as HTMLElement).getAllByRole('button', { name: 'Ver acreditación' })[0],
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('un documento local ausente degrada a error controlado (sin crash)', () => {
    vi.useFakeTimers()
    try {
      render(<App />)
      const section = document.getElementById('education')
      // Los botones (kind pdf) son los 6 cursos: índice 3 = Python
      fireEvent.click(
        within(section as HTMLElement).getAllByRole('button', { name: 'Ver acreditación' })[3],
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      // El visor espera LOAD_TIMEOUT_MS antes de declarar el fallo
      act(() => {
        vi.advanceTimersByTime(9000)
      })
      expect(screen.getByText('Documento no disponible')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Abrir en una pestaña nueva' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Descargar documento' })).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })
})
