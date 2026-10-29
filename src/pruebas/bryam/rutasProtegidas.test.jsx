
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'

import { renderizarApp } from './utilidades'

// Las vistas de administración de productos solo las puede ver un administrador

const RUTAS_ADMIN = ['/admin', '/admin/productos', '/admin/reportes']

describe('rutas de administración protegidas', () => {
  it.each(RUTAS_ADMIN)('%s sin sesión lleva al inicio de sesión', (ruta) => {
    renderizarApp(ruta)

    expect(screen.getByRole('heading', { name: /Qué bueno verte/ })).toBeInTheDocument()
  })

  it.each(RUTAS_ADMIN)('%s con un cliente muestra "Acceso restringido"', (ruta) => {
    localStorage.setItem('huertohogar_sesion', '111111111')

    renderizarApp(ruta)

    expect(screen.getByRole('heading', { name: 'Acceso restringido' })).toBeInTheDocument()
  })

  it.each(RUTAS_ADMIN)('%s con un administrador muestra la página', (ruta) => {
    localStorage.setItem('huertohogar_sesion', '123456785')

    renderizarApp(ruta)

    expect(screen.queryByRole('heading', { name: 'Acceso restringido' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Qué bueno verte/ })).not.toBeInTheDocument()
  })
})
