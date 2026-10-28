
import { useContext } from 'react'

import { SesionContexto } from './sesionContexto'

// Uso: const { usuario, iniciarSesion, cerrarSesion } = useSesion()
export default function useSesion() {
  const contexto = useContext(SesionContexto)

  if (!contexto) {
    throw new Error('useSesion debe usarse dentro de <SesionProvider>')
  }

  return contexto
}
