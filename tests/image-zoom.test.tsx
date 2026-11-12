import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

function openProject(name: string) {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: `Abrir proyecto: ${name}` }))
  return screen.getByRole('dialog', { name })
}

/**
 * Fase 3 — visor ampliado de imágenes (lupa + capa de zoom sobre el overlay).
 */
describe('Visor ampliado de imágenes (Fase 3)', () => {
  it('las imágenes ofrecen botón de lupa SIEMPRE visible (no solo-hover)', () => {
    const dialog = openProject('Signature Application')
    const zoom = within(dialog).getByRole('button', { name: 'Ampliar imagen' })
    expect(zoom).toBeInTheDocument()
  })

  it('al pulsar la lupa se abre la capa ampliada con la imagen actual; X y clic-fuera la cierran', () => {
    const dialog = openProject('Signature Application')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Ampliar imagen' }))

    // La capa está dentro del backdrop (slot aside): su X es alcanzable y
    // muestra la imagen actual con su contador
    const close = screen.getByRole('button', { name: 'Cerrar visor ampliado' })
    const layer = close.closest('div') as HTMLElement
    expect(within(layer).getByText(/^1 \//)).toBeInTheDocument()

    // Clic en el fondo de la capa (el target de la capa misma) cierra
    fireEvent.click(layer)
    expect(screen.queryByRole('button', { name: 'Cerrar visor ampliado' })).not.toBeInTheDocument()
    // El overlay del proyecto sigue abierto (vuelve a la vista del proyecto)
    expect(screen.getByRole('dialog', { name: 'Signature Application' })).toBeInTheDocument()
  })

  it('jerarquía de Escape: 1ª cierra SOLO la capa de zoom; 2ª cierra el overlay', () => {
    const dialog = openProject('Signature Application')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Ampliar imagen' }))
    expect(screen.getByRole('button', { name: 'Cerrar visor ampliado' })).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('button', { name: 'Cerrar visor ampliado' })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Signature Application' })).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('el índice de galería se CONSERVA al cerrar la capa (estado compartido)', () => {
    const dialog = openProject('Signature Application')
    // La galería tiene prev/next propios: navega a la 2ª imagen
    fireEvent.click(within(dialog).getByRole('button', { name: 'Media siguiente' }))
    expect(within(dialog).getByText(/^2 \//)).toBeInTheDocument()

    fireEvent.click(within(dialog).getByRole('button', { name: 'Ampliar imagen' }))
    const layer = screen.getByRole('button', { name: 'Cerrar visor ampliado' }).closest('div')!
    expect(within(layer as HTMLElement).getByText(/^2 \//)).toBeInTheDocument()

    // Cerrar la capa (X) devuelve al overlay con la MISMA posición
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar visor ampliado' }))
    expect(within(dialog).getByText(/^2 \//)).toBeInTheDocument()
  })

  it('en la capa, ←/→ cambian de imagen (no de proyecto); los botones laterales navegan', () => {
    const dialog = openProject('Signature Application')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Ampliar imagen' }))
    const layer = screen.getByRole('button', { name: 'Cerrar visor ampliado' }).closest('div')!

    // ←/→ a nivel documento navegan imágenes
    fireEvent.keyDown(document, { key: 'ArrowRight' })
    expect(within(layer as HTMLElement).getByText(/^2 \//)).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(within(layer as HTMLElement).getByText(/^1 \//)).toBeInTheDocument()

    // Botón next de la capa
    fireEvent.click(within(layer as HTMLElement).getByRole('button', { name: 'Imagen siguiente' }))
    expect(within(layer as HTMLElement).getByText(/^2 \//)).toBeInTheDocument()
    // El overlay del proyecto sigue siendo el mismo (no cambió de proyecto)
    expect(screen.getByRole('dialog', { name: 'Signature Application' })).toBeInTheDocument()
  })

  it('el primer/último elemento oculta su flecha en la capa (navegación acotada)', () => {
    const dialog = openProject('Signature Application')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Ampliar imagen' }))
    const layer = screen.getByRole('button', { name: 'Cerrar visor ampliado' }).closest('div')!
    expect(
      within(layer as HTMLElement).queryByRole('button', { name: 'Imagen anterior' }),
    ).not.toBeInTheDocument()
    expect(
      within(layer as HTMLElement).getByRole('button', { name: 'Imagen siguiente' }),
    ).toBeInTheDocument()
  })
})
