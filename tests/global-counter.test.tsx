import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { App } from '../src/App'
import { clickerCounter } from '../src/data/site'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const getUrl = `${clickerCounter.baseUrl}/get/${clickerCounter.namespace}/${clickerCounter.key}`
const hitUrl = `${clickerCounter.baseUrl}/hit/${clickerCounter.namespace}/${clickerCounter.key}`
const countBox = () => screen.getByTitle('Recuento de clicks')

/**
 * D38 — Clicker global: total acumulado de TODAS las visitas desde la
 * publicación, persistente entre deploys (la clave vive en el servicio
 * externo, fuera del bundle). El setup.ts bloquea la red por defecto;
 * aquí se mocka fetch explícitamente.
 */
describe('Clicker global (D38, useGlobalCounter)', () => {
  it('al montar lee el total global del servicio y lo muestra', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ value: 7 }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)
    await waitFor(() => expect(countBox()).toHaveTextContent('7'))
    expect(fetchMock).toHaveBeenCalledWith(
      getUrl,
      expect.objectContaining({ signal: expect.anything() }),
    )
  })

  it('cada click suma AL INSTANTE (optimista) y dispara el hit sin bloquear', () => {
    /* La lectura inicial queda pendiente: el click no debe esperarla */
    const fetchMock = vi.fn().mockImplementation(() => new Promise<Response>(() => {}))
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)
    const clicker = screen.getByRole('button', { name: 'Clicker: añade un clic' })

    fireEvent.click(clicker)
    fireEvent.click(clicker)

    expect(countBox()).toHaveTextContent('2')
    // El primer fetch es la lectura; los siguientes, los hits
    expect(fetchMock).toHaveBeenNthCalledWith(2, hitUrl)
    expect(fetchMock).toHaveBeenNthCalledWith(3, hitUrl)
  })

  it('si el servicio falla, degrada a contador de sesión sin romper', () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('servicio caído'))
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)
    expect(countBox()).toHaveTextContent('0')

    fireEvent.click(screen.getByRole('button', { name: 'Clicker: añade un clic' }))
    expect(countBox()).toHaveTextContent('1')
  })

  it('el número lleva el tooltip «Recuento de clicks» (nativo + sr-only)', () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ value: 0 }) })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)
    expect(countBox()).toBeInTheDocument()
    // Hint accesible para lectores de pantalla
    expect(screen.getByText('Recuento de clicks')).toBeInTheDocument()
  })
})
