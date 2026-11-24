
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { listarBoletas } from '../../servicios/ordenesServicio'
import { formatearPrecio, formatearFecha } from '../../funciones/formato'

// Lista de órdenes (boletas). La ven el Administrador y el Vendedor, solo para consultar.
export default function AdministrarPedidos() {
  const [boletas, setBoletas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // GET /boletas al abrir la página
  useEffect(() => {
    let activo = true

    listarBoletas()
      .then((lista) => {
        if (activo) {
          // las más nuevas primero
          setBoletas([...lista].sort((a, b) => b.boleta.boletaId - a.boleta.boletaId))
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
  }, [])

  return (
    <main className="pagina-admin-usuarios flex-grow-1">
      <div className="admin-usuarios-contenedor">

        <header className="admin-usuarios-encabezado">
          <div className="admin-usuarios-titulo">
            <p className="admin-usuarios-etiqueta">ADMINISTRACIÓN HUERTOHOGAR</p>

            <h1>Órdenes</h1>

            {!cargando && !error && (
              <p>
                {boletas.length} {boletas.length === 1 ? 'orden registrada' : 'órdenes registradas'}
              </p>
            )}
          </div>
        </header>

        {cargando && (
          <p className="admin-usuarios-sin-datos" role="status">
            Cargando órdenes...
          </p>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            No se pudieron cargar las órdenes. {error}
          </div>
        )}

        {!cargando && !error && (
          <div className="admin-usuarios-tabla-contenedor table-responsive">
            <table className="table table-hover align-middle admin-usuarios-tabla">
              <caption className="visually-hidden">Listado de órdenes</caption>

              <thead>
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Entrega</th>
                  <th scope="col">Total</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Detalle</th>
                </tr>
              </thead>

              <tbody>
                {boletas.map(({ boleta }) => (
                  <tr key={boleta.boletaId}>
                    <td>{boleta.codigo}</td>
                    <td>{formatearFecha(boleta.fechaBoleta)}</td>

                    <td className="admin-usuarios-nombre">
                      {boleta.nombreCliente} {boleta.apellidosCliente}
                    </td>

                    <td>{boleta.tipoEntrega === 'domicilio' ? 'Despacho a domicilio' : 'Retiro en tienda'}</td>
                    <td>{formatearPrecio(Number(boleta.total))}</td>

                    <td>
                      <span
                        className={
                          boleta.estado === 'PAGADA'
                            ? 'admin-usuarios-rol admin-usuarios-rol-cliente'
                            : 'admin-usuarios-rol admin-usuarios-rol-inactivo'
                        }
                      >
                        {boleta.estado === 'PAGADA' ? 'Pagada' : 'Fallida'}
                      </span>
                    </td>

                    <td>
                      <Link
                        to={`/admin/pedidos/${boleta.boletaId}`}
                        className="admin-usuarios-boton-editar"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!cargando && !error && boletas.length === 0 && (
          <p className="admin-usuarios-sin-datos">Todavía no hay órdenes registradas.</p>
        )}

      </div>
    </main>
  )
}
