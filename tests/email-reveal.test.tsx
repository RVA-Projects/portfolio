import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { App } from '../src/App'
import { decodeEmail } from '../src/data/site'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

/**
 * D26 — EmailReveal: el email viaja codificado (XOR) y solo se ensambla en
 * memoria tras completar el slider. Aquí se blinda: NADA de plaintext en el
 * DOM antes de revelar, revelado correcto, y copia al portapapeles.
 */
describe('EmailReveal (D26)', () => {
  it('decodeEmail() reconstruye la dirección real', () => {
    expect(decodeEmail()).toBe('andrei.v.ronai@gmail.com')
  })

  it('antes del slider NO hay email en el DOM (ni texto ni atributos)', () => {
    const { container } = render(<App />)
    const html = container.innerHTML
    expect(html).not.toContain('andrei.v.ronai')
    expect(html).not.toContain('mailto:')
    /* El control deslizante sí está, accesible por su label */
    expect(screen.getByLabelText('Desliza para ver el email')).toBeInTheDocument()
  })

  it('el slider al máximo revela el email sin recargar (estado, no DOM inicial)', () => {
    render(<App />)
    const slider = screen.getByLabelText('Desliza para ver el email')
    fireEvent.change(slider, { target: { value: '100' } })
    expect(screen.getByText('andrei.v.ronai@gmail.com')).toBeInTheDocument()
    /* Botón copiar con su tooltip/aria */
    expect(screen.getByRole('button', { name: 'Copiar email' })).toBeInTheDocument()
  })

  it('un valor intermedio NO revela (exige llegar al final)', () => {
    render(<App />)
    const slider = screen.getByLabelText('Desliza para ver el email')
    fireEvent.change(slider, { target: { value: '70' } })
    expect(screen.queryByText('andrei.v.ronai@gmail.com')).not.toBeInTheDocument()
  })

  it('el botón copiar escribe la dirección en el portapapeles y confirma', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    vi.useFakeTimers()
    render(<App />)
    fireEvent.change(screen.getByLabelText('Desliza para ver el email'), {
      target: { value: '100' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Copiar email' }))
    /* flush de microtasks del then (dentro de act para el estado de React) */
    await act(async () => {
      await Promise.resolve()
    })
    expect(writeText).toHaveBeenCalledWith('andrei.v.ronai@gmail.com')
    expect(screen.getByText('Email copiado')).toBeInTheDocument()
    /* La confirmación es transient: desaparece tras el timeout (2s) */
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000)
    })
    expect(screen.queryByText('Email copiado')).not.toBeInTheDocument()
    vi.useRealTimers()
  })
})

/**
 * Guard anti-scraping: el SOURCE del sitio jamás contiene la dirección
 * plaintext (D26). Si alguien reintroduce `email: '…'` en data/site.ts,
 * este test lo detecta antes del build.
 */
describe('Guard: sin plaintext del email en el código fuente', () => {
  it('src/data/site.ts no contiene la dirección ni mailto:', () => {
    const source = readFileSync(join(process.cwd(), 'src', 'data', 'site.ts'), 'utf8')
    expect(source).not.toContain('andrei.v.ronai')
    expect(source).not.toContain('mailto:')
  })

  it('ningún componente renderiza mailto: en su código', () => {
    const files = [
      'src/components/sections/Introduction.tsx',
      'src/components/sections/EmailReveal.tsx',
    ]
    for (const file of files) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')
      expect(source).not.toContain('mailto:')
    }
  })
})
