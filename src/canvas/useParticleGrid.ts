import { useEffect, useRef, type RefObject } from 'react'
import type { ThemeId } from '../hooks/useTheme'
import { lerpRgb, resolveThemeRgb, rgbaString, type Rgb } from './particleColors'

/* ——— Parámetros de simulación (unidades px / segundos) ——— */
const SPACING_MIN = 36
const SPACING_MAX = 56
const CURSOR_RADIUS = 180
/** Equilibrio con SPRING_K=90 ⇒ arrastre máximo del cursor ≈ 40px (sutil). */
const CURSOR_PULL = 3600
const CLICK_RADIUS = 480
/** Impulso de colapso (cualquier botón, D23): fuerte al centro, falloff². */
const CLICK_SPEED = 1100
const MAX_SPEED = 1500
const SPRING_K = 90
const SPRING_DAMP = 12
/** Desplazamiento máximo desde el home (el grid nunca se disgrega). */
const MAX_OFFSET = 140
const DRIFT_AMP = 1.2
/** Umbral de "compresión" para dibujar la malla elástica (fracción del spacing). */
const LINK_FACTOR = 0.5
/** Constante temporal del lerp de color (~300ms de transición percibida). */
const COLOR_EASE = 0.08
const RING_DURATION = 0.45
const RESIZE_DEBOUNCE = 150
/** Alfa por nivel de actividad (buckets para agrupar el fill del canvas). */
const ALPHA_BUCKETS = [0.38, 0.55, 0.7, 0.85]
const STATIC_ALPHA = 0.3

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

      let base = Math.min(SPACING_MAX, Math.max(SPACING_MIN, width * 0.05))
      /* Dispositivos con poca memoria: menos puntos (AGENTS.md §9). */
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
      if (memory !== undefined && memory <= 2) base *= 1.4
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
          const alpha = (1 - d / linkDist) * 0.16
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
        const driftY = Math.cos(now * p.drift * 0.9 + p.phase) * DRIFT_AMP
        const boost = Math.min(1, Math.hypot(p.x - p.hx, p.y - p.hy) / 120)
        const bucket = boost < 0.15 ? 0 : boost < 0.4 ? 1 : boost < 0.75 ? 2 : 3
        buckets[bucket].push({
          x: p.x + driftX,
          y: p.y + driftY,
          s: 1.2 + 1.3 * boost,
        })
      }
      for (let b = 0; b < buckets.length; b += 1) {
        if (buckets[b].length === 0) continue
        ctx.fillStyle = rgbaString(rgb, ALPHA_BUCKETS[b])
        ctx.beginPath()
        for (const rect of buckets[b]) {
          ctx.fillRect(rect.x - rect.s / 2, rect.y - rect.s / 2, rect.s, rect.s)
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
        ctx.strokeStyle = rgbaString(rgb, (1 - T) * 0.3)
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, 20 + eased * 240, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    /* Modo estático (reduced-motion o repintado puntual): grid en home. */
    const renderStatic = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
      const rgb = colorRef.current
      ctx.fillStyle = rgbaString(rgb, STATIC_ALPHA)
      ctx.beginPath()
      for (const p of particles) {
        ctx.fillRect(p.hx - 0.6, p.hy - 0.6, 1.2, 1.2)
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
