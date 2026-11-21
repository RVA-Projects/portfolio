import type { Project } from '../../models/Project'

/**
 * RVA Portfolio project record shared by its catalog card and Footer entry.
 * Andrei defines, designs, directs and reviews the work; OpenCode and Codex
 * assist implementation under his direction.
 */
export const rvaPortfolio: Project = {
  id: 'rva-portfolio',
  slug: 'rva-portfolio',
  year: 2026,
  name: { es: 'RVA Portfolio', en: 'RVA Portfolio' },
  summary: {
    es: 'Portfolio profesional en React desarrollado con OpenCode y Codex mediante una metodología SDD, planificación y validación incremental.',
    en: 'Professional React portfolio developed with OpenCode and Codex using SDD, structured planning and incremental validation.',
  },
  category: 'web',
  filterCategories: ['web'],
  technologyIds: ['react', 'typescript', 'css', 'git', 'github', 'vscode', 'opencodex', 'codex'],
  media: [
    {
      id: 'rva-portfolio-home',
      kind: 'image',
      src: '/portfolio/media/projects/rva-portfolio/home.webp',
      alt: {
        es: 'Vista general del portfolio RVA: hero, proyectos y fondo animado de puntos',
        en: 'Vista general del portfolio RVA: hero, proyectos y fondo animado de puntos',
      },
    },
  ],
  links: [],
  goal: {
    es: 'Crear un portfolio profesional que presente mi trabajo y aplicar lo aprendido experimentando con desarrollo asistido por IA, especialmente en Snake.',
    en: 'Create a professional portfolio that presents my work and apply what I learned experimenting with AI-assisted development, especially on Snake.',
  },
  problem: {
    es: 'El reto era dirigir varios agentes de IA en un producto real con requisitos, arquitectura, planificación y criterios de validación claros, manteniendo el contenido y la implementación coherentes.',
    en: 'The challenge was to direct multiple AI agents on a real product with clear requirements, architecture, planning and validation criteria, while keeping content and implementation coherent.',
  },
  role: {
    es: 'Defino el problema, los requisitos, el diseño, la arquitectura y las decisiones de producto; planifico, dirijo y superviso a OpenCode y Codex, y realizo los ajustes finales. La IA se utiliza como herramienta de implementación bajo mi dirección.',
    en: 'I define the problem, requirements, design, architecture and product decisions; plan, direct and supervise OpenCode and Codex, and make final adjustments. AI is used as an implementation tool under my direction.',
  },
  architecture: {
    es: 'Aplicación React con TypeScript estricto, Vite, CSS nativo y Canvas 2D. Especificaciones y contratos documentados, agentes guiados por instrucciones y memoria del proyecto; despliegue estático en GitHub Pages.',
    en: 'React application with strict TypeScript, Vite, native CSS and Canvas 2D. Documented specifications and contracts, agents guided by project instructions and memory; static deployment to GitHub Pages.',
  },
  features: [
    {
      id: 'f-agents-md',
      text: {
        es: 'AGENTS.md: reglas permanentes para los agentes (stack cerrado, capas, validación).',
        en: 'AGENTS.md: persistent instructions for agents covering the stack, architecture and validation.',
      },
    },
    {
      id: 'f-memory-md',
      text: {
        es: 'memory.md: estado operativo, decisiones cerradas y próximos pasos entre sesiones.',
        en: 'memory.md: project status, established decisions and next steps between sessions.',
      },
    },
    {
      id: 'f-docs',
      text: {
        es: 'Fuente de verdad en docs/: requisitos, decisiones (ADR), contratos y arquitectura como documentación viva.',
        en: 'docs/ as the source of truth for requirements, decisions, contracts and architecture.',
      },
    },
    {
      id: 'f-plan-mode',
      text: {
        es: 'Metodología SDD con requisitos, arquitectura y plan definidos antes de implementar; uso de Plan Mode y Build Mode.',
        en: 'SDD methodology with requirements, architecture and a plan defined before implementation; use of Plan Mode and Build Mode.',
      },
    },
    {
      id: 'f-incremental',
      text: {
        es: 'Dirección estructurada de agentes de OpenCode y Codex, con instrucciones, memoria y criterios de aceptación.',
        en: 'Structured direction of OpenCode and Codex agents using instructions, memory and acceptance criteria.',
      },
    },
    {
      id: 'f-validation',
      text: {
        es: 'Harness y validación incremental con typecheck, lint, tests, build y revisión e2e.',
        en: 'Harness and incremental validation with typecheck, lint, tests, build and e2e review.',
      },
    },
    {
      id: 'f-separation',
      text: {
        es: 'Separación de responsabilidades: datos declarativos, presentación, lógica e infraestructura no se mezclan.',
        en: 'Separation of concerns between declarative data, presentation, logic and infrastructure.',
      },
    },
  ],
  technicalDecisions: [
    {
      id: 'td-zero-runtime',
      text: {
        es: 'Cero dependencias de runtime: todo con la plataforma (CSS nativo, Canvas 2D, i18n propio).',
        en: 'No runtime dependencies: native CSS, Canvas 2D and the project’s own i18n implementation.',
      },
    },
    {
      id: 'td-typed-data',
      text: {
        es: 'Datos declarativos tipados separados de la presentación; modelos en src/models.',
        en: 'Typed declarative data kept separate from presentation, with models in src/models.',
      },
    },
    {
      id: 'td-content-tests',
      text: {
        es: 'Aplicación de lo aprendido en proyectos de experimentación previos, especialmente Snake, para reducir errores y limitar la intervención manual en el código.',
        en: 'Applied lessons from earlier experimental projects, especially Snake, to reduce errors and limit manual code intervention.',
      },
    },
  ],
  outcomes: {
    es: 'Portfolio estático publicado en GitHub Pages, con contenido de proyectos y validación automatizada.',
    en: 'Static portfolio published on GitHub Pages, with project content and automated validation.',
  },
  learnings: {
    es: 'La metodología SDD, la planificación y la validación incremental permiten dirigir agentes de IA en un desarrollo de mayor alcance y complejidad que los experimentos iniciales.',
    en: 'SDD, structured planning and incremental validation make it possible to direct AI agents on a broader and more complex project than the initial experiments.',
  },
}
