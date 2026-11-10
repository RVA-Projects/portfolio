import type { Texts } from './texts.es'

/**
 * Textos de interfaz en inglés. La estructura DEBE copiar la de `texts.es.ts`.
 */
export const en: Texts = {
  nav: {
    open: 'Open navigation menu',
    close: 'Close navigation menu',
    label: 'Main navigation',
  },
  sections: {
    intro: 'Intro',
    projects: 'Projects',
    experience: 'Experience',
    education: 'Education',
    languages: 'Languages',
    contact: 'Contact',
  },
  intro: {
    basedIn: 'In',
    available: 'Quick contact',
    copyEmail: 'Copy email',
    emailCopied: 'Email copied',
    mainStack: 'Main stack',
    projectStack: 'Technologies used in projects',
    tools: 'Tools and extras',
  },
  footer: {
    madeBy: 'Made by',
    older: 'Older portfolio',
  },
  /** RF-07 project filter. */
  filter: {
    all: 'All',
    label: 'Filter projects by technology',
    count: (n: number) => (n === 1 ? '1 project' : `${n} projects`),
    a11yCount: (n: number) => (n === 1 ? '1 result' : `${n} results`),
  },
  projectOverlay: {
    open: 'Open project',
    prev: 'Previous project',
    next: 'Next project',
    gallery: 'Project gallery',
  },
  categories: {
    web: 'Web',
    desktop: 'Desktop',
    android: 'Android',
    collab: 'Collab',
  },
}
