import type { Project } from '../../models/Project'

/**
 * Ficha especial (ronda 3 F6, petición del propietario): el propio portfolio
 * documentado como proyecto, ACCESIBLE SOLO DESDE EL FOOTER — NO pertenece
 * al catálogo `projects` (no toca filtros ni carruseles).
 *
 * F7.1/ES: textos en español; EN = fallback del ES (D-E, ronda 3 F5: las
 * traducciones inglesas llegan cuando el propietario termine de revisar los
 * textos en español; NO se inventan ni traducen automáticamente).
 *
 * Atribución honesta (petición del propietario): arquitectura, diseño y
 * decisiones del propietario; código desarrollado con asistencia de IA
 * (OpenCode) bajo su dirección — no se atribuye la escritura manual del
 * código generado por IA, ni se presenta la IA como autora de las decisiones.
 * Sin métricas, herramientas ni enlaces que no estén en el repo (repo remoto
 * aún pendiente ⇒ links vacío).
 */
export const rvaPortfolio: Project = {
  id: 'rva-portfolio',
  slug: 'rva-portfolio',
  year: 2026,
  name: { es: 'RVA Portfolio', en: 'RVA Portfolio' },
  summary: {
    es: 'Portfolio profesional desarrollado desde cero con React y desarrollo asistido por IA (OpenCode).',
    en: 'Portfolio profesional desarrollado desde cero con React y desarrollo asistido por IA (OpenCode).',
  },
  category: 'ai-assisted',
  technologyIds: ['react', 'css', 'git', 'vscode', 'github'],
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
    es: 'Crear un portfolio profesional, rápido y accesible que documente mi trabajo, desarrollado desde cero con React y con OpenCode (integrado en Visual Studio Code) como asistente de programación.',
    en: 'Crear un portfolio profesional, rápido y accesible que documente mi trabajo, desarrollado desde cero con React y con OpenCode (integrado en Visual Studio Code) como asistente de programación.',
  },
  problem: {
    es: 'Necesitaba un portfolio propio que representara mi trabajo real y, a la vez, sirviera como ejemplo de uso profesional de las herramientas de IA en el desarrollo de software en 2026.',
    en: 'Necesitaba un portfolio propio que representara mi trabajo real y, a la vez, sirviera como ejemplo de uso profesional de las herramientas de IA en el desarrollo de software en 2026.',
  },
  role: {
    es: 'Arquitectura, diseño, lógica y decisiones de producto: mías (Andrei). Código: desarrollado íntegramente con asistencia de IA (OpenCode) bajo mi dirección y supervisión.',
    en: 'Arquitectura, diseño, lógica y decisiones de producto: mías (Andrei). Código: desarrollado íntegramente con asistencia de IA (OpenCode) bajo mi dirección y supervisión.',
  },
  architecture: {
    es: 'SPA estática: React + TypeScript estricto + Vite, CSS nativo (custom properties) y Canvas 2D decorativo. Sin backend, desplegada en GitHub Pages con base /portfolio/. Cero dependencias de runtime.',
    en: 'SPA estática: React + TypeScript estricto + Vite, CSS nativo (custom properties) y Canvas 2D decorativo. Sin backend, desplegada en GitHub Pages con base /portfolio/. Cero dependencias de runtime.',
  },
  features: [
    {
      id: 'f-agents-md',
      text: {
        es: 'AGENTS.md: reglas permanentes para los agentes (stack cerrado, capas, validación).',
        en: 'AGENTS.md: reglas permanentes para los agentes (stack cerrado, capas, validación).',
      },
    },
    {
      id: 'f-memory-md',
      text: {
        es: 'memory.md: estado operativo, decisiones cerradas y próximos pasos entre sesiones.',
        en: 'memory.md: estado operativo, decisiones cerradas y próximos pasos entre sesiones.',
      },
    },
    {
      id: 'f-docs',
      text: {
        es: 'Fuente de verdad en docs/: requisitos, decisiones (ADR), contratos y arquitectura como documentación viva.',
        en: 'Fuente de verdad en docs/: requisitos, decisiones (ADR), contratos y arquitectura como documentación viva.',
      },
    },
    {
      id: 'f-plan-mode',
      text: {
        es: 'Planificación previa en Plan Mode antes de modificar cualquier fichero.',
        en: 'Planificación previa en Plan Mode antes de modificar cualquier fichero.',
      },
    },
    {
      id: 'f-incremental',
      text: {
        es: 'Desarrollo incremental por fases: cada fase se valida antes de continuar y se registra en un commit.',
        en: 'Desarrollo incremental por fases: cada fase se valida antes de continuar y se registra en un commit.',
      },
    },
    {
      id: 'f-validation',
      text: {
        es: 'Validación continua: typecheck, lint, tests y build tras cada cambio, más revisión visual y pruebas e2e.',
        en: 'Validación continua: typecheck, lint, tests y build tras cada cambio, más revisión visual y pruebas e2e.',
      },
    },
    {
      id: 'f-separation',
      text: {
        es: 'Separación de responsabilidades: datos declarativos, presentación, lógica e infraestructura no se mezclan.',
        en: 'Separación de responsabilidades: datos declarativos, presentación, lógica e infraestructura no se mezclan.',
      },
    },
  ],
  technicalDecisions: [
    {
      id: 'td-zero-runtime',
      text: {
        es: 'Cero dependencias de runtime: todo con la plataforma (CSS nativo, Canvas 2D, i18n propio).',
        en: 'Cero dependencias de runtime: todo con la plataforma (CSS nativo, Canvas 2D, i18n propio).',
      },
    },
    {
      id: 'td-typed-data',
      text: {
        es: 'Datos declarativos tipados separados de la presentación; modelos en src/models.',
        en: 'Datos declarativos tipados separados de la presentación; modelos en src/models.',
      },
    },
    {
      id: 'td-content-tests',
      text: {
        es: 'Los tests actúan de guarda de contenido: ids únicos, assets presentes y textos es/en completos.',
        en: 'Los tests actúan de guarda de contenido: ids únicos, assets presentes y textos es/en completos.',
      },
    },
  ],
  outcomes: {
    es: 'SPA estática publicada en GitHub Pages con suite de pruebas unitarias y e2e en verde, sin dependencias de runtime en el bundle.',
    en: 'SPA estática publicada en GitHub Pages con suite de pruebas unitarias y e2e en verde, sin dependencias de runtime en el bundle.',
  },
  learnings: {
    es: 'Una metodología estructurada (documentación viva, planificación previa y validación por fases) convierte la asistencia de IA en un proceso profesional y controlado, no en generación de código ad hoc.',
    en: 'Una metodología estructurada (documentación viva, planificación previa y validación por fases) convierte la asistencia de IA en un proceso profesional y controlado, no en generación de código ad hoc.',
  },
}
