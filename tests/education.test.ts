import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { education } from '../src/data/education'
import { googleDriveEmbedUrl } from '../src/utils/media'

describe('data/education — integridad (F6.6, RF-16)', () => {
  it('los ids son únicos y kebab-case (nunca el nombre visible)', () => {
    const ids = education.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9-]+$/)
    }
  })

  it('el inventario §4 está completo: 1 oficial + 4 certificaciones + 6 cursos', () => {
    expect(education).toHaveLength(11)
    expect(education.filter((item) => item.kind === 'official')).toHaveLength(1)
    expect(education.filter((item) => item.kind === 'certification')).toHaveLength(4)
    expect(education.filter((item) => item.kind === 'course')).toHaveLength(6)
  })

  it('todos los nombres tienen es/en y no hay fechas ni duraciones inventadas', () => {
    for (const item of education) {
      expect(item.name.es.trim()).not.toBe('')
      expect(item.name.en.trim()).not.toBe('')
      expect(item.date).toBeUndefined()
      expect(item.duration).toBeUndefined()
    }
  })

  it('el DAM es formación oficial con centro ILERNA (D-D, aportado por el propietario) y sin documento', () => {
    const dam = education.find((item) => item.id === 'dam-multiplatform')
    expect(dam).toBeDefined()
    expect(dam?.kind).toBe('official')
    expect(dam?.issuer).toBe('ILERNA')
    expect(dam?.description?.es).toContain('Programa oficial de Grado Superior')
    expect(dam?.document).toBeUndefined()
  })

  it('Java Foundations (sin acreditación verificable) no declara documento', () => {
    const java = education.find((item) => item.id === 'oracle-java-foundations')
    expect(java).toBeDefined()
    expect(java?.kind).toBe('certification')
    expect(java?.document).toBeUndefined()
  })

  it('los documentos solo usan dominios verificados o rutas locales /docs/ (D03)', () => {
    for (const item of education) {
      const src = item.document?.src
      if (src === undefined) continue
      const ok =
        src.startsWith('/portfolio/docs/') ||
        src.startsWith('https://www.credly.com/badges/') ||
        src.startsWith('https://catalog-education.oracle.com/')
      expect(ok, `src no verificado: ${src}`).toBe(true)
    }
  })

  it('los 6 cursos de OpenWebinars apuntan a los PDFs locales de /docs/', () => {
    const courses = education.filter((item) => item.kind === 'course')
    for (const course of courses) {
      expect(course.issuer).toBe('OpenWebinars')
      expect(course.document?.src).toMatch(/^\/portfolio\/docs\/[a-z0-9-]+\.pdf$/)
    }
  })

  it('todo PDF local declarado existe en public/docs/ (subida del propietario integrada, F7.3)', () => {
    for (const item of education) {
      const src = item.document?.src
      if (src !== undefined && src.startsWith('/portfolio/')) {
        const file = join(process.cwd(), 'public', src.slice('/portfolio/'.length))
        expect(existsSync(file), `falta: ${src}`).toBe(true)
      }
    }
  })
})

describe('utils/media — googleDriveEmbedUrl (F6.6)', () => {
  it('transforma una URL de visor de Drive a /preview', () => {
    expect(
      googleDriveEmbedUrl(
        'https://drive.google.com/file/d/10xcjIursyD_4zp_QVrOzWn6fM29CYCYr/view?usp=sharing',
      ),
    ).toBe('https://drive.google.com/file/d/10xcjIursyD_4zp_QVrOzWn6fM29CYCYr/preview')
  })

  it('devuelve null para URLs que no son de Drive (el visor las usa tal cual)', () => {
    expect(googleDriveEmbedUrl('/portfolio/docs/git.pdf')).toBeNull()
    expect(googleDriveEmbedUrl('https://www.credly.com/badges/83f4c08a/linked_in')).toBeNull()
    expect(googleDriveEmbedUrl('')).toBeNull()
  })
})
