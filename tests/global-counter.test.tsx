import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { App } from '../src/App'
import { clickerCounter } from '../src/data/site'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

const getUrl = `${clickerCounter.baseUrl}/get/${clickerCounter.namespace}/${clickerCounter.key}`
const hitUrl = `${clickerCounter.baseUrl}/hit/${clickerCounter.namespace}/${clickerCounter.key}`
const streamUrl = `${clickerCounter.baseUrl}/stream/${clickerCounter.namespace}/${clickerCounter.key}`
const TOTAL = 'Recuento de clicks'
const OTHERS = '¡Otros visitantes están acumulando clicks!'

/** Sustituto mínimo de EventSource: captura handlers para dispararlos a mano. */
class FakeEventSource {
  static instances: FakeEventSource[] = []
  onopen: (() => void) | null = null
  onmessage: ((event: { data: string }) => void) | null = null
  onerror: (() => void) | null = null
  close = vi.fn()
  constructor(public url: string) {
    FakeEventSource.instances.push(this)
  }
}

const countBox = () => screen.queryByTitle(TOTAL) ?? screen.getByTitle(OTHERS)

/** Asienta las microtareas de fetch→json→setState (las promesas NO son fake). */
const flush = async () => {
  await act(async () => {
    for (let i = 0; i < 6; i += 1) await Promise.resolve()
  })
}

/**
 * D38/D38.1 — Clicker global: total acumulado de TODAS las visitas desde
 * la publicación, persistente entre deploys, con stream EN VIVO (SSE).
 * El setup.ts bloquea la red por defecto; aquí se mocka fetch y
 * EventSource explícitamente.
 */
