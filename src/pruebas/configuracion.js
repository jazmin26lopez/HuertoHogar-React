// Se ejecuta antes de cada archivo de pruebas (ver "setupFiles" en vite.config.js).
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom no implementa window.scrollTo (lo usa ScrollArriba al cambiar de página)
window.scrollTo = () => {}

afterEach(() => {
  // Desmonta los componentes y deja el almacenamiento limpio entre pruebas
  cleanup()
  localStorage.clear()
  sessionStorage.clear()
})
