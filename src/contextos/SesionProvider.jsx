
import { useCallback, useEffect, useMemo, useState } from 'react'

import { SesionContexto } from './sesionContexto'
import { registrarAlExpirarSesion } from '../servicios/apiCliente'
import {
  iniciarSesionApi,
  registrarApi,
  obtenerPerfil,
  renovarToken
} from '../servicios/authServicio'
import {
  CLAVE_SESION,
  guardarSesion,
  cerrarSesion as borrarSesion,
  obtenerSesion,
  obtenerUsuarioActual,
  segundosRestantes
} from '../servicios/sesionServicio'

// Se renueva el token cuando le quedan menos de 10 minutos; se revisa cada minuto.
const RENOVAR_SI_QUEDAN_SEGUNDOS = 10 * 60
const REVISAR_CADA_MS = 60 * 1000

// Quién tiene la sesión iniciada. Lo usan el encabezado, el login, las rutas protegidas y el checkout.
//  - al cargar la página lee la sesión guardada, así sobrevive a una recarga
//  - la comprueba con el backend (GET /auth/me) por si el token ya no sirve o el rol cambió
//  - renueva el token antes de que venza (POST /auth/refresh)
//  - si el backend rechaza el token (401) o se cierra sesión en otra pestaña, cierra la sesión
export default function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(obtenerUsuarioActual)

  const cerrarSesion = useCallback(() => {
    borrarSesion()
    setUsuario(null)
  }, [])

  // Guarda la respuesta de login, registro o renovación y deja al usuario en sesión
  const abrirSesion = useCallback((respuesta) => {
    guardarSesion({ token: respuesta.token, usuario: respuesta.usuario })
    setUsuario(respuesta.usuario)

    return respuesta.usuario
  }, [])

  // Devuelve el usuario si las credenciales son correctas; si no, lanza un ErrorApi
  const iniciarSesion = useCallback(
    async (correo, contrasena) => abrirSesion(await iniciarSesionApi(correo, contrasena)),
    [abrirSesion]
  )

  // Crea una cuenta de Cliente y deja la sesión iniciada
  const registrarse = useCallback(
    async (datos) => abrirSesion(await registrarApi(datos)),
    [abrirSesion]
  )

  // Si cualquier llamada recibe 401 con un token enviado, la sesión ya no sirve
  useEffect(() => {
    registrarAlExpirarSesion(cerrarSesion)

    return () => registrarAlExpirarSesion(null)
  }, [cerrarSesion])

  // Al cargar la página: comprueba la sesión guardada y actualiza los datos del usuario.
  // Si el backend responde 401, apiCliente cierra la sesión; si no hay conexión, se conserva.
  useEffect(() => {
    if (!obtenerSesion()) {
      return undefined
    }

    let activo = true

    obtenerPerfil()
      .then((perfil) => {
        const actual = obtenerSesion()

        if (activo && actual) {
          guardarSesion({ token: actual.token, usuario: perfil })
          setUsuario(perfil)
        }
      })
      .catch(() => {})

    return () => {
      activo = false
    }
  }, [])

  // Renovación automática del token mientras haya sesión
  const haySesion = Boolean(usuario)

  useEffect(() => {
    if (!haySesion) {
      return undefined
    }

    async function revisar() {
      const actual = obtenerSesion()

      if (!actual) {
        cerrarSesion()
        return
      }

      if (segundosRestantes(actual.token) < RENOVAR_SI_QUEDAN_SEGUNDOS) {
        try {
          abrirSesion(await renovarToken())
        } catch {
          // un 401 ya cierra la sesión; otros errores se reintentan en la próxima revisión
        }
      }
    }

    const temporizador = setInterval(revisar, REVISAR_CADA_MS)

    return () => clearInterval(temporizador)
  }, [haySesion, abrirSesion, cerrarSesion])

  // Si en otra pestaña se inicia o cierra sesión, esta pestaña se entera
  useEffect(() => {
    function alCambiarAlmacenamiento(evento) {
      if (evento.key === CLAVE_SESION || evento.key === null) {
        setUsuario(obtenerUsuarioActual())
      }
    }

    window.addEventListener('storage', alCambiarAlmacenamiento)

    return () => window.removeEventListener('storage', alCambiarAlmacenamiento)
  }, [])

  const valor = useMemo(
    () => ({ usuario, iniciarSesion, registrarse, cerrarSesion }),
    [usuario, iniciarSesion, registrarse, cerrarSesion]
  )

  return (
    <SesionContexto.Provider value={valor}>
      {children}
    </SesionContexto.Provider>
  )
}
