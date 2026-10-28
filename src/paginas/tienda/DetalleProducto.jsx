
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  obtenerProductoPorId,
  suscribirseAProductos
} from '../../servicios/productosServicio'

export default function DetalleProducto() {
  const { id } = useParams()

  const [producto, setProducto] = useState(
    () => obtenerProductoPorId(id)
  )
  const [cantidad, setCantidad] = useState(1)

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
        <p>El producto solicitado no existe en nuestro catálogo.</p>

        <Link to="/productos" className="btn btn-success">
          Volver al catálogo
        </Link>
      </main>
    )
  }

  const precio = Number(producto.precio)

  const stock =
    producto.stock === undefined ||
    producto.stock === null ||
    producto.stock === ''
      ? null
      : Math.max(0, Math.floor(Number(producto.stock)))

  const sinStock = stock === 0

  const cantidadAplicada =
    stock === null
      ? cantidad
      : sinStock
        ? 0
        : Math.min(cantidad, stock)

  const precioFormateado = (valor) =>
    '$' + valor.toLocaleString('es-CL')

  function cambiarCantidad(evento) {
    const valor = Number(evento.target.value)

    if (!Number.isInteger(valor) || valor < 1) {
      setCantidad(1)
      return
    }

    setCantidad(
      stock === null
        ? valor
        : Math.min(valor, Math.max(1, stock))
    )
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

        <div className="col-12 col-md-6">
          <h1 className="mb-3">{producto.nombre}</h1>

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

          <p>
            <strong>Stock disponible: </strong>
            {stock === null
              ? 'No informado'
              : sinStock
                ? 'Agotado'
                : `${stock} unidades`}
          </p>

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
              value={sinStock ? 0 : cantidadAplicada}
              onChange={cambiarCantidad}
              disabled={sinStock}
            />
          </div>

          <p>
            <strong>Subtotal: </strong>
            {precioFormateado(precio * cantidadAplicada)}
          </p>

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
