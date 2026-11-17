import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { App } from '../src/App'
import { LanguageProvider } from '../src/i18n'
import { CaptchaPuzzleOverlay } from '../src/components/overlays/CaptchaPuzzleOverlay'
import { CAPTCHA_PIECE, CAPTCHA_WIDTH, generateChallenge } from '../src/utils/captcha'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

/** Render del overlay EN AISLAMIENTO con desafío determinista (pruebas). */
function renderOverlay(challengeSeed: number, onOpenCv = vi.fn()) {
  render(
    <LanguageProvider>
      <CaptchaPuzzleOverlay
        open
        onClose={() => {}}
        onOpenCv={onOpenCv}
        challenge={generateChallenge(challengeSeed)}
      />
    </LanguageProvider>,
  )
  return onOpenCv
}

/**
 * Ronda 6 F3 + ronda 7 D50 — overlay del CAPTCHA puzzle: slider valida con
 * tolerancia; el éxito NO descarga: «Ver CV» delega en onOpenCv (el cliente
 * cierra el captcha y abre el visor de documentos); fallo permite reintentar;
 * Escape cierra. Canvas no existe en jsdom (getContext ⇒ null): el
 * componente degrada sin crash. La integración completa (éxito ⇒ captcha
 * cerrado + visor abierto) se prueba vía App con Math.random stubbed.
 */
describe('CaptchaPuzzleOverlay (ronda 6 F3 + ronda 7 D50)', () => {
  it('muestra instrucción y slider etiquetado; sin botón «Ver CV» antes de resolver', () => {
    renderOverlay(1234)
    expect(screen.getByRole('dialog', { name: 'Verificación humana' })).toBeInTheDocument()
    expect(screen.getByText('Desliza la pieza hasta encajarla en su hueco')).toBeInTheDocument()
    expect(screen.getByLabelText('Deslizador de la pieza del puzzle')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Ver CV' })).not.toBeInTheDocument()
  })

  it('posición correcta ⇒ éxito + «Ver CV» que llama a onOpenCv (sin href/download)', () => {
    const challenge = generateChallenge(1234)
    const onOpenCv = renderOverlay(1234)
    const travel = CAPTCHA_WIDTH - CAPTCHA_PIECE
    const sliderValue = Math.round((challenge.targetLeft / travel) * 100)
    const slider = screen.getByLabelText('Deslizador de la pieza del puzzle') as HTMLInputElement
    fireEvent.change(slider, { target: { value: String(sliderValue) } })
    fireEvent.mouseUp(slider)

    expect(screen.getByText('¡Encajado! Verificación superada')).toBeInTheDocument()
    const open = screen.getByRole('button', { name: 'Ver CV' })
    expect(open.tagName).toBe('BUTTON')
    expect(open.closest('a')).toBeNull()
    expect(onOpenCv).not.toHaveBeenCalled()
    fireEvent.click(open)
    expect(onOpenCv).toHaveBeenCalledTimes(1)
  })

  it('posición incorrecta ⇒ fallo + reintento que resetea el intento', () => {
    const challenge = generateChallenge(1234)
    renderOverlay(1234)
    const slider = screen.getByLabelText('Deslizador de la pieza del puzzle') as HTMLInputElement
    /* Extremo opuesto al hueco: seguro fuera de tolerancia (±10px) */
    const wrongValue = challenge.targetLeft > (CAPTCHA_WIDTH - CAPTCHA_PIECE) / 2 ? 0 : 100
    fireEvent.change(slider, { target: { value: String(wrongValue) } })
    fireEvent.mouseUp(slider)

    expect(screen.getByText('La pieza no está en su hueco')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Ver CV' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Intentar de nuevo' }))
    expect(screen.queryByText('La pieza no está en su hueco')).not.toBeInTheDocument()
    const sliderReset = screen.getByLabelText(
      'Deslizador de la pieza del puzzle',
    ) as HTMLInputElement
    expect(sliderReset.value).toBe('0')
    expect(sliderReset).toBeEnabled()
  })

  it('el límite de la tolerancia todavía encaja; un poco más, no', () => {
    const challenge = generateChallenge(777)
    renderOverlay(777)
    const travel = CAPTCHA_WIDTH - CAPTCHA_PIECE
    const slider = screen.getByLabelText('Deslizador de la pieza del puzzle') as HTMLInputElement

    /* +6px lógicos: cerca del límite pero sin riesgo del redondeo del
       slider (1 unidad = 2.64px; el máximo error de mapeo es ~1.3px). */
    const edge = Math.round(((challenge.targetLeft + 6) / travel) * 100)
    fireEvent.change(slider, { target: { value: String(edge) } })
    fireEvent.mouseUp(slider)
    expect(screen.getByText('¡Encajado! Verificación superada')).toBeInTheDocument()
  })

  it('la pieza se desplaza con el slider (posición visual sigue al valor)', () => {
    renderOverlay(1234)
    const slider = screen.getByLabelText('Deslizador de la pieza del puzzle') as HTMLInputElement
    fireEvent.change(slider, { target: { value: '60' } })
    const piece = screen.getByTestId('captcha-piece') as HTMLElement
    expect(piece.style.left).toBe(pieceLeftPctForTest(60))
  })

  it('integración: el botón CV de la Hero abre el dialog y Escape lo cierra', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Ver CV' }))
    expect(screen.getByRole('dialog', { name: 'Verificación humana' })).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('integración D50: éxito ⇒ captcha cerrado + visor del CV abierto', () => {
    /* Math.random constante ⇒ nextSeed() determinista ⇒ replicamos el reto. */
    const random = Math.random
    Math.random = () => 0.42
    try {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: 'Ver CV' }))
      const captcha = screen.getByRole('dialog', { name: 'Verificación humana' })

      const challenge = generateChallenge(Math.floor(0.42 * 2 ** 31))
      const travel = CAPTCHA_WIDTH - CAPTCHA_PIECE
      const sliderValue = Math.round((challenge.targetLeft / travel) * 100)
      const slider = within(captcha).getByLabelText(
        'Deslizador de la pieza del puzzle',
      ) as HTMLInputElement
      fireEvent.change(slider, { target: { value: String(sliderValue) } })
      fireEvent.mouseUp(slider)

      /* «Ver CV» del éxito: cierra el captcha y abre el visor con el CV. */
      fireEvent.click(within(captcha).getByRole('button', { name: 'Ver CV' }))
      expect(screen.queryByRole('dialog', { name: 'Verificación humana' })).not.toBeInTheDocument()
      expect(screen.getByRole('dialog', { name: 'CV — Andrei Ronai' })).toBeInTheDocument()
    } finally {
      Math.random = random
    }
  })
})

/** Posición de la pieza en % (como la pinta style.left tras el cambio a porcentajes). */
function pieceLeftPctForTest(value: number): string {
  const travel = CAPTCHA_WIDTH - CAPTCHA_PIECE
  const left = (value / 100) * travel
  return `${(left / CAPTCHA_WIDTH) * 100}%`
}
