import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

describe('ProjectsSection (RF-06/RF-07/RF-08)', () => {
  it('muestra 9 proyectos con el filtro All', () => {
    render(<App />)
    expect(screen.getByText('9 proyectos')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Carrusel de proyectos' })).toBeInTheDocument()
  })

  it('filtra por categoría Android y actualiza el contador (F2.2)', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Android' }))
    expect(screen.getByText('2 proyectos')).toBeInTheDocument()
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
  })

  it('las 5 categorías están SIEMPRE visibles, incluso Python/Java con 0 proyectos', () => {
    render(<App />)
    for (const label of ['Android', 'Web', 'C#', 'Python', 'Java']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
    fireEvent.click(screen.getByRole('button', { name: 'Python' }))
    expect(screen.getByText('0 proyectos')).toBeInTheDocument()
  })

  it('el botón Todas restaura la colección completa', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Web' }))
    expect(screen.getByText('5 proyectos')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Todas' }))
    expect(screen.getByText('9 proyectos')).toBeInTheDocument()
  })

  it('el carrusel navega con botones prev/next y se deshabilita en extremos', () => {
    render(<App />)
    const prev = screen.getByRole('button', { name: 'Desplazar a proyectos anteriores' })
    const next = screen.getByRole('button', { name: 'Desplazar a proyectos siguientes' })
    expect(prev).toBeDisabled()
    expect(next).toBeEnabled()
    fireEvent.scroll(screen.getByRole('region', { name: 'Carrusel de proyectos' }))
  })
})
