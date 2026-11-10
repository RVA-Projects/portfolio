import type { Project } from '../../models/Project'

export const dawdamTop: Project = {
  id: 'dawdam-top',
  slug: 'dawdam-top',
  year: 2024,
  name: { es: 'dawdam.top', en: 'dawdam.top' },
  summary: {
    es: 'Colaboración en la plataforma dawdam.top: gestión de cursos y contenidos, y optimización de flujos de trabajo en WordPress.',
    en: 'Collaboration on the dawdam.top platform: subject and content management, plus optimised WordPress workflows.',
  },
  category: 'collab',
  technologyIds: ['wordpress'],
  media: [
    {
      id: 'dawdam-1',
      kind: 'image',
      src: '/portfolio/media/projects/dawdam-top/coding.png',
      alt: { es: 'Vista del sitio dawdam.top', en: 'dawdam.top site view' },
    },
  ],
  links: [{ id: 'web', url: 'https://dawdam.top/' }],
  goal: {
    es: 'Ayudar a operar y mantener una plataforma de formación basada en WordPress.',
    en: 'Help run and maintain a WordPress-based teaching platform.',
  },
  problem: {
    es: 'El equipo de la plataforma necesitaba manos para gestionar cursos, contenidos y flujos repetitivos del CMS.',
    en: 'The platform team needed extra hands for subjects, content and repetitive CMS workflows.',
  },
  role: {
    es: 'Colaboración externa: gestión de asignaturas, contenido y optimización del flujo de trabajo del CMS.',
    en: 'External collaboration: subject/content management and CMS workflow optimisation.',
  },
  architecture: {
    es: 'WordPress con organización de contenidos por cursos y materias.',
    en: 'WordPress with content organised by courses and subjects.',
  },
  features: [
    {
      id: 'f-1',
      text: {
        es: 'Gestión de materias y contenidos de la plataforma',
        en: 'Platform subject and content management',
      },
    },
    {
      id: 'f-2',
      text: {
        es: 'Simplificación de tareas repetitivas del CMS',
        en: 'Simplification of repetitive CMS tasks',
      },
    },
  ],
  technicalDecisions: [
    {
      id: 'd-1',
      text: {
        es: 'Uso directo del CMS estándar sin modificar el núcleo, priorizando el mantenimiento',
        en: 'Plain standard CMS usage with no core changes, keeping maintenance simple',
      },
    },
  ],
  outcomes: {
    es: 'Plataforma operativa con contenidos gestionados de forma continuada durante la colaboración.',
    en: 'Platform operated with continuously managed content during the collaboration.',
  },
  learnings: {
    es: 'Trabajo en equipo sobre un sitio en producción y procesos editoriales sobre WordPress.',
    en: 'Teamwork on a live site and editorial processes on WordPress.',
  },
}
