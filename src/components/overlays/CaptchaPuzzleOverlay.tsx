import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../i18n'
import { Button } from '../base/Button'
import { IconButton } from '../base/IconButton'
import { IconClose, IconRetry } from '../base/Icons'
import { Modal } from '../base/Modal'
import {
  CAPTCHA_HEIGHT,
  CAPTCHA_PIECE,
  CAPTCHA_TAB,
  CAPTCHA_WIDTH,
  type CaptchaChallenge,
  generateChallenge,
  isSolved,
  nextSeed,
  pieceLeftFromSlider,
} from '../../utils/captcha'
import styles from './CaptchaPuzzleOverlay.module.css'

const TITLE_ID = 'captcha-overlay-title'
/** PDF servido desde public/docs (Alternativa A: URL pública por diseño). */
const CV_URL = '/portfolio/docs/cv.pdf'

type CaptchaStatus = 'idle' | 'solved' | 'failed'

interface CaptchaPuzzleOverlayProps {
  open: boolean
  onClose: () => void
  /** Inyectable SOLO para pruebas/determinismo; ausente ⇒ nextSeed(). */
  challenge?: CaptchaChallenge
}

/** Configura un canvas a tamaño lógico con devicePixelRatio; null si jsdom. */
function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  const ctx = canvas.getContext('2d')
  if (ctx === null) return null
  ctx.scale(dpr, dpr)
  return ctx
}

/** Contorno de la pieza: cuadrado + pestaña circular arriba + muesca abajo. */
function tracePiecePath(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  const tab = CAPTCHA_TAB
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + size * 0.35, y)
  // Pestaña hacia arriba (semicírculo exterior)
  ctx.arc(x + size * 0.5, y, tab, Math.PI, Math.PI * 2, false)
  ctx.lineTo(x + size, y)
  ctx.lineTo(x + size, y + size)
  ctx.lineTo(x + size * 0.5 + tab, y + size)
  // Muesca hacia dentro (semicírculo superior, talla el cuadrado)
  ctx.arc(x + size * 0.5, y + size, tab, 0, Math.PI, true)
  ctx.lineTo(x, y + size)
  ctx.closePath()
}

interface CaptchaColors {
  base: string
  blobA: string
  blobB: string
  accent: string
  line: string
}

/** Colores del desafío leídos de los tokens del tema ACTIVO en cada redraw. */
function readColors(): CaptchaColors {
  const root = getComputedStyle(document.documentElement)
  const token = (name: string, fallback: string) => root.getPropertyValue(name).trim() || fallback
  return {
    base: token('--color-surface-2', '#1e1e21'),
    blobA: token('--color-surface', '#141416'),
    blobB: token('--color-line-strong', '#3a3a3f'),
    accent: token('--color-accent', '#e23744'),
    line: token('--color-line', '#2a2a2e'),
  }
}

/** Patrón abstracto determinista: bg y recorte de pieza usan la MISMA
    secuencia rng (rng fresco por canvas ⇒ fragmento idéntico al hueco). */
