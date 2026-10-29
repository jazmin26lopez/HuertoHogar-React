
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
    <main className="pagina-productos flex-grow-1">
      <div className="productos-contenedor">

        {/* ENCABEZADO */}
        <header className="productos-encabezado">
          <p className="productos-etiqueta">
            {categoria ? 'CATEGORÍA SELECCIONADA' : 'HUERTOHOGAR'}
          </p>

          <h1>
            {categoria || 'Nuestros productos'}
          </h1>

          <p className="productos-descripcion">
            {categoria
              ? 'Explora los productos disponibles en esta categoría.'
              : 'Frescura del campo directo a tu hogar.'}
          </p>
        </header>

        {/* NAVEGACIÓN */}
        <div className="productos-acciones">
          <Link
            to="/categorias"
            className="productos-boton productos-boton-secundario"
          >
            ← Volver a categorías
          </Link>

          {categoria && (
            <Link
              to="/productos"
              className="productos-boton productos-boton-principal"
            >
              Ver todos los productos
            </Link>
          )}
        </div>

        {/* MENSAJE DEL CARRITO */}
        {mensaje && (
          <div className="alert alert-info" role="status">
            {mensaje}
          </div>
        )}

        {/* CANTIDAD DE PRODUCTOS */}
        <p className="productos-cantidad">
          {productosFiltrados.length}{' '}
          {productosFiltrados.length === 1
            ? 'producto disponible'
            : 'productos disponibles'}
        </p>

        {/* CATÁLOGO */}
        {productosFiltrados.length > 0 ? (
          <div className="grid-productos">
            {productosFiltrados.map((producto) => (
              <TarjetaProducto
                key={producto.id}
                producto={producto}
                alAgregar={agregarAlCarrito}
              />
            ))}
          </div>
        ) : (
          <div className="productos-vacio">
            <h2>No hay productos disponibles</h2>
            <p>
              Actualmente no hay productos registrados en
              esta categoría.
            </p>
            <Link
              to="/productos"
              className="productos-boton productos-boton-principal"
            >
              Ver catálogo completo
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}
