import type { Experience } from '../models/Experience'

/**
 * Experiencia declarativa (inventario §5). Estructura del site anterior
 * re-clasificada en freelance / independiente / colaboración.
 *
 * ⚠ TODO(F7): fechas — el inventario no las aporta; `period` queda sin definir
 * hasta que el propietario confirme (no se inventan datos).
 * Enlaces: SOLO dominios/repos ya verificados; Upwork sin perfil público aún.
 */
export const experience: Experience[] = [
  {
    id: 'centro-medico-sector-v-web',
    kind: 'freelance',
    organization: {
      es: 'Centro Médico Sector V — web',
      en: 'Centro Médico Sector V — website',
    },
    role: {
      es: 'Desarrollo web, hosting y SEO',
      en: 'Web development, hosting and SEO',
    },
    description: {
      es: 'Trabajo freelance para el centro médico: sitio WordPress sobre hosting propio (SWHosting), posicionamiento SEO y formularios de contacto.',
      en: 'Freelance work for the medical centre: WordPress site on its own hosting (SWHosting), SEO positioning and contact forms.',
    },
    responsibilities: [
      {
        id: 'r-1',
        text: {
          es: 'Desarrollar y publicar el sitio en WordPress con optimización de la carga',
          en: 'Build and publish the WordPress site with load optimisation',
        },
      },
      {
        id: 'r-2',
        text: {
          es: 'Integrar contacto por WhatsApp y asistente conversacional con la API de Gemini',
          en: 'Integrate WhatsApp contact and a conversational assistant using the Gemini API',
        },
      },
      {
        id: 'r-3',
        text: {
          es: 'Gestionar el posicionamiento SEO y la identidad en redes con Meta Business Suite',
          en: 'Manage SEO positioning and social-media identity with Meta Business Suite',
        },
      },
    ],
    outcomes: [
      {
        id: 'o-1',
        text: {
          es: 'Sitio publicado en producción con presencia activa en buscadores',
          en: 'Site live in production with active search presence',
        },
      },
    ],
    technologyIds: ['wordpress', 'html', 'css', 'javascript'],
    links: [{ id: 'web', url: 'https://centromedicosectorv.es' }],
  },
  {
    id: 'signature-application',
    kind: 'freelance',
    organization: {
      es: 'Centro Médico Sector V — firma digital',
      en: 'Centro Médico Sector V — digital signature',
    },
    role: {
      es: 'Desarrollo de la aplicación de firma',
      en: 'Signature application development',
    },
    description: {
      es: 'Aplicación de firma electrónica integrada con hardware ePadLink para la recogida de consentimientos de datos en informes médicos. Usada en despliegue como herramienta de trabajo del centro.',
      en: 'Electronic signature application integrated with ePadLink hardware for collecting data-consent signatures in medical reports. Deployed and in use at the centre.',
    },
    responsibilities: [
      {
        id: 'r-1',
        text: {
          es: 'Integrar el SDK nativo de las tablets ePadLink en un backend C#',
          en: 'Integrate the ePadLink tablet native SDK inside a C# backend',
        },
      },
      {
        id: 'r-2',
        text: {
          es: 'Diseñar el flujo guiado de consentimiento y la captura de la firma',
          en: 'Design the guided consent flow and signature capture',
        },
      },
    ],
    outcomes: [
      {
        id: 'o-1',
        text: {
          es: 'Sustituyó el proceso en papel del consentimiento informado',
          en: 'Replaced the paper-based informed-consent process',
        },
      },
    ],
    technologyIds: ['html', 'css', 'javascript', 'csharp'],
  },
  {
    id: 'loki-home',
    kind: 'freelance',
    organization: { es: 'Loki Home', en: 'Loki Home' },
    role: {
      es: 'Desarrollo, diseño y despliegue web',
      en: 'Web development, design and deployment',
    },
    description: {
      es: 'Sitio corporativo responsive para la marca, desarrollado de principio a fin (HTML/CSS/JS vanilla) y publicado en dominio propio.',
      en: 'Responsive corporate website for the brand, developed end to end (vanilla HTML/CSS/JS) and published on its own domain.',
    },
    responsibilities: [
      {
        id: 'r-1',
        text: {
          es: 'Diseñar y maquetar todas las páginas del sitio',
          en: 'Design and build all site pages',
        },
      },
      {
        id: 'r-2',
        text: {
          es: 'Desplegar y ajustar el sitio tras la puesta en producción',
          en: 'Deploy and fine-tune the site after launch',
        },
      },
    ],
    technologyIds: ['html', 'css', 'javascript'],
    links: [{ id: 'web', url: 'https://lokihome.com/' }],
  },
  {
    id: 'smarti-data-datasets',
    kind: 'freelance',
    organization: {
      es: 'Smarti DATA — vía Upwork',
      en: 'Smarti DATA — via Upwork',
    },
    role: {
      es: 'Colaborador remoto',
      en: 'Remote collaborator',
    },
    description: {
      es: 'Trabajos freelance vía Upwork: recordatorios para datasets de formación de IA.',
      en: 'Freelance work via Upwork: reminders for AI-training datasets.',
    },
    responsibilities: [
      {
        id: 'r-1',
        text: {
          es: 'Recordatorios de datasets para entrenamiento de modelos de IA',
          en: 'Dataset reminders for AI model training',
        },
      },
    ],
    technologyIds: [],
  },
  {
    id: 'voz-asistentes-ia',
    kind: 'freelance',
    organization: {
      es: 'Captación de comandos de voz — vía Upwork',
      en: 'Voice command collection — via Upwork',
    },
    role: {
      es: 'Colaborador remoto',
      en: 'Remote collaborator',
    },
    description: {
      es: 'Trabajos freelance vía Upwork: captación de comandos de voz para asistentes de IA.',
      en: 'Freelance work via Upwork: voice command collection for AI assistants.',
    },
    responsibilities: [
      {
        id: 'r-1',
        text: {
          es: 'Grabación y verificación de comandos de voz',
          en: 'Voice command recording and verification',
        },
      },
    ],
    technologyIds: [],
  },
  {
    id: 'dawdam-top',
    kind: 'collab',
    organization: { es: 'dawdam.top', en: 'dawdam.top' },
    role: {
      es: 'Colaboración en WordPress',
      en: 'WordPress collaboration',
    },
    description: {
      es: 'Colaboración externa en la plataforma de formación: gestión de asignaturas, contenidos y optimización del flujo de trabajo del CMS.',
      en: 'External collaboration on the teaching platform: subject/content management and CMS workflow optimisation.',
    },
    responsibilities: [
      {
        id: 'r-1',
        text: {
          es: 'Gestionar asignaturas y contenidos de la plataforma',
          en: 'Manage platform subjects and content',
        },
      },
      {
        id: 'r-2',
        text: {
          es: 'Simplificar tareas repetitivas del CMS',
          en: 'Simplify repetitive CMS tasks',
        },
      },
    ],
    technologyIds: ['wordpress'],
    links: [{ id: 'web', url: 'https://dawdam.top/' }],
  },
  {
    id: 'task-manager',
    kind: 'independent',
    organization: { es: 'Task Manager', en: 'Task Manager' },
    role: {
      es: 'Diseño y desarrollo',
      en: 'Design and development',
    },
    description: {
      es: 'Aplicación de escritorio en uso diario propio: gestión de tareas en C# con persistencia local en SQLite. Código abierto en GitHub.',
      en: 'Desktop application in daily personal use: C# task management with local SQLite persistence. Open source on GitHub.',
    },
    responsibilities: [
      {
        id: 'r-1',
        text: {
          es: 'Modelar el almacenamiento local y el ciclo de vida de tareas',
          en: 'Model local storage and the task lifecycle',
        },
      },
    ],
    outcomes: [
      {
        id: 'o-1',
        text: { es: 'En uso diario propio', en: 'In daily personal use' },
      },
    ],
    technologyIds: ['csharp', 'sqlite'],
    links: [{ id: 'github', url: 'https://github.com/RVA-Projects/TaskManager' }],
  },
  {
    id: 'gb-utility',
    kind: 'independent',
    organization: {
      es: 'GB Utility (Magic & Monsters)',
      en: 'GB Utility (Magic & Monsters)',
    },
    role: {
      es: 'Diseño y desarrollo',
      en: 'Design and development',
    },
    description: {
      es: 'Complemento de escritorio para un juego de mesa: personajes/NPCs, misiones y eventos aleatorios y sistema de recompensas. Código abierto en GitHub.',
      en: 'Desktop companion for a board game: characters/NPCs, random quests/events and a reward system. Open source on GitHub.',
    },
    responsibilities: [
      {
        id: 'r-1',
        text: {
          es: 'Modelar reglas del juego como datos en SQLite para ampliar contenido sin reprogramar',
          en: 'Model game rules as SQLite data so content grows without reprogramming',
        },
      },
    ],
    outcomes: [
      {
        id: 'o-1',
        text: { es: 'En uso en partidas propias', en: 'In use at own sessions' },
      },
    ],
    technologyIds: ['csharp', 'sqlite'],
    links: [{ id: 'github', url: 'https://github.com/RVA-Projects/GB-Utility' }],
  },
]
