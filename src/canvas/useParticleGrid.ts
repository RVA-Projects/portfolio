import { useEffect, useRef, type RefObject } from 'react'
import type { ThemeId } from '../hooks/useTheme'
import { lerpRgb, resolveThemeRgb, rgbaString, type Rgb } from './particleColors'

/* ============================================================================
   AJUSTES DE LA ANIMACIÓN (D23) — todos los knobs unificados en este bloque.
   Unidades: px y segundos. Cambia un valor aquí y recarga: no hay que tocar
   nada más (los números que quedan repartidos por el fichero son ecuaciones,
   no ajustes). Consejo: cambia UN parámetro cada vez para aislar el efecto.
   ========================================================================== */

/* ——— PUNTOS: tamaño y brillo (lo más visual) ——— */
/** Tamaño base del punto EN REPOSO, en px (lado del cuadrado dibujado).
    Subir a 1.5–2 = puntos claramente visibles; bajar a 0.8 = casi polvo. */
const POINT_SIZE_BASE = 5
/** px EXTRA de tamaño en el punto de máxima actividad (muy desplazado).
    Tamaño real = POINT_SIZE_BASE + POINT_SIZE_BOOST × boost (0…1).
    Es lo que hace que los puntos "crezcan" al pasar el cursor o al hacer clic. */
const POINT_SIZE_BOOST = 5.3
/** Tamaño del punto en modo ESTÁTICO (prefers-reduced-motion, sin animación). */
const POINT_SIZE_STATIC = 3.8
/** Opacidad de cada punto según su nivel de actividad (4 niveles, de reposo
    a máxima). Es el knob de "brillo" por punto; la opacidad global de la capa
    vive en BackgroundCanvas.module.css (.layer). */
const ALPHA_BUCKETS = [0.38, 0.55, 0.7, 0.85]
/** Opacidad del grid en modo estático (reduced-motion). */
const STATIC_ALPHA = 0.3

/* ——— DENSIDAD DE LA REJILLA ——— */
/** Separación entre puntos (px): los límites del clamp automático.
    Menor spacing = más puntos y más denso (cuidado con el rendimiento). */
const SPACING_MIN = 36
const SPACING_MAX = 56
/** Spacing objetivo como fracción del ancho del viewport (5% ≈ 72px en
    1440, recortado al clamp de arriba). Súbelo si quieres rejilla más rala. */
const SPACING_VIEWPORT = 0.05
/** Multiplicador de spacing en dispositivos con poca memoria (≤2 GB):
    más separación ⇒ menos puntos (AGENTS.md §9). */
const MEMORY_SPACING_FACTOR = 1.4

/* ——— CURSOR: atracción sutil (solo puntero fino, no táctil) ——— */
/** Radio de influencia del cursor (px): qué puntos se sienten atraídos. */
const CURSOR_RADIUS = 180
/** Fuerza de atracción. Con SPRING_K=90 el equilibrio es un arrastre
    máximo de ≈40px: sutil. Más valor = vórtice más agresivo. */
const CURSOR_PULL = 3600

/* ——— CLIC: colapso + eco de anillo (ambos botones por igual) ——— */
/** Radio del colapso al pulsar (px): puntos que se ven afectados. */
const CLICK_RADIUS = 480
/** Impulso hacia el punto del clic: fuerte en el centro, decae con falloff².
    Más valor = succión más dramática. */
const CLICK_SPEED = 1100
/** Velocidad máxima de cualquier punto (px/s): freno de seguridad. */
const MAX_SPEED = 1500
/** Desplazamiento máximo desde su posición home (px): el grid nunca se
    disgrega, siempre se reconoce como rejilla. */
const MAX_OFFSET = 140
/* Anillo expansivo que aparece en el punto del clic: */
/** Duración de vida del anillo (s). */
const RING_DURATION = 0.45
/** Radio inicial del anillo (px). */
const RING_RADIUS_START = 20
/** Radio final del anillo (px). */
const RING_RADIUS_MAX = 140
/** Opacidad inicial del anillo (se desvanece linealmente hasta 0). */
const RING_ALPHA = 2
/** Grosor de la línea del anillo (px). */
const RING_WIDTH = 1.5

