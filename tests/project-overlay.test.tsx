import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { App } from '../src/App'

beforeEach(() => {
  cleanup()
  window.localStorage.clear()
  window.localStorage.setItem('rva-portfolio-language', 'es')
})

function openProject(name: string) {
  fireEvent.click(screen.getByRole('button', { name: `Abrir proyecto: ${name}` }))
  return screen.getByRole('dialog', { name })
}

describe('ProjectOverlay (RF-10/RF-12/RF-13/RF-14)', () => {
  it('abre el overlay al pulsar una tarjeta y muestra info accesible', () => {
    render(<App />)
    const dialog = openProject('Signature Application')
    expect(
      within(dialog).getByRole('heading', { name: 'Signature Application' }),
    ).toBeInTheDocument()
    expect(within(dialog).getByRole('region', { name: 'Galería del proyecto' })).toBeInTheDocument()
    expect(within(dialog).getByText('Objetivo')).toBeInTheDocument()
  })

  it('navega entre proyectos con prev/next SIN cerrar y respeta extremos', () => {
    render(<App />)
    const dialog = openProject('Signature Application')
    const prev = within(dialog).getByRole('button', { name: 'Proyecto anterior' })
    const next = within(dialog).getByRole('button', { name: 'Proyecto siguiente' })
    // Primer proyecto del carrusel: prev deshabilitado
    expect(prev).toBeDisabled()
    fireEvent.click(next)
    // Cambia de proyecto manteniendo el overlay abierto (F6.4)
    expect(screen.getByRole('dialog', { name: 'Centro Médico Sector V' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'Signature Application' })).not.toBeInTheDocument()
  })

  it('el último proyecto (snake) tiene next deshabilitado y prev vuelve al anterior', () => {
    render(<App />)
    const dialog = openProject('Snake')
    const next = within(dialog).getByRole('button', { name: 'Proyecto siguiente' })
    expect(next).toBeDisabled()
    const prev = within(dialog).getByRole('button', { name: 'Proyecto anterior' })
    expect(prev).toBeEnabled()
    fireEvent.click(prev)
    expect(screen.getByRole('dialog', { name: 'dawdam.top' })).toBeInTheDocument()
  })

  it('cierra con Escape y con el botón de cerrar (restaura el foco al DOM)', () => {
    render(<App />)
    openProject('Task Manager')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    openProject('MiniCRM')
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar detalles del proyecto' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('muestra los enlaces existentes del proyecto (sin inventar repos)', () => {
    render(<App />)
    const dialog = openProject('Loki Home')
    const link = within(dialog).getByRole('link', { name: 'Ver sitio web' })
    expect(link).toHaveAttribute('href', 'https://lokihome.com/')
    // MiniCRM no tiene enlaces declarados: no debe renderizarlos (TODO F7)
    const crmDialog = openProject('MiniCRM')
    expect(within(crmDialog).queryAllByRole('link')).toHaveLength(0)
  })
})
