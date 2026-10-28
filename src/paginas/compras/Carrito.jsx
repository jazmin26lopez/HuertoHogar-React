
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import useCarrito from '../../contextos/useCarrito'
import ImagenProducto from '../../componentes/compras/ImagenProducto'
import { calcularSubtotalItem } from '../../funciones/carrito'
import { formatearPrecio } from '../../funciones/formato'
import { esOferta, precioConOferta } from '../../funciones/ofertas'
import { obtenerProductos, suscribirseAProductos } from '../../servicios/productosServicio'

// Vista del carrito según la Figura 5 del anexo:
// a la izquierda la lista de productos para añadir, a la derecha el carrito de compras.
export default function Carrito() {
  const { items, subtotal, agregar, cambiarCantidad, quitar, vaciar } = useCarrito()
  const navigate = useNavigate()

  const [productos, setProductos] = useState(obtenerProductos)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    const actualizar = () => setProductos(obtenerProductos())

    return suscribirseAProductos(actualizar)
  }, [])

  function anadir(producto) {
    const agregado = agregar(producto)

    setMensaje(
      agregado
        ? `${producto.nombre} se agregó al carrito.`
        : `No hay más stock disponible de ${producto.nombre}.`
    )
  }

  return (
    <main className="container py-4 flex-grow-1 text-start">
      <h1 className="visually-hidden">Carrito de compras</h1>

      {mensaje && (
        <div className="alert alert-info" role="status">
          {mensaje}
        </div>
      )}

      <div className="row g-4">
        {/* ---------- LISTA DE PRODUCTOS ---------- */}
        <section className="col-lg-6" aria-labelledby="titulo-lista">
          <h2 id="titulo-lista" className="h3 mb-3">Lista de productos</h2>

          <div className="row row-cols-2 row-cols-md-3 g-3">
            {productos.map((producto) => (
              <div className="col" key={producto.id}>
                <article className="card h-100 shadow-sm">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="card-img-top"
                    style={{ height: '90px', objectFit: 'cover' }}
                  />

                  <div className="card-body p-2 d-flex flex-column">
                    <h3 className="h6 mb-1">{producto.nombre}</h3>

                    <p className="small text-muted mb-1">{producto.categoria}</p>

                    {esOferta(producto) && (
                      <p className="small text-muted mb-0">
                        <del>{formatearPrecio(producto.precio)}</del>
                      </p>
                    )}

                    <p className="fw-bold mb-2" style={{ color: '#2E8B57' }}>
                      {formatearPrecio(precioConOferta(producto))}
                    </p>

                    <button
                      type="button"
                      className="btn btn-dark btn-sm mt-auto"
                      onClick={() => anadir(producto)}
                    >
                      Añadir{' '}
                      <span className="visually-hidden">{producto.nombre} al carrito</span>
                    </button>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- CARRITO DE COMPRAS ---------- */}
        <section className="col-lg-6" aria-labelledby="titulo-carrito">
          <h2 id="titulo-carrito" className="h3 mb-3">Carrito de Compras</h2>

          {items.length === 0 ? (
            <div className="alert alert-secondary" role="status">
              Tu carrito está vacío. Agrega productos desde la lista.
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-striped align-middle bg-white">
                  <caption className="visually-hidden">Productos en tu carrito</caption>
                  <thead>
                    <tr>
                      <th scope="col">Imagen</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Precio</th>
                      <th scope="col">Cantidad</th>
                      <th scope="col">Subtotal</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <ImagenProducto producto={item} tamano={40} />
                        </td>

                        <td>
                          {item.nombre}
                          {item.precio < item.precioNormal && (
                            <span className="badge bg-danger ms-1">Oferta</span>
                          )}
                        </td>

                        <td>{formatearPrecio(item.precio)}</td>

                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
                              aria-label={`Disminuir cantidad de ${item.nombre}`}
                              disabled={item.cantidad <= 1}
                              onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                            >
                              −
                            </button>

                            <input
                              type="number"
                              min="1"
                              max={Number.isFinite(item.stock) ? item.stock : undefined}
                              className="form-control form-control-sm text-center"
                              style={{ width: '58px' }}
                              aria-label={`Cantidad de ${item.nombre}`}
                              value={item.cantidad}
                              onChange={(evento) => cambiarCantidad(item.id, evento.target.value)}
                            />

                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
                              aria-label={`Aumentar cantidad de ${item.nombre}`}
                              disabled={item.cantidad >= (item.stock ?? Infinity)}
                              onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td>{formatearPrecio(calcularSubtotalItem(item))}</td>

                        <td>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => quitar(item.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr>
                      <th scope="row" colSpan="4" className="text-end">Total</th>
                      <td colSpan="2" className="fw-bold" data-testid="total-carrito">
                        {formatearPrecio(subtotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="d-flex justify-content-end gap-2 flex-wrap">
                <button type="button" className="btn btn-secondary" onClick={vaciar}>
                  Limpiar
                </button>

                <button
                  type="button"
                  className="btn btn-success btn-lg"
                  onClick={() => navigate('/checkout')}
                >
                  Comprar ahora
                </button>
              </div>
            </>
          )}

          <Link to="/productos" className="btn btn-outline-success mt-3">
            ← Seguir comprando
          </Link>
        </section>
      </div>
    </main>
  )
}
