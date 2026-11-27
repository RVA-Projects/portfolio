import { useCallback, useEffect, useRef, useState } from 'react'

/** Estado del contador global: cifra visible, acción de incremento y señal de «otros». */
export interface GlobalCounter {
  count: number
  loaded: boolean
  increment: () => void
  /** D38.1: true ~4s cuando el stream reporta clicks de OTROS visitantes. */
  othersActive: boolean
}

/** Ventana en la que el número muestra la pista de «otros visitantes». */
const OTHERS_HINT_MS = 4000
/* Abacus allows 30 requests per 10 seconds per IP. Keep the hit queue below
   that ceiling and leave room for the initial read and SSE connection. */
const MIN_HIT_INTERVAL_MS = 450
const DEFAULT_RATE_LIMIT_RETRY_MS = 2000

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
 * la UI muestre la pista. Las respuestas de `/hit` actualizan el total, pero
 * no activan la pista: el valor agregado no permite atribuir su delta.
 *
 * Degradación: sin EventSource (navegadores antiguos, jsdom) o si el
 * stream falla → comportamiento anterior (sync solo al cargar). El
 * contador sin servicio degrada a «solo sesión». Solo viaja un número
 * agregado: cero datos personales.
 */
export function useGlobalCounter(getUrl: string, hitUrl: string, streamUrl: string): GlobalCounter {
  const [count, setCount] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [othersActive, setOthersActive] = useState(false)
  /** Espejo del count: las callbacks de stream/hit necesitan el valor al día. */
  const countRef = useRef(0)
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingHits = useRef(0)
  const hitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hitInFlight = useRef(false)
  const lastHitAt = useRef(0)
  const scheduleHitRef = useRef<(minimumDelay?: number) => void>(() => {})

  const notifyOthers = useCallback(() => {
    setOthersActive(true)
    if (hintTimer.current !== null) clearTimeout(hintTimer.current)
    hintTimer.current = setTimeout(() => setOthersActive(false), OTHERS_HINT_MS)
  }, [])

  /** Reconciliación por máximo + detección de clicks ajenos (delta > 0). */
  const applyServerValue = useCallback(
    (value: number, notify: boolean) => {
      if (!Number.isFinite(value) || value < 0) return
      if (value > countRef.current) {
        countRef.current = value
        setCount(value)
        if (notify) notifyOthers()
      }
      setLoaded(true)
    },
    [notifyOthers],
  )

  /* Lectura inicial del total global. AbortController al desmontar. */
  useEffect(() => {
    const controller = new AbortController()
    fetch(getUrl, { cache: 'no-store', signal: controller.signal })
      .then((res) => {
        if (res.ok === false) throw new Error(`Counter read failed: ${res.status}`)
        return res.json() as Promise<{ value: number }>
      })
      .then((data) => applyServerValue(data.value, false))
      .catch(() => undefined) // sin servicio (offline/abort): contador de sesión
      .finally(() => {
        if (!controller.signal.aborted) setLoaded(true)
      })
    return () => controller.abort()
  }, [getUrl, applyServerValue])

  /* Stream en vivo (SSE). EventSource reintenta solo ante fallos. */
  useEffect(() => {
    if (typeof EventSource === 'undefined') return
    const source = new EventSource(streamUrl)
    let primed = false
    /* EventSource se reconecta automáticamente. La instantánea enviada al
       abrir cada conexión no es actividad nueva y debe quedar silenciada. */
    source.onopen = () => {
      primed = false
    }
    source.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string) as { value: number }
        applyServerValue(data.value, primed)
        primed = true
      } catch {
        /* mensaje corrupto: ignorar */
      }
    }
    return () => source.close()
  }, [streamUrl, applyServerValue])

  /* Limpieza del temporizador de la pista (independiente del stream). */
  useEffect(
    () => () => {
      if (hintTimer.current !== null) clearTimeout(hintTimer.current)
      if (hitTimer.current !== null) clearTimeout(hitTimer.current)
    },
    [],
  )

  const sendQueuedHit = useCallback(async () => {
    if (pendingHits.current === 0 || hitInFlight.current) return

    hitInFlight.current = true
    lastHitAt.current = Date.now()
    let retryDelay = 0
    try {
      const response = await fetch(hitUrl, { keepalive: true })
      if (response.status === 429) {
        /* Abacus documents Retry-After in milliseconds. Retain this click and
           retry after the provider's window; never fan out another request. */
        const retryAfter = Number(response.headers.get('Retry-After'))
        retryDelay = Number.isFinite(retryAfter) && retryAfter > 0
          ? retryAfter
          : DEFAULT_RATE_LIMIT_RETRY_MS
        return
      }

      pendingHits.current -= 1
      if (response.ok) {
        const data = (await response.json()) as { value: number }
        applyServerValue(data.value, false)
      }
    } catch {
      /* A network failure cannot safely be retried: the server may have
         counted it before the response was lost. Keep session count usable. */
      pendingHits.current -= 1
    } finally {
      hitInFlight.current = false
      if (pendingHits.current > 0) scheduleHitRef.current(retryDelay)
    }
  }, [hitUrl, applyServerValue])

  scheduleHitRef.current = (minimumDelay = 0) => {
    if (pendingHits.current === 0 || hitInFlight.current || hitTimer.current !== null) return
    const spacing = Math.max(0, MIN_HIT_INTERVAL_MS - (Date.now() - lastHitAt.current))
    hitTimer.current = setTimeout(() => {
      hitTimer.current = null
      void sendQueuedHit()
    }, Math.max(minimumDelay, spacing))
  }

  const increment = useCallback(() => {
    countRef.current += 1
    setCount(countRef.current)
    pendingHits.current += 1
    scheduleHitRef.current()
  }, [])

  return { count, loaded, increment, othersActive }
}
