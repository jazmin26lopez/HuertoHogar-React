
import { usuariosIniciales } from '../datos/usuarios'
import { normalizarRun } from '../funciones/validaciones'

export const CLAVE_USUARIOS = 'huertohogar_usuarios'

// CRUD de usuarios sobre localStorage (simula la base de datos).

export function obtenerUsuarios() {
  try {
    const guardados = localStorage.getItem(CLAVE_USUARIOS)

    if (guardados !== null) {
      const usuarios = JSON.parse(guardados)

      if (Array.isArray(usuarios)) {
        return usuarios
      }
    }
  } catch (error) {
    console.error('Error al cargar los usuarios:', error)
  }

  return usuariosIniciales
}

export function guardarUsuarios(usuarios) {
  try {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
    return true
  } catch (error) {
    console.error('Error al guardar los usuarios:', error)
    return false
  }
}

export function obtenerUsuarioPorRun(run) {
  const buscado = normalizarRun(run)

  return obtenerUsuarios().find((usuario) => usuario.run === buscado)
}

// CREATE: lanza un Error con mensaje legible si el RUN o el correo ya existen
export function crearUsuario(datos) {
  const usuarios = obtenerUsuarios()
  const nuevo = { rol: 'Cliente', ...datos, run: normalizarRun(datos.run) }

  if (usuarios.some((u) => u.run === nuevo.run)) {
    throw new Error('Ya existe un usuario con ese RUN.')
  }

  if (usuarios.some((u) => u.correo.toLowerCase() === nuevo.correo.toLowerCase())) {
    throw new Error('Ya existe un usuario con ese correo.')
  }

  guardarUsuarios([...usuarios, nuevo])

  return nuevo
}

// UPDATE: devuelve el usuario actualizado o null si no existe
export function actualizarUsuario(run, cambios) {
  const usuarios = obtenerUsuarios()
  const objetivo = normalizarRun(run)
  const existente = usuarios.find((u) => u.run === objetivo)

  if (!existente) {
    return null
  }

  const correoNuevo = cambios.correo?.toLowerCase()

  if (
    correoNuevo &&
    usuarios.some((u) => u.run !== objetivo && u.correo.toLowerCase() === correoNuevo)
  ) {
    throw new Error('Ya existe un usuario con ese correo.')
  }

  // El RUN identifica al usuario: no se modifica
  const actualizado = { ...existente, ...cambios, run: existente.run }

  guardarUsuarios(usuarios.map((u) => (u.run === objetivo ? actualizado : u)))

  return actualizado
}

// DELETE: devuelve true si se eliminó
export function eliminarUsuario(run) {
  const usuarios = obtenerUsuarios()
  const objetivo = normalizarRun(run)
  const restantes = usuarios.filter((u) => u.run !== objetivo)

  guardarUsuarios(restantes)

  return restantes.length !== usuarios.length
}

// Login simulado: devuelve el usuario o undefined
export function autenticar(correo, contrasena) {
  return obtenerUsuarios().find(
    (u) => u.correo.toLowerCase() === String(correo).trim().toLowerCase() && u.contrasena === contrasena
  )
}
