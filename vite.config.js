import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // jsdom simula el navegador (DOM, localStorage) dentro de Node
    environment: 'jsdom',
    setupFiles: './src/pruebas/configuracion.js',
    include: ['src/pruebas/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/pruebas/**', 'src/main.jsx']
    }
  }
})
