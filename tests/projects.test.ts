import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { projects } from '../src/data/projects'
import { FILTER_CATEGORIES, FILTER_CATEGORY_BY_TECH, technologies } from '../src/data/technologies'
import { filterProjects } from '../src/utils/filter'

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

  it('toda media local declarada existe en public/ (media integrada, F7.2)', () => {
    for (const project of projects) {
      for (const mediaItem of project.media) {
        if (mediaItem.src.startsWith('/portfolio/')) {
          const file = join(process.cwd(), 'public', mediaItem.src.slice('/portfolio/'.length))
          expect(existsSync(file), `falta: ${mediaItem.src}`).toBe(true)
        }
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

  it('el catálogo conserva el orden acordado y añade RVA Portfolio al final', () => {
    expect(projects.map((p) => p.id)).toEqual([
      'signature-application',
      'centro-medico-sector-v',
      'loki-home',
      'mini-crm',
      'snake',
      'task-manager',
      'gb-utility',
      'flashcards-app',
      'dawdam-top',
      'rva-portfolio',
    ])
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

describe('utils/filter por categoría (RF-07 simplificado, F2.2)', () => {
  it('All (null) devuelve la colección intacta', () => {
    expect(filterProjects(projects, null)).toBe(projects)
  })

  it('Android agrupa kotlin/android-studio (2 proyectos, sqlite/room sin categoría propia)', () => {
    const android = filterProjects(projects, 'android')
    expect(android.map((p) => p.id).sort()).toEqual(['flashcards-app', 'mini-crm'])
  })

  it('Web agrupa los seis proyectos con badge Web', () => {
    const web = filterProjects(projects, 'web')
    expect(web.map((p) => p.id).sort()).toEqual([
      'centro-medico-sector-v',
      'dawdam-top',
      'loki-home',
      'rva-portfolio',
      'signature-application',
      'snake',
    ])
  })

  it('badges superiores usan únicamente categorías de filtro, incluyendo múltiples categorías', () => {
    const categories = Object.fromEntries(
      projects.map((project) => [project.id, project.filterCategories]),
    )
    expect(categories['signature-application']).toEqual(['web', 'csharp'])
    expect(categories['mini-crm']).toEqual(['android'])
    expect(categories['snake']).toEqual(['web'])
    expect(categories['dawdam-top']).toEqual(['web'])
    expect(categories['rva-portfolio']).toEqual(['web'])
    expect(projects.every((project) => project.filterCategories.length > 0)).toBe(true)
  })

  it('Centro Médico describe reservas Google y agente basado solo en la Eko Knowledge Base', () => {
    const centre = projects.find((project) => project.id === 'centro-medico-sector-v')
    expect(centre?.summary.es).toContain('calendario de Google')
    expect(centre?.architecture.es).toContain('Eko Knowledge Base propia como única fuente')
    expect(centre?.outcomes.es).toContain('reducido significativamente')
    expect(JSON.stringify(centre)).not.toMatch(/whatsapp/i)
  })

  it('MiniCRM refleja el TFG y sus flujos de ruta y confirmación de visita', () => {
    const crm = projects.find((project) => project.id === 'mini-crm')
    expect(crm?.summary.es).toContain('Trabajo de Fin de Grado')
    expect(crm?.problem.es).toContain('combustible')
    expect(crm?.architecture.es).toContain('XML para la interfaz')
    expect(crm?.features[2].text.es).toContain('recalcula el siguiente destino')
    expect(crm?.technicalDecisions[1].text.es).toContain('Firebase')
  })

  it('C# agrupa csharp; sqlite NO filtra sola pero sus proyectos entran por csharp (3)', () => {
    const csharp = filterProjects(projects, 'csharp')
    expect(csharp.map((p) => p.id).sort()).toEqual([
      'gb-utility',
      'signature-application',
      'task-manager',
    ])
  })

  it('Python y Java existen con 0 proyectos hoy (el propietario los rellenará)', () => {
    expect(filterProjects(projects, 'python')).toHaveLength(0)
    expect(filterProjects(projects, 'java')).toHaveLength(0)
  })

  it('git, sqlite y room NO mapean a ninguna categoría de filtro', () => {
    expect(FILTER_CATEGORY_BY_TECH['git']).toBeUndefined()
    expect(FILTER_CATEGORY_BY_TECH['sqlite']).toBeUndefined()
    expect(FILTER_CATEGORY_BY_TECH['room']).toBeUndefined()
  })

  it('la constante FILTER_CATEGORIES contiene exactamente las 5 en orden estable', () => {
    expect([...FILTER_CATEGORIES]).toEqual(['android', 'web', 'csharp', 'python', 'java'])
  })
})
