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
  /** Controles de desplazamiento del carrusel (RF-08). */
  carousel: {
    prev: 'Desplazar a proyectos anteriores',
    next: 'Desplazar a proyectos siguientes',
    viewport: 'Carrusel de proyectos',
  },
  /** Sección de experiencia (RF-15), agrupada por tipo. */
  experience: {
    groups: {
      professional: 'Experiencia profesional',
      freelance: 'Freelance',
      independent: 'Proyectos independientes',
      collab: 'Colaboraciones',
    },
    current: 'Actualidad',
    responsibilities: 'Funciones',
    outcomes: 'Logros',
  },
  projectOverlay: {
    open: 'Abrir proyecto',
    prev: 'Proyecto anterior',
    next: 'Proyecto siguiente',
    gallery: 'Galería del proyecto',
    close: 'Cerrar detalles del proyecto',
    year: 'Año',
    labels: {
      goal: 'Objetivo',
      problem: 'Problema a resolver',
      role: 'Mi rol',
      architecture: 'Arquitectura',
      features: 'Funcionalidades',
      technicalDecisions: 'Decisiones técnicas',
      outcomes: 'Resultados',
      learnings: 'Aprendizajes',
    },
    links: {
      github: 'Repositorio en GitHub',
      demo: 'Ver demo',
      web: 'Ver sitio web',
      docs: 'Documentación',
    },
  },
  /** Galería de media dentro del overlay (RF-11). */
  gallery: {
    prev: 'Media anterior',
    next: 'Media siguiente',
    play: 'Reproducir vídeo',
    unavailable: 'Medio no disponible todavía',
  },
  categories: {
    web: 'Web',
    desktop: 'Escritorio',
    android: 'Android',
    collab: 'Colaboración',
  },
}

export type Texts = typeof es
