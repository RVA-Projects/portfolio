import type { Project } from '../../models/Project'

export const gbUtility: Project = {
  id: 'gb-utility',
  slug: 'gb-utility',
  year: 2024,
  name: { es: 'GB Utility (Magic & Monsters)', en: 'GB Utility (Magic & Monsters)' },
  summary: {
    es: 'Complemento de escritorio para un juego de mesa: gestión de personajes/NPCs, misiones y eventos aleatorios y sistema de recompensas.',
    en: 'Desktop companion for a board game: character/NPC management, random quests and events, and a reward system.',
  },
  category: 'desktop',
  technologyIds: ['csharp', 'sqlite'],
  media: [
    {
      id: 'gb-1',
      kind: 'image',
      src: '/portfolio/media/projects/gb-utility/mm.png',
      alt: { es: 'Vista de la utilidad de juego de mesa', en: 'Board game utility view' },
    },
  ],
  links: [{ id: 'github', url: 'https://github.com/RVA-Projects/GB-Utility' }],
  goal: {
    es: 'Acelerar las partidas del juego de mesa sustituyendo fichas y papel por una utilidad en escritorio.',
    en: 'Speed up board-game sessions by replacing paper sheets and dice tables with a desktop utility.',
  },
  problem: {
    es: 'Gestionar personajes, NPCs y eventos aleatorios a mano ralentizaba las partidas de un juego con muchas fichas.',
    en: 'Managing characters, NPCs and random events by hand slowed down sessions of a sheet-heavy game.',
  },
  role: {
    es: 'Diseño y desarrollo de la utilidad completa.',
    en: 'Design and development of the whole utility.',
  },
  architecture: {
    es: 'Aplicación Windows Forms en C# con SQLite para personajes, NPCs, misiones y recompensas.',
    en: 'Windows Forms application in C# with SQLite for characters, NPCs, quests and rewards.',
  },
  features: [
    {
      id: 'f-1',
      text: {
        es: 'Creación y gestión de personajes y NPCs',
        en: 'Character and NPC creation/management',
      },
    },
    {
      id: 'f-2',
      text: {
        es: 'Generador aleatorio de misiones y eventos',
        en: 'Random generator of quests and events',
      },
    },
    {
      id: 'f-3',
      text: {
        es: 'Sistema de recompensas integrado con las partidas',
        en: 'Reward system integrated with the sessions',
      },
    },
  ],
  technicalDecisions: [
    {
      id: 'd-1',
      text: {
        es: 'Generación aleatoria basada en datos en SQLite, no en código duro, para ampliar contenido sin reprogramar',
        en: 'Randomisation driven by SQLite data instead of hardcode, so content grows without reprogramming',
      },
    },
  ],
  outcomes: {
    es: 'En uso en partidas propias; código abierto en GitHub.',
    en: 'In use at own sessions; open source on GitHub.',
  },
  learnings: {
    es: 'Modelado de reglas de juego como datos y UX para partidas en vivo (rápido, sin fricción).',
    en: 'Modelling game rules as data and building friction-free UX for in-session use.',
  },
}
