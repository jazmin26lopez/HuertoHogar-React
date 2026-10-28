
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import DetalleOrden from '../../componentes/compras/DetalleOrden'
import { obtenerOrdenPorId } from '../../servicios/ordenesServicio'

export default function CompraFallida() {
  const [parametros] = useSearchParams()
  const navigate = useNavigate()
  const orden = obtenerOrdenPorId(parametros.get('orden'))

  if (!orden || orden.estado !== 'fallida') {
    return (
      <main className="container py-5 flex-grow-1">
        <h1>No encontramos ese pago</h1>

        <p>El pago que buscas no existe o ya fue realizado.</p>

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
          <h1 className="h3 text-danger">
            <span aria-hidden="true">❌ </span>
            No se pudo realizar el pago. nro #{orden.id}
          </h1>

          <p className="text-muted">
            Tu tarjeta fue rechazada. Tus productos siguen en el carrito y no se realizó ningún cobro.
          </p>

          <div className="text-center mb-4">
            <button
              type="button"
              className="btn btn-success btn-lg text-uppercase"
              onClick={() => navigate('/checkout')}
            >
              Volver a realizar el pago
            </button>
          </div>

          <DetalleOrden orden={orden} etiquetaTotal="Total a pagar" />

          <div className="text-center">
            <Link to="/carrito" className="btn btn-outline-secondary">
              Revisar mi carrito
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
