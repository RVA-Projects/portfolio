import { describe, expect, it } from 'vitest'
import { experience } from '../src/data/experience'
import { technologies } from '../src/data/technologies'
import { projects } from '../src/data/projects'

describe('audit:content — integridad de datos de experiencia (RF-15)', () => {
  it('no hay IDs duplicados', () => {
    const ids = experience.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('todas las technologyIds existen en el catálogo', () => {
    const catalogIds = new Set(technologies.map((tech) => tech.id))
    for (const item of experience) {
      for (const technologyId of item.technologyIds) {
        expect(catalogIds).toContain(technologyId)
      }
    }
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

  it('los periodos, si existen, tienen formato YYYY-MM y no se inventan fechas por defecto', () => {
    for (const item of experience) {
      // Al no haber fechas verificadas en el inventario, ninguna entrada las declara aún
      expect(item.period).toBeUndefined()
      if (item.period !== undefined) {
        expect(item.period.start).toMatch(/^\d{4}-\d{2}$/)
        if (item.period.end !== undefined) {
          expect(item.period.end).toMatch(/^\d{4}-\d{2}$/)
        }
      }
    }
  })

  it('los enlaces son solo dominios verificados (sin Upwork, sin repos inventados)', () => {
    const allowed = ['github.com', 'lokihome.com', 'centromedicosectorv.es', 'dawdam.top']
    for (const item of experience) {
      for (const link of item.links ?? []) {
        expect(allowed.find((domain) => link.url.includes(domain))).toBeTruthy()
      }
    }
  })

  it('cada entrada de freelance/independiente puede referenciar un proyecto del portfolio', () => {
    // Coherencia alta: las organizaciones de experiencia coinciden con nombres de proyectos
    const projectSlugs = new Set(projects.map((project) => project.slug))
    const expected = new Set([
      'centro-medico-sector-v-web',
      'signature-application',
      'loki-home',
      'smarti-data-datasets',
      'voz-asistentes-ia',
      'dawdam-top',
      'task-manager',
      'gb-utility',
    ])
    expect(new Set(experience.map((item) => item.id))).toEqual(expected)
    expect(projectSlugs.size).toBeGreaterThan(0)
  })
})
