import type { Project } from '../../models/Project'

export const centroMedicoSectorV: Project = {
  id: 'centro-medico-sector-v',
  slug: 'centro-medico-sector-v',
  name: { es: 'Centro Médico Sector V', en: 'Centro Médico Sector V' },
  summary: {
    es: 'Web del centro médico con WordPress, posicionamiento SEO, formulario de contacto por WhatsApp y asistente de IA con Gemini API.',
    en: 'Medical centre website on WordPress with SEO positioning, WhatsApp contact form and a Gemini API AI assistant.',
  },
  category: 'web',
  technologyIds: ['wordpress', 'html', 'css', 'javascript'],
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
    es: 'Dar al centro médico una web funcional, visible en buscadores y con canales de contacto instantáneos.',
    en: 'Give the medical centre a functional, search-visible site with instant contact channels.',
  },
  problem: {
    es: 'El centro no tenía presencia web organizada y perdía pacientes que no podían solicitar cita en línea.',
    en: 'The centre had no organised web presence and was losing patients who could not request appointments online.',
  },
  role: {
    es: 'Desarrollo web, gestión del hosting (SWHosting), SEO, integración de contacto y asistente de IA.',
    en: 'Web development, hosting management (SWHosting), SEO, contact and AI assistant integration.',
  },
  architecture: {
    es: 'WordPress sobre hosting propio (SWHosting) con plugins de optimización, integración de WhatsApp y llamadas a la API de Gemini.',
    en: 'WordPress on its own hosting (SWHosting) with optimisation plugins, WhatsApp integration and calls to the Gemini API.',
  },
  features: [
    {
      id: 'f-1',
      text: {
        es: 'Formulario de contacto integrado con WhatsApp',
        en: 'Contact form integrated with WhatsApp',
      },
    },
    {
      id: 'f-2',
      text: {
        es: 'Asistente conversacional con la API de Gemini',
        en: 'Conversational assistant using the Gemini API',
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
        es: 'WhatsApp como canal de cita por la preferencia del paciente frente a formularios tradicionales',
        en: 'WhatsApp as the booking channel given patient preference over classic forms',
      },
    },
  ],
  outcomes: {
    es: 'Web publicada en producción y presencia activa en buscadores; también gestioné la identidad del centro en redes sociales con Meta Business Suite.',
    en: 'Site live in production with active search presence; I also managed the centre’s social-media identity with Meta Business Suite.',
  },
  learnings: {
    es: 'SEO aplicado a un negocio real, integración de servicios de IA en WordPress y gestión de CMS para equipos no técnicos.',
    en: 'Applied SEO for a real business, AI services integration in WordPress and running a CMS for non-technical teams.',
  },
}
