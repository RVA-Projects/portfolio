import { describe, expect, it } from 'vitest'
import { languages } from '../src/data/languages'

describe('data/languages — integridad (F6.7, RF-19/D04)', () => {
  it('hay 5 idiomas con ids únicos kebab-case', () => {
    expect(languages).toHaveLength(5)
    const ids = languages.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9-]+$/)
    }
  })

  it('los codes son códigos ISO de idioma válidos y únicos', () => {
    const codes = languages.map((item) => item.code)
    expect(new Set(codes).size).toBe(codes.length)
    for (const code of codes) {
      expect(code).toMatch(/^[a-z]{2}$/)
    }
    expect(codes.sort()).toEqual(['ca', 'de', 'en', 'es', 'ro'])
  })

  it('todo nombre tiene es/en no vacíos', () => {
    for (const item of languages) {
      expect(item.name.es.trim().length).toBeGreaterThan(0)
      expect(item.name.en.trim().length).toBeGreaterThan(0)
    }
  })

  it('los niveles coinciden exactamente con D04 (nada inventado)', () => {
    const byId = new Map(languages.map((item) => [item.id, item.cefr]))
    expect(byId.get('castellano')).toBe('nativo')
    expect(byId.get('valenciano')).toBe('C1')
    expect(byId.get('rumano')).toBe('nativo')
    expect(byId.get('ingles')).toBe('B2')
    expect(byId.get('aleman')).toBe('starter')
    // Sin desglose conversación/escrito (decisión del propietario, nivel único)
    for (const item of languages) {
      expect(item.spoken).toBeUndefined()
      expect(item.written).toBeUndefined()
    }
  })

  it('sin documentos declarados todavía (PDFs de certificados pendientes, F7.3); si se declaran, deben ser locales /docs/', () => {
    for (const item of languages) {
      if (item.document !== undefined) {
        expect(item.document.src.startsWith('/portfolio/docs/')).toBe(true)
      }
    }
  })
})
