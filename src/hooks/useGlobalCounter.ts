import { useCallback, useEffect, useState } from 'react'

/** Estado del contador global: cifra visible + acción de incremento. */
export interface GlobalCounter {
  count: number
  increment: () => void
}

/**
 * D38 — contador global del Clicker (Abacus, servicio público sin clave).
 *
 * Al montar lee el total acumulado de TODAS las visitas (GET /get) y en
 * cada click suma localmente AL INSTANTE (optimista: la reacción del
 * fondo D23 no espera la red) mientras dispara el incremento en el
 * servidor (GET /hit) fire-and-forget. Solo se sincroniza al cargar:
 * los clicks de otros visitantes no actualizan en caliente (decisión
 * del propietario, 2026-11-13). Si el servicio falla, el contador
 * degrada a «solo sesión» sin romper nada ni avisar (es un juguete).
 *
 * Formato de respuesta verificado: {"value": number} — ambos endpoints
 * devuelven el total; /hit además lo incrementa (CORS: ACAO * con Origin).
 */
export function useGlobalCounter(getUrl: string, hitUrl: string): GlobalCounter {
  const [count, setCount] = useState(0)

  /* Lectura inicial del total global. AbortController: si el componente
     desmonta, se cancela y no se toca setState fuera de ciclo. */
  useEffect(() => {
    const controller = new AbortController()
    fetch(getUrl, { signal: controller.signal })
      .then((res) => res.json() as Promise<{ value: number }>)
      .then((data) => {
        if (Number.isFinite(data.value)) setCount(data.value)
      })
      .catch(() => undefined) // sin servicio (offline/abort): contador de sesión
    return () => controller.abort()
  }, [getUrl])

  const increment = useCallback(() => {
    setCount((current) => current + 1)
    /* Fire-and-forget: un fallo de red no afecta a la UX local. */
    fetch(hitUrl).catch(() => undefined)
  }, [hitUrl])

  return { count, increment }
}
