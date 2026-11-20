
import { obtenerToken } from './sesionServicio'

// Dirección del backend. Se puede cambiar con la variable VITE_API_URL (archivo .env).
export const URL_API = import.meta.env.VITE_API_URL ?? 'http://localhost:8085/api/v1'

// Error de una llamada a la API. "estado" es el código HTTP (0 si no hubo conexión).
export class ErrorApi extends Error {
  constructor(mensaje, estado) {
    super(mensaje)
    this.name = 'ErrorApi'
    this.estado = estado
  }
}

// El contexto de sesión se registra aquí para enterarse cuando el backend rechaza el token (401).
let alExpirarSesion = null

export function registrarAlExpirarSesion(funcion) {
  alExpirarSesion = funcion
}

function mensajePorEstado(estado) {
  switch (estado) {
    case 400:
      return 'Los datos enviados no son válidos.'
    case 401:
      return 'Tu sesión no es válida o expiró. Inicia sesión nuevamente.'
    case 403:
      return 'No tienes permiso para realizar esta acción.'
    case 404:
      return 'No se encontró lo que buscabas.'
    case 409:
      return 'Ya existe un registro con esos datos.'
    default:
      return 'Ocurrió un error en el servidor. Intenta nuevamente.'
  }
}

// Hace una llamada a la API con fetch.
//  - agrega el token (Authorization: Bearer ...) cuando hay sesión, salvo conToken: false
//  - devuelve el JSON de la respuesta (o null si viene vacía)
//  - si falla, lanza un ErrorApi con un mensaje legible
export async function peticion(ruta, { metodo = 'GET', cuerpo, conToken = true } = {}) {
  const cabeceras = { Accept: 'application/json' }
  const token = conToken ? obtenerToken() : null

  if (cuerpo !== undefined) {
    cabeceras['Content-Type'] = 'application/json'
  }

  if (token) {
    cabeceras.Authorization = `Bearer ${token}`
  }

  let respuesta

  try {
    respuesta = await fetch(`${URL_API}${ruta}`, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined
    })
  } catch {
    throw new ErrorApi(
      'No se pudo conectar con el servidor. Revisa que el backend esté encendido.',
      0
    )
  }

  const texto = await respuesta.text()
  let datos

  try {
    datos = texto ? JSON.parse(texto) : null
  } catch {
    datos = null
  }

  if (!respuesta.ok) {
    // Con un token enviado, un 401 significa que la sesión ya no sirve
    if (respuesta.status === 401 && token) {
      alExpirarSesion?.()
    }

    throw new ErrorApi(datos?.message || mensajePorEstado(respuesta.status), respuesta.status)
  }

  return datos
}
