import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('rva-portfolio-language', 'es')
  })
})

test('el Clicker queda centrado en móvil y conserva el extremo derecho en escritorio', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  const mobile = await page.locator('[class*="clicker"]').first().boundingBox()
  const mobileIntro = await page.locator('#intro [class*="quickLinks"]').boundingBox()
  expect(mobile).not.toBeNull()
  expect(mobileIntro).not.toBeNull()
  expect(
    Math.abs(mobile!.x + mobile!.width / 2 - (mobileIntro!.x + mobileIntro!.width / 2)),
  ).toBeLessThanOrEqual(1)

  await page.setViewportSize({ width: 1440, height: 900 })
  const desktop = await page.locator('[class*="clicker"]').first().boundingBox()
  const desktopIntro = await page.locator('#intro [class*="quickLinks"]').boundingBox()
  expect(desktop).not.toBeNull()
  expect(desktopIntro).not.toBeNull()
  expect(
    Math.abs(desktopIntro!.x + desktopIntro!.width - (desktop!.x + desktop!.width)),
  ).toBeLessThanOrEqual(1)
})

test('recupera el total tras recargar y cada clic hace un hit único', async ({ page }) => {
  let persistedValue = 42
  await page.route('https://abacus.jasoncameron.dev/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname
    if (pathname.includes('/stream/')) {
      await route.abort()
      return
    }
    if (pathname.includes('/hit/')) persistedValue += 1
    await route.fulfill({ json: { value: persistedValue } })
  })

  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  const count = page.getByTitle('Recuento de clicks')
  const visibleCount = () => count.evaluate((element) => element.firstChild?.textContent)
  await expect.poll(visibleCount).toBe('42')
  await page.reload()
  await expect.poll(visibleCount).toBe('42')

  const clicker = page.getByRole('button', { name: 'Clicker: añade un clic' })
  await clicker.click()
  await clicker.click()
  await clicker.click()
  await expect.poll(visibleCount).toBe('45')
  await page.reload()
  await expect.poll(visibleCount).toBe('45')
})
