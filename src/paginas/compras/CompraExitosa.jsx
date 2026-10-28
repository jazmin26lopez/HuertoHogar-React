
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import DetalleOrden from '../../componentes/compras/DetalleOrden'
import { obtenerOrdenPorId } from '../../servicios/ordenesServicio'

export default function CompraExitosa() {
  const [parametros] = useSearchParams()
  const orden = obtenerOrdenPorId(parametros.get('orden'))
  const [mensaje, setMensaje] = useState('')

  if (!orden || orden.estado !== 'pagada') {
    return (
      <main className="container py-5 flex-grow-1">
        <h1>No encontramos esa compra</h1>

        <p>La compra que buscas no existe o no fue pagada.</p>

        <Link to="/" className="btn btn-success">
          Volver al inicio
        </Link>
      </main>
    )
  }

  return (
    <main className="container py-4 flex-grow-1">
      <div className="card shadow-sm text-start">
        <div className="card-body p-4">
          <p className="text-end text-muted small mb-1">Código orden: {orden.codigo}</p>

          <h1 className="h3 text-success">
            <span aria-hidden="true">✅ </span>
            Se ha realizado la compra. nro #{orden.id}
          </h1>

          <p className="text-muted">Completa la siguiente información: datos de tu compra.</p>

          <DetalleOrden orden={orden} />

          {mensaje && (
            <div className="alert alert-success" role="status">
              {mensaje}
            </div>
          )}

          <div className="d-flex gap-2 flex-wrap justify-content-center">
            <button type="button" className="btn btn-danger" onClick={() => window.print()}>
              Imprimir boleta en PDF
            </button>

            <button
              type="button"
              className="btn btn-success"
              onClick={() => setMensaje(`Boleta enviada a ${orden.cliente.correo} (simulado).`)}
            >
              Enviar boleta por email
            </button>

            <Link to="/productos" className="btn btn-outline-success">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
