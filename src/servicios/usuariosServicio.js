
import { peticion } from './apiCliente'
import { normalizarRun } from '../funciones/validaciones'

// CRUD de usuarios contra el backend (/api/v1/usuarios). Solo lo puede usar un Administrador.
// Cada usuario se identifica con "usuarioId" (el número que entrega la base de datos).

// Convierte lo que escribe el formulario en lo que espera la API.
// Los campos opcionales vacíos se envían como null; al editar, una contraseña vacía no se cambia.
function paraApi(datos) {
  const cuerpo = {
    run: normalizarRun(datos.run),
    nombre: datos.nombre,
    apellidos: datos.apellidos,
    correo: datos.correo,
    fechaNacimiento: datos.fechaNacimiento || null,
    region: datos.region || null,
    comuna: datos.comuna || null,
    direccion: datos.direccion || null,
    rol: datos.rol
  }

  if (datos.contrasena) {
    cuerpo.contrasena = datos.contrasena
  }

  return cuerpo
}

// READ: todos los usuarios
export function listarUsuarios() {
  return peticion('/usuarios')
}

// READ: un usuario por su id
export function obtenerUsuario(id) {
  return peticion(`/usuarios/${id}`)
}

// CREATE: el backend responde 409 si el RUN o el correo ya existen
export function crearUsuario(datos) {
  return peticion('/usuarios', { metodo: 'POST', cuerpo: paraApi(datos) })
}

// UPDATE: el RUN no se puede cambiar
export function actualizarUsuario(id, datos) {
  return peticion(`/usuarios/${id}`, { metodo: 'PUT', cuerpo: paraApi(datos) })
}

// DELETE: el backend no borra al usuario, lo desactiva (activo = "N") y ya no puede iniciar sesión
export function desactivarUsuario(id) {
  return peticion(`/usuarios/${id}`, { metodo: 'DELETE' })
}
