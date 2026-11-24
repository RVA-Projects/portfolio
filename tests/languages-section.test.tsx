import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

describe('LanguagesSection (F6.7, RF-19)', () => {
  it('renderiza los 5 idiomas de D04 con su nivel en la sección', () => {
    render(<App />)
    const section = document.getElementById('languages')
    expect(section).not.toBeNull()
    for (const name of ['Castellano', 'Valenciano', 'Rumano', 'Inglés', 'Alemán']) {
      expect(
        within(section as HTMLElement).getByRole('heading', { name, level: 3 }),
      ).toBeInTheDocument()
    }
    const levels = within(section as HTMLElement).getAllByText(/^(Nativo|C1|B2|Starter)$/)
    expect(levels).toHaveLength(5)
  })

  it('con PDFs de certificados subidos (ingles/valenciano), ofrece el visor', () => {
    render(<App />)
    const section = document.getElementById('languages')
    /* Solo los dos idiomas con certificado subido (D03): castellano, rumano
       y alemán (starter, sin certificado) NO ofrecen visor. */
    const buttons = within(section as HTMLElement).getAllByRole('button', {
      name: /Ver certificado/,
    })
    expect(buttons).toHaveLength(2)
    // El visor genérico permanece cerrado hasta pulsar
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('abrir un certificado monta el DocumentViewerOverlay (dialog + título del documento)', () => {
    render(<App />)
    /* La lista se ordena por nombre; seleccionamos valenciano por su nombre. */
    const item = screen.getByRole('heading', { name: 'Valenciano' }).closest('article')
    expect(item).not.toBeNull()
    fireEvent.click(within(item as HTMLElement).getByRole('button', { name: 'Ver certificado' }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(screen.getByText('Certificado — Valenciano C1')).toBeInTheDocument()
    expect(dialog.querySelector('iframe')).not.toBeNull()
  })

  it('la sección se sitúa tras formación (orden del documento: 04 — Formación)', () => {
    render(<App />)
    const education = document.getElementById('education')
    const languagesSection = document.getElementById('languages')
    expect(education).not.toBeNull()
    expect(languagesSection).not.toBeNull()
    expect(
      (education as HTMLElement).compareDocumentPosition(languagesSection as HTMLElement) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })
})
