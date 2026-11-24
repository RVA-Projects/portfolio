import type { ThemeId } from '../hooks/useTheme'

/**
 * Colores del fondo animado (D23/D29), puro y testeable. Marfil en oscuro;
 * en claro, taupe técnico rgb(112,108,97) sobre papel. El canvas no lee CSS vars por frame: la interpolación
 * entre temas se hace aquí con RGB.
 */
export interface Rgb {
  r: number
  g: number
  b: number
}

export function resolveThemeRgb(theme: ThemeId): Rgb {
  return theme === 'light' ? { r: 112, g: 108, b: 97 } : { r: 211, g: 207, b: 193 }
}

/** Interpolación lineal acotada (t fuera de [0,1] se satura). Flotantes:
    redondear por frame crea puntos fijos que frenan la cola de la transición. */
export function lerpRgb(from: Rgb, to: Rgb, t: number): Rgb {
  const k = Math.min(1, Math.max(0, t))
  return {
    r: from.r + (to.r - from.r) * k,
    g: from.g + (to.g - from.g) * k,
    b: from.b + (to.b - from.b) * k,
  }
}

export function rgbaString(rgb: Rgb, alpha: number): string {
  const a = Math.min(1, Math.max(0, alpha))
  return `rgba(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}, ${a})`
}
