import type { Project } from '../../models/Project'

export const miniCrm: Project = {
  id: 'mini-crm',
  slug: 'mini-crm',
  year: 2026,
  name: { es: 'MiniCRM', en: 'MiniCRM' },
  summary: {
    es: 'App Android minimalista de gestión de clientes: contactos, notas y seguimiento sencillo.',
    en: 'Minimalist Android CRM app: contacts, notes and simple follow-up management.',
  },
  category: 'android',
  technologyIds: ['kotlin', 'room', 'android-studio'],
  media: [
    {
      id: 'crm-0',
      kind: 'image',
      src: '/portfolio/media/projects/mini-crm/mcrm0.jpeg',
      alt: { es: 'Vista general del MiniCRM', en: 'MiniCRM overview' },
    },
    {
      id: 'crm-1',
      kind: 'image',
      src: '/portfolio/media/projects/mini-crm/mcrm1.jpeg',
      alt: { es: 'Pantalla principal del MiniCRM', en: 'MiniCRM main screen' },
    },
    {
      id: 'crm-2',
      kind: 'image',
      src: '/portfolio/media/projects/mini-crm/mcrm2.jpeg',
      alt: { es: 'Listado de clientes', en: 'Client list' },
    },
    {
      id: 'crm-3',
      kind: 'image',
      src: '/portfolio/media/projects/mini-crm/mcrm3.jpeg',
      alt: { es: 'Detalle de cliente', en: 'Client detail' },
    },
    {
      id: 'crm-4',
      kind: 'image',
      src: '/portfolio/media/projects/mini-crm/mcrm4.jpeg',
      alt: { es: 'Creación de contacto', en: 'Contact creation' },
    },
    {
      id: 'crm-5',
      kind: 'image',
      src: '/portfolio/media/projects/mini-crm/mcrm5.jpeg',
      alt: { es: 'Notas del cliente', en: 'Client notes' },
    },
    {
      id: 'crm-6',
      kind: 'image',
      src: '/portfolio/media/projects/mini-crm/mcrm6.jpeg',
      alt: { es: 'Seguimiento de interacciones', en: 'Interaction follow-up' },
    },
    {
      id: 'crm-7',
      kind: 'image',
      src: '/portfolio/media/projects/mini-crm/mcrm7.jpeg',
      alt: { es: 'Búsqueda y filtrado', en: 'Search and filtering' },
    },
    {
      id: 'crm-8',
      kind: 'image',
      src: '/portfolio/media/projects/mini-crm/mcrm8.jpeg',
      alt: { es: 'Ajustes de la app', en: 'App settings' },
    },
  ],
  // TODO(F7): confirmar con el propietario el repo real (en el site anterior apuntaba por error a "flashcards").
  links: [],
  goal: {
    es: 'Disponer de la gestión mínima indispensable de clientes en el móvil, sin cuentas ni nube.',
    en: 'Have the bare-minimum client management on a phone, with no accounts and no cloud.',
  },
  problem: {
    es: 'Las apps CRM comerciales son pesadas y exigen cuentas/servidores para un caso de uso tan sencillo.',
    en: 'Commercial CRM apps are heavyweight and force accounts/servers for such a simple use case.',
  },
  role: {
    es: 'Diseño y desarrollo de la app completa en Kotlin.',
    en: 'Design and development of the whole app in Kotlin.',
  },
  architecture: {
    es: 'App nativa Android en Kotlin (Android Studio) con persistencia local mediante Room (SQLite) para clientes y notas.',
    en: 'Native Android app in Kotlin (Android Studio) with local Room (SQLite) persistence for clients and notes.',
  },
  features: [
    {
      id: 'f-1',
      text: {
        es: 'Alta, edición y detalle de clientes',
        en: 'Client creation, editing and detail',
      },
    },
    {
      id: 'f-2',
      text: {
        es: 'Notas y seguimiento de interacciones por cliente',
        en: 'Per-client notes and interaction tracking',
      },
    },
    { id: 'f-3', text: { es: 'Búsqueda y filtrado rápido', en: 'Fast search and filtering' } },
  ],
  technicalDecisions: [
    {
      id: 'd-1',
      text: {
        es: 'Minimalismo funcional: solo pantallas imprescindibles para un uso real.',
        en: 'Functional minimalism: only the screens that a real use case needs.',
      },
    },
  ],
  outcomes: {
    es: 'En uso propio. TODO(F7): repo público si el propietario decide publicarlo.',
    en: 'In personal use. TODO(F7): public repo if the owner decides to publish it.',
  },
  learnings: {
    es: 'Diseño de UX minimalista en móvil y modelado de datos relacionales en Kotlin.',
    en: 'Minimalist mobile UX design and relational data modelling in Kotlin.',
  },
}
