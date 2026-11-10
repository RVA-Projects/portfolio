import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { technologies } from '../src/data/technologies'
import type { TechnologyTier } from '../src/models/Technology'

const iconsDir = join(process.cwd(), 'src', 'components', 'base', 'icons')
const pngDir = join(process.cwd(), 'public', 'assets', 'img', 'icons')

describe('audit:content — catálogo de tecnologías (RF-03)', () => {
  it('no hay IDs duplicados', () => {
    const ids = technologies.map((tech) => tech.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('los tiers son válidos y los tres niveles tienen entradas', () => {
    const valid: TechnologyTier[] = ['core', 'project', 'tool']
    for (const tech of technologies) {
      expect(valid).toContain(tech.tier)
    }
    for (const tier of valid) {
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
        expect(existsSync(join(pngDir, `${tech.icon}.png`)), `PNG: ${tech.icon}`).toBe(true)
      } else {
        expect(existsSync(join(iconsDir, `${tech.id}.svg`)), `SVG: ${tech.id}`).toBe(true)
      }
    }
  })

  it('el stack principal (core) contiene las tecnologías validadas con el propietario', () => {
    const core = technologies.filter((tech) => tech.tier === 'core').map((tech) => tech.id)
    expect(core).toEqual(
      expect.arrayContaining([
        'javascript',
        'typescript',
        'react',
        'html',
        'css',
        'sql',
        'git',
        'java',
        'python',
        'csharp',
      ]),
    )
  })

  it('mini-crm declara Room y el catálogo la incluye como tecnología de proyecto', () => {
    const room = technologies.find((tech) => tech.id === 'room')
    expect(room?.tier).toBe('project')
  })
})
