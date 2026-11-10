import { describe, expect, it } from 'vitest'
import { projects } from '../src/data/projects'
import { technologies } from '../src/data/technologies'
import { collectFilterTechnologies, filterProjects } from '../src/utils/filter'

describe('audit:content — integridad de datos de proyectos (RF-09)', () => {
  it('no hay IDs duplicados en la colección de proyectos', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('todas las technologyIds existen en el catálogo de tecnologías', () => {
    const catalogIds = new Set(technologies.map((t) => t.id))
    for (const project of projects) {
      for (const techId of project.technologyIds) {
        expect(catalogIds).toContain(techId)
      }
    }
  })

  it('todo LocalizedText tiene es/en no vacíos', () => {
    const texts: Array<{ es?: string; en?: string }> = []
    for (const project of projects) {
      texts.push(
        project.name,
        project.summary,
        project.goal,
        project.problem,
        project.role,
        project.architecture,
        project.outcomes,
        project.learnings,
      )
      for (const item of [...project.features, ...project.technicalDecisions]) {
        texts.push(item.text)
      }
      for (const mediaItem of project.media) texts.push(mediaItem.alt)
    }
    for (const text of texts) {
      expect(text.es?.trim().length ?? 0).toBeGreaterThan(0)
      expect(text.en?.trim().length ?? 0).toBeGreaterThan(0)
    }
  })

  it('cada proyecto tiene al menos 1 media y todas las URLs son válidas', () => {
    for (const project of projects) {
      expect(project.media.length).toBeGreaterThan(0)
      for (const mediaItem of project.media) {
        expect(mediaItem.src.startsWith('/portfolio/') || /^https?:\/\//.test(mediaItem.src)).toBe(
          true,
        )
      }
    }
  })

  it('los enlaces están bien formados y ninguno está inventado (solo dominios conocidos)', () => {
    const allowed = [
      'github.com',
      'lokihome.com',
      'centromedicosectorv.es',
      'dawdam.top',
      'rva-projects.github.io',
    ]
    for (const project of projects) {
      for (const link of project.links) {
        expect(allowed.some((domain) => link.url.includes(domain))).toBe(true)
      }
    }
  })

  it('los años, si existen, son reales y coherentes (2000–año actual)', () => {
    const currentYear = new Date().getFullYear()
    for (const project of projects) {
      if (project.year !== undefined) {
        expect(project.year).toBeGreaterThanOrEqual(2000)
        expect(project.year).toBeLessThanOrEqual(currentYear)
      }
    }
  })

  it('el catálogo refleja los proyectos validados (9 fichas) con la categoría ai-assisted', () => {
    expect(projects).toHaveLength(9)
    expect(projects.map((p) => p.id)).toEqual(
      expect.arrayContaining([
        'signature-application',
        'centro-medico-sector-v',
        'loki-home',
        'task-manager',
        'gb-utility',
        'flashcards-app',
        'mini-crm',
        'dawdam-top',
        'snake',
      ]),
    )
    const snake = projects.find((p) => p.id === 'snake')
    expect(snake?.category).toBe('ai-assisted')
    expect(snake?.year).toBe(2026)
    expect(snake?.technologyIds).toEqual(['html', 'css', 'javascript', 'git'])
  })

  it('la ficha snake enlaza demo y repo reales publicados', () => {
    const snake = projects.find((p) => p.id === 'snake')
    expect(snake).toBeDefined()
    const urls = (snake?.links ?? []).map((link) => link.url)
    expect(urls).toContain('https://rva-projects.github.io/snake/')
    expect(urls).toContain('https://github.com/RVA-Projects/snake')
  })
})

describe('utils/filter (RF-07)', () => {
  it('All (null) devuelve la colección intacta', () => {
    expect(filterProjects(projects, null)).toBe(projects)
  })

  it('filtra por tecnología usada', () => {
    const kotlin = filterProjects(projects, 'kotlin')
    expect(kotlin.length).toBe(2)
    expect(kotlin.every((p) => p.technologyIds.includes('kotlin'))).toBe(true)
  })

  it('devuelve vacío con tecnologías sin uso en proyectos', () => {
    expect(filterProjects(projects, 'docker')).toHaveLength(0)
  })

  it('el índice del filtro solo contiene tecnologías usadas y está ordenado', () => {
    const index = collectFilterTechnologies(projects, technologies)
    const names = index.map((t) => t.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'es')))
    expect(index.map((t) => t.id)).not.toContain('unity')
    expect(index.length).toBeGreaterThan(0)
  })
})
