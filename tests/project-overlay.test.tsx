import { beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { App } from '../src/App'
import styles from '../src/components/overlays/ProjectOverlay.module.css'

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
    openProject('Signature Application')
    // Flechas flotantes FUERA del panel (slot aside del Modal), a nivel pantalla
    const prev = screen.getByRole('button', { name: 'Proyecto anterior' })
    const next = screen.getByRole('button', { name: 'Proyecto siguiente' })
    // Primer proyecto del carrusel: prev deshabilitado
    expect(prev).toBeDisabled()
    fireEvent.click(next)
    // Cambia de proyecto manteniendo el overlay abierto (F6.4)
    expect(screen.getByRole('dialog', { name: 'Centro Médico Sector V' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'Signature Application' })).not.toBeInTheDocument()
  })

  it('el último proyecto (snake) tiene next deshabilitado y prev vuelve al anterior', () => {
    render(<App />)
    openProject('Snake')
    const next = screen.getByRole('button', { name: 'Proyecto siguiente' })
    expect(next).toBeDisabled()
    const prev = screen.getByRole('button', { name: 'Proyecto anterior' })
    expect(prev).toBeEnabled()
    fireEvent.click(prev)
    expect(screen.getByRole('dialog', { name: 'dawdam.top' })).toBeInTheDocument()
  })

  it('las flechas conservan su posición lateral aunque estén deshabilitadas (F4.1)', () => {
    render(<App />)
    // Primer proyecto: prev deshabilitado PERO mantiene la clase de posición
    openProject('Signature Application')
    const prev = screen.getByRole('button', { name: 'Proyecto anterior' })
    const next = screen.getByRole('button', { name: 'Proyecto siguiente' })
    expect(prev).toBeDisabled()
    expect(prev.className).toContain(styles.navPrev)
    expect(prev.className).toContain(styles.navArrow)
    expect(next.className).toContain(styles.navNext)

    // Último proyecto: next deshabilitado PERO mantiene la clase de posición
    openProject('Snake')
    const lastNext = screen.getByRole('button', { name: 'Proyecto siguiente' })
    expect(lastNext).toBeDisabled()
    expect(lastNext.className).toContain(styles.navNext)
    expect(screen.getByRole('button', { name: 'Proyecto anterior' }).className).toContain(
      styles.navPrev,
    )
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
