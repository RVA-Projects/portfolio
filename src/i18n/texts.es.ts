/**
 * Textos de interfaz en español. `en.ts` DEBE mantener exactamente esta
 * estructura (el tipo lo garantiza). Prohibido hardcodear strings visibles.
 */
export const es = {
  nav: {
    label: 'Navegación principal',
    toLight: 'Cambiar a modo claro',
    toDark: 'Cambiar a modo oscuro',
    toEnglish: 'Cambiar a inglés',
    toSpanish: 'Cambiar a español',
  },
  sections: {
    intro: 'Sobre mí',
    projects: 'Proyectos',
    stack: 'Stack',
    experience: 'Experiencia',
    education: 'Formación',
    languages: 'Idiomas',
  },
  intro: {
    basedIn: 'En',
    available: 'Contacto rápido',
    /* Ronda 6 F2 — botón CV: etiqueta visible + tooltip D24. Ronda 7 D50:
       la acción es VER el CV en el visor (la descarga vive en el visor). */
    cv: 'CV',
    cvTooltip: 'Ver CV',
    slideToReveal: 'Desliza para ver el email',
    emailRevealed: 'Pareces humano...',
    copyEmail: 'Copiar email',
    emailCopied: 'Email copiado',
    /** D24: juguete de clicks junto al contacto rápido (la animación de fondo reacciona). */
    clickerAria: 'Clicker: añade un clic',
    clickerTotal: 'Recuento de clicks',
    clickerOthers: '¡Otros visitantes están acumulando clicks!',
  },
  /** Ronda 6 F3 — CAPTCHA puzzle del CV (Alternativa A: barrera disuasoria
      SIN backend; NO protege el archivo frente a acceso directo a su URL). */
  captcha: {
    title: 'Verificación humana',
    instruction: 'Desliza la pieza hasta encajarla en su hueco',
    sliderAria: 'Deslizador de la pieza del puzzle',
    success: '¡Encajado! Verificación superada',
    failed: 'La pieza no está en su hueco',
    retry: 'Intentar de nuevo',
    /** Ronda 7 D50: abre el VISOR del CV (no descarga). */
    openCv: 'Ver CV',
    close: 'Cerrar verificación',
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
  /** Sección de experiencia (RF-15, carrusel desde ronda 6 F1). */
  experience: {
    responsibilities: 'Funciones',
    outcomes: 'Logros',
    upwork: 'Perfil de Upwork',
    open: 'Abrir experiencia:',
    count: (n: number) => `${n} ${n === 1 ? 'experiencia' : 'experiencias'}`,
    prev: 'Desplazar a experiencias anteriores',
    next: 'Desplazar a experiencias siguientes',
    viewport: 'Carrusel de experiencia',
  },
  /** Overlay de experiencia (Fase 5 del plan de actualización; prev/next ronda 6 F1). */
  experienceOverlay: {
    close: 'Cerrar detalles de la experiencia',
    description: 'Descripción',
    associatedProjects: 'Proyectos asociados',
    viewProject: 'Ver proyecto',
    prev: 'Experiencia anterior',
    next: 'Experiencia siguiente',
  },
  /** Sección de formación (RF-16), agrupada por jerarquía. */
  education: {
    viewLabel: 'Vista de formación',
    views: { cards: 'Tarjetas', list: 'Lista' },
    groups: {
      official: 'Formación oficial',
      certification: 'Certificaciones',
      course: 'Cursos',
    },
    openDocument: 'Ver acreditación',
    technologiesTitle: 'Tecnologías y herramientas estudiadas durante el ciclo formativo',
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
