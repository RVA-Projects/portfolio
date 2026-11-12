import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
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

  it('sin PDFs de certificados subidos, no ofrece el visor (sin botones de documento)', () => {
    render(<App />)
    const section = document.getElementById('languages')
    expect(
      within(section as HTMLElement).queryByRole('button', { name: 'Ver certificado' }),
    ).not.toBeInTheDocument()
    // El visor genérico permanece cerrado
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('la sección se sitúa tras formación (orden del documento: 05 — Languages)', () => {
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