describe('Clicker global (D38/D38.1, useGlobalCounter)', () => {
  it('al montar lee el total global SIN caché y lo muestra', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ value: 7 }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)
    await waitFor(() => expect(countBox()).toHaveTextContent('7'))
    expect(fetchMock).toHaveBeenCalledWith(
      getUrl,
      expect.objectContaining({ cache: 'no-store', signal: expect.anything() }),
    )
  })

  it('no muestra un cero temporal mientras la lectura inicial sigue pendiente', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>(() => {})),
    )
    render(<App />)
    expect(countBox()).toHaveTextContent('…')
  })

  it('cada click suma AL INSTANTE y dispara el hit con keepalive', () => {
    const fetchMock = vi.fn().mockImplementation(() => new Promise<Response>(() => {}))
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)
    const clicker = screen.getByRole('button', { name: 'Clicker: añade un clic' })

    fireEvent.click(clicker)
    fireEvent.click(clicker)

    expect(countBox()).toHaveTextContent('2')
    // El primer fetch es la lectura; los siguientes, los hits
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      hitUrl,
      expect.objectContaining({ keepalive: true }),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      hitUrl,
      expect.objectContaining({ keepalive: true }),
    )
  })

  it('los clicks hechos durante la carga NO se tapan: el GET jamás baja la cifra (fix D38.1)', async () => {
    /* El GET tarda; mientras tanto el usuario pulsa 3 veces (3 hits en vuelo) */
    let resolveGet: (r: { json: () => Promise<{ value: number }> }) => void = () => {}
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      if (String(input).includes('/get/')) {
        return new Promise((resolve) => {
          resolveGet = resolve
        })
      }
      return new Promise<Response>(() => {}) // hits: quedan en vuelo
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)
    const clicker = screen.getByRole('button', { name: 'Clicker: añade un clic' })
    fireEvent.click(clicker)
    fireEvent.click(clicker)
    fireEvent.click(clicker)
    expect(countBox()).toHaveTextContent('3')

    /* El GET resuelve DESPUÉS con el total ANTERIOR a esos clicks (race real) */
    await act(async () => {
      resolveGet({ json: async () => ({ value: 0 }) })
      await Promise.resolve()
    })
    expect(countBox()).toHaveTextContent('3')
  })

  it('si el servicio falla, degrada a contador de sesión sin romper', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('servicio caído'))
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)
    await waitFor(() => expect(countBox()).toHaveTextContent('0'))

    fireEvent.click(screen.getByRole('button', { name: 'Clicker: añade un clic' }))
    expect(countBox()).toHaveTextContent('1')
  })

  it('el número lleva el tooltip «Recuento de clicks» (nativo + sr-only)', () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ value: 0 }) })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)
    expect(countBox()).toBeInTheDocument()
    expect(screen.getByText(TOTAL)).toBeInTheDocument()
  })

  it('D38.1: el stream empuja en VIVO los clicks de otros visitantes (con pista ~4s)', async () => {
    vi.useFakeTimers()
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ value: 7 }) })
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('EventSource', FakeEventSource)
    FakeEventSource.instances = []

    render(<App />)
    await flush()
    expect(countBox()).toHaveTextContent('7')

    /* El PRIMER mensaje es el eco al conectar (primado): no marca «otros» */
    const source = FakeEventSource.instances[0]
    expect(source.url).toBe(streamUrl)
    act(() => source.onmessage!({ data: '{"value":7}' }))
    expect(countBox()).toHaveAttribute('title', TOTAL)

    /* Un visitante ajeno pulsa 3 veces: cifra sube + pista + pulso */
    act(() => source.onmessage!({ data: '{"value":10}' }))
    const othersBox = screen.getByTitle(OTHERS)
    expect(othersBox).toHaveTextContent('10')
    expect(othersBox.className).toContain('countPulse')

    /* La pista expira a los ~4s */
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000)
    })
    expect(countBox()).toHaveAttribute('title', TOTAL)
    expect(countBox().className).not.toContain('countPulse')

    /* Cleanup: cerrar el stream al desmontar */
    render(<App />)
    cleanup()
    expect(source.close).toHaveBeenCalled()
  })

  it('D38.1: el stream no BAJA la cifra ni marca «otros» por mi propio click', async () => {
    vi.useFakeTimers()
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ value: 5 }) })
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('EventSource', FakeEventSource)
    FakeEventSource.instances = []

    render(<App />)
    await flush()
    const source = FakeEventSource.instances[0]
    act(() => source.onmessage!({ data: '{"value":5}' })) // eco de conexión

    /* Click propio: +1 optimista; el eco del servidor (5) no debe bajarla ni avisar */
    fireEvent.click(screen.getByRole('button', { name: 'Clicker: añade un clic' }))
    expect(countBox()).toHaveTextContent('6')
    expect(countBox()).toHaveAttribute('title', TOTAL)

    /* El eco SSE del clic propio actualiza el total sin activar el pulso. */
    act(() => source.onmessage!({ data: '{"value":6}' }))
    expect(countBox()).toHaveAttribute('title', TOTAL)

    /* Un valor del stream inferior al local (entrega desfasada): se ignora */
    act(() => source.onmessage!({ data: '{"value":3}' }))
    expect(countBox()).toHaveTextContent('6')
    expect(countBox()).toHaveAttribute('title', TOTAL)
  })

  it('silencia la instantánea de reconexión y acepta solo actualizaciones posteriores', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ value: 20 }) })
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('EventSource', FakeEventSource)
    FakeEventSource.instances = []
    render(<App />)
    await waitFor(() => expect(countBox()).toHaveTextContent('20'))

    const source = FakeEventSource.instances[0]
    act(() => {
      source.onopen?.()
      source.onmessage?.({ data: '{"value":25}' })
    })
    expect(countBox()).toHaveTextContent('25')
    expect(countBox()).toHaveAttribute('title', TOTAL)

    act(() => source.onmessage?.({ data: '{"value":27}' }))
    expect(countBox()).toHaveTextContent('27')
    expect(countBox()).toHaveAttribute('title', OTHERS)
  })

  it('sin EventSource (navegador antiguo) funciona igual: sync solo al cargar', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ value: 42 }) })
    vi.stubGlobal('fetch', fetchMock)
    expect('EventSource' in globalThis).toBe(false) // jsdom no lo trae

    render(<App />)
    await waitFor(() => expect(countBox()).toHaveTextContent('42'))
  })
})
