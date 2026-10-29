
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import DetalleOrden from '../../componentes/compras/DetalleOrden'
import { obtenerOrdenPorId } from '../../servicios/ordenesServicio'

export default function CompraFallida() {
  const [parametros] = useSearchParams()
  const navigate = useNavigate()
  const orden = obtenerOrdenPorId(parametros.get('orden'))

  if (!orden || orden.estado !== 'fallida') {
    return (
      <main className="pagina-compra-fallida flex-grow-1">
        <div className="compra-fallida-contenedor">
          <div className="compra-fallida-vacio">
            <h1>No encontramos ese pago</h1>

            <p>
              El pago que buscas no existe o ya fue realizado.
            </p>

            <Link to="/" className="compra-fallida-boton">
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="pagina-compra-fallida flex-grow-1">
      <div className="compra-fallida-contenedor">

        {/* ENCABEZADO */}
        <header className="compra-fallida-encabezado">
          <p className="compra-fallida-etiqueta">
            HUERTOHOGAR
          </p>

          <h1>No se pudo realizar el pago</h1>

          <p>
            Tu pago fue rechazado. Tus productos siguen en el
            carrito y no se realizó ningún cobro.
          </p>
        </header>

        {/* DETALLE DEL PAGO */}
        <article className="compra-fallida-tarjeta">

          <div className="compra-fallida-cabecera">
            <div>
              <p className="compra-fallida-estado">
                <span aria-hidden="true">✕ </span>
                Pago rechazado
              </p>

              <h2>Resumen de tu pedido</h2>
            </div>

            <p className="compra-fallida-numero">
              Número de orden:
              <strong>#{orden.id}</strong>
            </p>
          </div>

          {/* AVISO */}
          <div className="compra-fallida-aviso" role="alert">
            <strong>No se completó la compra.</strong>
            <p>
              Puedes revisar tu carrito o volver a intentar
              el pago. Los productos seleccionados se
              conservaron.
            </p>
          </div>

          {/* DETALLE ORIGINAL DE BRYAM */}
          <div className="compra-fallida-detalle">
            <DetalleOrden
              orden={orden}
              etiquetaTotal="Total a pagar"
            />
          </div>

          {/* ACCIONES */}
          <div className="compra-fallida-acciones">
            <button
              type="button"
              className="compra-fallida-boton"
              onClick={() => navigate('/checkout')}
            >
              Volver a realizar el pago
            </button>

            <Link
              to="/carrito"
              className="compra-fallida-boton-secundario"
            >
              Revisar mi carrito
            </Link>
          </div>

        </article>

      </div>
    </main>
  )
}
