import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

describe('EducationSection (F6.6, RF-16)', () => {
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

  it('Java Foundations (sin acreditación) no ofrece documento; el resto sí', () => {
    render(<App />)
    const section = document.getElementById('education')
    const javaCard = within(section as HTMLElement)
      .getByRole('heading', { name: 'Oracle Java Foundations', level: 3 })
      .closest('article')
    expect(within(javaCard as HTMLElement).queryByRole('button')).not.toBeInTheDocument()

    const buttons = within(section as HTMLElement).getAllByRole('button', {
      name: 'Ver acreditación',
    })
    // 9 entradas con documento (3 certificaciones acreditadas + 6 cursos)
    expect(buttons).toHaveLength(9)
  })

  it('abre DocumentViewerOverlay con el documento del ítem pulsado', () => {
    render(<App />)
    const section = document.getElementById('education')
    const ccstCard = within(section as HTMLElement)
      .getByRole('heading', {
        name: 'Cisco Certified Support Technician Cybersecurity (CCST Cybersecurity)',
        level: 3,
      })
      .closest('article')
    fireEvent.click(
      within(ccstCard as HTMLElement).getByRole('button', { name: 'Ver acreditación' }),
    )
    const dialog = screen.getByRole('dialog', { name: 'Insignia Credly — CCST Cybersecurity' })
    const frame = within(dialog).getByTitle('Insignia Credly — CCST Cybersecurity')
    expect(frame.getAttribute('src')).toContain('credly.com')
  })

  it('cierra el visor con Escape', () => {
    render(<App />)
    const section = document.getElementById('education')
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
      // Primer curso (PDF local pendiente de subida, D03):
      // 0-2 = certificaciones (Credly/CertView), 3+ = cursos con PDF local
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
