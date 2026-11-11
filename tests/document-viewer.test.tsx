import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

function openFirstDocument() {
  render(<App />)
  const section = document.getElementById('education')
  expect(section).not.toBeNull()
  fireEvent.click(
    within(section as HTMLElement).getAllByRole('button', { name: 'Ver acreditación' })[0],
  )
  return screen.getByRole('dialog')
}

describe('DocumentViewerOverlay (F6.6, RF-18)', () => {
  it('embebe el documento dentro del overlay (NUNCA pestaña nueva como visor)', () => {
    const dialog = openFirstDocument()
    expect(
      within(dialog).getByRole('heading', { name: 'Insignia Credly — CCST Cybersecurity' }),
    ).toBeInTheDocument()
    // Sin enlaces de navegación en modo carga/éxito: el embebido es el visor
    expect(within(dialog).queryByRole('link')).not.toBeInTheDocument()
  })

  it('usa la URL tal cual para documentos locales y externos no-Drive', () => {
    const dialog = openFirstDocument()
    const frame = within(dialog).getByTitle('Insignia Credly — CCST Cybersecurity')
    expect(frame.getAttribute('src')).toBe(
      'https://www.credly.com/badges/83f4c08a-bdf0-43af-8d63-1a8c2238b37e/linked_in?t=thjv1f',
    )
  })

  it('muestra el error controlado con acciones si el embebido no carga (timeout)', () => {
    vi.useFakeTimers()
    try {
      const dialog = openFirstDocument()
      expect(within(dialog).queryByText('Documento no disponible')).not.toBeInTheDocument()
      act(() => {
        vi.advanceTimersByTime(9000)
      })
      expect(within(dialog).getByText('Documento no disponible')).toBeInTheDocument()
      const openTab = within(dialog).getByRole('link', { name: 'Abrir en una pestaña nueva' })
      expect(openTab).toHaveAttribute('target', '_blank')
      expect(openTab).toHaveAttribute(
        'href',
        'https://www.credly.com/badges/83f4c08a-bdf0-43af-8d63-1a8c2238b37e/linked_in?t=thjv1f',
      )
      const download = within(dialog).getByRole('link', { name: 'Descargar documento' })
      expect(download).toHaveAttribute('download')
    } finally {
      vi.useRealTimers()
    }
  })

  it('cierra con el botón del header y con Escape', () => {
    const dialog = openFirstDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cerrar visor de documento' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    openFirstDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
