
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
      <main className="pagina-compra-exitosa flex-grow-1">
        <div className="compra-exitosa-contenedor">
          <div className="compra-exitosa-vacio">
            <h1>No encontramos esa compra</h1>

            <p>
              La compra que buscas no existe o no fue pagada.
            </p>

            <Link to="/" className="compra-exitosa-boton">
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="pagina-compra-exitosa flex-grow-1">
      <div className="compra-exitosa-contenedor">

        {/* ENCABEZADO */}
        <header className="compra-exitosa-encabezado">
          <p className="compra-exitosa-etiqueta">
            HUERTOHOGAR
          </p>

          <h1>¡Compra realizada exitosamente!</h1>

          <p>
            Tu pedido fue registrado correctamente.
            Aquí puedes revisar los detalles de tu compra.
          </p>
        </header>

        {/* COMPROBANTE */}
        <article className="compra-exitosa-tarjeta">
          <div className="compra-exitosa-cabecera">
            <div>
              <p className="compra-exitosa-estado">
                <span aria-hidden="true">✓ </span>
                Compra confirmada
              </p>

              <h2>Resumen de tu compra</h2>
            </div>

            <p className="compra-exitosa-codigo">
              Código de orden:
              <strong>{orden.codigo}</strong>
            </p>
          </div>

          <p className="compra-exitosa-numero">
            Número de compra: #{orden.id}
          </p>

          {/* DETALLE ORIGINAL DE BRYAM */}
          <div className="compra-exitosa-detalle">
            <DetalleOrden orden={orden} />
          </div>

          {/* MENSAJE DE ENVÍO */}
          {mensaje && (
            <div className="alert alert-success" role="status">
              {mensaje}
            </div>
          )}

          {/* ACCIONES */}
          <div className="compra-exitosa-acciones">
            <button
              type="button"
              className="compra-exitosa-boton"
              onClick={() => window.print()}
            >
              Imprimir boleta en PDF
            </button>

            <button
              type="button"
              className="compra-exitosa-boton-secundario"
              onClick={() =>
                setMensaje(
                  `Boleta enviada a ${orden.cliente.correo} (simulado).`
                )
              }
            >
              Enviar boleta por email
            </button>

            <Link
              to="/productos"
              className="compra-exitosa-boton-contorno"
            >
              Seguir comprando
            </Link>
          </div>
        </article>

      </div>
    </main>
  )
}
