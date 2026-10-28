
import { precioConOferta } from './ofertas'

// Opciones de entrega del checkout
export const OPCIONES_ENTREGA = [
  { id: 'retiro', nombre: 'Retiro en tienda', costo: 0 },
  { id: 'domicilio', nombre: 'Despacho a domicilio', costo: 3000 }
]

// Stock máximo que se puede comprar. Si el catálogo no informa stock, no hay tope.
export function limiteStock(producto) {
  const stock = producto?.stock

  if (stock === null || stock === undefined || stock === '') {
    return Infinity
  }

  const cantidad = Number(stock)

  return Number.isInteger(cantidad) && cantidad >= 0 ? cantidad : Infinity
}

// Todas las funciones siguientes son "puras": no modifican el arreglo recibido,
// devuelven uno nuevo (así React detecta el cambio de estado).

export function agregarItem(items, producto, cantidad = 1) {
  const limite = limiteStock(producto)
  const existente = items.find((item) => item.id === producto.id)
  const actual = existente ? existente.cantidad : 0
  const nueva = Math.min(actual + cantidad, limite)

  if (cantidad < 1 || nueva <= actual) {
    return items
  }

  // "stock: null" significa sin límite (Infinity no sobrevive a JSON.stringify)
  const stock = Number.isFinite(limite) ? limite : null

  if (existente) {
    return items.map((item) =>
      item.id === producto.id ? { ...item, cantidad: nueva, stock } : item
    )
  }

  return [
    ...items,
    {
      id: producto.id,
      nombre: producto.nombre,
      imagen: producto.imagen,
      unidad: producto.unidad,
      precio: precioConOferta(producto),
      precioNormal: Number(producto.precio),
      stock,
      cantidad: nueva
    }
  ]
}

export function cambiarCantidadItem(items, id, cantidad) {
  const entero = Math.trunc(Number(cantidad))

  if (!Number.isFinite(entero)) {
    return items
  }

  return items.map((item) => {
    if (item.id !== id) {
      return item
    }

    const tope = item.stock ?? Infinity

    return { ...item, cantidad: Math.min(Math.max(entero, 1), tope) }
  })
}

export function quitarItem(items, id) {
  return items.filter((item) => item.id !== id)
}

export function calcularSubtotalItem(item) {
  return item.precio * item.cantidad
}

export function calcularSubtotal(items) {
  return items.reduce((suma, item) => suma + calcularSubtotalItem(item), 0)
}

export function contarUnidades(items) {
  return items.reduce((suma, item) => suma + item.cantidad, 0)
}

export function calcularTotales(items, costoEnvio = 0) {
  const subtotal = calcularSubtotal(items)

  return {
    subtotal,
    envio: costoEnvio,
    total: subtotal + costoEnvio
  }
}

// Pago simulado (no hay pasarela real). El método "tarjeta-rechazada" existe
// para poder demostrar la vista de pago fallido.
export const METODOS_PAGO = [
  { id: 'tarjeta', nombre: 'Tarjeta de crédito o débito' },
  { id: 'transferencia', nombre: 'Transferencia bancaria' },
  { id: 'tarjeta-rechazada', nombre: 'Tarjeta de prueba (será rechazada)' }
]

export function simularPago(metodo) {
  return { aprobado: metodo !== 'tarjeta-rechazada' }
}
