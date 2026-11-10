import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

describe('ProjectsSection (RF-06/RF-07/RF-08)', () => {
  it('muestra 8 proyectos con el filtro All', () => {
    render(<App />)
    expect(screen.getByText('8 proyectos')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Galería del proyecto' })).toBeInTheDocument()
  })

  it('filtra por tecnología y actualiza el contador', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Kotlin' }))
    expect(screen.getByText('2 proyectos')).toBeInTheDocument()
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
  })

  it('el botón All restaura la colección completa', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'WordPress' }))
    fireEvent.click(screen.getByRole('button', { name: 'Todas' }))
    expect(screen.getByText('8 proyectos')).toBeInTheDocument()
  })

  it('el carrusel navega con botones prev/next y se deshabilita en extremos', () => {
    render(<App />)
    const prev = screen.getByRole('button', { name: 'Proyecto anterior' })
    const next = screen.getByRole('button', { name: 'Proyecto siguiente' })
    expect(prev).toBeDisabled()
    expect(next).toBeEnabled()
    fireEvent.scroll(screen.getByRole('region', { name: 'Galería del proyecto' }))
  })
})
