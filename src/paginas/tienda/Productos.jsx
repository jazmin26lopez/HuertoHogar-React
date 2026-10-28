
import { useState } from 'react'
import { productosIniciales } from '../../datos/productos'
import TarjetaProducto from '../../componentes/tienda/TarjetaProducto'

export default function Productos() {
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [mensaje, setMensaje] = useState('')

  const categorias = [
    'Todas',
    ...new Set(productosIniciales.map(p => p.categoria))
  ]

  const productosFiltrados = productosIniciales.filter(producto => {
    const coincideNombre = producto.nombre
      .toLocaleLowerCase('es-CL')
      .includes(busqueda.toLocaleLowerCase('es-CL'))

    const coincideCategoria =
      categoria === 'Todas' ||
      producto.categoria === categoria

    return coincideNombre && coincideCategoria
  })

  function agregarAlCarrito(producto) {
    setMensaje(
      `${producto.nombre} seleccionado para el carrito`
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

      <div className="row g-3 my-3">
        <div className="col-12 col-md-6">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-6">
          <select
            className="form-select"
            value={categoria}
            aria-label="Filtrar por categoría"
            onChange={e => setCategoria(e.target.value)}
          >
            {categorias.map(nombre => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {mensaje && (
        <div className="alert alert-info" role="status">
          {mensaje}
        </div>
      )}

      <div className="grid-productos">
        {productosFiltrados.map(producto => (
          <TarjetaProducto
            key={producto.id}
            producto={producto}
            alAgregar={agregarAlCarrito}
          />
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <p>No se encontraron productos.</p>
      )}
    </main>
  )
}
