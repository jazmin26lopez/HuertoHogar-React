
// Descuentos vigentes: código de producto -> porcentaje de descuento.
// Si luego el catálogo guarda sus propias ofertas, solo hay que cambiar esta tabla.
export const DESCUENTOS_OFERTA = {
  FR001: 20,
  VR001: 15,
  PO001: 10,
  PL001: 12
}

export function porcentajeOferta(producto) {
  return DESCUENTOS_OFERTA[producto?.id] ?? 0
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
