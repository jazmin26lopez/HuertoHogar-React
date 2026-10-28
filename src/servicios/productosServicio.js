
import { productosIniciales } from '../datos/productos'

const CLAVE_PRODUCTOS = 'huertohogar_productos'
const EVENTO_PRODUCTOS = 'huertohogar_productos_actualizados'

// Obtener productos guardados o utilizar el catálogo original
export function obtenerProductos() {
  try {
    const guardados = localStorage.getItem(CLAVE_PRODUCTOS)

    if (guardados !== null) {
      const productos = JSON.parse(guardados)

      if (Array.isArray(productos)) {
        return productos
      }
    }
  } catch (error) {
    console.error('Error al cargar los productos:', error)
  }

  return productosIniciales
}

// Guardar cambios de la administración
export function guardarProductos(productos) {
  if (!Array.isArray(productos)) {
    return false
  }

  try {
    localStorage.setItem(
      CLAVE_PRODUCTOS,
      JSON.stringify(productos)
    )

    window.dispatchEvent(new Event(EVENTO_PRODUCTOS))
    return true
  } catch (error) {
    console.error('Error al guardar los productos:', error)
    return false
  }
}

// Buscar un producto por su código
export function obtenerProductoPorId(id) {
  return obtenerProductos().find(
    (producto) => producto.id === id
  )
}

// Avisar a los componentes cuando cambie el catálogo
export function suscribirseAProductos(actualizar) {
  window.addEventListener(EVENTO_PRODUCTOS, actualizar)
  window.addEventListener('storage', actualizar)

  return () => {
    window.removeEventListener(EVENTO_PRODUCTOS, actualizar)
    window.removeEventListener('storage', actualizar)
  }
}
