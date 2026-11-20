
import { peticion } from './apiCliente'
import { normalizarRun } from '../funciones/validaciones'

// Llamadas de autenticación al backend (/api/v1/auth). Todas devuelven { token, usuario, ... }
// excepto obtenerPerfil, que devuelve solo el usuario.

export function iniciarSesionApi(correo, contrasena) {
  return peticion('/auth/login', {
    metodo: 'POST',
    conToken: false,
    cuerpo: { correo: String(correo).trim(), contrasena }
  })
}

// El registro público siempre crea un Cliente: el backend ignora cualquier rol que se envíe.
export function registrarApi(datos) {
  return peticion('/auth/registro', {
    metodo: 'POST',
    conToken: false,
    cuerpo: {
      run: normalizarRun(datos.run),
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      correo: datos.correo,
      contrasena: datos.contrasena,
      fechaNacimiento: datos.fechaNacimiento || null,
      region: datos.region || null,
      comuna: datos.comuna || null,
      direccion: datos.direccion || null
    }
  })
}

// Datos actuales del usuario logueado (sirve para comprobar que el token sigue siendo válido)
export function obtenerPerfil() {
  return peticion('/auth/me')
}

// Cambia el token por uno nuevo mientras el actual siga vigente
export function renovarToken() {
  return peticion('/auth/refresh', { metodo: 'POST' })
}
