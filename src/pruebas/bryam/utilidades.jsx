
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import SesionProvider from '../../contextos/SesionProvider'
import CarritoProvider from '../../contextos/CarritoProvider'
import App from '../../App'

// Productos de ejemplo para las pruebas (no dependen del catálogo real)
export const manzanas = {
  id: 'FR001', // tiene 20% de descuento: paga $960
  nombre: 'Manzanas Fuji',
  precio: 1200,
  unidad: 'kilo',
  imagen: '/imagenes/manzanas.jpg'
}

export const naranjas = {
  id: 'FR002', // sin oferta
  nombre: 'Naranjas Valencia',
  precio: 1000,
  unidad: 'kilo',
  imagen: '/imagenes/naranjas.jpg',
  stock: 3
}

// Muestra un componente con router y los contextos de carrito y sesión,
// igual que en la aplicación real (ver main.jsx).
export function renderizarConProveedores(ui, { ruta = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <SesionProvider>
        <CarritoProvider>{ui}</CarritoProvider>
      </SesionProvider>
    </MemoryRouter>
  )
}

// Muestra la aplicación completa (encabezado + rutas + pie) en una ruta dada.
export function renderizarApp(ruta = '/') {
  return renderizarConProveedores(<App />, { ruta })
}
