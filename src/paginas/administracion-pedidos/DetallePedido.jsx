
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { obtenerBoleta } from '../../servicios/ordenesServicio'
import { obtenerProductos } from '../../servicios/productosServicio'
import { formatearPrecio, formatearFecha } from '../../funciones/formato'

// Detalle de una orden (boleta) con sus productos. Solo consulta.
export default function DetallePedido() {
  const { id } = useParams()

  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // GET /boletas/{id}
  useEffect(() => {
    let activo = true

    obtenerBoleta(id)
      .then((respuesta) => {
        if (activo) {
          setDatos(respuesta)
        }
      })
      .catch((falla) => {
        if (activo) {
          setError(falla.message)
        }
      })
      .finally(() => {
        if (activo) {
          setCargando(false)
        }
      })

    return () => {
      activo = false
    }
  }, [id])

  // El detalle de la boleta trae el número del producto; el nombre se busca en el catálogo
  function nombreProducto(productoId) {
    return obtenerProductos().find((p) => p.productoId === productoId)?.nombre ?? `Producto #${productoId}`
  }

  const volver = (
    <Link to="/admin/pedidos" className="btn btn-outline-success btn-sm">
      ← Volver a las órdenes
    </Link>
  )

  if (cargando) {
    return (
      <main className="pagina-admin-usuarios flex-grow-1">
        <div className="admin-usuarios-contenedor">
          <p role="status">Cargando orden...</p>
        </div>
      </main>
    )
  }

  if (error || !datos) {
    return (
      <main className="pagina-admin-usuarios flex-grow-1">
        <div className="admin-usuarios-contenedor">
          {volver}

          <h1>Orden no encontrada</h1>

          <p>{error || 'La orden que buscas no existe.'}</p>
        </div>
      </main>
    )
  }

  const { boleta, detalles } = datos

  return (
    <main className="pagina-admin-usuarios flex-grow-1">
      <div className="admin-usuarios-contenedor">

        <nav className="editor-usuario-navegacion">{volver}</nav>

        <header className="admin-usuarios-encabezado">
          <div className="admin-usuarios-titulo">
            <p className="admin-usuarios-etiqueta">ADMINISTRACIÓN HUERTOHOGAR</p>

            <h1>Orden {boleta.codigo}</h1>

            <p>
              {formatearFecha(boleta.fechaBoleta)} ·{' '}
              {boleta.estado === 'PAGADA' ? 'Pagada' : 'Pago fallido'}
            </p>
          </div>
        </header>

        <section className="mb-4">
          <h2 className="h5">Cliente y entrega</h2>

          <p className="mb-1">
            {boleta.nombreCliente} {boleta.apellidosCliente} · {boleta.correoCliente}
          </p>

          <p className="mb-1">
            {boleta.tipoEntrega === 'domicilio' ? 'Despacho a domicilio' : 'Retiro en tienda'}
            {boleta.tipoEntrega === 'domicilio' &&
              `: ${boleta.calle}${boleta.departamento ? `, ${boleta.departamento}` : ''}, ${boleta.comuna}, ${boleta.region}`}
          </p>

          {boleta.indicaciones && <p className="mb-1">Indicaciones: {boleta.indicaciones}</p>}

          <p className="mb-0">Método de pago: {boleta.metodoPago}</p>
        </section>

        <div className="admin-usuarios-tabla-contenedor table-responsive">
          <table className="table align-middle admin-usuarios-tabla">
            <caption className="visually-hidden">Productos de la orden</caption>

            <thead>
              <tr>
                <th scope="col">Producto</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Precio unitario</th>
                <th scope="col">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {detalles.map((detalle) => (
                <tr key={detalle.detalleId}>
                  <td className="admin-usuarios-nombre">{nombreProducto(detalle.productoId)}</td>
                  <td>{detalle.cantidad}</td>
                  <td>{formatearPrecio(Number(detalle.precioUnitario))}</td>
                  <td>{formatearPrecio(Number(detalle.subtotal))}</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <th scope="row" colSpan="3">Subtotal</th>
                <td>{formatearPrecio(Number(boleta.subtotal))}</td>
              </tr>

              <tr>
                <th scope="row" colSpan="3">Envío</th>
                <td>{formatearPrecio(Number(boleta.costoEnvio))}</td>
              </tr>

              <tr>
                <th scope="row" colSpan="3">Total</th>
                <td><strong>{formatearPrecio(Number(boleta.total))}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>
    </main>
  )
}
