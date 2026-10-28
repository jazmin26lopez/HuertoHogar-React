
import { useContext } from 'react'

import { CarritoContexto } from './carritoContexto'

// Uso: const { items, agregar, quitar, vaciar, cantidadTotal } = useCarrito()
export default function useCarrito() {
  const contexto = useContext(CarritoContexto)

  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de <CarritoProvider>')
  }

  return contexto
}
