
import { calcularTotales } from '../funciones/carrito'

export const CLAVE_ORDENES = 'huertohogar_ordenes'
export const CLAVE_BORRADOR = 'huertohogar_checkout_borrador'

export function obtenerOrdenes() {
  try {
    const guardadas = localStorage.getItem(CLAVE_ORDENES)

    if (guardadas !== null) {
      const ordenes = JSON.parse(guardadas)

      if (Array.isArray(ordenes)) {
        return ordenes
      }
    }
  } catch (error) {
    console.error('Error al cargar las órdenes:', error)
  }

  return []
}

function guardarOrdenes(ordenes) {
  localStorage.setItem(CLAVE_ORDENES, JSON.stringify(ordenes))
}

export function obtenerOrdenPorId(id) {
  return obtenerOrdenes().find((orden) => orden.id === String(id))
}

// Crea una orden con número correlativo. estado: 'pagada' | 'fallida'
export function registrarOrden({ cliente, direccion, entrega, metodoPago, items, estado, usuarioRun = null }) {
  const ordenes = obtenerOrdenes()
  const numero = 20260000 + ordenes.length + 1
  const totales = calcularTotales(items, entrega.costo)

  const orden = {
    id: String(numero),
    codigo: `ORDER${numero}`,
    fecha: new Date().toISOString(),
    cliente,
    direccion,
    entrega,
    metodoPago,
    items,
    ...totales,
    estado,
    usuarioRun
  }

  guardarOrdenes([...ordenes, orden])

  return orden
}

// Cuando el pago falla se conservan los datos escritos para no volver a digitarlos.
export function guardarBorrador(datos) {
  sessionStorage.setItem(CLAVE_BORRADOR, JSON.stringify(datos))
}

export function obtenerBorrador() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_BORRADOR)) ?? null
  } catch {
    return null
  }
}

export function borrarBorrador() {
  sessionStorage.removeItem(CLAVE_BORRADOR)
}
