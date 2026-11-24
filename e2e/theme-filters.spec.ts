import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('rva-portfolio-language', 'es')
  })
  await page.setViewportSize({ width: 1024, height: 900 })
  await page.goto('/')
})

/**
 * Temas (D18) e2e: estado real del navegador (sin mocks de matchMedia) —
 * html[data-theme] alterna y PERSISTE en localStorage entre recargas.
 */
test.describe('Temas (D18)', () => {
  test('arranca en oscuro y el toggle pasa a claro con persistencia', async ({ page }) => {
    /* Oscuro = estado base: SIN atributo data-theme (D18, tokens :root) */
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light')

    await page.getByRole('button', { name: 'Cambiar a modo claro' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('rva-portfolio-theme')))
      .toBe('light')

    /* Persistencia: tras recargar sigue claro */
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    /* Vuelta a oscuro: el atributo se elimina */
    await page.getByRole('button', { name: 'Cambiar a modo oscuro' }).click()
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light')
  })

  test('los iconos monocromos conservan el zoom hover en ambos temas', async ({ page }) => {
    const names = ['Meta Business Suite', 'Unity', 'GitHub', 'Codex', 'OpenCode']

    const verifyZoom = async () => {
      for (const name of names) {
        const item = page.locator('#stack li').filter({ hasText: new RegExp(`^${name}$`) })
        const icon = item.locator('[data-tech-icon]')
        await icon.hover()
        await expect(icon).toHaveCSS('transform', 'matrix(1.15, 0, 0, 1.15, 0, 0)')
      }
    }

    await verifyZoom()
    await expect(page.locator('#stack li').filter({ hasText: /^Google Gemini$/ })).toHaveCount(0)
    await page.mouse.move(0, 0)
    await page.getByRole('button', { name: 'Cambiar a modo claro' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await verifyZoom()
  })
})

/**
 * Filtros por categoría (F2.2): 5 categorías SIEMPRE visibles; Java y
 * Python no tienen proyectos hoy → estado vacío «0 proyectos».
 */
test.describe('Filtros por categoría', () => {
  test('categoría sin proyectos muestra «0 proyectos»', async ({ page }) => {
    await page.getByRole('button', { name: 'Java', exact: true }).click()
    await expect(page.getByText('0 proyectos')).toBeVisible()
  })

  test('categoría con proyectos muestra fichas y el recuento coincide', async ({ page }) => {
    await page.getByRole('button', { name: 'Web', exact: true }).click()
    const countText = await page
      .getByText(/\d+ proyectos/)
      .first()
      .textContent()
    const expected = Number.parseInt(countText?.match(/\d+/)?.[0] ?? '0', 10)
    expect(expected).toBeGreaterThan(0)
    const cards = page.locator('#projects').getByRole('button', { name: /^Abrir proyecto:/ })
    await expect(cards).toHaveCount(expected)
  })

  test('volver a todas restaura el catálogo completo', async ({ page }) => {
    const total = await page
      .locator('#projects')
      .getByRole('button', { name: /^Abrir proyecto:/ })
      .count()
    expect(total).toBeGreaterThan(0)

    await page.getByRole('button', { name: 'Java', exact: true }).click()
    await expect(page.getByText('0 proyectos')).toBeVisible()

    await page.getByRole('button', { name: 'Todas', exact: true }).click()
    const restored = await page
      .locator('#projects')
      .getByRole('button', { name: /^Abrir proyecto:/ })
      .count()
    expect(restored).toBe(total)
  })
})
