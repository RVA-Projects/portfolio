import type { Project } from '../../models/Project'

export const lokiHome: Project = {
  id: 'loki-home',
  slug: 'loki-home',
  name: { es: 'Loki Home', en: 'Loki Home' },
  summary: {
    es: 'Sitio web corporativo responsive desarrollado y publicado para la marca Loki Home.',
    en: 'Corporate responsive website developed and launched for the Loki Home brand.',
  },
  category: 'web',
  technologyIds: ['html', 'css', 'javascript'],
  media: [
    {
      id: 'loki-1',
      kind: 'image',
      src: '/portfolio/media/projects/loki-home/lokihome2.png',
      alt: { es: 'Vista de la web de Loki Home', en: 'Loki Home website view' },
    },
  ],
  links: [{ id: 'web', url: 'https://lokihome.com/' }],
  goal: {
    es: 'Construir la presencia pública de la marca con un sitio propio, rápido y funcional desde cualquier dispositivo.',
    en: 'Build the brand’s public presence with an own, fast, fully functional site on any device.',
  },
  problem: {
    es: 'La marca no disponía de sitio web propio: se dependía de canales de terceros para mostrar la oferta.',
    en: 'The brand had no website of its own: offering was scattered across third-party channels.',
  },
  role: {
    es: 'Desarrollo, diseño y despliegue del sitio completo.',
    en: 'Development, design and deployment of the whole site.',
  },
  architecture: {
    es: 'Sitio estático en HTML, CSS y JavaScript puro, publicado en dominio propio.',
    en: 'Static site in plain HTML, CSS and JavaScript, published on its own domain.',
  },
  features: [
    {
      id: 'f-1',
      text: {
        es: 'Diseño responsive verificada en móvil y escritorio',
        en: 'Responsive design checked on mobile and desktop',
      },
    },
    {
      id: 'f-2',
      text: {
        es: 'Estructura de contenidos orientada a conversación con el cliente',
        en: 'Content structure aimed at customer enquiry',
      },
    },
  ],
  technicalDecisions: [
    {
      id: 'd-1',
      text: {
        es: 'Vanilla HTML/CSS/JS sin framework para peso mínimo y control total del diseño',
        en: 'Vanilla HTML/CSS/JS with no framework for minimum weight and full design control',
      },
    },
  ],
  outcomes: {
    es: 'Publicada en producción en lokihome.com.',
    en: 'Live in production at lokihome.com.',
  },
  learnings: {
    es: 'Ciclo completo del proyecto cliente: diseño, implementación, despliegue y ajustes post-publicación.',
    en: 'Full client-project cycle: design, implementation, deployment and post-launch tweaks.',
  },
}
