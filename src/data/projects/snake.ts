import type { Project } from '../../models/Project'

/**
 * Juego Snake desarrollado con OpenCode (agentes IA) y publicado en
 * GitHub Pages. La captura del juego se genera en F6 (media generada,
 * aprobación del propietario en revisión F7).
 */
export const snake: Project = {
  id: 'snake',
  slug: 'snake',
  name: { es: 'Snake', en: 'Snake' },
  year: 2026,
  summary: {
    es: 'Juego Snake para navegador desarrollado con OpenCode: agentes IA dirigidos con AGENTS.md, memory.md, documentación en docs/ y harness de pruebas Vitest.',
    en: 'Browser Snake game developed with OpenCode: AI agents directed via AGENTS.md, memory.md, docs/ documentation and a Vitest test harness.',
  },
  category: 'ai-assisted',
  technologyIds: ['html', 'css', 'javascript', 'git'],
  media: [
    {
      id: 'snake-1',
      kind: 'image',
      src: '/portfolio/media/projects/snake/snake-cover.png',
      alt: {
        es: 'Captura del juego Snake jugando en el navegador',
        en: 'Screenshot of the Snake game playing in the browser',
      },
    },
  ],
  links: [
    { id: 'demo', url: 'https://rva-projects.github.io/snake/' },
    { id: 'github', url: 'https://github.com/RVA-Projects/snake' },
  ],
  goal: {
    es: 'Construir un juego completo para navegador como entorno de aprendizaje de desarrollo asistido por IA, con la misma disciplina metodológica que un proyecto de producción.',
    en: 'Build a complete browser game as a learning environment for AI-assisted development, with the same methodological discipline as a production project.',
  },
  problem: {
    es: 'Los proyectos de práctica suelen descuidar arquitectura, testing y gestión del conocimiento; aquí el reto era que el proceso agente-humano fuera trazable y reproducible.',
    en: 'Practice projects usually skip architecture, testing and knowledge management; the challenge here was making the agent-human process traceable and reproducible.',
  },
  role: {
    es: 'Dirección del desarrollo: decisiones, revisión del trabajo de los agentes y validación del producto final.',
    en: 'Development direction: decisions, agent-work review and validation of the final product.',
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
        es: 'AGENTS.md como manual operativo del agente + memory.md entre sesiones: proceso documentado y repetible',
        en: 'AGENTS.md as the agent’s operating manual + memory.md across sessions: a documented, repeatable process',
      },
    },
    {
      id: 'd-2',
      text: {
        es: 'Sujetos a docs/ (requirements, architecture, contracts, decisions, testing): jerarquía documental única de verdad',
        en: 'Bound to docs/ (requirements, architecture, contracts, decisions, testing): a single documentary source of truth',
      },
    },
    {
      id: 'd-3',
      text: {
        es: 'Lógica de juego pura y testeable separada de la presentación',
        en: 'Game logic kept pure and testable, separate from presentation',
      },
    },
  ],
  outcomes: {
    es: 'Publicado en producción en GitHub Pages; repositorio con tests pasando y documentación completa.',
    en: 'Live in production on GitHub Pages; repository with passing tests and complete documentation.',
  },
  learnings: {
    es: 'Dirección de agentes IA con contexto gobernado (AGENTS.md/memory.md), disciplina de documentación y testing aplicada a un juego real.',
    en: 'Directing AI agents with governed context (AGENTS.md/memory.md), documentation discipline and testing applied to a real game.',
  },
}
