import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

function openSnake() {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'Abrir proyecto: Snake' }))
  return screen.getByRole('dialog', { name: 'Snake' })
}

describe('Modo juego embebido (RF-10/F7, playUrl de snake)', () => {
  it('solo snake ofrece «Jugar ahora» y carga el despliegue público en el overlay', () => {
    const dialog = openSnake()
    const play = within(dialog).getByRole('button', { name: 'Jugar ahora' })
    fireEvent.click(play)
    const frame = within(dialog).getByTitle('Snake')
    expect(frame.getAttribute('src')).toBe('https://rva-projects.github.io/snake/')
  })

  it('en modo juego NO hay flechas flotantes de navegación entre proyectos', () => {
    const dialog = openSnake()
    expect(screen.getByRole('button', { name: 'Proyecto anterior' })).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Jugar ahora' }))
    expect(screen.queryByRole('button', { name: 'Proyecto anterior' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Proyecto siguiente' })).not.toBeInTheDocument()
  })

  it('un clic fuera del panel (backdrop) NO cierra el overlay mientras se juega', () => {
    const dialog = openSnake()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Jugar ahora' }))
    fireEvent.click(dialog.parentElement as Element)
    expect(screen.getByRole('dialog', { name: 'Snake' })).toBeInTheDocument()
  })

  it('Escape en modo juego cierra SOLO el juego; el overlay sigue abierto', () => {
    const dialog = openSnake()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Jugar ahora' }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByRole('dialog', { name: 'Snake' })).toBeInTheDocument()
    // Ha vuelto a la vista del proyecto: el juego ya no está embebido
    expect(within(dialog).queryByTitle('Snake')).not.toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Jugar ahora' })).toBeInTheDocument()
  })

  it('«Cerrar juego» vuelve a la vista del proyecto sin cerrar el overlay', () => {
    const dialog = openSnake()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Jugar ahora' }))
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cerrar juego' }))
    expect(screen.getByRole('dialog', { name: 'Snake' })).toBeInTheDocument()
    expect(within(dialog).queryByTitle('Snake')).not.toBeInTheDocument()
  })

  it('tras salir del modo juego, el clic en el backdrop vuelve a cerrar el overlay', () => {
    const dialog = openSnake()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Jugar ahora' }))
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cerrar juego' }))
    fireEvent.click(dialog.parentElement as Element)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
