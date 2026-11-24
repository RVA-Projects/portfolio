import type { DocumentRef, LocalizedText } from '../models/common'

/** Secciones navegables de la SPA (orden = orden del documento). */
export type SectionId = 'intro' | 'projects' | 'stack' | 'experience' | 'education' | 'languages'

/**
 * Secciones navegables de la SPA (orden = orden del documento y de la
 * navegación horizontal de TopBar). Ronda 5 F3: fuera 'contact' — la
 * sección independiente se elimina (los datos de contacto viven en la
 * Hero) y la nav no muestra anclas muertas.
 */
export const SECTIONS: SectionId[] = [
  'intro',
  'projects',
  'stack',
  'experience',
  'education',
  'languages',
]

export interface SiteData {
  name: string
  role: LocalizedText
  /** Línea secundaria bajo el rol (D25): complementaria, sin protagonismo. */
  roleNote: LocalizedText
  location: LocalizedText
  /** Texto estático único (D11). Borrador a pulir con el propietario en F7. */
  description: LocalizedText
  github: string
  linkedin: string
  /** Ronda 7: perfil de Upwork (botón junto a LinkedIn en la Hero). */
  upwork: string
  /** Ronda 7 D50 — el CV se visualiza en DocumentViewerOverlay (kind 'pdf'). */
  cvDocument: DocumentRef
  /** D01: versión anterior publicada en /old-version/ dentro del sitio. */
  olderPortfolioUrl: string
}

/**
 * D26 — email anti-scraping pasivo: NUNCA plaintext en el bundle. Cada
 * charcode va XOR 0x5A y solo se ensambla en memoria tras completar el
 * slider (EmailReveal). Límite honesto documentado: un scraper que ejecute
 * el JS puede decodificar; elimina el email de HTML/JS/atributos estáticos.
 */
const EMAIL_XOR_KEY = 0x5a
const EMAIL_ENCODED = [
  59, 52, 62, 40, 63, 51, 116, 44, 116, 40, 53, 52, 59, 51, 26, 61, 55, 59, 51, 54, 116, 57, 53, 55,
]

export function decodeEmail(): string {
  return EMAIL_ENCODED.map((code) => String.fromCharCode(code ^ EMAIL_XOR_KEY)).join('')
}

/**
 * D38 — contador GLOBAL del Clicker (Abacus: https://abacus.jasoncameron.dev,
 * servicio público sin clave, CORS abierto). La clave es estable y vive
 * FUERA del bundle: el total de todas las visitas sobrevive a cualquier
 * deploy. GET /get/:ns/:key lee, GET /hit/:ns/:key incrementa y devuelve
 * el nuevo total (formato { value: number }, verificado en 2026-11-13).
 * Solo un número agregado viaja por la red: cero datos personales.
 */
export const clickerCounter = {
  baseUrl: 'https://abacus.jasoncameron.dev',
  namespace: 'rva-portfolio',
  key: 'clicker',
} as const

export const site: SiteData = {
  name: 'Andrei Ronai',
  role: {
    es: 'Desarrollador Full Stack',
    en: 'Full Stack Developer',
  },
  roleNote: {
    es: 'Perfil junior',
    en: 'Junior profile',
  },
  location: { es: 'Elche, España', en: 'Elche, Spain' },
  description: {
    es: 'Desarrollador con proyectos reales en web, escritorio y Android. Enfoque Full Stack: diseño y desarrollo de interfaces y experiencia de usuario, además de la lógica y los sistemas que las hacen funcionar.',
    en: 'Developer with real projects in web, desktop and Android. Full Stack focus: designing and building interfaces and user experience, plus the logic and systems that make them work.',
  },
  // TODO(F7): confirmar definitivamente con el propietario antes de publicar.
  github: 'https://github.com/RVA-Projects',
  linkedin: 'https://www.linkedin.com/in/rva-developer/',
  /** Ronda 7: perfil real de Upwork (botón junto a LinkedIn). */
  upwork: 'https://www.upwork.com/freelancers/~011b7fd9b75d981e3c',
  olderPortfolioUrl: '/portfolio/old-version/',
  /**
   * Ronda 7 D50 — el CV ya NO se descarga: se VISUALIZA en el
   * DocumentViewerOverlay (mismo patrón que certificaciones e idiomas).
   * kind 'pdf': recurso local bajo /docs/ servido por el propio portfolio.
   * La descarga sigue disponible desde el propio visor (documentViewer.ui).
   */
  cvDocument: {
    src: '/portfolio/docs/cv.pdf',
    kind: 'pdf',
    name: { es: 'CV — Andrei Ronai', en: 'CV — Andrei Ronai' },
  },
}