/* ——— MALLA ELÁSTICA: líneas entre vecinos cuando se comprimen ——— */
/** Umbral de compresión para dibujar línea (fracción del spacing):
    se dibuja cuando dos vecinos están a MENOS de spacing × LINK_FACTOR. */
const LINK_FACTOR = 0.5
/** Opacidad máxima de la malla (a máxima compresión). 0 = desactivada. */
const LINK_ALPHA = 0.16

/* ——— FÍSICA DEL RETORNO (resorte hacia el home) ——— */
/** Rigidez del resorte: mayor = vuelve más rápido y tieso. */
const SPRING_K = 90
/** Amortiguación: con K=90, ζ≈0.63 ⇒ rebote controlado sin oscilar eternamente. */
const SPRING_DAMP = 12

/* ——— RESPIRACIÓN: micro-drift sutil en reposo ——— */
/** Amplitud del drift en px (movimiento orgánico de ~1px). 0 = estático. */
const DRIFT_AMP = 1.2
/** Velocidad del drift vertical respecto al horizontal (0.9 = cae más lento). */
const DRIFT_ASPECT = 0.9

/* ——— ACTIVIDAD: cómo se mide y clasifica el "boost" de cada punto ——— */
/** Distancia desde el home (px) a la que un punto alcanza boost = 1.0.
    Es el divisor de la actividad: menos px = los puntos reaccionan antes. */
const ACTIVITY_RANGE = 120
/** Umbrales de boost que separan los 4 niveles de opacidad (ALPHA_BUCKETS). */
const ACTIVITY_BUCKETS = [0.15, 0.4, 0.75]

/* ——— COLOR Y MANTENIMIENTO ——— */
/** Constante temporal del lerp de color entre temas (~300ms percibidos). */
const COLOR_EASE = 0.08
/** Debounce del resize (ms): espera tras dejar de redimensionar. */
const RESIZE_DEBOUNCE = 150

interface Particle {
  /** Posición home del grid. */
  hx: number
  hy: number
  /** Posición y velocidad actuales (integrador semi-implícito). */
  x: number
  y: number
  vx: number
  vy: number
  /** Micro-drift visual (respiración), fase y velocidad aleatorias. */
  phase: number
  drift: number
}

interface Ring {
  x: number
  y: number
  t: number
}

interface PointerState {
  x: number
  y: number
  active: boolean
  /** En táctil no hay cursor permanente: solo respuesta al tap. */
  coarse: boolean
}

/**
 * Fondo animado de puntos en grid (D23, AGENTS.md §9 — capa decorativa,
 * nunca contenido funcional). Física: resorte hacia el home + atracción
 * sutil al cursor (falloff cuadrático, solo puntero fino) + colapso al
 * pulsar (ambos botones idénticos) con retorno elástico amortiguado.
 * Pausa con `visibilitychange`; grid estático bajo `prefers-reduced-motion`;
 * densidad reducida en dispositivos con poca memoria; DPR + resize
 * con debounce; limpieza total de listeners en el unmount.
 */
