/**
 * Textos de interfaz en español. `en.ts` DEBE mantener exactamente esta
 * estructura (el tipo lo garantiza). Prohibido hardcodear strings visibles.
 */
export const es = {
  nav: {
    open: 'Abrir menú de navegación',
    close: 'Cerrar menú de navegación',
    label: 'Navegación principal',
    toLight: 'Cambiar a modo claro',
    toDark: 'Cambiar a modo oscuro',
    toEnglish: 'Cambiar a inglés',
    toSpanish: 'Cambiar a español',
  },
  sections: {
    intro: 'Presentación',
    projects: 'Proyectos',
    stack: 'Stack',
    experience: 'Experiencia',
    education: 'Formación',
    languages: 'Idiomas',
    contact: 'Contacto',
  },
  intro: {
    basedIn: 'En',
    available: 'Contacto rápido',
    slideToReveal: 'Desliza para ver el email',
    emailRevealed: 'Pareces humano...',
    copyEmail: 'Copiar email',
    emailCopied: 'Email copiado',
    /** D24: juguete de clicks junto al contacto rápido (la animación de fondo reacciona). */
    clickerAria: 'Clicker: añade un clic',
    clickerTotal: 'Recuento de clicks',
    clickerOthers: '¡Otros visitantes están acumulando clicks!',
  },
  /** D27 — dos niveles del stack, sección propia centrada tras proyectos. */
  stack: {
    mainTitle: 'Stack principal',
    exploredTitle: 'Tecnologías con las que he experimentado',
  },
  footer: {
    madeBy: 'Hecho por',
    older: 'Portfolio anterior',
    /** F6: hint accesible del texto pulsable (abre la ficha del portfolio). */
    projectHint: 'Abrir la ficha del proyecto (RVA Portfolio)',
  },
  /** Filtro del carrusel (RF-07 simplificado: categorías generales, F2.2). */
  filter: {
    all: 'Todas',
    label: 'Filtrar proyectos por categoría tecnológica',
    categories: {
      android: 'Android',
      web: 'Web',
      csharp: 'C#',
      python: 'Python',
      java: 'Java',
    },
    count: (n: number) => (n === 1 ? '1 proyecto' : `${n} proyectos`),
    a11yCount: (n: number) => (n === 1 ? '1 resultado' : `${n} resultados`),
  },
  /** Controles de desplazamiento del carrusel (RF-08). */
  carousel: {
    prev: 'Desplazar a proyectos anteriores',
    next: 'Desplazar a proyectos siguientes',
    viewport: 'Carrusel de proyectos',
  },
  /** Sección de experiencia (RF-15, lista plana desde Fase 6). */
  experience: {
    current: 'Actualidad',
    responsibilities: 'Funciones',
    outcomes: 'Logros',
    upwork: 'Perfil de Upwork',
    open: 'Abrir experiencia:',
  },
  /** Overlay de experiencia (Fase 5 del plan de actualización). */
  experienceOverlay: {
    close: 'Cerrar detalles de la experiencia',
    description: 'Descripción',
    associatedProjects: 'Proyectos asociados',
    viewProject: 'Ver proyecto',
  },
  /** Sección de formación (RF-16), agrupada por jerarquía. */
  education: {
    groups: {
      official: 'Formación oficial',
      certification: 'Certificaciones',
      course: 'Cursos',
    },
    openDocument: 'Ver acreditación',
  },
  /** Sección de idiomas (RF-19), niveles según D04. */
  languages: {
    levels: {
      nativo: 'Nativo',
      starter: 'Starter',
    },
    openCertificate: 'Ver certificado',
  },
  /** Visor de documentos embebido (RF-18, compartido por formación e idiomas). */
  documentViewer: {
    close: 'Cerrar visor de documento',
    openNewTab: 'Abrir en una pestaña nueva',
    download: 'Descargar documento',
    errorTitle: 'Documento no disponible',
    errorBody:
      'El documento no se puede mostrar embebido todavía. Puedes abrirlo en una pestaña nueva o descargarlo.',
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
    /** Modo juego embebido (proyectos jugables, snake). */
    play: 'Jugar ahora',
    playClose: 'Cerrar juego',
    /** Visor ampliado de imágenes (Fase 3). */
    zoom: 'Ampliar imagen',
  },
  /** Capa de zoom sobre el overlay de proyecto (Fase 3). */
  zoomOverlay: {
    close: 'Cerrar visor ampliado',
    in: 'Acercar',
    out: 'Alejar',
    prev: 'Imagen anterior',
    next: 'Imagen siguiente',
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
    'ai-assisted': 'Con IA',
  },
}

export type Texts = typeof es
