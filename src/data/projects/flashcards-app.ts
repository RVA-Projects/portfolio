import type { Project } from '../../models/Project'

export const flashcardsApp: Project = {
  id: 'flashcards-app',
  slug: 'flashcards-app',
  year: 2025,
  name: { es: 'Flashcards App', en: 'Flashcards App' },
  summary: {
    es: 'App Android para estudiar con tarjetas CSV en formato flashcard, con importación y práctica por sesiones.',
    en: 'Android app to study with CSV flashcards, including importing and session-based practice.',
  },
  category: 'android',
  technologyIds: ['kotlin', 'android-studio'],
  media: [
    {
      id: 'fc-1',
      kind: 'image',
      src: '/portfolio/media/projects/flashcards-app/fcicon.png',
      alt: { es: 'Icono de la app de flashcards', en: 'Flashcards app icon' },
    },
    {
      id: 'fc-2',
      kind: 'image',
      src: '/portfolio/media/projects/flashcards-app/fc1.jpeg',
      alt: { es: 'Pantalla principal de la app', en: 'App main screen' },
    },
    {
      id: 'fc-3',
      kind: 'image',
      src: '/portfolio/media/projects/flashcards-app/fc2.jpeg',
      alt: { es: 'Sesión de práctica de tarjetas', en: 'Card practice session' },
    },
    {
      id: 'fc-4',
      kind: 'image',
      src: '/portfolio/media/projects/flashcards-app/fc3.jpeg',
      alt: { es: 'Detalle de tarjeta en revisión', en: 'Card review detail' },
    },
    {
      id: 'fc-5',
      kind: 'image',
      src: '/portfolio/media/projects/flashcards-app/fc4.jpeg',
      alt: { es: 'Resultado de la sesión de estudio', en: 'Study session result' },
    },
  ],
  links: [{ id: 'github', url: 'https://github.com/RVA-Projects/flashcards' }],
  goal: {
    es: 'Convertir exportaciones de CSV en material de estudio que se pueda usar directamente en el móvil.',
    en: 'Turn CSV exports into study material that is directly usable on mobile.',
  },
  problem: {
    es: 'Las plataformas de tarjetas existentes no permitían importar CSV libremente ni practicar sin conexión.',
    en: 'Existing card platforms didn’t allow free CSV import or offline practice.',
  },
  role: {
    es: 'Diseño y desarrollo de la app completa en Kotlin.',
    en: 'Design and development of the whole app in Kotlin.',
  },
  architecture: {
    es: 'App nativa Android en Kotlin (Android Studio) con importación de CSV y renderizado de tarjetas.',
    en: 'Native Android app in Kotlin (Android Studio) with CSV import and card rendering.',
  },
  features: [
    {
      id: 'f-1',
      text: { es: 'Importación de tarjetas desde archivos CSV', en: 'Card import from CSV files' },
    },
    {
      id: 'f-2',
      text: {
        es: 'Práctica por sesiones con registro de progreso',
        en: 'Session-based practice with progress',
      },
    },
    { id: 'f-3', text: { es: 'Uso sin conexión', en: 'Offline usage' } },
  ],
  technicalDecisions: [
    {
      id: 'd-1',
      text: {
        es: 'Kotlin nativo por rendimiento y acceso directo al SDK de Android',
        en: 'Native Kotlin for performance and straight access to the Android SDK',
      },
    },
    {
      id: 'd-2',
      text: {
        es: 'CSV como formato de intercambio: universal y editable en cualquier hoja de cálculo',
        en: 'CSV as exchange format, being universal and editable in any spreadsheet',
      },
    },
  ],
  outcomes: {
    es: 'En uso personal para estudio; código abierto en GitHub.',
    en: 'In personal study use; open source on GitHub.',
  },
  learnings: {
    es: 'Desarrollo Android con Kotlin, ciclo de vida de actividades y I/O de ficheros en móvil.',
    en: 'Android development with Kotlin, activity lifecycle and file I/O on mobile.',
  },
}
