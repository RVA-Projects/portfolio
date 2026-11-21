import type { Project } from '../../models/Project'

/**
 * Juego Snake desarrollado con OpenCode (agentes IA) y publicado en
 * GitHub Pages. Media: capturas reales aportadas por el propietario.
 */
export const snake: Project = {
  id: 'snake',
  slug: 'snake',
  name: { es: 'Snake', en: 'Snake' },
  year: 2026,
  summary: {
    es: 'Proyecto personal de aprendizaje sobre OpenCode, agentes de IA y Spec-Driven Development, aplicado a un juego Snake para navegador.',
    en: 'Personal learning project exploring OpenCode, AI agents and Spec-Driven Development through a browser-based Snake game.',
  },
  category: 'ai-assisted',
  filterCategories: ['web'],
  technologyIds: ['html', 'css', 'javascript', 'git'],
  media: [
    {
      id: 'snake-1',
      kind: 'image',
      src: '/portfolio/media/projects/snake/snake1.png',
      alt: {
        es: 'Partida de Snake en curso, con la serpiente avanzando hacia una fruta (interfaz en español)',
        en: 'Ongoing Snake game with the snake heading towards a fruit (Spanish interface)',
      },
    },
    {
      id: 'snake-2',
      kind: 'image',
      src: '/portfolio/media/projects/snake/snake2.png',
      alt: {
        es: 'Partida de Snake en curso con la serpiente pegada al muro derecho (interfaz en inglés)',
        en: 'Ongoing Snake game with the snake along the right wall (English interface)',
      },
    },
    {
      id: 'snake-3',
      kind: 'image',
      src: '/portfolio/media/projects/snake/snake3.png',
      alt: {
        es: 'Pantalla de fin de partida (Game Over) de Snake',
        en: 'Snake game-over screen',
      },
    },
  ],
  links: [
    { id: 'demo', url: 'https://rva-projects.github.io/snake/' },
    { id: 'github', url: 'https://github.com/RVA-Projects/snake' },
  ],
  /** Juego embebido en el overlay (RF-10): mismo despliegue público. */
  playUrl: 'https://rva-projects.github.io/snake/',
  goal: {
    es: 'Aprender a trabajar eficazmente con agentes de IA mediante OpenCode y desarrollo basado en especificaciones (SDD), usando un juego completo como proyecto de experimentación.',
    en: 'Learn to work effectively with AI agents through OpenCode and Spec-Driven Development (SDD), using a complete game as an experimentation project.',
  },
  problem: {
    es: 'El reto era dirigir el desarrollo con poca intervención manual en el código, manteniendo el proceso controlado y verificable mediante especificaciones, instrucciones y validación incremental.',
    en: 'The challenge was to direct development with little manual coding while keeping the process controlled and verifiable through specifications, instructions and incremental validation.',
  },
  role: {
    es: 'Definí el problema, los requisitos, las especificaciones, la arquitectura y los prompts; dirigí y revisé a los agentes y realicé ajustes finales. El desarrollo se hizo prácticamente de principio a fin con OpenCode y Gemma 4 mediante acceso gratuito, en aproximadamente dos tardes de tiempo libre. Mi intervención directa en el código fue mínima.',
    en: 'I defined the problem, requirements, specifications, architecture and prompts; directed and reviewed the agents and made final adjustments. Development was carried out almost entirely with OpenCode and Gemma 4 through free access, over roughly two evenings of spare time. My direct coding involvement was minimal.',
  },
  architecture: {
    es: 'JavaScript vanilla módulo a módulo (board, logic, snake, food, ui, audio, storage, i18n) sobre Canvas, con zzfx para audio generado procedimentalmente y tests Vitest.',
    en: 'Vanilla JavaScript module by module (board, logic, snake, food, ui, audio, storage, i18n) on Canvas, with zzfx for procedurally generated audio and Vitest tests.',
  },
  features: [
    {
      id: 'f-1',
      text: {
        es: 'Movimiento, muros y colisiones con lógica pura testeada (Vitest)',
        en: 'Movement, walls and collisions with pure, tested logic (Vitest)',
      },
    },
    {
      id: 'f-2',
      text: {
        es: 'Récords persistentes y ajustes guardados en localStorage',
        en: 'Persistent high-scores and settings in localStorage',
      },
    },
    {
      id: 'f-3',
      text: {
        es: 'Multilingüe (i18n.js) con física de audio generada por zzfx',
        en: 'Multi-language (i18n.js) with zzfx-generated sound',
      },
    },
  ],
  technicalDecisions: [
    {
      id: 'd-1',
      text: {
        es: 'AGENTS.md, memoria del proyecto y skills mantienen el contexto y guían a los agentes entre tareas y sesiones.',
        en: 'AGENTS.md, project memory and skills maintain context and guide agents across tasks and sessions.',
      },
    },
    {
      id: 'd-2',
      text: {
        es: 'SDD: requisitos, especificaciones y arquitectura documentados antes de implementar; uso de Plan Mode y Build Mode para dirigir el trabajo.',
        en: 'SDD: requirements, specifications and architecture documented before implementation; Plan Mode and Build Mode used to direct the work.',
      },
    },
    {
      id: 'd-3',
      text: {
        es: 'Harness y pruebas para validar incrementalmente los resultados de los agentes, reducir errores y limitar la intervención manual en el código.',
        en: 'A test harness and incremental validation to reduce agent errors and minimise manual code intervention.',
      },
    },
  ],
  outcomes: {
    es: 'Publicado en producción en GitHub Pages; repositorio con tests pasando y documentación completa.',
    en: 'Live in production on GitHub Pages; repository with passing tests and complete documentation.',
  },
  learnings: {
    es: 'Diseño de un proceso de desarrollo asistido por IA basado en SDD: especificar, dirigir agentes y validar sus entregas.',
    en: 'Designed an AI-assisted SDD workflow: specifying requirements, directing agents and validating their work.',
  },
}
