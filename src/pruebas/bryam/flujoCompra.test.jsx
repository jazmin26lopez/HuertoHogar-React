
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderizarApp } from './utilidades'
import { obtenerOrdenes } from '../../servicios/ordenesServicio'
import { obtenerCarrito } from '../../servicios/carritoServicio'

afterEach(() => {
  vi.restoreAllMocks()
})

// Agrega al carrito la primera oferta (Manzanas Fuji, 20% de descuento: $960)
async function agregarPrimeraOferta(usuario) {
  renderizarApp('/ofertas')

  const botones = screen.getAllByRole('button', { name: 'Agregar al carrito' })

  await usuario.click(botones[0])
}

async function completarCheckout(usuario, { pago = 'tarjeta' } = {}) {
  await usuario.type(screen.getByLabelText('Nombre'), 'Ana')
  await usuario.type(screen.getByLabelText('Apellidos'), 'Pérez Soto')
  await usuario.type(screen.getByLabelText('Correo'), 'ana@gmail.com')
  await usuario.type(screen.getByLabelText('Calle'), 'Los Crisantemos 123')
  await usuario.selectOptions(screen.getByLabelText('Región'), 'Región Metropolitana')
  await usuario.selectOptions(screen.getByLabelText('Comuna'), 'Santiago')
  await usuario.selectOptions(screen.getByLabelText(/Método de pago/), pago)
}

