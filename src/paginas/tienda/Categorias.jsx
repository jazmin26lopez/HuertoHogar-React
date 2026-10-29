
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
    const actualizar = () => {
      setProductos(obtenerProductos())
    }

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
    <main className="pagina-categorias flex-grow-1">
      <div className="categorias-contenedor">

        {/* ENCABEZADO */}
        <header className="categorias-encabezado">
          <p className="categorias-etiqueta">
            HUERTOHOGAR
          </p>

          <h1>Categorías de productos</h1>

          <p className="categorias-descripcion">
            Explora nuestros productos frescos y selecciona
            la categoría que prefieras.
          </p>
        </header>

        {/* TARJETAS */}
        {categorias.length > 0 ? (
          <div className="categorias-grid">
            {categorias.map((categoria) => (
              <article
                className="categoria-tarjeta"
                key={categoria.nombre}
              >
                <img
                  src={categoria.imagen}
                  alt={categoria.nombre}
                  className="categoria-imagen"
                />

                <div className="categoria-contenido">
                  <h2>{categoria.nombre}</h2>

                  <p>
                    {categoria.cantidad}{' '}
                    {categoria.cantidad === 1
                      ? 'producto disponible'
                      : 'productos disponibles'}
                  </p>

                  <Link
                    to={`/productos?categoria=${encodeURIComponent(
                      categoria.nombre
                    )}`}
                    className="categoria-boton"
                  >
                    Ver productos
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="categorias-vacio">
            <h2>No hay categorías disponibles</h2>
            <p>
              Actualmente no hay categorías registradas
              en el catálogo.
            </p>
          </div>
        )}

      </div>
    </main>
  )
}
