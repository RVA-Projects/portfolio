import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  /* Español estable (la elección manual persiste; D12) */
  await page.addInitScript(() => {
    window.localStorage.setItem('rva-portfolio-language', 'es')
  })
})

/**
 * Humo + responsive (Fase 8): 375/768/1024/1440 — sin scroll horizontal
 * accidental y con la navegación horizontal SIEMPRE visible (ronda 5 F2).
 */
for (const width of [375, 768, 1024, 1440]) {
  test(`viewport ${width}px: carga sin scroll horizontal y nav accesible`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')

    /* Nombre e identidad visibles */
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    /* Sin scroll horizontal */
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)

    /* Navegación permanente visible y clicable en cualquier punto de la página */
    await page.keyboard.press('End')
    await page.waitForTimeout(300)
    const nav = page.getByRole('navigation', { name: 'Navegación principal' })
    await expect(nav).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Formación' })).toBeEnabled()

    /* Secciones principales presentes */
    for (const id of ['projects', 'stack', 'experience', 'education', 'languages']) {
      await expect(page.locator(`#${id}`)).toBeAttached()
    }
  })
}