describe('flujo de compra completo', () => {
  it('agregar una oferta muestra el mensaje y la guarda en el carrito', async () => {
    const usuario = userEvent.setup()

    await agregarPrimeraOferta(usuario)

    expect(obtenerCarrito()).toMatchObject([{ id: 'FR001', cantidad: 1, precio: 960 }])
    expect(screen.getByRole('status')).toHaveTextContent('Manzanas Fuji se agregó al carrito')
  })

  it('el carrito muestra el producto con su precio de oferta y permite cambiar la cantidad', async () => {
    const usuario = userEvent.setup()

    await agregarPrimeraOferta(usuario)
    await usuario.click(screen.getByRole('link', { name: /Carrito \$/ }))

    expect(screen.getByRole('heading', { name: 'Carrito de compras' })).toBeInTheDocument()
    expect(screen.getByTestId('total-carrito').textContent.replace(/\s/g, '')).toBe('$960')

    await usuario.click(screen.getByRole('button', { name: 'Aumentar cantidad de Manzanas Fuji' }))

    expect(screen.getByLabelText('Cantidad de Manzanas Fuji')).toHaveValue(2)
    expect(screen.getByTestId('total-carrito').textContent.replace(/\s/g, '')).toBe('$1.920')

    await usuario.click(screen.getByRole('button', { name: 'Disminuir cantidad de Manzanas Fuji' }))

    expect(screen.getByLabelText('Cantidad de Manzanas Fuji')).toHaveValue(1)
  })

  it('la lista de productos de la página del carrito permite añadir productos', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/carrito')

    expect(screen.getByText(/Tu carrito está vacío/)).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: /Añadir Naranjas Valencia al carrito/ }))

    expect(screen.getByTestId('total-carrito').textContent.replace(/\s/g, '')).toBe('$1.000')
    expect(screen.getByRole('status')).toHaveTextContent('Naranjas Valencia se agregó al carrito')
    expect(obtenerCarrito()).toMatchObject([{ id: 'FR002', cantidad: 1, precio: 1000 }])
  })

  it('el carrito se conserva al recargar la página (localStorage)', async () => {
    const usuario = userEvent.setup()

    const primera = renderizarApp('/ofertas')

    await usuario.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[0])
    primera.unmount()

    renderizarApp('/carrito')

    expect(screen.getByLabelText('Cantidad de Manzanas Fuji')).toHaveValue(1)
  })

  it('eliminar el último producto deja el carrito vacío', async () => {
    const usuario = userEvent.setup()

    await agregarPrimeraOferta(usuario)
    await usuario.click(screen.getByRole('link', { name: /Carrito \$/ }))
    await usuario.click(screen.getByRole('button', { name: 'Eliminar' }))

    expect(screen.getByText(/Tu carrito está vacío/)).toBeInTheDocument()
    expect(obtenerCarrito()).toHaveLength(0)
  })

  it('"Limpiar" vacía todos los productos', async () => {
    const usuario = userEvent.setup()

    await agregarPrimeraOferta(usuario)
    await usuario.click(screen.getByRole('link', { name: /Carrito \$/ }))
    await usuario.click(screen.getByRole('button', { name: 'Limpiar' }))

    expect(screen.getByText(/Tu carrito está vacío/)).toBeInTheDocument()
  })

  it('un pago aprobado muestra la boleta, vacía el carrito y registra la orden', async () => {
    const usuario = userEvent.setup()

    await agregarPrimeraOferta(usuario)
    await usuario.click(screen.getByRole('link', { name: /Carrito \$/ }))
    await usuario.click(screen.getByRole('button', { name: 'Comprar ahora' }))
    await completarCheckout(usuario)
    await usuario.click(screen.getByRole('button', { name: /Pagar ahora/ }))

    expect(
      screen.getByRole('heading', { name: /Se ha realizado la compra. nro #20260001/ })
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveValue('Ana')
    expect(screen.getByLabelText('Apellidos')).toHaveValue('Pérez Soto')
    expect(obtenerCarrito()).toHaveLength(0)

    expect(obtenerOrdenes()).toHaveLength(1)
    expect(obtenerOrdenes()[0]).toMatchObject({ estado: 'pagada', subtotal: 960, envio: 3000, total: 3960 })
  })

  it('la boleta se puede imprimir y enviar por correo (simulado)', async () => {
    const usuario = userEvent.setup()
    const imprimir = vi.spyOn(window, 'print').mockImplementation(() => {})

    await agregarPrimeraOferta(usuario)
    await usuario.click(screen.getByRole('link', { name: /Carrito \$/ }))
    await usuario.click(screen.getByRole('button', { name: 'Comprar ahora' }))
    await completarCheckout(usuario, { pago: 'transferencia' })
    await usuario.click(screen.getByRole('button', { name: /Pagar ahora/ }))

    await usuario.click(screen.getByRole('button', { name: 'Imprimir boleta en PDF' }))
    expect(imprimir).toHaveBeenCalledTimes(1)

    await usuario.click(screen.getByRole('button', { name: 'Enviar boleta por email' }))
    expect(screen.getByRole('status')).toHaveTextContent('Boleta enviada a ana@gmail.com')
  })

  it('un pago rechazado muestra el error y conserva el carrito y los datos escritos', async () => {
    const usuario = userEvent.setup()

    await agregarPrimeraOferta(usuario)
    await usuario.click(screen.getByRole('link', { name: /Carrito \$/ }))
    await usuario.click(screen.getByRole('button', { name: 'Comprar ahora' }))
    await completarCheckout(usuario, { pago: 'tarjeta-rechazada' })
    await usuario.click(screen.getByRole('button', { name: /Pagar ahora/ }))

    expect(screen.getByRole('heading', { name: /No se pudo realizar el pago/ })).toBeInTheDocument()
    expect(obtenerCarrito()).toMatchObject([{ id: 'FR001', cantidad: 1, precio: 960 }])
    expect(obtenerOrdenes()[0].estado).toBe('fallida')

    // "Volver a realizar el pago" vuelve al checkout con los datos ya escritos
    await usuario.click(screen.getByRole('button', { name: 'Volver a realizar el pago' }))

    expect(screen.getByLabelText('Nombre')).toHaveValue('Ana')
    expect(screen.getByLabelText('Calle')).toHaveValue('Los Crisantemos 123')
    expect(screen.getByLabelText('Comuna')).toHaveValue('Santiago')
  })
})

describe('checkout', () => {
  it('con el carrito vacío no permite pagar', () => {
    renderizarApp('/checkout')

    expect(screen.getByText(/No tienes productos en el carrito/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Pagar ahora/ })).not.toBeInTheDocument()
  })

  it('con datos vacíos muestra los errores y no registra la orden', async () => {
    const usuario = userEvent.setup()

    await agregarPrimeraOferta(usuario)
    await usuario.click(screen.getByRole('link', { name: /Carrito \$/ }))
    await usuario.click(screen.getByRole('button', { name: 'Comprar ahora' }))
    await usuario.click(screen.getByRole('button', { name: /Pagar ahora/ }))

    expect(screen.getByText('Ingresa tu nombre.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa tu correo electrónico.')).toBeInTheDocument()
    expect(screen.getByText('Selecciona una región.')).toBeInTheDocument()
    expect(obtenerOrdenes()).toHaveLength(0)
  })

  it('el costo de envío cambia según el tipo de entrega elegido', async () => {
    const usuario = userEvent.setup()

    await agregarPrimeraOferta(usuario)
    await usuario.click(screen.getByRole('link', { name: /Carrito \$/ }))
    await usuario.click(screen.getByRole('button', { name: 'Comprar ahora' }))

    // Por defecto: despacho a domicilio ($3.000)
    expect(screen.getByTestId('total-pagar').textContent.replace(/\s/g, '')).toBe('$3.960')

    await usuario.click(screen.getByLabelText(/Retiro en tienda/))

    expect(screen.getByTestId('total-pagar').textContent.replace(/\s/g, '')).toBe('$960')
  })

  it('las comunas dependen de la región elegida', async () => {
    const usuario = userEvent.setup()

    await agregarPrimeraOferta(usuario)
    await usuario.click(screen.getByRole('link', { name: /Carrito \$/ }))
    await usuario.click(screen.getByRole('button', { name: 'Comprar ahora' }))

    const comuna = screen.getByLabelText('Comuna')

    expect(comuna).toBeDisabled()

    await usuario.selectOptions(screen.getByLabelText('Región'), 'Región Metropolitana')

    expect(comuna).toBeEnabled()
    expect(within(comuna).getByRole('option', { name: 'Maipú' })).toBeInTheDocument()
  })
})

describe('compra exitosa / fallida con datos inexistentes', () => {
  it('una orden que no existe muestra un aviso', () => {
    renderizarApp('/compra-exitosa?orden=999')

    expect(screen.getByRole('heading', { name: 'No encontramos esa compra' })).toBeInTheDocument()
  })

  it('un pago fallido que no existe muestra un aviso', () => {
    renderizarApp('/compra-fallida?orden=999')

    expect(screen.getByRole('heading', { name: 'No encontramos ese pago' })).toBeInTheDocument()
  })
})
