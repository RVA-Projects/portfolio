import type { Project } from '../../models/Project'

export const centroMedicoSectorV: Project = {
  id: 'centro-medico-sector-v',
  slug: 'centro-medico-sector-v',
  year: 2025,
  name: { es: 'Centro Médico Sector V', en: 'Centro Médico Sector V' },
  summary: {
    es: 'Web del centro médico y posicionamiento SEO, reservas con calendario de Google y asistente con Gemini API y base de conocimiento propia.',
    en: 'Medical centre website and SEO, Google Calendar bookings, and a Gemini API assistant backed by a dedicated knowledge base.',
  },
  category: 'web',
  filterCategories: ['web'],
  technologyIds: ['wordpress', 'html', 'css', 'javascript', 'google-gemini'],
  media: [
    {
      id: 'cmsv-1',
      kind: 'image',
      src: '/portfolio/media/projects/centro-medico-sector-v/cmsv.png',
      alt: { es: 'Vista de la web del centro médico', en: 'Medical centre website view' },
    },
  ],
  links: [{ id: 'web', url: 'https://centromedicosectorv.es' }],
  goal: {
    es: 'Ofrecer información fiable del centro, facilitar las reservas y resolver dudas frecuentes de los visitantes.',
    en: 'Provide reliable information about the centre, make bookings easier and answer visitors’ common questions.',
  },
  problem: {
    es: 'Los visitantes necesitaban consultar los servicios y resolver dudas, además de encontrar una vía clara para reservar cita.',
    en: 'Visitors needed information about services and answers to common questions, as well as a clear way to book appointments.',
  },
  role: {
    es: 'Desarrollo de la web, gestión del hosting (SWHosting), posicionamiento SEO e integración del agente de IA y del sistema de reservas.',
    en: 'Website development, SWHosting management, SEO, and integration of the AI agent and booking system.',
  },
  architecture: {
    es: 'WordPress en SWHosting, con el calendario oficial de reservas de Google integrado en la web y acceso a la página externa de reservas. El agente usa Gemini API y la Eko Knowledge Base propia como única fuente; el prompt limita sus respuestas a esa documentación, sin búsquedas externas.',
    en: 'WordPress on SWHosting, with Google’s official booking calendar embedded in the site and a link to the external Google booking page. The Gemini API agent uses the custom Eko Knowledge Base as its sole source; its prompt restricts answers to that documentation and disallows external searches.',
  },
  features: [
    {
      id: 'f-1',
      text: {
        es: 'Calendario oficial de reservas de Google integrado en la web y acceso a la página externa de reservas',
        en: 'Google’s official booking calendar embedded in the site, with access to its external booking page',
      },
    },
    {
      id: 'f-2',
      text: {
        es: 'Agente con Gemini API para responder dudas y dirigir las solicitudes de cita al sistema oficial',
        en: 'Gemini API agent that answers questions and directs booking requests to the official system',
      },
    },
    {
      id: 'f-4',
      text: {
        es: 'Eko Knowledge Base: documentación del centro, sus servicios y preguntas frecuentes, utilizada como única fuente del agente',
        en: 'Eko Knowledge Base: centre, service and FAQ documentation used as the agent’s sole information source',
      },
    },
    {
      id: 'f-3',
      text: {
        es: 'Gestión completa de posicionamiento SEO en Google',
        en: 'Full SEO positioning management on Google',
      },
    },
  ],
  technicalDecisions: [
    {
      id: 'd-1',
      text: {
        es: 'WordPress por el equipo de contenido no técnico del centro; optimización controlada de plugins',
        en: 'WordPress because of the centre’s non-technical content team; carefully trimmed plugin setup',
      },
    },
    {
      id: 'd-2',
      text: {
        es: 'Calendario de Google como sistema oficial de reserva; el agente deriva las solicitudes a ese sistema y responde solo con la Eko Knowledge Base',
        en: 'Google Calendar as the official booking system; the agent routes booking requests there and answers only from the Eko Knowledge Base',
      },
    },
  ],
  outcomes: {
    es: 'Web publicada y utilizada por visitantes. El agente ofrece atención automatizada y ha reducido significativamente las consultas informativas que requerían respuesta directa. También gestioné la identidad del centro en redes sociales con Meta Business Suite.',
    en: 'The published site is used by visitors. The agent provides automated support and has significantly reduced informational questions requiring a direct response. I also managed the centre’s social-media identity with Meta Business Suite.',
  },
  learnings: {
    es: 'SEO aplicado a un negocio real, integración de servicios de IA en WordPress y gestión de CMS para equipos no técnicos.',
    en: 'Applied SEO for a real business, AI services integration in WordPress and running a CMS for non-technical teams.',
  },
}
