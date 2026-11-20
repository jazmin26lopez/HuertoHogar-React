
import { useEffect, useState } from 'react'

import {
  cargarProductos,
  estadoCatalogo,
  suscribirseAProductos
} from '../servicios/productosServicio'

// Descarga el catálogo (productos y categorías) desde el backend al abrir la aplicación.
// Si no se puede, avisa arriba de la página para que no parezca que la tienda está vacía.
export default function CatalogoProvider({ children }) {
  const [error, setError] = useState(() => estadoCatalogo().error)

  useEffect(() => {
    const actualizar = () => setError(estadoCatalogo().error)

    const dejarDeEscuchar = suscribirseAProductos(actualizar)

    cargarProductos()

    return dejarDeEscuchar
  }, [])

  return (
    <>
      {error && (
        <div className="alert alert-warning text-center rounded-0 mb-0" role="alert">
          No se pudo cargar el catálogo: {error}{' '}
          <button type="button" className="btn btn-sm btn-outline-dark ms-2" onClick={cargarProductos}>
            Reintentar
          </button>
        </div>
      )}

      {children}
    </>
  )
}
