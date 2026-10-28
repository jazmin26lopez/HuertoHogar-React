
import { describe, it, expect } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderizarApp } from './utilidades'
import { obtenerCarrito } from '../../servicios/carritoServicio'

// Conexión entre la tienda (catálogo, detalle, encabezado) y el carrito

describe('integración tienda y carrito', () => {
  it('el encabezado muestra el carrito con su total y los enlaces de sesión', () => {
    renderizarApp('/')

    const encabezado = within(screen.getByRole('banner'))

    expect(encabezado.getByRole('link', { name: /Carrito \$0/ })).toHaveAttribute('href', '/carrito')
    expect(encabezado.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/iniciar-sesion')
    expect(encabezado.getByRole('link', { name: 'Registrarse' })).toHaveAttribute('href', '/registro')
  })

  it('"Agregar al carrito" del catálogo guarda el producto y actualiza el total del encabezado', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/productos')

    await usuario.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[0])

    expect(obtenerCarrito()).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveTextContent('se agregó al carrito')
    expect(
      within(screen.getByRole('banner')).queryByRole('link', { name: /Carrito \$0$/ })
    ).not.toBeInTheDocument()
  })

  it('"Agregar al carrito" del detalle agrega la cantidad elegida', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/productos/FR002')

    const cantidad = screen.getByLabelText('Cantidad')

    // El campo nunca queda vacío (vuelve a 1), por eso se reemplaza el texto seleccionado
    await usuario.type(cantidad, '2', { initialSelectionStart: 0, initialSelectionEnd: 1 })
    await usuario.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    expect(obtenerCarrito()).toMatchObject([{ id: 'FR002', cantidad: 2 }])
    expect(screen.getByRole('status')).toHaveTextContent('se agregó al carrito')
  })
})
