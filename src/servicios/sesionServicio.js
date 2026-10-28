
import { obtenerUsuarioPorRun } from './usuariosServicio'

export const CLAVE_SESION = 'huertohogar_sesion'

// La sesión solo guarda el RUN; los datos se leen siempre del usuario actual,
// así no queda una copia de la contraseña en la sesión.

export function iniciarSesion(usuario) {
  localStorage.setItem(CLAVE_SESION, usuario.run)
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION)
}

// Devuelve el usuario con sesión iniciada (sin contraseña) o null
export function obtenerUsuarioActual() {
  const run = localStorage.getItem(CLAVE_SESION)

  if (!run) {
    return null
  }

  const usuario = obtenerUsuarioPorRun(run)

  if (!usuario) {
    return null
  }

  const publico = { ...usuario }
  delete publico.contrasena

  return publico
}
