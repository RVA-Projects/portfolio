import type { Project } from '../../models/Project'

/** Media heredada del portfolio anterior (propietario copia los ficheros en F7). */
export const signatureApplication: Project = {
  id: 'signature-application',
  slug: 'signature-application',
  year: 2026,
  name: { es: 'Signature Application', en: 'Signature Application' },
  summary: {
    es: 'Aplicación de firma digital integrada con hardware ePadLink para la recogida de consentimientos de datos en informes médicos.',
    en: 'Digital signature application integrated with ePadLink hardware for collecting data-consent signatures in medical reports.',
  },
  category: 'web',
  filterCategories: ['web', 'csharp'],
  technologyIds: ['html', 'css', 'javascript', 'csharp'],
  media: [
    {
      id: 'sig-1',
      kind: 'image',
      src: '/portfolio/media/projects/signature-application/sig1.webp',
      alt: { es: 'Vista de la aplicación de firma', en: 'Signature application view' },
    },
    {
      id: 'sig-2',
      kind: 'image',
      src: '/portfolio/media/projects/signature-application/sig2.webp',
      alt: { es: 'Flujo de firma electrónica', en: 'Electronic signing flow' },
    },
    {
      id: 'sig-3',
      kind: 'image',
      src: '/portfolio/media/projects/signature-application/sig3.png',
      alt: { es: 'Detalle del panel de consentimiento', en: 'Consent panel detail' },
    },
    {
      id: 'sig-4',
      kind: 'image',
      src: '/portfolio/media/projects/signature-application/sig4.png',
      alt: { es: 'Vista de confirmación de firma', en: 'Signature confirmation view' },
    },
  ],
  links: [],
  goal: {
    es: 'Digitalizar la recogida del consentimiento informado en la firma de informes médicos, eliminando el papel.',
    en: 'Digitise the collection of informed consent when signing medical reports, removing paper from the process.',
  },
  problem: {
    es: 'El proceso en papel ralentizaba la atención al paciente, requería almacenamiento físico y era propenso a errores de custodia.',
    en: 'The paper process slowed down patient care, required physical storage and was error-prone when it came to record-keeping.',
  },
  role: {
    es: 'Desarrollo completo de la aplicación: interfaz y lógica de firma por hardware.',
    en: 'Full development of the application: user interface and hardware signing logic.',
  },
  architecture: {
    es: 'Frontend ligero en HTML/CSS/JavaScript conectado a un backend en C# que encapsula el SDK nativo de las tablets ePadLink.',
    en: 'Lightweight HTML/CSS/JavaScript frontend connected to a C# backend that encapsulates the native SDK of the ePadLink tablets.',
  },
  features: [
    {
      id: 'f-1',
      text: {
        es: 'Firma electrónica real mediante hardware ePadLink',
        en: 'Real electronic signature using ePadLink hardware',
      },
    },
    {
      id: 'f-2',
      text: {
        es: 'Flujo guiado de consentimiento de datos para el paciente',
        en: 'Guided data-consent flow for the patient',
      },
    },
    {
      id: 'f-3',
      text: {
        es: 'Captura y almacenamiento de la imagen de la firma',
        en: 'Capture and storage of the signature image',
      },
    },
  ],
  technicalDecisions: [
    {
      id: 'd-1',
      text: {
        es: 'Integración del SDK nativo en un backend C# justo para aislar el driver del fabricante del navegador',
        en: 'Native SDK integration inside a C# backend to isolate the vendor driver from the browser',
      },
    },
    {
      id: 'd-2',
      text: {
        es: 'Frontend estático sin build para mantenimiento y despliegue sencillos',
        en: 'Static, build-free frontend for simple maintenance and deployment',
      },
    },
  ],
  outcomes: {
    es: 'En despliegue como herramienta de trabajo en el centro médico para el consentimiento de informes.',
    en: 'Deployed as the working tool for report consent at the medical centre.',
  },
  learnings: {
    es: 'Integración de hardware de terceros en aplicaciones web y diseño de flujos de firma sencillos para contextos clínicos.',
    en: 'Integrating third-party hardware in web apps and designing simple signing flows for clinical settings.',
  },
}
