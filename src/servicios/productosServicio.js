
import { peticion } from './apiCliente'

// Catálogo de productos y categorías, que vive en la base de datos (backend).
//
// Para que las pantallas no cambien, el catálogo se guarda en memoria apenas se descarga:
//  - cargarProductos() lo pide a la API (GET /productos y GET /categorias) y avisa a las pantallas
//  - obtenerProductos() y obtenerProductoPorId() leen esa copia, igual que antes
//  - suscribirseAProductos() permite a una pantalla enterarse cuando el catálogo se actualiza
// Los cambios del panel de administración (crear, editar, desactivar) van a la API y luego recargan.

const EVENTO_PRODUCTOS = 'huertohogar_productos_actualizados'

let productos = []
let categorias = []
let estado = { cargado: false, cargando: false, error: '' }

function avisar() {
  window.dispatchEvent(new Event(EVENTO_PRODUCTOS))
}

// Convierte un producto de la API en el formato que usan las pantallas
//   API: productoId, codigo, categoriaId, unidadMedida, descuentoOferta ...
//   Pantallas: id (el código, p. ej. FR001), categoria (el nombre), unidad, descuento ...
export function desdeApi(producto, listaCategorias = categorias) {
  const categoria = listaCategorias.find((c) => c.categoriaId === producto.categoriaId)

  return {
    id: producto.codigo,
    productoId: producto.productoId,
    nombre: producto.nombre,
    categoria: categoria?.nombre ?? '',
    categoriaId: producto.categoriaId,
    precio: Number(producto.precio),
    unidad: producto.unidadMedida,
    stock: producto.stock,
    imagen: producto.imagen,
    descripcion: producto.descripcion ?? '',
    origen: producto.origen ?? '',
    descuento: producto.descuentoOferta ?? 0
  }
}

// Convierte lo que escribe el administrador en lo que espera la API
export function haciaApi(producto) {
  return {
    codigo: producto.id,
    nombre: producto.nombre,
    categoriaId: Number(producto.categoriaId),
    precio: Number(producto.precio),
    stock: Number(producto.stock),
    unidadMedida: producto.unidad,
    origen: producto.origen || null,
    descripcion: producto.descripcion || null,
    imagen: producto.imagen || null,
    descuentoOferta: Number(producto.descuento) || 0
  }
}

// Descarga el catálogo desde la API. Si falla, deja el mensaje en estadoCatalogo().error
export async function cargarProductos() {
  estado = { ...estado, cargando: true, error: '' }
  avisar()

  try {
    // Las consultas son públicas, no necesitan sesión
    const [listaCategorias, listaProductos] = await Promise.all([
      peticion('/categorias', { conToken: false }),
      peticion('/productos', { conToken: false })
    ])

    categorias = listaCategorias
    productos = listaProductos.map((p) => desdeApi(p, listaCategorias))
    estado = { cargado: true, cargando: false, error: '' }
  } catch (error) {
    estado = { cargado: true, cargando: false, error: error.message }
  }

  avisar()
}

export function obtenerProductos() {
  return productos
}

// Buscar un producto por su código (FR001, VR002...)
export function obtenerProductoPorId(id) {
  return productos.find((producto) => producto.id === id)
}

export function obtenerCategorias() {
  return categorias
}

// { cargado, cargando, error }: sirve para mostrar "Cargando..." o el aviso de error
export function estadoCatalogo() {
  return estado
}

// Avisar a los componentes cuando cambie el catálogo
export function suscribirseAProductos(actualizar) {
  window.addEventListener(EVENTO_PRODUCTOS, actualizar)

  return () => window.removeEventListener(EVENTO_PRODUCTOS, actualizar)
}

// --- Administración (solo Administrador) ---

// CREATE: POST /productos
export async function crearProducto(producto) {
  await peticion('/productos', { metodo: 'POST', cuerpo: haciaApi(producto) })
  await cargarProductos()
}

// UPDATE: PUT /productos/{productoId}
export async function actualizarProducto(productoId, producto) {
  await peticion(`/productos/${productoId}`, { metodo: 'PUT', cuerpo: haciaApi(producto) })
  await cargarProductos()
}

// DELETE: DELETE /productos/{productoId}. El backend lo desactiva, deja de aparecer en la tienda
export async function desactivarProducto(productoId) {
  await peticion(`/productos/${productoId}`, { metodo: 'DELETE' })
  await cargarProductos()
}
