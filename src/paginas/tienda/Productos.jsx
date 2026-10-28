
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import {
  obtenerProductos,
  suscribirseAProductos
} from '../../servicios/productosServicio'

import TarjetaProducto from '../../componentes/tienda/TarjetaProducto'
import useCarrito from '../../contextos/useCarrito'

export default function Productos() {
  const [parametros] = useSearchParams()
  const categoria = parametros.get('categoria')
  const { agregar } = useCarrito()

  const [productos, setProductos] = useState(obtenerProductos)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    const actualizar = () => {
      setProductos(obtenerProductos())
    }

    actualizar()
    return suscribirseAProductos(actualizar)
  }, [])

  const productosFiltrados = productos.filter(
    (producto) =>
      !categoria || producto.categoria === categoria
  )

  function agregarAlCarrito(producto) {
    const agregado = agregar(producto)

    setMensaje(
      agregado
        ? `${producto.nombre} se agregó al carrito.`
        : `No hay más stock disponible de ${producto.nombre}.`
    )
  }

  return (
    <main className="container py-4 flex-grow-1">
      <h1 style={{ color: '#244D36' }}>
        {categoria || 'Nuestros Productos'}
      </h1>

      <p className="text-muted">
        {categoria
          ? 'Explora los productos disponibles en esta categoría.'
          : 'Frescura del campo directo a tu hogar.'}
      </p>

      <div className="d-flex gap-2 flex-wrap my-4">
        <Link
          to="/categorias"
          className="btn btn-outline-success"
        >
          ← Volver a categorías
        </Link>

        {categoria && (
          <Link
            to="/productos"
            className="btn btn-success"
          >
            Ver todos los productos
          </Link>
        )}
      </div>

      {mensaje && (
        <div className="alert alert-info" role="status">
          {mensaje}
        </div>
      )}

      <p className="text-muted">
        {productosFiltrados.length}
        {' '}
        {productosFiltrados.length === 1
          ? 'producto disponible'
          : 'productos disponibles'}
      </p>

      <div className="grid-productos">
        {productosFiltrados.map((producto) => (
          <TarjetaProducto
            key={producto.id}
            producto={producto}
            alAgregar={agregarAlCarrito}
          />
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <p className="text-muted mt-4">
          No hay productos registrados en esta categoría.
        </p>
      )}
    </main>
  )
}
