import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

/**
 * Ronda 6 F2 + ronda 7 D50 — botón CV en la Hero: pill 44px con etiqueta
 * «CV» y tooltip D24 «Ver CV» (aria-label); orden email → CV → GitHub →
 * LinkedIn → Upwork. El click NO descarga: abre el CAPTCHA, que a su vez
 * abre el VISOR del CV (D50). Ronda 7: botón Upwork junto a LinkedIn.
 */
describe('Botón CV y Upwork en la Hero (ronda 6 F2 + ronda 7 D50)', () => {
  it('existe el botón con tooltip «Ver CV» (aria + data-tip)', () => {
    render(<App />)
    const cv = screen.getByRole('button', { name: 'Ver CV' })
    expect(cv).toBeInTheDocument()
    expect(cv.getAttribute('data-tip')).toBe('Ver CV')
    expect(cv).toHaveTextContent('CV')
  })

  it('orden email → CV → GitHub → LinkedIn → Upwork (y Clicker al final)', () => {
    render(<App />)
    const cv = screen.getByRole('button', { name: 'Ver CV' })
    const github = screen.getByRole('link', { name: /GitHub: RVA-Projects/ })
    const linkedin = screen.getByRole('link', { name: /LinkedIn: rva-developer/ })
    const upwork = screen.getByRole('link', { name: /Upwork: perfil de Andrei Ronai/ })
    const emailSlider = screen.getByLabelText('Desliza para ver el email')

    const quickLinks = cv.closest('div') as HTMLElement
    const order = [emailSlider, cv, github, linkedin, upwork].map((el) =>
      Array.from(quickLinks.children).indexOf(el as HTMLElement),
    )
    expect(order[0]).toBeLessThan(order[1])
    expect(order[1]).toBeLessThan(order[2])
    expect(order[2]).toBeLessThan(order[3])
    expect(order[3]).toBeLessThan(order[4])
  })

  it('el CV no descarga directamente (botón que abre el CAPTCHA, no enlace)', () => {
    render(<App />)
    const cv = screen.getByRole('button', { name: 'Ver CV' })
    expect(cv.tagName).toBe('BUTTON')
    expect(cv.closest('a')).toBeNull()
  })

  it('Upwork: enlace externo a la URL del perfil con rel de seguridad', () => {
    render(<App />)
    const upwork = screen.getByRole('link', { name: /Upwork: perfil de Andrei Ronai/ })
    expect(upwork).toHaveAttribute('href', 'https://www.upwork.com/freelancers/~011b7fd9b75d981e3c')
    expect(upwork).toHaveAttribute('target', '_blank')
    expect(upwork).toHaveAttribute('rel', 'noreferrer noopener')
    expect(upwork).toHaveTextContent('Upwork')
  })
})
