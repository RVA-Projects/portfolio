import type { LocalizedText } from '../models/common'

/** Secciones navegables de la SPA (orden = orden del documento y del menú). */
export type SectionId = 'intro' | 'projects' | 'experience' | 'education' | 'languages' | 'contact'

export const SECTIONS: SectionId[] = [
  'intro',
  'projects',
  'experience',
  'education',
  'languages',
  'contact',
]

export interface SiteData {
  name: string
  role: LocalizedText
  location: LocalizedText
  /** Texto estático único (D11). Borrador a pulir con el propietario en F7. */
  description: LocalizedText
  email: string
  github: string
  linkedin: string
  /** D01: el portfolio anterior se servirá desde /old/ dentro del repo. */
  olderPortfolioUrl: string
}

export const site: SiteData = {
  name: 'Andrei Ronai',
  role: {
    es: 'Desarrollador junior especializado en desarrollo de software',
    en: 'Junior developer specialized in software development',
  },
  location: { es: 'Elche, España', en: 'Elche, Spain' },
  description: {
    es: 'Desarrollador junior con proyectos reales en web, escritorio y Android. Foco en frontend, código limpio y experiencia de usuario.',
    en: 'Junior developer with real projects in web, desktop and Android. Focused on frontend, clean code and user experience.',
  },
  // TODO(F7): confirmar definitivamente con el propietario antes de publicar.
  email: 'andrei.v.ronai@gmail.com',
  github: 'https://github.com/RVA-Projects',
  linkedin: 'https://www.linkedin.com/in/rva-developer/',
  olderPortfolioUrl: '/portfolio/old/',
}
