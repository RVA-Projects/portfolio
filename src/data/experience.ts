import type { Experience } from '../models/Experience'

/**
 * Experiencia declarativa (inventario §5 + fechas validadas por el
 * propietario, 2026-11). Fase 6 del plan de actualización: SOLO trabajo
 * profesional remunerado/cargos reales; los proyectos propios y
 * colaboraciones (snake, mini-crm, flashcards, task-manager, gb-utility,
 * dawdam-top) viven como fichas en el catálogo de Proyectos — sin duplicar.
 *
 * Periodos: año o año-mes reales; ausencia ⇒ sin fecha visible (nunca inventada).
 * Enlaces: solo dominios/repos verificados (incl. perfil real de Upwork).
 */
export const experience: Experience[] = [
  {
    id: 'centro-medico-sector-v-web',
    period: { start: '2025' },
    organization: {
      es: 'Centro Médico Sector V — web',
      en: 'Centro Médico Sector V — website',
    },
    role: {
      es: 'Diseño, desarrollo, despliegue y mantenimiento',
      en: 'Design, development, deployment and maintenance',
    },
    description: {
      es: 'Página web oficial del centro: sitio WordPress sobre hosting propio (SWHosting), posicionamiento SEO completo y canales de contacto instantáneos.',
      en: 'Official website of the centre: WordPress site on its own hosting (SWHosting), full SEO work and instant contact channels.',
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
          es: 'Gestionar el posicionamiento SEO completo del sitio en Google',
          en: 'Manage the site’s complete SEO positioning on Google',
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
    projectIds: ['centro-medico-sector-v'],
  },
  {
    id: 'redes-sociales-centro-medico',
    period: { start: '2025' },
    organization: {
      es: 'Centro Médico Sector V — redes sociales',
      en: 'Centro Médico Sector V — social media',
    },
    role: {
      es: 'Gestión y optimización de redes',
      en: 'Social media management and optimisation',
    },
    description: {
      es: 'Gestión completa de la identidad y presencia del centro en redes con Meta Business Suite.',
      en: 'Full management of the centre’s social identity and presence with Meta Business Suite.',
    },
    responsibilities: [
      {
        id: 'r-1',
        text: {
          es: 'Programar contenidos y gestionar el engagement de la audiencia',
          en: 'Schedule content and manage audience engagement',
        },
      },
      {
        id: 'r-2',
        text: {
          es: 'Analizar el rendimiento y optimizar la publicación',
          en: 'Analyse performance and optimise publishing',
        },
      },
    ],
    technologyIds: [],
    projectIds: ['centro-medico-sector-v'],
  },
  {
    id: 'agente-ia-centro-medico',
    period: { start: '2026' },
    organization: {
      es: 'Centro Médico Sector V — agente IA de asesoramiento',
      en: 'Centro Médico Sector V — AI advisory agent',
    },
    role: {
      es: 'Diseño y entrenamiento del agente',
      en: 'Agent design and training',
    },
    description: {
      es: 'Agente de asesoramiento para las consultas de pacientes del sitio, con base de conocimiento Echo Knowledge Base y respuestas potenciadas por la API de Gemini.',
      en: 'Advisory agent for patient enquiries on the site, backed by an Echo Knowledge Base with answers powered by the Gemini API.',
    },
    responsibilities: [
      {
        id: 'r-1',
        text: {
          es: 'Diseñar la estructura de la base de conocimiento y entrenar al agente',
          en: 'Design the knowledge-base structure and train the agent',
        },
      },
      {
        id: 'r-2',
        text: {
          es: 'Integrar el agente con la API de Gemini y el sitio WordPress',
          en: 'Integrate the agent with the Gemini API and the WordPress site',
        },
      },
    ],
    technologyIds: ['wordpress'],
    projectIds: ['centro-medico-sector-v'],
  },
  {
    id: 'signature-application',
    period: { start: '2026' },
    organization: {
      es: 'Centro Médico Sector V — firma digital',
      en: 'Centro Médico Sector V — digital signature',
    },
    role: {
      es: 'Diseño y desarrollo de la aplicación',
      en: 'Application design and development',
    },
    description: {
      es: 'Aplicativo de firma de documentos para tableta de firma electrónica: exportación PDF y biometría integrada para el consentimiento de datos en informes médicos. En despliegue como herramienta de trabajo del centro.',
      en: 'Document-signing application for an electronic signature tablet: PDF export and integrated biometrics for data consent in medical reports. Deployed as a working tool of the centre.',
    },
    responsibilities: [
      {
        id: 'r-1',
        text: {
          es: 'Integrar el SDK de las tablets ePadLink con backend en C#',
          en: 'Integrate the ePadLink tablet SDK with a C# backend',
        },
      },
      {
        id: 'r-2',
        text: {
          es: 'Diseñar el flujo de firma con exportación PDF y biometría',
          en: 'Design the signing flow with PDF export and biometrics',
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
    projectIds: ['signature-application'],
  },
  {
    id: 'loki-home',
    period: { start: '2025' },
    organization: { es: 'Loki Home', en: 'Loki Home' },
    role: {
      es: 'Diseño, desarrollo y despliegue web',
      en: 'Web design, development and deployment',
    },
    description: {
      es: 'Página web oficial de la marca, desarrollada de principio a fin (HTML/CSS/JS vanilla) y publicada en dominio propio.',
      en: 'Official brand website, developed end to end (vanilla HTML/CSS/JS) and published on its own domain.',
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
          es: 'Desplegar y mantener el sitio tras la puesta en producción',
          en: 'Deploy and maintain the site after launch',
        },
      },
    ],
    technologyIds: ['html', 'css', 'javascript'],
    links: [{ id: 'web', url: 'https://lokihome.com/' }],
    projectIds: ['loki-home'],
  },
  {
    id: 'smarti-data-datasets',
    organization: {
      es: 'Smarti DATA — vía Upwork',
      en: 'Smarti DATA — via Upwork',
    },
    role: {
      es: 'Colaborador remoto',
      en: 'Remote collaborator',
    },
    description: {
      es: 'Registraba conversational datasets para el entrenamiento de modelos de IA, como trabajo freelance vía Upwork.',
      en: 'Recorded conversational datasets for AI-model training, as freelance work via Upwork.',
    },
    responsibilities: [
      {
        id: 'r-1',
        text: {
          es: 'Grabar y verificar conversaciones para datasets de entrenamiento',
          en: 'Record and verify conversations for training datasets',
        },
      },
    ],
    technologyIds: [],
    links: [
      {
        id: 'web',
        url: 'https://www.upwork.com/freelancers/~011b7fd9b75d981e3c?mp_source=share',
      },
    ],
  },
  {
    id: 'voz-asistentes-ia',
    organization: {
      es: 'Captación de comandos de voz — vía Upwork',
      en: 'Voice command collection — via Upwork',
    },
    role: {
      es: 'Colaborador remoto',
      en: 'Remote collaborator',
    },
    description: {
      es: 'Captación y entrega de Wake-Up voice commands para asistentes de IA, como trabajo freelance vía Upwork.',
      en: 'Collected and delivered Wake-Up voice commands for AI assistants, as freelance work via Upwork.',
    },
    responsibilities: [
      {
        id: 'r-1',
        text: {
          es: 'Grabación y verificación de comandos de voz Wake-Up',
          en: 'Recording and verification of Wake-Up voice commands',
        },
      },
    ],
    technologyIds: [],
    links: [
      {
        id: 'web',
        url: 'https://www.upwork.com/freelancers/~011b7fd9b75d981e3c?mp_source=share',
      },
    ],
  },
]
