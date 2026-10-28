
import { useCallback, useMemo, useState } from 'react'

import { SesionContexto } from './sesionContexto'
import { autenticar } from '../servicios/usuariosServicio'
import {
  iniciarSesion as guardarSesion,
  cerrarSesion as borrarSesion,
  obtenerUsuarioActual
} from '../servicios/sesionServicio'

// Quién tiene la sesión iniciada. Lo usan el encabezado, el login y el checkout.
export default function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(obtenerUsuarioActual)

  // Devuelve el usuario si las credenciales son correctas, o null
  const iniciarSesion = useCallback((correo, contrasena) => {
    const encontrado = autenticar(correo, contrasena)

    if (!encontrado) {
      return null
    }

    guardarSesion(encontrado)
    setUsuario(obtenerUsuarioActual())

    return encontrado
  }, [])

  const cerrarSesion = useCallback(() => {
    borrarSesion()
    setUsuario(null)
  }, [])

  // Para el login automático después de registrarse
  const iniciarSesionConUsuario = useCallback((registrado) => {
    guardarSesion(registrado)
    setUsuario(obtenerUsuarioActual())
  }, [])

  const valor = useMemo(
    () => ({ usuario, iniciarSesion, iniciarSesionConUsuario, cerrarSesion }),
    [usuario, iniciarSesion, iniciarSesionConUsuario, cerrarSesion]
  )

  return (
    <SesionContexto.Provider value={valor}>
      {children}
    </SesionContexto.Provider>
  )
}
