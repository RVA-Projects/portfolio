import type { LocalizedText } from '../models/common'

/** Secciones navegables de la SPA (orden = orden del documento y del menú). */
export type SectionId =
  'intro' | 'projects' | 'stack' | 'experience' | 'education' | 'languages' | 'contact'

/**
 * Secciones navegables de la SPA (orden = orden del documento y de la
 * navegación horizontal de TopBar). Ronda 5: fuera 'contact' (F6.8 nunca se
 * implementó y la sección stub era null) — la nav no muestra anclas muertas.
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
  /** D01: el portfolio anterior se servirá desde /old/ dentro del repo. */
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
    es: 'Desarrollador de software',
    en: 'Software developer',
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
  olderPortfolioUrl: '/portfolio/old/',
}
