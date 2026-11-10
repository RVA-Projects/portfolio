/**
 * Utilidades de media (RF-11). Funciones puras, testables, sin DOM.
 */

/**
 * Extrae el ID de vídeo de una URL de YouTube (watch, share, embed, shorts)
 * o acepta un ID desnudo de 11 caracteres. Devuelve null si no es un ID válido.
 */
export function extractYouTubeId(src: string): string | null {
  const idPattern = '[A-Za-z0-9_-]{11}'
  const patterns: RegExp[] = [
    new RegExp(`[?&]v=(${idPattern})`),
    new RegExp(`youtu\\.be/(${idPattern})`),
    new RegExp(`/embed/(${idPattern})`),
    new RegExp(`/shorts/(${idPattern})`),
  ]
  for (const pattern of patterns) {
    const match = src.match(pattern)
    if (match !== null) return match[1]
  }
  if (new RegExp(`^${idPattern}$`).test(src.trim())) return src.trim()
  return null
}
