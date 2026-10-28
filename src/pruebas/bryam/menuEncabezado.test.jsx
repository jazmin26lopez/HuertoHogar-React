
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'

import EnlaceCarrito from '../../componentes/compras/EnlaceCarrito'
import MenuSesion from '../../componentes/usuarios/MenuSesion'
import useCarrito from '../../contextos/useCarrito'
import { renderizarConProveedores, manzanas } from './utilidades'
import { obtenerUsuarioActual } from '../../servicios/sesionServicio'

// Menú de prueba: lo mismo que Jazmín pondrá dentro de la lista <ul> de su encabezado.
function MenuDePrueba() {
  const { agregar } = useCarrito()

  return (
    <>
      <ul>
        <EnlaceCarrito />
        <MenuSesion />
      </ul>

      <button type="button" onClick={() => agregar(manzanas, 2)}>
        Simular agregar
      </button>
    </>
  )
}

function renderizarMenu() {
  return renderizarConProveedores(
    <Routes>
      <Route path="*" element={<MenuDePrueba />} />
    </Routes>
  )
}

async function iniciarSesionComo(usuario, correo, contrasena) {
  // El inicio de sesión real vive en SesionProvider; se simula con el mismo servicio
  const { autenticar } = await import('../../servicios/usuariosServicio')
  const { iniciarSesion } = await import('../../servicios/sesionServicio')

  iniciarSesion(autenticar(correo, contrasena))
  void usuario
}

describe('EnlaceCarrito', () => {
  it('muestra el total del carrito y se actualiza al agregar productos', async () => {
    const usuario = userEvent.setup()

    renderizarMenu()

    expect(screen.getByRole('link', { name: /Carrito \$0/ })).toHaveAttribute('href', '/carrito')

    await usuario.click(screen.getByRole('button', { name: 'Simular agregar' }))

    // 2 kilos de manzanas con 20% de descuento: 2 × $960
    expect(screen.getByRole('link', { name: /Carrito \$1\.920/ })).toBeInTheDocument()
  })
})

describe('MenuSesion', () => {
  it('sin sesión ofrece iniciar sesión y registrarse', () => {
    renderizarMenu()

    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/iniciar-sesion')
    expect(screen.getByRole('link', { name: 'Registrarse' })).toHaveAttribute('href', '/registro')
    expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).not.toBeInTheDocument()
  })

  it('con un cliente muestra su nombre y permite cerrar sesión', async () => {
    const usuario = userEvent.setup()

    await iniciarSesionComo(usuario, 'cliente@gmail.com', 'cliente12')
    renderizarMenu()

    expect(screen.getByText('Hola, Cliente')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Administración' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Iniciar sesión' })).not.toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }))

    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(obtenerUsuarioActual()).toBeNull()
  })

  it('con un administrador agrega el enlace de administración', async () => {
    const usuario = userEvent.setup()

    await iniciarSesionComo(usuario, 'admin@duoc.cl', 'admin123')
    renderizarMenu()

    expect(screen.getByRole('link', { name: 'Administración' })).toHaveAttribute('href', '/admin/usuarios')
  })
})
