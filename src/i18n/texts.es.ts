/**
 * Textos de interfaz en español. `en.ts` DEBE mantener exactamente esta
 * estructura (el tipo lo garantiza). Prohibido hardcodear strings visibles.
 */
export const es = {
  nav: {
    open: 'Abrir menú de navegación',
    close: 'Cerrar menú de navegación',
    label: 'Navegación principal',
  },
  sections: {
    intro: 'Presentación',
    projects: 'Proyectos',
    experience: 'Experiencia',
    education: 'Formación',
    languages: 'Idiomas',
    contact: 'Contacto',
  },
  intro: {
    basedIn: 'En',
    available: 'Contacto rápido',
    copyEmail: 'Copiar email',
    emailCopied: 'Email copiado',
    mainStack: 'Stack principal',
    projectStack: 'Tecnologías usadas en proyectos',
    tools: 'Herramientas y complementos',
  },
  footer: {
    madeBy: 'Hecho por',
    older: 'Portfolio anterior',
  },
  /** Filtro del carrusel (RF-07). */
  filter: {
    all: 'Todas',
    label: 'Filtrar proyectos por tecnología',
    count: (n: number) => (n === 1 ? '1 proyecto' : `${n} proyectos`),
    a11yCount: (n: number) => (n === 1 ? '1 resultado' : `${n} resultados`),
  },
  projectOverlay: {
    open: 'Abrir proyecto',
    prev: 'Proyecto anterior',
    next: 'Proyecto siguiente',
    gallery: 'Galería del proyecto',
  },
  categories: {
    web: 'Web',
    desktop: 'Escritorio',
    android: 'Android',
    collab: 'Colaboración',
  },
}

export type Texts = typeof es
