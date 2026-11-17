import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

/**
 * Ronda 6 F2 — botón CV en la Hero: pill 44px con etiqueta «CV» y tooltip
 * D24 «Descargar CV» (aria-label); orden email → CV → GitHub → LinkedIn.
 * La descarga NO es directa: el click abre el CAPTCHA (F3).
 */
describe('Botón CV (ronda 6 F2)', () => {
  it('existe el botón con tooltip «Descargar CV» (aria + data-tip)', () => {
    render(<App />)
    const cv = screen.getByRole('button', { name: 'Descargar CV' })
    expect(cv).toBeInTheDocument()
    expect(cv.getAttribute('data-tip')).toBe('Descargar CV')
    expect(cv).toHaveTextContent('CV')
  })

  it('está ENTRE el email y GitHub (orden email → CV → GitHub → LinkedIn)', () => {
    render(<App />)
    const cv = screen.getByRole('button', { name: 'Descargar CV' })
    const github = screen.getByRole('link', { name: /GitHub: RVA-Projects/ })
    const linkedin = screen.getByRole('link', { name: /LinkedIn: rva-developer/ })
    const emailSlider = screen.getByLabelText('Desliza para ver el email')

    const quickLinks = cv.closest('div') as HTMLElement
    const order = [emailSlider, cv, github, linkedin].map((el) =>
      Array.from(quickLinks.children).indexOf(el as HTMLElement),
    )
    expect(order[0]).toBeLessThan(order[1])
    expect(order[1]).toBeLessThan(order[2])
    expect(order[2]).toBeLessThan(order[3])
  })

  it('no descarga directamente (no es un enlace, es un botón que abre overlay)', () => {
    render(<App />)
    const cv = screen.getByRole('button', { name: 'Descargar CV' })
    expect(cv.tagName).toBe('BUTTON')
    expect(cv.closest('a')).toBeNull()
  })
})
