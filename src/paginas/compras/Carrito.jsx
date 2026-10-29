
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import useCarrito from '../../contextos/useCarrito'
import ImagenProducto from '../../componentes/compras/ImagenProducto'
import { calcularSubtotalItem } from '../../funciones/carrito'
import { formatearPrecio } from '../../funciones/formato'
import { esOferta, precioConOferta } from '../../funciones/ofertas'
import {
  obtenerProductos,
  suscribirseAProductos
} from '../../servicios/productosServicio'

const MAX_SUGERENCIAS = 6

export default function Carrito() {
  const { items, subtotal, agregar, cambiarCantidad, quitar, vaciar } = useCarrito()
  const navigate = useNavigate()

  const [productos, setProductos] = useState(obtenerProductos)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    const actualizar = () => setProductos(obtenerProductos())
    return suscribirseAProductos(actualizar)
  }, [])

  const sugerencias = productos
    .filter((producto) => !items.some((item) => item.id === producto.id))
    .slice(0, MAX_SUGERENCIAS)

  function anadir(producto) {
    const agregado = agregar(producto)

    setMensaje(
      agregado
        ? `${producto.nombre} se agregó al carrito.`
        : `No hay más stock disponible de ${producto.nombre}.`
    )
  }

  return (
    <main className="pagina-carrito flex-grow-1">
      <div className="carrito-contenedor">

        {/* ENCABEZADO */}
        <header className="carrito-encabezado">
          <p className="carrito-etiqueta">HUERTOHOGAR</p>
          <h1 id="titulo-carrito">Carrito de compras</h1>
          <p>
            Revisa tus productos antes de continuar con tu compra.
          </p>
        </header>

        {/* MENSAJES */}
        {mensaje && (
          <div className="alert alert-info" role="status">
            {mensaje}
          </div>
        )}

        {/* PRODUCTOS DEL CARRITO */}
        <section aria-labelledby="titulo-carrito">
          {items.length === 0 ? (
            <div className="carrito-vacio" role="status">
              <h2>Tu carrito está vacío</h2>
              <p>
                Explora nuestros productos frescos y agrega
                tus favoritos para comenzar.
              </p>
              <Link to="/productos" className="carrito-boton-principal">
                Ver productos
              </Link>
            </div>
          ) : (
            <>
              <div className="carrito-tabla-contenedor table-responsive">
                <table className="table align-middle carrito-tabla">
                  <caption className="visually-hidden">
                    Productos en tu carrito
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Imagen</th>
                      <th scope="col">Producto</th>
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
                          <ImagenProducto producto={item} tamano={55} />
                        </td>

                        <td className="carrito-nombre">
                          {item.nombre}

                          {item.precio < item.precioNormal && (
                            <span className="badge bg-danger ms-2">
                              Oferta
                            </span>
                          )}
                        </td>

                        <td>{formatearPrecio(item.precio)}</td>

                        <td>
                          <div className="carrito-cantidad">
                            <button
                              type="button"
                              aria-label={`Disminuir cantidad de ${item.nombre}`}
                              disabled={item.cantidad <= 1}
                              onClick={() =>
                                cambiarCantidad(item.id, item.cantidad - 1)
                              }
                            >
                              −
                            </button>

                            <input
                              type="number"
                              min="1"
                              max={
                                Number.isFinite(item.stock)
                                  ? item.stock
                                  : undefined
                              }
                              aria-label={`Cantidad de ${item.nombre}`}
                              value={item.cantidad}
                              onChange={(evento) =>
                                cambiarCantidad(item.id, evento.target.value)
                              }
                            />

                            <button
                              type="button"
                              aria-label={`Aumentar cantidad de ${item.nombre}`}
                              disabled={item.cantidad >= (item.stock ?? Infinity)}
                              onClick={() =>
                                cambiarCantidad(item.id, item.cantidad + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="carrito-subtotal">
                          {formatearPrecio(calcularSubtotalItem(item))}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="carrito-boton-eliminar"
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
                      <th scope="row" colSpan="4" className="text-end">
                        Total
                      </th>
                      <td
                        colSpan="2"
                        className="carrito-total"
                        data-testid="total-carrito"
                      >
                        {formatearPrecio(subtotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* ACCIONES */}
              <div className="carrito-acciones">
                <button
                  type="button"
                  className="carrito-boton-limpiar"
                  onClick={vaciar}
                >
                  Limpiar carrito
                </button>

                <button
                  type="button"
                  className="carrito-boton-principal"
                  onClick={() => navigate('/checkout')}
                >
                  Comprar ahora
                </button>
              </div>
            </>
          )}

          <Link to="/productos" className="carrito-seguir">
            ← Seguir comprando
          </Link>
        </section>

        {/* SUGERENCIAS */}
        {sugerencias.length > 0 && (
          <section
            className="carrito-sugerencias"
            aria-labelledby="titulo-sugerencias"
          >
            <h2 id="titulo-sugerencias">
              También podrías agregar esto
            </h2>

            <div className="carrito-grid-sugerencias">
              {sugerencias.map((producto) => (
                <article
                  className="carrito-tarjeta-sugerencia"
                  key={producto.id}
                >
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                  />

                  <div className="carrito-sugerencia-contenido">
                    <h3>{producto.nombre}</h3>

                    <p className="carrito-sugerencia-categoria">
                      {producto.categoria}
                    </p>

                    {esOferta(producto) && (
                      <p className="carrito-precio-anterior">
                        <del>{formatearPrecio(producto.precio)}</del>
                      </p>
                    )}

                    <p className="carrito-sugerencia-precio">
                      {formatearPrecio(precioConOferta(producto))}
                    </p>

                    <button
                      type="button"
                      className="carrito-boton-agregar"
                      onClick={() => anadir(producto)}
                    >
                      Añadir
                      <span className="visually-hidden">
                        {' '}{producto.nombre} al carrito
                      </span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  )
}
