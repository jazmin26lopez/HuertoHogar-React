import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  obtenerProductoPorId,
  estadoCatalogo,
  suscribirseAProductos
} from '../../servicios/productosServicio'
import { obtenerEstadoStock } from '../../funciones/estadoStock'
import { esOferta, porcentajeOferta, precioConOferta } from '../../funciones/ofertas'
import { formatearPrecio } from '../../funciones/formato'

// Detalle de un producto dentro del panel. Es de solo consulta: no tiene botón de compra,
// por eso es la pantalla de detalle que ve el Vendedor.
export default function DetalleProductoPanel() {
  const { id } = useParams()

  const [producto, setProducto] = useState(() => obtenerProductoPorId(id))

  // Sirve para volver a dibujar cuando termina la descarga del catálogo, aunque el producto no exista
  const [, actualizarVista] = useState(0)

  // El catálogo viene de la API: se actualiza cuando termina de cargar o cambia
  useEffect(() => {
    const actualizar = () => {
      setProducto(obtenerProductoPorId(id))
      actualizarVista((n) => n + 1)
    }

    actualizar()

    return suscribirseAProductos(actualizar)
  }, [id])

  const volver = (
    <Link to="/admin/productos" className="btn btn-outline-success mb-4">
      ← Volver a productos
    </Link>
  )

  if (!producto && !estadoCatalogo().cargado) {
    return (
      <main className="container py-5 flex-grow-1">
        <p role="status">Cargando producto...</p>
      </main>
    )
  }

  if (!producto) {
    return (
      <main className="container py-5 flex-grow-1">
        {volver}

        <h1>Producto no encontrado</h1>

        <p>El producto solicitado no existe o fue desactivado.</p>
      </main>
    )
  }

  const estadoStock = obtenerEstadoStock(producto.stock)
  const enOferta = esOferta(producto)

  return (
    <main className="container py-5 flex-grow-1">
      {volver}

      <div className="row g-4 align-items-start">
        <div className="col-12 col-md-6">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded shadow-sm w-100"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>

        <div className="col-12 col-md-6">
          <h1 className="mb-2">{producto.nombre}</h1>

          <p className="text-muted mb-3">
            Código: {producto.id} · Categoría: {producto.categoria}
          </p>

          <h2 className="mb-2" style={{ color: '#2E8B57' }}>
            {formatearPrecio(Number(producto.precio))} / {producto.unidad}
          </h2>

          {enOferta && (
            <p className="mb-3">
              <span className="badge bg-danger me-2">-{porcentajeOferta(producto)}%</span>
              Precio con oferta: <strong>{formatearPrecio(precioConOferta(producto))}</strong>
            </p>
          )}

          <p>{producto.descripcion || 'Sin descripción.'}</p>

          {producto.origen && (
            <p>
              <strong>Origen: </strong>
              {producto.origen}
            </p>
          )}

          <div className="mb-3">
            <strong>Estado del producto: </strong>
            <span className={`badge ${estadoStock.clase}`}>{estadoStock.nombre}</span>
          </div>

          <p>
            <strong>Stock disponible: </strong>
            {estadoStock.nivel === 'sin-definir' ? 'No informado' : `${producto.stock} unidades`}
          </p>

          <p className="text-muted small mb-0">Vista de solo consulta.</p>
        </div>
      </div>
    </main>
  )
}
