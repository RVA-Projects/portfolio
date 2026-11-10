import type { Project } from '../../models/Project'

export const taskManager: Project = {
  id: 'task-manager',
  slug: 'task-manager',
  name: { es: 'Task Manager', en: 'Task Manager' },
  summary: {
    es: 'Aplicación de escritorio para la gestión de tareas diarias, con persistencia local en SQLite.',
    en: 'Desktop application for daily task management with local SQLite persistence.',
  },
  category: 'desktop',
  technologyIds: ['csharp', 'sqlite'],
  media: [
    {
      id: 'task-1',
      kind: 'image',
      src: '/portfolio/media/projects/task-manager/taskmanager.png',
      alt: { es: 'Vista del gestor de tareas', en: 'Task manager view' },
    },
  ],
  links: [{ id: 'github', url: 'https://github.com/RVA-Projects/TaskManager' }],
  goal: {
    es: 'Tener una herramienta propia, rápida y sin nube para organizar el trabajo diario.',
    en: 'Have an own, fast, cloud-free tool to organise daily work.',
  },
  problem: {
    es: 'Las soluciones existentes de tareas me iban excesivas o dependían de servicios externos.',
    en: 'Existing task solutions were either overkill for my needs or hooked on external services.',
  },
  role: {
    es: 'Diseño y desarrollo de la aplicación completa.',
    en: 'Design and development of the entire application.',
  },
  architecture: {
    es: 'Aplicación Windows Forms en C# con capa de persistencia SQLite local.',
    en: 'Windows Forms application in C# with a local SQLite persistence layer.',
  },
  features: [
    {
      id: 'f-1',
      text: {
        es: 'Alta, edición y cierre de tareas del día a día',
        en: 'Create, edit and complete day-to-day tasks',
      },
    },
    {
      id: 'f-2',
      text: {
        es: 'Persistencia local sin dependencia de servicios en la nube',
        en: 'Local persistence with no cloud-service dependency',
      },
    },
  ],
  technicalDecisions: [
    {
      id: 'd-1',
      text: {
        es: 'SQLite por ser local, embebido y sin instalación de servidor de bases de datos',
        en: 'SQLite because it’s local, embedded and needs no database server install',
      },
    },
    {
      id: 'd-2',
      text: {
        es: 'Windows Forms por el estilo de aplicación rápido en C# para un instrumento diario',
        en: 'Windows Forms as the fastest way to a C# daily-drive desktop tool',
      },
    },
  ],
  outcomes: {
    es: 'En uso diario propio; código abierto en GitHub.',
    en: 'In daily personal use; open source on GitHub.',
  },
  learnings: {
    es: 'Modelo de datos con SQLite desde C# y flujo completo de publicar un proyecto en GitHub.',
    en: 'SQLite data modelling from C# and the full flow of shipping a project to GitHub.',
  },
}
