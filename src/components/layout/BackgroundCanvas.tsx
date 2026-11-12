import type { ThemeId } from '../../hooks/useTheme'
import { useParticleGrid } from '../../canvas/useParticleGrid'
import styles from './BackgroundCanvas.module.css'

interface BackgroundCanvasProps {
  /** Tema activo (D18) — lo pasa App: una única fuente de verdad. */
  theme: ThemeId
}

/**
 * Capa visual decorativa a pantalla completa (D23, AGENTS.md §9): grid de
 * puntos con gravedad de cursor y colapso al pulsar. Decorativa SIEMPRE:
 * `aria-hidden`, `pointer-events: none` y detrás de todo el contenido
 * (z-index negativo). El tema lo posee App (una única instancia de useTheme).
 */
export function BackgroundCanvas({ theme }: BackgroundCanvasProps) {
  const canvasRef = useParticleGrid(theme)
  return <canvas ref={canvasRef} className={styles.layer} aria-hidden="true" />
}
