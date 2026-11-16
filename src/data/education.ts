import type { Education } from '../models/Education'

/**
 * Formación declarativa (inventario §4 del portfolio anterior). Jerarquía
 * RF-16: `official` → `certification` → `course`. Clasificación (D16): el
 * DAM es formación oficial en curso; CCST, IT Specialist (Pearson) y Oracle
 * Fusion AI Agent Studio son certificaciones con acreditación (badge externo
 * real); Oracle Java Foundations es certificación SIN acreditación verificable
 * (pendiente del propietario); los 6 cursos de OpenWebinars son `course`.
 *
 * Sin fechas ni duraciones: la fuente no las publica y NO se inventan.
 * Emisor (D-D, ronda 4 F3): el propietario aportó el centro del DAM (ILERNA).
 * Documentos (D03): los PDFs de OpenWebinars se sirven localmente bajo
 * /docs/ (pendientes de subida ⇒ el visor muestra un error controlado);
 * los badges Credly/CertView conservan su URL externa real.
 */
export const education: Education[] = [
  // ——— Formación oficial
  {
    id: 'dam-multiplatform',
    kind: 'official',
    name: {
      es: 'Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)',
      en: 'Higher Technician in Multiplatform Application Development (DAM)',
    },
    issuer: 'ILERNA',
    description: {
      es: 'Programa oficial de Grado Superior, en curso.',
      en: 'Official higher-technician programme, currently enrolled.',
    },
  },

  // ——— Certificaciones
  {
    id: 'ccst-cybersecurity',
    kind: 'certification',
    name: {
      es: 'Cisco Certified Support Technician Cybersecurity (CCST Cybersecurity)',
      en: 'Cisco Certified Support Technician Cybersecurity (CCST Cybersecurity)',
    },
    issuer: 'Cisco',
    document: {
      src: 'https://www.credly.com/badges/83f4c08a-bdf0-43af-8d63-1a8c2238b37e/linked_in?t=thjv1f',
      name: {
        es: 'Insignia Credly — CCST Cybersecurity',
        en: 'Credly badge — CCST Cybersecurity',
      },
    },
  },
  {
    id: 'it-specialist-databases-pearson',
    kind: 'certification',
    name: {
      es: 'IT Specialist — Databases — Pearson',
      en: 'IT Specialist — Databases — Pearson',
    },
    issuer: 'Pearson',
    document: {
      src: 'https://www.credly.com/badges/37b6bca7-3df8-4bd1-900a-45edf614da90/linked_in?t=thjv4d',
      name: {
        es: 'Insignia Credly — IT Specialist Databases',
        en: 'Credly badge — IT Specialist Databases',
      },
    },
  },
  {
    id: 'oracle-fusion-ai-agent-studio',
    kind: 'certification',
    name: {
      es: 'Oracle Fusion AI Agent Studio Foundations Associate',
      en: 'Oracle Fusion AI Agent Studio Foundations Associate',
    },
    issuer: 'Oracle',
    document: {
      src: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=C96076205E85C88779E26A41B059BA08A1B84628D981867E412723843702182C',
      name: {
        es: 'Insignia Oracle CertView',
        en: 'Oracle CertView badge',
      },
    },
  },
  {
    id: 'oracle-java-foundations',
    kind: 'certification',
    name: {
      es: 'Oracle Java Foundations',
      en: 'Oracle Java Foundations',
    },
    issuer: 'Oracle',
    // Sin acreditación verificable en la fuente (inventario §4): sin documento.
  },

  // ——— Cursos (OpenWebinars)
  {
    id: 'course-react-fundamentals',
    kind: 'course',
    name: {
      es: 'React fundamentals',
      en: 'React fundamentals',
    },
    issuer: 'OpenWebinars',
    document: {
      src: '/portfolio/docs/react-fundamentals.pdf',
      name: {
        es: 'Certificado — React fundamentals (OpenWebinars)',
        en: 'Certificate — React fundamentals (OpenWebinars)',
      },
    },
  },
  {
    id: 'course-javascript-fundamentals',
    kind: 'course',
    name: {
      es: 'JavaScript fundamentals',
      en: 'JavaScript fundamentals',
    },
    issuer: 'OpenWebinars',
    document: {
      src: '/portfolio/docs/javascript-fundamentals.pdf',
      name: {
        es: 'Certificado — JavaScript fundamentals (OpenWebinars)',
        en: 'Certificate — JavaScript fundamentals (OpenWebinars)',
      },
    },
  },
  {
    id: 'course-spring-boot-spring-mvc-5',
    kind: 'course',
    name: {
      es: 'Spring Boot and Spring MVC 5',
      en: 'Spring Boot and Spring MVC 5',
    },
    issuer: 'OpenWebinars',
    document: {
      src: '/portfolio/docs/spring-boot-spring-mvc-5.pdf',
      name: {
        es: 'Certificado — Spring Boot and Spring MVC 5 (OpenWebinars)',
        en: 'Certificate — Spring Boot and Spring MVC 5 (OpenWebinars)',
      },
    },
  },
  {
    id: 'course-python',
    kind: 'course',
    name: {
      es: 'Python',
      en: 'Python',
    },
    issuer: 'OpenWebinars',
    document: {
      src: '/portfolio/docs/python.pdf',
      name: {
        es: 'Certificado — Python (OpenWebinars)',
        en: 'Certificate — Python (OpenWebinars)',
      },
    },
  },
  {
    id: 'course-kotlin',
    kind: 'course',
    name: {
      es: 'Kotlin',
      en: 'Kotlin',
    },
    issuer: 'OpenWebinars',
    document: {
      src: '/portfolio/docs/kotlin.pdf',
      name: {
        es: 'Certificado — Kotlin (OpenWebinars)',
        en: 'Certificate — Kotlin (OpenWebinars)',
      },
    },
  },
  {
    id: 'course-git',
    kind: 'course',
    name: {
      es: 'Git',
      en: 'Git',
    },
    issuer: 'OpenWebinars',
    document: {
      src: '/portfolio/docs/git.pdf',
      name: {
        es: 'Certificado — Git (OpenWebinars)',
        en: 'Certificate — Git (OpenWebinars)',
      },
    },
  },
]
