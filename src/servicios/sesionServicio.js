
export const CLAVE_SESION = 'huertohogar_sesion'

// La sesión guarda el token JWT y los datos públicos del usuario (nunca la contraseña).
// Se usa localStorage para que la sesión sobreviva a recargar la página o cerrar el navegador;
// el token vence solo (lo controla el backend) y se valida en cada petición.

// Lee el contenido del token (la parte del medio) para saber cuándo vence.
// Es solo para decidir en el navegador; quien manda es el backend, que verifica la firma.
export function leerDatosToken(token) {
  try {
    const parte = token.split('.')[1]
    const base64 = parte.replace(/-/g, '+').replace(/_/g, '/')
    const texto = decodeURIComponent(
      atob(base64)
        .split('')
        .map((letra) => '%' + letra.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )

    return JSON.parse(texto)
  } catch {
    return null
  }
}

// Segundos que le quedan al token (0 si ya venció o no se puede leer)
export function segundosRestantes(token) {
  const datos = leerDatosToken(token)

  if (!datos?.exp) {
    return 0
  }

  return Math.max(0, Math.floor(datos.exp - Date.now() / 1000))
}

export function guardarSesion({ token, usuario }) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify({ token, usuario }))
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION)
}

// Devuelve { token, usuario } o null si no hay sesión, está dañada o el token ya venció
export function obtenerSesion() {
  try {
    const guardada = JSON.parse(localStorage.getItem(CLAVE_SESION))

    if (guardada?.token && guardada?.usuario && segundosRestantes(guardada.token) > 0) {
      return guardada
    }
  } catch {
    // contenido dañado: se trata como sin sesión
  }

  cerrarSesion()
  return null
}

export function obtenerToken() {
  return obtenerSesion()?.token ?? null
}

// Devuelve el usuario con sesión iniciada (sin contraseña) o null
export function obtenerUsuarioActual() {
  return obtenerSesion()?.usuario ?? null
}
