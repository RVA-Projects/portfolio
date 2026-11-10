import { render, screen } from '@testing-library/react'
import { App } from '../src/App'

describe('App (esqueleto Fase 3)', () => {
  it('renderiza la aplicación y la sección de presentación', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
