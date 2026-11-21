import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { technologies, technologiesByTier } from '../src/data/technologies'
import type { TechnologyTier } from '../src/models/Technology'

const iconsDir = join(process.cwd(), 'src', 'components', 'base', 'icons')
const pngDir = join(process.cwd(), 'public', 'assets', 'img', 'icons')

describe('audit:content — catálogo de tecnologías (RF-03)', () => {
  it('no hay IDs duplicados', () => {
    const ids = technologies.map((tech) => tech.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('los tiers son válidos; las tecnologías de ficha quedan fuera del Stack visible', () => {
    const valid: TechnologyTier[] = ['core', 'explored', 'project']
    for (const tech of technologies) {
      expect(valid).toContain(tech.tier)
    }
    for (const tier of ['core', 'explored'] as const) {
      expect(technologies.filter((tech) => tech.tier === tier).length).toBeGreaterThan(0)
    }
  })

  it('todo nombre canónico no está vacío y es igual en ambos idiomas (campo único)', () => {
    for (const tech of technologies) {
      expect(tech.name.trim().length).toBeGreaterThan(0)
    }
  })

  it('toda tecnología tiene icono: PNG custom declarado o SVG en assets del componente', () => {
    for (const tech of technologies) {
      if (tech.icon !== undefined) {
        if (['codex', 'opencode'].includes(tech.icon)) {
          expect(existsSync(join(pngDir, `${tech.icon}-light.png`))).toBe(true)
          if (tech.icon === 'opencode') {
            expect(existsSync(join(pngDir, `${tech.icon}-dark.png`))).toBe(true)
          }
        } else {
          expect(existsSync(join(pngDir, `${tech.icon}.png`)), `PNG: ${tech.icon}`).toBe(true)
        }
      } else {
        expect(existsSync(join(iconsDir, `${tech.id}.svg`)), `SVG: ${tech.id}`).toBe(true)
      }
    }
  })

  it('el stack principal contiene tecnologías core sin TypeScript project-only', () => {
    const core = technologies.filter((tech) => tech.tier === 'core').map((tech) => tech.id)
    expect(core).toEqual(
      expect.arrayContaining([
        'javascript',
        'kotlin',
        'react',
        'html',
        'css',
        'sql',
        'java',
        'python',
        'csharp',
      ]),
    )
    expect(core).not.toContain('typescript')
  })

  it('ordena alfabéticamente ambos niveles y asigna Codex/OpenCoDEX donde corresponde', () => {
    expect(technologies.filter((tech) => tech.tier === 'core').map((tech) => tech.name)).toEqual([
      'C#',
      'CSS',
      'HTML',
      'Java',
      'JavaScript',
      'Kotlin',
      'OpenCode',
      'Python',
      'React',
      'SQL',
    ])
    expect(
      technologies.filter((tech) => tech.tier === 'explored').map((tech) => tech.name),
    ).toEqual([
      'Android Studio',
      'Codex',
      'Docker',
      'Eclipse',
      'Firebase',
      'Git',
      'GitHub',
      'Meta Business Suite',
      'MySQL',
      'NetBeans',
      'Node.js',
      'PostgreSQL',
      'Postman',
      'Room',
      'SQLite',
      'Unity',
      'Visual Studio',
      'VS Code',
      'WordPress',
      'XAMPP',
    ])
    expect(technologies.find((tech) => tech.id === 'codex')?.icon).toBe('codex')
    expect(technologies.find((tech) => tech.id === 'opencodex')?.tier).toBe('core')
    expect(technologies.find((tech) => tech.id === 'git')?.tier).toBe('explored')
    expect(technologies.find((tech) => tech.id === 'google-gemini')?.tier).toBe('project')
  })

  it('TypeScript está disponible solo en las fichas de proyecto, no en el Stack visible', () => {
    expect(technologies.find((tech) => tech.id === 'typescript')?.tier).toBe('project')
    expect(technologiesByTier('core')).not.toContainEqual(
      expect.objectContaining({ id: 'typescript' }),
    )
    expect(technologiesByTier('explored')).not.toContainEqual(
      expect.objectContaining({ id: 'typescript' }),
    )
  })

  it('mini-crm declara Room y el catálogo la incluye como explorada (D27)', () => {
    const room = technologies.find((tech) => tech.id === 'room')
    expect(room?.tier).toBe('explored')
  })
})
