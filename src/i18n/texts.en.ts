import type { Texts } from './texts.es'

/**
 * Textos de interfaz en inglés. La estructura DEBE copiar la de `texts.es.ts`.
 */
export const en: Texts = {
  nav: {
    open: 'Open navigation menu',
    close: 'Close navigation menu',
    label: 'Main navigation',
    toLight: 'Switch to light mode',
    toDark: 'Switch to dark mode',
  },
  sections: {
    intro: 'Intro',
    projects: 'Projects',
    stack: 'Stack',
    experience: 'Experience',
    education: 'Education',
    languages: 'Languages',
    contact: 'Contact',
  },
  intro: {
    basedIn: 'In',
    available: 'Quick contact',
    slideToReveal: 'Slide to reveal the email',
    emailRevealed: 'Email visible',
    copyEmail: 'Copy email',
    emailCopied: 'Email copied',
    /** D24: click toy next to the quick contact (the background animation reacts). */
    clickerAria: 'Clicker: add a click',
  },
  /** D27 — two stack levels, own centered section after projects. */
  stack: {
    mainTitle: 'Main stack',
    exploredTitle: 'Technologies I have explored',
  },
  footer: {
    madeBy: 'Made by',
    older: 'Older portfolio',
  },
  /** RF-07 project filter. */
  filter: {
    all: 'All',
    label: 'Filter projects by technology category',
    categories: {
      android: 'Android',
      web: 'Web',
      csharp: 'C#',
      python: 'Python',
      java: 'Java',
    },
    count: (n: number) => (n === 1 ? '1 project' : `${n} projects`),
    a11yCount: (n: number) => (n === 1 ? '1 result' : `${n} results`),
  },
  /** RF-08 carousel scroll controls. */
  carousel: {
    prev: 'Scroll to previous projects',
    next: 'Scroll to next projects',
    viewport: 'Projects carousel',
  },
  /** RF-15 experience section, flat list since Phase 6. */
  experience: {
    current: 'Present',
    responsibilities: 'Duties',
    outcomes: 'Outcomes',
    upwork: 'Upwork profile',
    open: 'Open experience:',
  },
  /** Experience overlay (Phase 5 of the update plan). */
  experienceOverlay: {
    close: 'Close experience details',
    description: 'Description',
    associatedProjects: 'Associated projects',
    viewProject: 'View project',
  },
  /** RF-16 education section, grouped by hierarchy. */
  education: {
    groups: {
      official: 'Official education',
      certification: 'Certifications',
      course: 'Courses',
    },
    openDocument: 'View accreditation',
  },
  /** RF-19 languages section, levels per D04. */
  languages: {
    levels: {
      nativo: 'Native',
      starter: 'Starter',
    },
    openCertificate: 'View certificate',
  },
  /** Embedded document viewer (RF-18, shared by education and languages). */
  documentViewer: {
    close: 'Close document viewer',
    openNewTab: 'Open in a new tab',
    download: 'Download document',
    errorTitle: 'Document unavailable',
    errorBody:
      'The document cannot be displayed embedded yet. You can open it in a new tab or download it.',
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
    /** Embedded play mode (playable projects, snake). */
    play: 'Play now',
    playClose: 'Close game',
    /** Enlarged image viewer (Phase 3). */
    zoom: 'Enlarge image',
  },
  /** Zoom layer over the project overlay (Phase 3). */
  zoomOverlay: {
    close: 'Close enlarged viewer',
    in: 'Zoom in',
    out: 'Zoom out',
    prev: 'Previous image',
    next: 'Next image',
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
    'ai-assisted': 'AI-assisted',
  },
}
