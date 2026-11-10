import { describe, expect, it } from 'vitest'
import { extractYouTubeId } from '../src/utils/media'

describe('utils/media — extractYouTubeId (RF-11)', () => {
  it('extrae el ID de URLs watch', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extrae el ID de URLs share (youtu.be)', () => {
    expect(extractYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extrae el ID de URLs embed y shorts', () => {
    expect(extractYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(extractYouTubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('acepta un ID desnudo de 11 caracteres', () => {
    expect(extractYouTubeId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('devuelve null para URLs que no son de YouTube o IDs inválidos', () => {
    expect(extractYouTubeId('https://example.com/video')).toBeNull()
    expect(extractYouTubeId('')).toBeNull()
    expect(extractYouTubeId('short-id')).toBeNull()
    expect(extractYouTubeId('https://www.youtube.com/watch?v=tooshort')).toBeNull()
  })
})
