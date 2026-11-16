import type { LanguageProfile } from '../models/LanguageProfile'

/**
 * Idiomas declarativos (RF-19/RF-20, D04 — confirmado por el propietario).
 * Nivel único MCER: `nativo` (sin marco MCER), C1, B2 y `starter` (etiqueta
 * elegida por el propietario para el alemán). `spoken`/`written` no se usan:
 * no hay desglose confirmado y NO se inventa.
 *
 * Certificados: Valenciano C1 e Inglés B2 con PDF en `public/docs/`
 * (subidos por el propietario el 2026-11-13) — D03, id estable.
 */
export const languages: LanguageProfile[] = [
  {
    id: 'castellano',
    code: 'es',
    name: { es: 'Castellano', en: 'Spanish' },
    cefr: 'nativo',
  },
  {
    id: 'valenciano',
    code: 'ca',
    name: { es: 'Valenciano', en: 'Valencian' },
    cefr: 'C1',
    document: {
      kind: 'pdf',
      src: '/portfolio/docs/valenciano.pdf',
      name: {
        es: 'Certificado — Valenciano C1',
        en: 'Certificate — Valencian C1',
      },
    },
  },
  {
    id: 'rumano',
    code: 'ro',
    name: { es: 'Rumano', en: 'Romanian' },
    cefr: 'nativo',
  },
  {
    id: 'ingles',
    code: 'en',
    name: { es: 'Inglés', en: 'English' },
    cefr: 'B2',
    document: {
      kind: 'pdf',
      src: '/portfolio/docs/ingles.pdf',
      name: {
        es: 'Certificado — Inglés B2',
        en: 'Certificate — English B2',
      },
    },
  },
  {
    id: 'aleman',
    code: 'de',
    name: { es: 'Alemán', en: 'German' },
    cefr: 'starter',
  },
]
