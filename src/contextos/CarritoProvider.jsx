
import { useCallback, useEffect, useMemo, useState } from 'react'

import { CarritoContexto } from './carritoContexto'
import { obtenerCarrito, guardarCarrito } from '../servicios/carritoServicio'
import {
  agregarItem,
  cambiarCantidadItem,
  quitarItem,
  calcularSubtotal,
  contarUnidades
} from '../funciones/carrito'

// Estado global del carrito: lo usan el encabezado, el catálogo, el detalle,
// la página del carrito y el checkout. Se guarda en localStorage.
export default function CarritoProvider({ children }) {
  const [items, setItems] = useState(obtenerCarrito)

  useEffect(() => {
    guardarCarrito(items)
  }, [items])

  // Devuelve true si se agregó algo (false si no hay stock suficiente)
  const agregar = useCallback(
    (producto, cantidad = 1) => {
      const nuevos = agregarItem(items, producto, cantidad)

      setItems(nuevos)

      return nuevos !== items
    },
    [items]
  )

  const cambiarCantidad = useCallback((id, cantidad) => {
    setItems((actuales) => cambiarCantidadItem(actuales, id, cantidad))
  }, [])

  const quitar = useCallback((id) => {
    setItems((actuales) => quitarItem(actuales, id))
  }, [])

  const vaciar = useCallback(() => {
    setItems([])
  }, [])

  const valor = useMemo(
    () => ({
      items,
      subtotal: calcularSubtotal(items),
      cantidadTotal: contarUnidades(items),
      agregar,
      cambiarCantidad,
      quitar,
      vaciar
    }),
    [items, agregar, cambiarCantidad, quitar, vaciar]
  )

  return (
    <CarritoContexto.Provider value={valor}>
      {children}
    </CarritoContexto.Provider>
  )
}
