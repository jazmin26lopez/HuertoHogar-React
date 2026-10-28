
export const CLAVE_MENSAJES = 'huertohogar_mensajes'

export function obtenerMensajes() {
  try {
    const guardado = localStorage.getItem(CLAVE_MENSAJES)

    if (guardado !== null) {
      const mensajes = JSON.parse(guardado)

      if (Array.isArray(mensajes)) {
        return mensajes
      }
    }
  } catch (error) {
    console.error('Error al cargar los mensajes de contacto:', error)
  }

  return []
}

// Guarda el mensaje en localStorage (no hay servidor). Devuelve true si se pudo guardar.
export function guardarMensaje({ nombre, correo, asunto, mensaje }) {
  try {
    const mensajes = obtenerMensajes()

    mensajes.push({
      id: mensajes.length + 1,
      fecha: new Date().toISOString(),
      nombre: nombre.trim(),
      correo: correo.trim(),
      asunto: asunto.trim(),
      mensaje: mensaje.trim()
    })

    localStorage.setItem(CLAVE_MENSAJES, JSON.stringify(mensajes))

    return true
  } catch (error) {
    console.error('Error al guardar el mensaje de contacto:', error)
    return false
  }
}
