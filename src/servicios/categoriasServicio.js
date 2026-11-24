
import { peticion } from './apiCliente'
import { cargarProductos } from './productosServicio'

// GET público
export async function listarCategorias() {
  return peticion('/categorias', { conToken: false })
}

// POST: solo Administrador
export async function crearCategoria(datos) {
  const resultado = await peticion('/categorias', {
    metodo: 'POST',
    cuerpo: datos
  })

  await cargarProductos()
  return resultado
}

// PUT: solo Administrador
export async function actualizarCategoria(id, datos) {
  const resultado = await peticion(`/categorias/${id}`, {
    metodo: 'PUT',
    cuerpo: datos
  })

  await cargarProductos()
  return resultado
}

// DELETE: solo Administrador
export async function eliminarCategoria(id) {
  await peticion(`/categorias/${id}`, {
    metodo: 'DELETE'
  })

  await cargarProductos()
}
