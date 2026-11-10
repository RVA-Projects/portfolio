import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// D01: el portfolio vive en el repo del anterior → base '/portfolio/'
export default defineConfig({
  base: '/portfolio/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
  },
})
