
import { useEffect, useState } from 'react'
import {
  obtenerProductos,
  suscribirseAProductos
} from '../../servicios/productosServicio'
import TarjetaProducto from '../../componentes/tienda/TarjetaProducto'

export default function Productos() {
  const [productos, setProductos] = useState(obtenerProductos)
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [mensaje, setMensaje] = useState('')

  // Actualizar el catálogo cuando cambian los productos
  useEffect(() => {
    const actualizarProductos = () => {
      setProductos(obtenerProductos())
    }

    actualizarProductos()

    return suscribirseAProductos(actualizarProductos)
  }, [])

  // Obtener las categorías disponibles
  const categorias = [
    'Todas',
    ...new Set(productos.map((producto) => producto.categoria))
  ]

  // Filtrar productos por nombre y categoría
  const productosFiltrados = productos.filter((producto) => {
    const coincideNombre = producto.nombre
      .toLocaleLowerCase('es-CL')
      .includes(busqueda.toLocaleLowerCase('es-CL').trim())

    const coincideCategoria =
      categoria === 'Todas' ||
      producto.categoria === categoria

    return coincideNombre && coincideCategoria
  })

  // Aviso temporal hasta integrar el carrito de Bryam
  function agregarAlCarrito(producto) {
    setMensaje(
      `${producto.nombre}: la función de compra estará disponible al integrar el carrito.`
    )
  }

  return (
    <main className="container py-4 flex-grow-1">
      <h1>Nuestros Productos</h1>

      <p>
        Frescura del campo directo a tu hogar.
        Encuentra frutas, verduras, productos
        orgánicos y lácteos.
      </p>

      {/* Búsqueda y categorías */}
      <div className="row g-3 my-3">
        <div className="col-12 col-md-6">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            value={busqueda}
            onChange={(evento) =>
              setBusqueda(evento.target.value)
            }
          />
        </div>

        <div className="col-12 col-md-6">
          <select
            className="form-select"
            value={categoria}
            aria-label="Filtrar por categoría"
            onChange={(evento) =>
              setCategoria(evento.target.value)
            }
          >
            {categorias.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Aviso de integración del carrito */}
      {mensaje && (
        <div
          className="alert alert-info"
          role="status"
        >
          {mensaje}
        </div>
      )}

      {/* Cantidad de productos encontrados */}
      <p className="text-muted">
        Productos encontrados: {productosFiltrados.length}
      </p>

      {/* Catálogo de productos */}
      <div className="grid-productos">
        {productosFiltrados.map((producto) => (
          <TarjetaProducto
            key={producto.id}
            producto={producto}
            alAgregar={agregarAlCarrito}
          />
        ))}
      </div>

      {/* Sin resultados */}
      {productosFiltrados.length === 0 && (
        <p className="text-muted mt-4">
          No se encontraron productos con los filtros seleccionados.
        </p>
      )}
    </main>
  )
}
