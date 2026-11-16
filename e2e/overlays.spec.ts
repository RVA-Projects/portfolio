import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('rva-portfolio-language', 'es')
  })
  await page.setViewportSize({ width: 1024, height: 900 })
  await page.goto('/')
})

/**
 * Overlays e2e (Fase 8): ficha de proyecto (con capa de zoom y jerarquía
 * de Escape), experiencia («Ver proyecto») y navegación por anclas.
 */
test.describe('Ficha de proyecto', () => {
  test('abre y cierra con Escape (1ª pulsación)', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir proyecto: Loki Home' }).click()
    const dialog = page.getByRole('dialog', { name: 'Loki Home' })
    await expect(dialog).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('zoom (D21): lupa abre la capa; Escape ×2 — 1ª capa, 2ª overlay', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir proyecto: Loki Home' }).click()
    const dialog = page.getByRole('dialog', { name: 'Loki Home' })
    await expect(dialog).toBeVisible()

    await dialog.getByRole('button', { name: 'Ampliar imagen' }).click()
    const layer = page.getByRole('button', { name: 'Cerrar visor ampliado' })
    await expect(layer).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(layer).toBeHidden()
    await expect(dialog).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('prev/next de proyecto navega entre fichas (teclado ←/→)', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir proyecto: Loki Home' }).click()
    const dialog = page.getByRole('dialog', { name: 'Loki Home' })
    await expect(dialog).toBeVisible()

    await page.keyboard.press('ArrowRight')
    await expect(dialog).toBeHidden()
    await expect(page.locator('[role="dialog"]')).toBeVisible()
  })
})

test.describe('Experiencia', () => {
  test('overlay de experiencia abre la ficha de su proyecto asociado', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir experiencia: Loki Home' }).click()
    const dialog = page.getByRole('dialog', { name: 'Loki Home' })
    await expect(dialog).toBeVisible()

    await dialog.getByRole('button', { name: 'Ver proyecto: Loki Home' }).click()
    /* El overlay de experiencia se cierra y abre el de proyecto (D20) */
    await expect(page.getByRole('dialog', { name: 'Loki Home' })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Galería del proyecto' })).toBeVisible()
  })

  test('cierra con Escape', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir experiencia: Smarti DATA — vía Upwork' }).click()
    const dialog = page.getByRole('dialog', { name: 'Smarti DATA — vía Upwork' })
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })
})

test.describe('Navegación por anclas (RF-04 + ronda 5 F2)', () => {
  test('la nav permanente navega a Proyectos por ancla', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Navegación principal' })
    await expect(nav).toBeVisible()

    await nav.getByRole('link', { name: 'Proyectos' }).click()

    const projects = page.locator('#projects')
    await expect(projects).toBeInViewport()
  })

  test('la barra fija SIEMPRE es visible al final del scroll (D-B)', async ({ page }) => {
    await page.keyboard.press('End')
    await page.waitForTimeout(600)
    const nav = page.getByRole('navigation', { name: 'Navegación principal' })
    await expect(nav).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Idiomas' })).toBeEnabled()
  })
})
