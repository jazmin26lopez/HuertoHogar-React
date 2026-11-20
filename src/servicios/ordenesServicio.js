
import { peticion } from './apiCliente'
import { obtenerProductoPorId } from './productosServicio'

export const CLAVE_ORDENES = 'huertohogar_ordenes'
export const CLAVE_BORRADOR = 'huertohogar_checkout_borrador'

// La compra se guarda en la base de datos como una boleta (POST /boletas).
// Como el backend solo deja leer boletas ajenas al Administrador y al Vendedor, el comprobante
// de la compra recién hecha se guarda también en el navegador, para mostrar la pantalla de
// "compra exitosa" o "compra fallida" sin volver a pedirla.

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

// Registra la compra en el backend. estado: 'pagada' | 'fallida' (resultado del pago simulado).
// Devuelve la orden con los totales y precios calculados por el backend.
// Lanza un Error con mensaje legible si algo falla (sin stock, sesión vencida, sin conexión...).
export async function registrarOrden({ cliente, direccion, entrega, metodoPago, items, estado }) {
  // El backend identifica los productos por su número (productoId), no por el código FR001
  const productos = items.map((item) => ({
    productoId: item.productoId ?? obtenerProductoPorId(item.id)?.productoId,
    cantidad: item.cantidad
  }))

  if (productos.some((producto) => !producto.productoId)) {
    throw new Error('Algunos productos de tu carrito ya no están disponibles. Revisa tu carrito.')
  }

  const respuesta = await peticion('/boletas', {
    metodo: 'POST',
    cuerpo: {
      nombreCliente: cliente.nombre,
      apellidosCliente: cliente.apellidos,
      correoCliente: cliente.correo,
      calle: direccion.calle,
      departamento: direccion.departamento || null,
      region: direccion.region,
      comuna: direccion.comuna,
      indicaciones: direccion.indicaciones || null,
      tipoEntrega: entrega.id,
      metodoPago,
      pagoAprobado: estado === 'pagada',
      productos
    }
  })

  const { boleta, detalles } = respuesta

  // Precios finales según el backend (ya con el descuento aplicado)
  const itemsConPrecio = items.map((item, posicion) => {
    const detalle = detalles.find((d) => d.productoId === productos[posicion].productoId)

    return detalle ? { ...item, precio: Number(detalle.precioUnitario) } : item
  })

  const orden = {
    id: String(boleta.boletaId),
    codigo: boleta.codigo,
    // La fecha la pone la base de datos al guardar; la respuesta del POST aún no la trae
    fecha: boleta.fechaBoleta ?? new Date().toISOString(),
    cliente,
    direccion,
    entrega,
    metodoPago,
    items: itemsConPrecio,
    subtotal: Number(boleta.subtotal),
    envio: Number(boleta.costoEnvio),
    total: Number(boleta.total),
    estado: boleta.estado === 'PAGADA' ? 'pagada' : 'fallida'
  }

  guardarOrdenes([...obtenerOrdenes().filter((o) => o.id !== orden.id), orden])

  return orden
}

// --- Consulta de órdenes (Administrador y Vendedor) ---

// GET /boletas: todas las boletas con sus detalles
export async function listarBoletas() {
  return peticion('/boletas')
}

// GET /boletas/{id}: una boleta con sus detalles
export async function obtenerBoleta(id) {
  return peticion(`/boletas/${id}`)
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
