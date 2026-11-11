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

/**
 * Convierte una URL de visor de Google Drive (`/file/d/<id>/view…`) en la
 * URL de embebido (`/preview`), la única que los iframes de Drive aceptan.
 * Devuelve null si la URL no es de Drive (el visor la usa tal cual).
 */
export function googleDriveEmbedUrl(src: string): string | null {
  const match = src.match(/^https:\/\/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)\/view/)
  if (match === null) return null
  return `https://drive.google.com/file/d/${match[1]}/preview`
}
