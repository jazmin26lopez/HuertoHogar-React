
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  obtenerProductoPorId,
  suscribirseAProductos
} from '../../servicios/productosServicio'

import {
  obtenerEstadoStock
} from '../../funciones/estadoStock'

export default function DetalleProducto() {
  const { id } = useParams()

  const [producto, setProducto] = useState(
    () => obtenerProductoPorId(id)
  )

  const [cantidad, setCantidad] = useState(1)

  // Mantener la información sincronizada con administración
  useEffect(() => {
    const actualizarProducto = () => {
      setProducto(obtenerProductoPorId(id))
    }

    actualizarProducto()

    return suscribirseAProductos(actualizarProducto)
  }, [id])

  if (!producto) {
    return (
      <main className="container py-5 flex-grow-1">
        <h1>Producto no encontrado</h1>

        <p>
          El producto solicitado no existe en nuestro catálogo.
        </p>

        <Link to="/productos" className="btn btn-success">
          Volver al catálogo
        </Link>
      </main>
    )
  }

  const precio = Number(producto.precio)
  const estadoStock = obtenerEstadoStock(producto.stock)

  const stock =
    estadoStock.nivel === 'sin-definir'
      ? null
      : Number(producto.stock)

  const sinStock = estadoStock.nivel === 'agotado'

  const cantidadAplicada =
    stock === null
      ? cantidad
      : sinStock
        ? 0
        : Math.min(cantidad, stock)

  const precioFormateado = (valor) =>
    '$' + Number(valor).toLocaleString('es-CL')

  function cambiarCantidad(evento) {
    const valor = Number(evento.target.value)

    if (!Number.isInteger(valor) || valor < 1) {
      setCantidad(1)
      return
    }

    if (stock !== null) {
      setCantidad(Math.min(valor, Math.max(1, stock)))
    } else {
      setCantidad(valor)
    }
  }

  return (
    <main className="container py-5 flex-grow-1">
      <Link
        to="/productos"
        className="btn btn-outline-success mb-4"
      >
        ← Volver al catálogo
      </Link>

      <div className="row g-4 align-items-start">
        {/* IMAGEN */}
        <div className="col-12 col-md-6">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded shadow-sm w-100"
            style={{
              maxHeight: '400px',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* INFORMACIÓN */}
        <div className="col-12 col-md-6">
          <h1 className="mb-3">
            {producto.nombre}
          </h1>

          <p className="text-muted">
            Categoría: {producto.categoria}
          </p>

          <h2
            className="mb-3"
            style={{ color: '#2E8B57' }}
          >
            {precioFormateado(precio)} / {producto.unidad}
          </h2>

          <p>
            {producto.descripcion ||
              'Producto fresco y de calidad de HuertoHogar.'}
          </p>

          {/* ESTADO DEL INVENTARIO */}
          <div className="mb-3">
            <strong>Estado del producto: </strong>

            <span
              className={`badge ${estadoStock.clase}`}
            >
              {estadoStock.nombre}
            </span>
          </div>

          <p>
            <strong>Stock disponible: </strong>

            {stock === null
              ? 'No informado'
              : `${stock} unidades`}
          </p>

          {estadoStock.nivel === 'critico' && (
            <div
              className="alert alert-warning"
              role="status"
            >
              Quedan pocas unidades disponibles.
            </div>
          )}

          {sinStock && (
            <div
              className="alert alert-danger"
              role="status"
            >
              Este producto se encuentra agotado.
            </div>
          )}

          {/* CANTIDAD */}
          <div
            className="mb-3"
            style={{ maxWidth: '160px' }}
          >
            <label
              htmlFor="cantidad-producto"
              className="form-label"
            >
              <strong>Cantidad</strong>
            </label>

            <input
              id="cantidad-producto"
              type="number"
              min="1"
              max={
                stock === null
                  ? undefined
                  : Math.max(1, stock)
              }
              step="1"
              className="form-control"
              value={
                sinStock
                  ? 0
                  : cantidadAplicada
              }
              onChange={cambiarCantidad}
              disabled={sinStock}
            />
          </div>

          {/* SUBTOTAL */}
          <p>
            <strong>Subtotal: </strong>

            {precioFormateado(
              precio * cantidadAplicada
            )}
          </p>

          {/* INTEGRACIÓN FUTURA CON BRYAM */}
          <button
            type="button"
            className="btn btn-warning"
            disabled
            title="Se habilitará al integrar el módulo de compras"
          >
            {sinStock
              ? 'Producto agotado'
              : 'Agregar al carrito (próximamente)'}
          </button>

          <p className="text-muted small mt-2">
            La compra se habilitará al integrar el carrito
            desarrollado por Bryam.
          </p>
        </div>
      </div>
    </main>
  )
}
