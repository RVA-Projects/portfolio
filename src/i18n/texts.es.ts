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
}

export type Texts = typeof es