function drawPattern(ctx: CanvasRenderingContext2D, seed: number, colors: CaptchaColors): void {
  const rng = (() => {
    let a = seed >>> 0
    return () => {
      a = (a + 0x9e3779b9) >>> 0
      let t = a
      t = Math.imul(t ^ (t >>> 16), 0x21f0aaad)
      t = Math.imul(t ^ (t >>> 15), 0x735a2d97)
      return ((t ^= t >>> 15) >>> 0) / 4294967296
    }
  })()

  ctx.fillStyle = colors.base
  ctx.fillRect(0, 0, CAPTCHA_WIDTH, CAPTCHA_HEIGHT)

  // Manchas elípticas grandes (profundidad del patrón)
  for (let i = 0; i < 7; i += 1) {
    ctx.globalAlpha = 0.5
    ctx.fillStyle = i % 2 === 0 ? colors.blobA : colors.blobB
    const cx = rng() * CAPTCHA_WIDTH
    const cy = rng() * CAPTCHA_HEIGHT
    const rx = 24 + rng() * 60
    const ry = 16 + rng() * 40
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, rng() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }

  // Líneas diagonales finas (textura direccional)
  ctx.globalAlpha = 0.35
  ctx.strokeStyle = colors.line
  ctx.lineWidth = 1
  for (let i = 0; i < 5; i += 1) {
    const y0 = rng() * CAPTCHA_HEIGHT
    ctx.beginPath()
    ctx.moveTo(rng() * CAPTCHA_WIDTH - 40, y0)
    ctx.lineTo(rng() * CAPTCHA_WIDTH + 40, y0 + (rng() - 0.5) * 60)
    ctx.stroke()
  }

  // Puntos de acento dispersos (identidad con el grid del fondo del portfolio)
  ctx.globalAlpha = 0.55
  ctx.fillStyle = colors.accent
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath()
    ctx.arc(rng() * CAPTCHA_WIDTH, rng() * CAPTCHA_HEIGHT, 2.5, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

/**
 * Ronda 6 F3 — CAPTCHA puzzle (Alternativa A, SIN backend): barrera de
 * interacción delante de la descarga del CV. Patrón abstracto generado en
 * Canvas 2D con rng determinista; hueco en posición aleatoria; la pieza se
 * recorta del MISMO patrón; slider (input range: ratón + táctil + teclado).
 * Comprueba tolerancia; éxito ⇒ snap + confirmación + descarga habilitada;
 * fallo ⇒ feedback + reintento con desafío nuevo. LIMITACIÓN explícita
 * (D49): la validación es local; el PDF sigue siendo accesible por URL.
 */
export function CaptchaPuzzleOverlay({
  open,
  onClose,
  challenge: injected,
}: CaptchaPuzzleOverlayProps) {
  const { texts } = useLanguage()
  const bgRef = useRef<HTMLCanvasElement>(null)
  const pieceRef = useRef<HTMLCanvasElement>(null)
  const [challenge, setChallenge] = useState<CaptchaChallenge>(
    () => injected ?? generateChallenge(nextSeed()),
  )
  const [slider, setSlider] = useState(0)
  const [status, setStatus] = useState<CaptchaStatus>('idle')

  const pieceTop = (CAPTCHA_HEIGHT - CAPTCHA_PIECE) / 2

  /** Redibuja fondo + pieza (mismo rng por semilla ⇒ recorte exacto). */
  const draw = useCallback(() => {
    const bg = bgRef.current
    const piece = pieceRef.current
    if (bg === null || piece === null) return
    const colors = readColors()

    const bgCtx = setupCanvas(bg, CAPTCHA_WIDTH, CAPTCHA_HEIGHT)
    if (bgCtx !== null) {
      drawPattern(bgCtx, challenge.seed, colors)
      // Hueco: silueta oscurecida en la posición objetivo
      bgCtx.save()
      tracePiecePath(bgCtx, challenge.targetLeft, pieceTop, CAPTCHA_PIECE)
      bgCtx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      bgCtx.fill()
      bgCtx.strokeStyle = 'rgba(0, 0, 0, 0.6)'
      bgCtx.lineWidth = 1.5
      bgCtx.stroke()
      bgCtx.restore()
    }

    const pieceCtx = setupCanvas(piece, CAPTCHA_PIECE, CAPTCHA_PIECE + CAPTCHA_TAB)
    if (pieceCtx !== null) {
      // El canvas de pieza cubre bg desde (challenge.left, pieceTop - TAB)
      pieceCtx.save()
      pieceCtx.translate(-challenge.targetLeft, -(pieceTop - CAPTCHA_TAB))
      tracePiecePath(pieceCtx, challenge.targetLeft, pieceTop, CAPTCHA_PIECE)
      pieceCtx.clip()
      drawPattern(pieceCtx, challenge.seed, colors)
      pieceCtx.restore()
      // Vuelta a coordenadas del canvas de pieza: sombra del contorno
      pieceCtx.save()
      tracePiecePath(pieceCtx, 0, CAPTCHA_TAB, CAPTCHA_PIECE)
      pieceCtx.strokeStyle = 'rgba(0, 0, 0, 0.55)'
      pieceCtx.lineWidth = 1.5
      pieceCtx.stroke()
      pieceCtx.restore()
    }
  }, [challenge, pieceTop])

  useEffect(() => {
    if (!open) return
    draw()
    /* Cambio de tema ⇒ colores de tokens: redibujar. MutationObserver en
       data-theme (useTheme escribe ahí; aquí no hay acceso al hook). */
    const observer = new MutationObserver(draw)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => {
      observer.disconnect()
    }
  }, [open, draw])

  const resetAttempt = useCallback(() => {
    setChallenge(generateChallenge(nextSeed()))
    setSlider(0)
    setStatus('idle')
  }, [])

  /** Al soltar el slider: tolerancia; éxito ⇒ snap + descarga; fallo ⇒ retry. */
  const release = useCallback(() => {
    if (status !== 'idle') return
    const pieceLeft = pieceLeftFromSlider(slider)
    if (isSolved(pieceLeft, challenge.targetLeft)) {
      setStatus('solved')
    } else {
      setStatus('failed')
    }
  }, [challenge.targetLeft, slider, status])

  if (!open) return null

  const pieceLeft = status === 'solved' ? challenge.targetLeft : pieceLeftFromSlider(slider)
  /* Posición en % del tablero: la alineación pieza↔hueco se mantiene a
     cualquier escala del canvas (el CSS dimensiona el tablero con width:100%). */
  const pieceLeftPct = (pieceLeft / CAPTCHA_WIDTH) * 100
  const pieceTopPct = ((pieceTop - CAPTCHA_TAB) / CAPTCHA_HEIGHT) * 100

  return (
    <Modal open onClose={onClose} labelledById={TITLE_ID} className={styles.modalPanel}>
      <div className={styles.panel}>
        <header className={styles.header}>
          <h2 id={TITLE_ID} className={styles.title}>
            {texts.captcha.title}
          </h2>
          <IconButton ariaLabel={texts.captcha.close} onClick={onClose} icon={<IconClose />} />
        </header>

        <p className={styles.instruction}>{texts.captcha.instruction}</p>

        <div
          className={status === 'failed' ? `${styles.board} ${styles.boardShake}` : styles.board}
        >
          <canvas ref={bgRef} className={styles.bg} aria-hidden="true" />
          {/* La pieza flota sobre el fondo; en éxito salta a su hueco (snap). */}
          <canvas
            ref={pieceRef}
            data-testid="captcha-piece"
            className={status === 'solved' ? `${styles.piece} ${styles.pieceSnap}` : styles.piece}
            style={{ left: `${pieceLeftPct}%`, top: `${pieceTopPct}%` }}
            aria-hidden="true"
          />
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={slider}
          aria-label={texts.captcha.sliderAria}
          disabled={status !== 'idle'}
          onChange={(event) => {
            if (status === 'idle') setSlider(Number(event.target.value))
          }}
          /* change = al soltar (ratón/táctil/teclado): momento de validar */
          onMouseUp={release}
          onTouchEnd={release}
          onKeyUp={release}
          className={styles.slider}
        />

        <div className={styles.status} role="status">
          {status === 'solved' && (
            <>
              <p className={styles.success}>{texts.captcha.success}</p>
              <Button label={texts.captcha.download} href={CV_URL} download variant="primary" />
            </>
          )}
          {status === 'failed' && (
            <>
              <p className={styles.failed}>{texts.captcha.failed}</p>
              <Button label={texts.captcha.retry} onClick={resetAttempt} icon={<IconRetry />} />
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}
