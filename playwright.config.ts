import { defineConfig } from '@playwright/test'

/**
 * e2e/responsive (Fase 8, plan original): pruebas contra el BUILD real
 * (vite preview tras vite build, base '/portfolio/'). Chromium únicamente:
 * los viewports 375/768/1024/1440 se emulan por proyecto de test.
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  use: {
    baseURL: 'http://localhost:4173/portfolio/',
    /* Escenario determinista (D18): arranque en oscuro en los tests. */
    colorScheme: 'dark',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/portfolio/',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
