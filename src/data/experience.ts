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
      es: 'Centro Médico Sector V',
      en: 'Centro Médico Sector V',
    },
    role: {
      es: 'Desarrollo de web empresarial',
      en: 'Corporate website development',
    },
    description: {
      es: 'Sitio oficial del centro desarrollado en WordPress y alojado en SWHosting, con posicionamiento SEO y canales de contacto.',
      en: 'Official centre website built with WordPress and hosted on SWHosting, with SEO positioning and contact channels.',
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
      es: 'Centro Médico Sector V',
      en: 'Centro Médico Sector V',
    },
    role: {
      es: 'Gestión de redes sociales',
      en: 'Social media management',
    },
    description: {
      es: 'Gestión de la identidad y la presencia del centro en redes sociales mediante Meta Business Suite.',
      en: 'Management of the centre’s identity and presence on social media using Meta Business Suite.',
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
    technologyIds: ['meta-business-suite'],
    projectIds: ['centro-medico-sector-v'],
  },
  {
    id: 'agente-ia-centro-medico',
    period: { start: '2026' },
    organization: {
      es: 'Centro Médico Sector V',
      en: 'Centro Médico Sector V',
    },
    role: {
      es: 'Desarrollo de agente de IA para asesoramiento',
      en: 'AI advisory agent development',
    },
    description: {
      es: 'Agente de IA integrado en la web para atender consultas de pacientes, con una base de conocimiento Echo Knowledge Base y respuestas mediante la API de Gemini.',
      en: 'AI agent integrated into the website to answer patient enquiries, using an Echo Knowledge Base and responses powered by the Gemini API.',
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
    technologyIds: ['wordpress', 'google-gemini'],
    projectIds: ['centro-medico-sector-v'],
  },
  {
    id: 'signature-application',
    period: { start: '2026' },
    organization: {
      es: 'Centro Médico Sector V',
      en: 'Centro Médico Sector V',
    },
    role: {
      es: 'Desarrollo de aplicación de firma digital',
      en: 'Digital signature application development',
    },
    description: {
      es: 'Aplicación para firmar documentos en tableta electrónica, con exportación PDF y biometría integrada para el consentimiento sobre datos de informes médicos. En despliegue como herramienta del centro.',
      en: 'Application for signing documents on an electronic tablet, with PDF export and integrated biometrics for consent to the use of data in medical reports. Being deployed as a centre tool.',
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
      es: 'Desarrollo de web para materiales de construcción y decoración',
      en: 'Website development for building materials and home decor',
    },
    description: {
      es: 'Sitio web de Loki Home para su actividad comercial en materiales de construcción y decoración, desarrollado con HTML, CSS y JavaScript y publicado en dominio propio.',
      en: 'Loki Home website for its commercial activity in building materials and home decor, built with HTML, CSS and JavaScript and published on its own domain.',
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
      es: 'Smarti DATA · Upwork',
      en: 'Smarti DATA · Upwork',
    },
    role: {
      es: 'Registro y verificación de datos conversacionales para entrenamiento de IA',
      en: 'Conversational data recording and verification for AI training',
    },
    description: {
      es: 'Registro y verificación de datos conversacionales destinados al entrenamiento de modelos de inteligencia artificial en una colaboración remota vía Upwork.',
      en: 'Recording and verification of conversational data for training artificial intelligence models as a remote collaboration via Upwork.',
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
      es: 'Upwork',
      en: 'Upwork',
    },
    role: {
      es: 'Grabación y verificación de comandos de activación para asistentes de IA',
      en: 'Wake-word recording and verification for AI assistants',
    },
    description: {
      es: 'Captación, grabación y verificación de comandos de activación (Wake-Up) para asistentes de inteligencia artificial en una colaboración remota vía Upwork.',
      en: 'Collection, recording and verification of wake-up voice commands for artificial intelligence assistants as a remote collaboration via Upwork.',
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
