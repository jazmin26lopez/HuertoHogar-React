
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  obtenerProductos,
  suscribirseAProductos
} from '../../servicios/productosServicio'

const imagenesCategorias = {
  'Frutas Frescas': '/imagenes/frutosFrescos.jpg',
  'Verduras Orgánicas': '/imagenes/zanahorias.jpg',
  'Productos Orgánicos': '/imagenes/producto-organico.jpg',
  'Productos Lácteos': '/imagenes/leche.jpg'
}

export default function Categorias() {
  const [productos, setProductos] = useState(obtenerProductos)

  useEffect(() => {
    const actualizar = () => setProductos(obtenerProductos())
    actualizar()
    return suscribirseAProductos(actualizar)
  }, [])

  const categorias = [
    ...new Set(productos.map((producto) => producto.categoria))
  ].map((nombre) => ({
    nombre,
    cantidad: productos.filter(
      (producto) => producto.categoria === nombre
    ).length,
    imagen:
      imagenesCategorias[nombre] ||
      '/imagenes/placeholder.svg'
  }))

  return (
    <main className="container py-4 flex-grow-1">
      <h1>Categorías de productos</h1>

      <p className="text-muted mb-4">
        Explora nuestros productos frescos y selecciona
        la categoría que prefieras.
      </p>

      <div className="row g-4">
        {categorias.map((categoria) => (
          <div
            className="col-12 col-sm-6 col-lg-3"
            key={categoria.nombre}
          >
            <article className="card h-100 shadow-sm">
              <img
                src={categoria.imagen}
                alt={categoria.nombre}
                className="card-img-top"
                style={{
                  height: '180px',
                  objectFit: 'cover'
                }}
              />

              <div className="card-body d-flex flex-column">
                <h2 className="h5">
                  {categoria.nombre}
                </h2>

                <p className="text-muted">
                  {categoria.cantidad} productos
                </p>

                <Link
                  to={`/productos?categoria=${encodeURIComponent(
                    categoria.nombre
                  )}`}
                  className="btn btn-success mt-auto"
                >
                  Ver productos
                </Link>
              </div>
            </article>
          </div>
        ))}
      </div>

      {categorias.length === 0 && (
        <p>No hay categorías disponibles.</p>
      )}
    </main>
  )
}