export function useParticleGrid(theme: ThemeId): RefObject<HTMLCanvasElement | null> {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const themeRef = useRef(theme)
  themeRef.current = theme
  /** Estado mutable compartido entre el efecto principal y el de tema. */
  const colorRef = useRef<Rgb>(resolveThemeRgb(theme))
  const reducedRef = useRef(false)
  const renderStaticRef = useRef<() => void>(() => {})

  /* Cambio de tema (D18): en modo animado el loop interpola (COLOR_EASE);
     en modo estático (reduced-motion) se repinta al instante. */
  useEffect(() => {
    if (reducedRef.current) {
      colorRef.current = resolveThemeRgb(theme)
      renderStaticRef.current()
    }
  }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null) return
    const ctx = canvas.getContext('2d')
    /* jsdom y navegadores sin canvas: la capa se queda vacía sin crashear. */
    if (ctx === null) return

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedRef.current = reducedQuery.matches

    let particles: Particle[] = []
    let spacing = 48
    let columns = 0
    let rings: Ring[] = []
    let raf = 0
    let running = false
    let lastTime = 0
    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    const pointer: PointerState = { x: 0, y: 0, active: false, coarse: false }

    const buildGrid = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (width === 0 || height === 0) {
        particles = []
        return
      }
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      let base = Math.min(SPACING_MAX, Math.max(SPACING_MIN, width * SPACING_VIEWPORT))
      /* Dispositivos con poca memoria: menos puntos (AGENTS.md §9). */
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
      if (memory !== undefined && memory <= 2) base *= MEMORY_SPACING_FACTOR
      spacing = base

      const cols = Math.ceil(width / spacing) + 1
      const rows = Math.ceil(height / spacing) + 1
      columns = cols
      particles = []
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const hx = col * spacing
          const hy = row * spacing
          particles.push({
            hx,
            hy,
            x: hx,
            y: hy,
            vx: 0,
            vy: 0,
            phase: Math.random() * Math.PI * 2,
            drift: 0.5 + Math.random() * 0.5,
          })
        }
      }
    }

    /* ——— Simulación ——— */
    const simulate = (dt: number) => {
      for (const p of particles) {
        /* Resorte hacia el home + amortiguación (ζ≈0.63: rebote controlado). */
        let ax = -SPRING_K * (p.x - p.hx) - SPRING_DAMP * p.vx
        let ay = -SPRING_K * (p.y - p.hy) - SPRING_DAMP * p.vy

        /* Gravedad del cursor: solo puntero fino, dentro del radio, falloff². */
        if (pointer.active && !pointer.coarse) {
          const dxc = pointer.x - p.x
          const dyc = pointer.y - p.y
          const d = Math.hypot(dxc, dyc)
          if (d > 1 && d < CURSOR_RADIUS) {
            const falloff = 1 - (d / CURSOR_RADIUS) ** 2
            const force = CURSOR_PULL * falloff
            ax += (dxc / d) * force
            ay += (dyc / d) * force
          }
        }

        p.vx += ax * dt
        p.vy += ay * dt

        const speed = Math.hypot(p.vx, p.vy)
        if (speed > MAX_SPEED) {
          const s = MAX_SPEED / speed
          p.vx *= s
          p.vy *= s
        }

        p.x += p.vx * dt
        p.y += p.vy * dt

        /* Clamp de desplazamiento: el grid siempre se reconoce como grid. */
        const dx = p.x - p.hx
        const dy = p.y - p.hy
        const m = Math.hypot(dx, dy)
        if (m > MAX_OFFSET) {
          const s = MAX_OFFSET / m
          p.x = p.hx + dx * s
          p.y = p.hy + dy * s
        }
      }
    }

    /* Colapso al pulsar (ambos botones idénticos, D23). */
    const applyCollapse = (cx: number, cy: number) => {
      for (const p of particles) {
        const dxc = cx - p.x
        const dyc = cy - p.y
        const d = Math.hypot(dxc, dyc)
        if (d > CLICK_RADIUS || d < 0.5) continue
        const falloff = 1 - d / CLICK_RADIUS
        const v = CLICK_SPEED * falloff * falloff
        p.vx += (dxc / d) * v
        p.vy += (dyc / d) * v
      }
    }

    /* ——— Dibujo ——— */
    const drawFrame = (dt: number, now: number) => {
      /* Interpolación suave de color entre temas (~300ms). */
      colorRef.current = lerpRgb(
        colorRef.current,
        resolveThemeRgb(themeRef.current),
        dt / COLOR_EASE,
      )
      const rgb = colorRef.current

      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
      const linkDist = spacing * LINK_FACTOR

      /* Malla elástica: solo se dibuja bajo compresión (en reposo, cero coste). */
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i]
        const right = (i + 1) % columns !== 0 ? particles[i + 1] : undefined
        const down = particles[i + columns]
        for (const q of [right, down]) {
          if (q === undefined) continue
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d >= linkDist) continue
          const alpha = (1 - d / linkDist) * LINK_ALPHA
          ctx.strokeStyle = rgbaString(rgb, alpha)
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(q.x, q.y)
          ctx.stroke()
        }
      }

      /* Puntos: tamaño/alfa según actividad, respiración base, buckets de fill. */
      const buckets: { x: number; y: number; s: number }[][] = [[], [], [], []]
      for (const p of particles) {
        const driftX = Math.sin(now * p.drift + p.phase) * DRIFT_AMP
        const driftY = Math.cos(now * p.drift * DRIFT_ASPECT + p.phase) * DRIFT_AMP
        const boost = Math.min(1, Math.hypot(p.x - p.hx, p.y - p.hy) / ACTIVITY_RANGE)
        const bucket =
          boost < ACTIVITY_BUCKETS[0]
            ? 0
            : boost < ACTIVITY_BUCKETS[1]
              ? 1
              : boost < ACTIVITY_BUCKETS[2]
                ? 2
                : 3
        buckets[bucket].push({
          x: p.x + driftX,
          y: p.y + driftY,
          s: POINT_SIZE_BASE + POINT_SIZE_BOOST * boost,
        })
      }
      for (let b = 0; b < buckets.length; b += 1) {
        if (buckets[b].length === 0) continue
        ctx.fillStyle = rgbaString(rgb, ALPHA_BUCKETS[b])
        ctx.beginPath()
        for (const dot of buckets[b]) {
          /* D31 — puntos REDONDOS: arc por punto dentro del mismo path
             (moveTo evita el segmento de unión entre subpaths); se conserva
             el batching por cubeta de alfa (un solo fill por cubeta). */
          const r = dot.s / 2
          ctx.moveTo(dot.x + r, dot.y)
          ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2)
        }
        ctx.fill()
      }

      /* Eco del clic: un único anillo expansivo tenue por pulsación. */
      for (let i = rings.length - 1; i >= 0; i -= 1) {
        const ring = rings[i]
        ring.t += dt
        const T = ring.t / RING_DURATION
        if (T >= 1) {
          rings.splice(i, 1)
          continue
        }
        const eased = T * (2 - T)
        ctx.strokeStyle = rgbaString(rgb, (1 - T) * RING_ALPHA)
        ctx.lineWidth = RING_WIDTH
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, RING_RADIUS_START + eased * RING_RADIUS_MAX, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    /* Modo estático (reduced-motion o repintado puntual): grid en home. */
    const renderStatic = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
      const rgb = colorRef.current
      ctx.fillStyle = rgbaString(rgb, STATIC_ALPHA)
      ctx.beginPath()
      const r = POINT_SIZE_STATIC / 2
      for (const p of particles) {
        ctx.moveTo(p.hx + r, p.hy)
        ctx.arc(p.hx, p.hy, r, 0, Math.PI * 2)
      }
      ctx.fill()
    }
    renderStaticRef.current = renderStatic

    const tick = (now: number) => {
      const dt = Math.min(0.032, Math.max(0, (now - lastTime) / 1000))
      lastTime = now
      simulate(dt)
      drawFrame(dt, now / 1000)
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      lastTime = performance.now()
      raf = requestAnimationFrame(tick)
    }

    const stop = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
    }

    /* ——— Listeners (window/document, todos limpiados al desmontar) ——— */
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
      pointer.coarse = event.pointerType === 'touch'
    }

    const onPointerDown = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      applyCollapse(event.clientX, event.clientY)
      rings.push({ x: event.clientX, y: event.clientY, t: 0 })
    }

    const onBlur = () => {
      pointer.active = false
    }

    const onVisibility = () => {
      if (document.hidden) stop()
      else if (!reducedRef.current) start()
    }

    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        buildGrid()
        if (!running) renderStatic()
      }, RESIZE_DEBOUNCE)
    }

    const onReducedChange = () => {
      reducedRef.current = reducedQuery.matches
      if (reducedRef.current) {
        stop()
        colorRef.current = resolveThemeRgb(themeRef.current)
        renderStatic()
      } else {
        start()
      }
    }

    buildGrid()
    if (reducedRef.current) renderStatic()
    else start()

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', onResize)
    reducedQuery.addEventListener('change', onReducedChange)

    return () => {
      stop()
      clearTimeout(resizeTimer)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
      reducedQuery.removeEventListener('change', onReducedChange)
      rings = []
      particles = []
    }
  }, [])

  return canvasRef
}
