import { useCallback, useEffect, useRef, useState } from 'react'

/** Estado del contador global: cifra visible, acción de incremento y señal de «otros». */
export interface GlobalCounter {
  count: number
  increment: () => void
  /** D38.1: true ~4s cuando el stream reporta clicks de OTROS visitantes. */
  othersActive: boolean
}

/** Ventana en la que el número muestra la pista de «otros visitantes». */
const OTHERS_HINT_MS = 4000

/**
 * D38 — contador global del Clicker (Abacus, servicio público sin clave).
 *
 * D38.1 (fix de la carrera reportada 2026-11-13): la lectura inicial
 * desfasada TAPABA los clicks hechos durante la carga (el GET devolvía el
 * total anterior y sobrescribía los incrementos optimistas → «se resetean,
 * luego se recuperan acumulados»). Tres correcciones:
 *   1. Reconciliación por MÁXIMO: el servidor JAMÁS baja la cifra local
 *      (ambas cifras solo crecen; max es seguro y hace el bug imposible).
 *   2. `cache: 'no-store'` en la lectura: el total nunca sale de la caché
 *      HTTP del navegador (la respuesta de Abacus no manda cabeceras).
 *   3. `keepalive: true` en el hit: los clicks hechos justo antes de
 *      cerrar/recargar la página sobreviven al unload.
 *
 * Sincronización EN VIVO (petición del propietario, 2026-11-16): canal
 * Server-Sent Events de Abacus (`/stream`) — el servidor emite el valor
 * actual al conectar (mensaje de primado, NO cuenta como «de otros») y
 * cada actualización posterior. Si una actualización supera la cifra
 * local, el delta son clicks ajenos: se marca `othersActive` ~4s para que
 * la UI muestre la pista. El hit devuelve el total actualizado y se
 * reconcilia igual (detecta a otros entre mi click y la respuesta).
 *
 * Degradación: sin EventSource (navegadores antiguos, jsdom) o si el
 * stream falla → comportamiento anterior (sync solo al cargar). El
 * contador sin servicio degrada a «solo sesión». Solo viaja un número
 * agregado: cero datos personales.
 */
export function useGlobalCounter(getUrl: string, hitUrl: string, streamUrl: string): GlobalCounter {
  const [count, setCount] = useState(0)
  const [othersActive, setOthersActive] = useState(false)
  /** Espejo del count: las callbacks de stream/hit necesitan el valor al día. */
  const countRef = useRef(0)
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** Primer mensaje del stream = eco del valor actual al conectar. */
  const streamPrimed = useRef(false)

  const notifyOthers = useCallback(() => {
    setOthersActive(true)
    if (hintTimer.current !== null) clearTimeout(hintTimer.current)
    hintTimer.current = setTimeout(() => setOthersActive(false), OTHERS_HINT_MS)
  }, [])

  /** Reconciliación por máximo + detección de clicks ajenos (delta > 0). */
  const applyServerValue = useCallback(
    (value: number, notify: boolean) => {
      if (!Number.isFinite(value)) return
      if (value > countRef.current) {
        countRef.current = value
        setCount(value)
        if (notify) notifyOthers()
      }
    },
    [notifyOthers],
  )

  /* Lectura inicial del total global. AbortController al desmontar. */
  useEffect(() => {
    const controller = new AbortController()
    fetch(getUrl, { cache: 'no-store', signal: controller.signal })
      .then((res) => res.json() as Promise<{ value: number }>)
      .then((data) => applyServerValue(data.value, false))
      .catch(() => undefined) // sin servicio (offline/abort): contador de sesión
    return () => controller.abort()
  }, [getUrl, applyServerValue])

  /* Stream en vivo (SSE). EventSource reintenta solo ante fallos. */
  useEffect(() => {
    if (typeof EventSource === 'undefined') return
    streamPrimed.current = false
    const source = new EventSource(streamUrl)
    source.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string) as { value: number }
        applyServerValue(data.value, streamPrimed.current)
      } catch {
        /* mensaje corrupto: ignorar */
      }
      streamPrimed.current = true
    }
    return () => source.close()
  }, [streamUrl, applyServerValue])

  /* Limpieza del temporizador de la pista (independiente del stream). */
  useEffect(
    () => () => {
      if (hintTimer.current !== null) clearTimeout(hintTimer.current)
    },
    [],
  )

  const increment = useCallback(() => {
    countRef.current += 1
    setCount(countRef.current)
    /* Fire-and-forget, pero reconciliando la respuesta (detecta a otros). */
    fetch(hitUrl, { keepalive: true })
      .then((res) => res.json() as Promise<{ value: number }>)
      .then((data) => applyServerValue(data.value, true))
      .catch(() => undefined)
  }, [hitUrl, applyServerValue])

  return { count, increment, othersActive }
}
