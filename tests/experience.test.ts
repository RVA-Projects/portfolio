import { describe, expect, it } from 'vitest'
import { experience } from '../src/data/experience'
import { technologies } from '../src/data/technologies'
import { projects } from '../src/data/projects'

const projectIds = new Set(projects.map((project) => project.id))

describe('audit:content — integridad de datos de experiencia (RF-15, Fase 6)', () => {
  it('no hay IDs duplicados', () => {
    const ids = experience.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('el catálogo es la lista plana de trabajo profesional validada (7 entradas, Fase 6)', () => {
    expect(experience.map((item) => item.id)).toEqual([
      'centro-medico-sector-v-web',
      'redes-sociales-centro-medico',
      'agente-ia-centro-medico',
      'signature-application',
      'loki-home',
      'smarti-data-datasets',
      'voz-asistentes-ia',
    ])
  })

  it('las únicas entradas con ficha de proyecto asociada son las aprobadas (Fase 5 las enlazará)', () => {
    // signature-application y loki-home comparten id con su ficha: mismo trabajo
    for (const item of experience) {
      if (projectIds.has(item.id)) {
        expect(['signature-application', 'loki-home']).toContain(item.id)
      }
    }
  })

  it('las entradas independent/collab ya NO existen aquí (viven como fichas en Proyectos)', () => {
    const ids = experience.map((item) => item.id)
    for (const removed of [
      'snake',
      'mini-crm',
      'flashcards-app',
      'task-manager',
      'gb-utility',
      'dawdam-top',
    ]) {
      expect(ids).not.toContain(removed)
    }
    // Y sus fichas siguen existiendo en Proyectos con sus datos completos
    for (const fichaId of [
      'snake',
      'mini-crm',
      'flashcards-app',
      'task-manager',
      'gb-utility',
      'dawdam-top',
    ]) {
      expect(projectIds.has(fichaId)).toBe(true)
    }
  })

  it('todas las technologyIds existen en el catálogo', () => {
    const catalogIds = new Set(technologies.map((tech) => tech.id))
    for (const item of experience) {
      for (const technologyId of item.technologyIds) {
        expect(catalogIds).toContain(technologyId)
      }
    }
  })

  it('los projectIds declarados existen en el catálogo de Proyectos (mapeo aprobado, Fase 5)', () => {
    const expected = new Map<string, string[]>([
      ['centro-medico-sector-v-web', ['centro-medico-sector-v']],
      ['redes-sociales-centro-medico', ['centro-medico-sector-v']],
      ['agente-ia-centro-medico', ['centro-medico-sector-v']],
      ['signature-application', ['signature-application']],
      ['loki-home', ['loki-home']],
    ])
    for (const item of experience) {
      if (item.projectIds !== undefined) {
        expect(expected.get(item.id), `mapeo inesperado en ${item.id}`).toEqual(item.projectIds)
        for (const projectId of item.projectIds) {
          expect(projectIds.has(projectId), `ficha inexistente: ${projectId}`).toBe(true)
        }
      }
    }
    // Las 2 entradas Upwork NO tienen proyectos asociados (aprobado)
    expect(
      experience.find((item) => item.id === 'smarti-data-datasets')?.projectIds,
    ).toBeUndefined()
    expect(experience.find((item) => item.id === 'voz-asistentes-ia')?.projectIds).toBeUndefined()
  })

  it('todo LocalizedText tiene es/en no vacíos', () => {
    for (const item of experience) {
      expect(item.organization.es.trim().length).toBeGreaterThan(0)
      expect(item.organization.en.trim().length).toBeGreaterThan(0)
      if (item.role !== undefined) {
        expect(item.role.es.trim().length).toBeGreaterThan(0)
        expect(item.role.en.trim().length).toBeGreaterThan(0)
      }
      if (item.description !== undefined) {
        expect(item.description.es.trim().length).toBeGreaterThan(0)
        expect(item.description.en.trim().length).toBeGreaterThan(0)
      }
      for (const responsibility of item.responsibilities) {
        expect(responsibility.text.es?.trim().length ?? 0).toBeGreaterThan(0)
        expect(responsibility.text.en?.trim().length ?? 0).toBeGreaterThan(0)
      }
      for (const outcome of item.outcomes ?? []) {
        expect(outcome.text.es?.trim().length ?? 0).toBeGreaterThan(0)
        expect(outcome.text.en?.trim().length ?? 0).toBeGreaterThan(0)
      }
    }
  })

  it('los periodos, si existen, tienen formato YYYY o YYYY-MM (fechas verificadas por el propietario)', () => {
    for (const item of experience) {
      if (item.period !== undefined) {
        expect(item.period.start).toMatch(/^\d{4}(-\d{2})?$/)
        if (item.period.end !== undefined) {
          expect(item.period.end).toMatch(/^\d{4}(-\d{2})?$/)
        }
      }
    }
  })

  it('las entradas sin fecha confirmada no declaran periodo (no se inventan datos)', () => {
    const undated = experience.filter((item) => item.period === undefined)
    // Smarti DATA y la captación de voz (Upwork) no tienen fecha confirmada
    expect(undated.map((item) => item.id)).toEqual(
      expect.arrayContaining(['smarti-data-datasets', 'voz-asistentes-ia']),
    )
  })

  it('los enlaces son solo dominios verificados (incl. perfil real de Upwork)', () => {
    const allowed = ['lokihome.com', 'centromedicosectorv.es', 'upwork.com']
    for (const item of experience) {
      for (const link of item.links ?? []) {
        expect(allowed.find((domain) => link.url.includes(domain))).toBeTruthy()
      }
    }
  })

  it('el perfil de Upwork enlazado es el real del propietario', () => {
    const upworkUrls = experience
      .flatMap((item) => item.links ?? [])
      .filter((link) => link.url.includes('upwork.com'))
    expect(upworkUrls.length).toBeGreaterThan(0)
    for (const link of upworkUrls) {
      expect(link.url).toBe(
        'https://www.upwork.com/freelancers/~011b7fd9b75d981e3c?mp_source=share',
      )
    }
  })
})
