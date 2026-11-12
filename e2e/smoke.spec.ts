import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  /* Español estable (la elección manual persiste; D12) */
  await page.addInitScript(() => {
    window.localStorage.setItem('rva-portfolio-language', 'es')
  })
})

/**
 * Humo + responsive (Fase 8): 375/768/1024/1440 — sin scroll horizontal
 * accidental y con el disparador del menú SIEMPRE accesible (D22).
 */
for (const width of [375, 768, 1024, 1440]) {
  test(`viewport ${width}px: carga sin scroll horizontal y menú accesible`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')

    /* Nombre e identidad visibles */
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    /* Sin scroll horizontal */
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)

    /* Menú y toggle de tema accesibles en cualquier punto de la página */
    await page.keyboard.press('End')
    await page.waitForTimeout(300)
    const menuButton = page.getByRole('button', { name: 'Abrir menú de navegación' })
    await expect(menuButton).toBeVisible()
    await expect(menuButton).toBeEnabled()

    /* Secciones principales presentes (contact pendiente de F6.8: aún null) */
    for (const id of ['projects', 'experience', 'education', 'languages']) {
      await expect(page.locator(`#${id}`)).toBeAttached()
    }
  })
}
