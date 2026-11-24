
// Descuentos de respaldo: código de producto -> porcentaje.
// El descuento real viene del backend (campo descuentoOferta de cada producto, que el catálogo
// entrega como producto.descuento); esta tabla solo se usa si el producto no trae ese dato.
export const DESCUENTOS_OFERTA = {
  FR001: 20,
  VR001: 15,
  PO001: 10,
  PL001: 12
}

export function porcentajeOferta(producto) {
  return producto?.descuento ?? DESCUENTOS_OFERTA[producto?.id] ?? 0
}

export function esOferta(producto) {
  return porcentajeOferta(producto) > 0
}

// Precio que realmente paga el cliente (con descuento si corresponde).
export function precioConOferta(producto) {
  const precio = Number(producto.precio)
  const descuento = porcentajeOferta(producto)

  return Math.round(precio * (1 - descuento / 100))
}
