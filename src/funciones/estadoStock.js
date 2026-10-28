
export const LIMITE_STOCK_CRITICO = 5

export function obtenerEstadoStock(stock) {
  if (
    stock === null ||
    stock === undefined ||
    stock === ''
  ) {
    return {
      nombre: 'Sin definir',
      clase: 'bg-secondary',
      nivel: 'sin-definir'
    }
  }

  const cantidad = Number(stock)

  if (
    !Number.isInteger(cantidad) ||
    cantidad < 0
  ) {
    return {
      nombre: 'Sin definir',
      clase: 'bg-secondary',
      nivel: 'sin-definir'
    }
  }

  if (cantidad === 0) {
    return {
      nombre: 'Agotado',
      clase: 'bg-danger',
      nivel: 'agotado'
    }
  }

  if (cantidad <= LIMITE_STOCK_CRITICO) {
    return {
      nombre: 'Stock crítico',
      clase: 'bg-warning text-dark',
      nivel: 'critico'
    }
  }

  return {
    nombre: 'Disponible',
    clase: 'bg-success',
    nivel: 'disponible'
  }
}
