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
  /** RF-08 carousel scroll controls. */
  carousel: {
    prev: 'Scroll to previous projects',
    next: 'Scroll to next projects',
    viewport: 'Projects carousel',
  },
  /** RF-15 experience section, grouped by kind. */
  experience: {
    groups: {
      professional: 'Professional experience',
      freelance: 'Freelance',
      independent: 'Independent projects',
      collab: 'Collaborations',
    },
    current: 'Present',
    responsibilities: 'Duties',
    outcomes: 'Outcomes',
  },
  projectOverlay: {
    open: 'Open project',
    prev: 'Previous project',
    next: 'Next project',
    gallery: 'Project gallery',
    close: 'Close project details',
    year: 'Year',
    labels: {
      goal: 'Goal',
      problem: 'Problem to solve',
      role: 'My role',
      architecture: 'Architecture',
      features: 'Features',
      technicalDecisions: 'Technical decisions',
      outcomes: 'Outcomes',
      learnings: 'Learnings',
    },
    links: {
      github: 'GitHub repository',
      demo: 'View demo',
      web: 'Visit website',
      docs: 'Documentation',
    },
  },
  /** RF-11 media gallery inside the overlay. */
  gallery: {
    prev: 'Previous media',
    next: 'Next media',
    play: 'Play video',
    unavailable: 'Media not available yet',
  },
  categories: {
    web: 'Web',
    desktop: 'Desktop',
    android: 'Android',
    collab: 'Collab',
  },
}
