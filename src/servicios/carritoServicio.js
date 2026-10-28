
export const CLAVE_CARRITO = 'huertohogar_carrito'

export function obtenerCarrito() {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO)

    if (guardado !== null) {
      const items = JSON.parse(guardado)

      if (Array.isArray(items)) {
        return items
      }
    }
  } catch (error) {
    console.error('Error al cargar el carrito:', error)
  }

  return []
}

export function guardarCarrito(items) {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items))
    return true
  } catch (error) {
    console.error('Error al guardar el carrito:', error)
    return false
  }
}
