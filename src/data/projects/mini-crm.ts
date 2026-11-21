import type { Project } from '../../models/Project'

export const miniCrm: Project = {
  id: 'mini-crm',
  slug: 'mini-crm',
  year: 2026,
  name: { es: 'MiniCRM', en: 'MiniCRM' },
  summary: {
    es: 'Trabajo de Fin de Grado y prototipo funcional para organizar rutas de visitas comerciales, optimizarlas con OpenStreetMap y controlar clientes pendientes y visitados.',
    en: 'Final degree project and working prototype for organising sales visits, optimising routes with OpenStreetMap and tracking pending and visited customers.',
  },
  category: 'android',
  filterCategories: ['android'],
  technologyIds: ['kotlin', 'room', 'sqlite', 'android-studio'],
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
    es: 'Desarrollar como Trabajo de Fin de Grado un prototipo funcional que ayude a un comercial colaborador externo de LokiHome a planificar y gestionar las visitas a clientes.',
    en: 'Develop a working final degree project prototype to help a LokiHome external sales collaborator plan and manage customer visits.',
  },
  problem: {
    es: 'El comercial itinerante visita clientes repartidos entre distintas ciudades y transporta muestras y material comercial. La planificación manual desorganizaba las visitas, podía dejar clientes sin atender y provocaba desplazamientos repetidos a las mismas ciudades, con pérdida de tiempo y combustible.',
    en: 'The travelling salesperson visits customers across multiple cities while carrying samples and sales material. Manual planning disorganised visits, could leave customers unvisited and led to repeat trips to the same cities, wasting time and fuel.',
  },
  role: {
    es: 'Analicé, diseñé y desarrollé el prototipo Android como Trabajo de Fin de Grado, partiendo de una necesidad real de gestión de rutas comerciales.',
    en: 'Analysed, designed and developed the Android prototype as a final degree project around a real sales-route management need.',
  },
  architecture: {
    es: 'Aplicación desarrollada íntegramente en Android Studio, con Kotlin para la lógica y XML para la interfaz. Room sobre SQLite persiste los datos. OpenStreetMap calcula y representa rutas optimizadas entre clientes.',
    en: 'Application developed entirely in Android Studio, using Kotlin for logic and XML for the interface. Room over SQLite persists the data. OpenStreetMap calculates and displays optimised routes between customers.',
  },
  features: [
    {
      id: 'f-1',
      text: {
        es: 'Registro de clientes y organización en rutas comerciales.',
        en: 'Register customers and organise them into sales routes.',
      },
    },
    {
      id: 'f-2',
      text: {
        es: 'Control de clientes visitados y pendientes; consulta del siguiente destino, posibilidad de saltar clientes o seleccionar manualmente el próximo.',
        en: 'Track visited and pending customers, view the next destination, skip customers or choose the next one manually.',
      },
    },
    {
      id: 'f-3',
      text: {
        es: 'Abre Google Maps o la aplicación de navegación preferida para ir desde la ubicación actual al cliente seleccionado. Al regresar, se confirma la visita: si se completa, el cliente queda marcado y se recalcula el siguiente destino; si no, permanece pendiente.',
        en: 'Opens Google Maps or the preferred navigation app to route from the current location to the selected customer. On return, the visit can be confirmed: completed visits are marked and the next destination is recalculated; otherwise the customer remains pending.',
      },
    },
  ],
  technicalDecisions: [
    {
      id: 'd-1',
      text: {
        es: 'Estudio previo del estado del arte y elaboración de diagramas de clases, casos de uso y base de datos para definir el problema y la solución.',
        en: 'Reviewed the state of the art and prepared class, use-case and database diagrams to define the problem and solution.',
      },
    },
    {
      id: 'd-2',
      text: {
        es: 'La arquitectura inicial contemplaba Firebase; evolucionó a persistencia local con Room y SQLite, acorde con las necesidades de organización y crecimiento previstas para los datos.',
        en: 'The initial architecture considered Firebase; it evolved to local Room and SQLite persistence to suit the planned data organisation and growth.',
      },
    },
  ],
  outcomes: {
    es: 'Prototipo funcional de Trabajo de Fin de Grado concebido para responder a una necesidad real de planificación de visitas comerciales.',
    en: 'Working final degree project prototype designed to address a real sales-visit planning need.',
  },
  learnings: {
    es: 'Análisis y diseño de una solución móvil para rutas comerciales, modelado de datos relacionales y navegación basada en OpenStreetMap.',
    en: 'Analysis and design of a mobile sales-route solution, relational data modelling and OpenStreetMap-based routing.',
  },
}
