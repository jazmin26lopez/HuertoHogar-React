
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  obtenerProductos,
  suscribirseAProductos
} from '../../servicios/productosServicio'

import {
  obtenerEstadoStock
} from '../../funciones/estadoStock'

export default function Dashboard() {
  const [productos, setProductos] = useState(obtenerProductos)

  useEffect(() => {
    const actualizar = () => {
      setProductos(obtenerProductos())
    }

    actualizar()

    return suscribirseAProductos(actualizar)
  }, [])

  // RESUMEN DE INVENTARIO
  const resumen = {
    total: productos.length,
    disponibles: 0,
    criticos: 0,
    agotados: 0,
    sinDefinir: 0
  }

  productos.forEach((producto) => {
    const nivel = obtenerEstadoStock(producto.stock).nivel

    if (nivel === 'disponible') resumen.disponibles++
    if (nivel === 'critico') resumen.criticos++
    if (nivel === 'agotado') resumen.agotados++
    if (nivel === 'sin-definir') resumen.sinDefinir++
  })

  // PRODUCTOS CON ALERTAS
  const alertas = productos.filter((producto) => {
    const nivel = obtenerEstadoStock(producto.stock).nivel

    return nivel === 'critico' || nivel === 'agotado'
  })

  // INDICADORES
  const indicadores = [
    {
      titulo: 'Productos',
      cantidad: resumen.total,
      clase: 'total'
    },
    {
      titulo: 'Disponibles',
      cantidad: resumen.disponibles,
      clase: 'disponibles'
    },
    {
      titulo: 'Stock crítico',
      cantidad: resumen.criticos,
      clase: 'criticos'
    },
    {
      titulo: 'Agotados',
      cantidad: resumen.agotados,
      clase: 'agotados'
    }
  ]

  // MÓDULOS ADMINISTRATIVOS
  const modulos = [
    {
      titulo: 'Productos',
      descripcion: 'Gestionar inventario',
      icono: '📦',
      ruta: '/admin/productos',
      disponible: true
    },
    {
      titulo: 'Reportes',
      descripcion: 'Consultar existencias',
      icono: '📊',
      ruta: '/admin/reportes',
      disponible: true
    },
    {
      titulo: 'Usuarios',
      descripcion: 'Módulo de Bryam',
      icono: '👥',
      ruta: '/admin/usuarios',
      disponible: true
    },
    {
      titulo: 'Pedidos',
      descripcion: 'Pendiente de integración',
      icono: '🛒',
      ruta: '/admin/pedidos',
      disponible: false
    }
  ]

  return (
    <main className="pagina-dashboard flex-grow-1">
      <div className="dashboard-contenedor">

        {/* ENCABEZADO */}
        <header className="dashboard-encabezado">
          <p className="dashboard-etiqueta">
            ADMINISTRACIÓN HUERTOHOGAR
          </p>

          <h1>Panel de administración</h1>

          <p>
            Resumen de productos e inventario de HuertoHogar.
          </p>
        </header>

        {/* INDICADORES */}
        <section
          className="dashboard-seccion"
          aria-label="Resumen de inventario"
        >
          <div className="dashboard-indicadores">
            {indicadores.map((indicador) => (
              <article
                key={indicador.titulo}
                className={`dashboard-indicador dashboard-indicador-${indicador.clase}`}
              >
                <p>{indicador.titulo}</p>

                <strong>{indicador.cantidad}</strong>
              </article>
            ))}
          </div>
        </section>

        {/* MÓDULOS ADMINISTRATIVOS */}
        <section className="dashboard-seccion">
          <h2>Módulos administrativos</h2>

          <div className="dashboard-modulos">
            {modulos.map((modulo) => (
              <article
                key={modulo.titulo}
                className="dashboard-modulo"
              >
                <span
                  className="dashboard-modulo-icono"
                  aria-hidden="true"
                >
                  {modulo.icono}
                </span>

                <h3>{modulo.titulo}</h3>

                <p>{modulo.descripcion}</p>

                {modulo.disponible ? (
                  <Link
                    to={modulo.ruta}
                    className="dashboard-boton"
                  >
                    Abrir módulo
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="dashboard-boton-inactivo"
                    disabled
                  >
                    Próximamente
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* ALERTAS DE INVENTARIO */}
        <section className="dashboard-seccion">
          <div className="dashboard-alertas-encabezado">
            <h2>Alertas de inventario</h2>

            <Link
              to="/admin/reportes"
              className="dashboard-boton-contorno"
            >
              Ver reporte completo
            </Link>
          </div>

          <div className="dashboard-alertas-tarjeta">
            {alertas.length === 0 ? (
              <div
                className="dashboard-sin-alertas"
                role="status"
              >
                No hay productos con stock crítico o agotado.
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover align-middle dashboard-tabla">
                    <thead>
                      <tr>
                        <th scope="col">Producto</th>
                        <th scope="col">Stock</th>
                        <th scope="col">Estado</th>
                      </tr>
                    </thead>

                    <tbody>
                      {alertas.slice(0, 5).map((producto) => {
                        const estado = obtenerEstadoStock(
                          producto.stock
                        )

                        return (
                          <tr key={producto.id}>
                            <td className="dashboard-producto-nombre">
                              {producto.nombre}
                            </td>

                            <td>{producto.stock}</td>

                            <td>
                              <span
                                className={`badge ${estado.clase}`}
                              >
                                {estado.nombre}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {alertas.length > 5 && (
                  <p className="dashboard-alertas-nota">
                    Se muestran 5 de {alertas.length} alertas.
                  </p>
                )}
              </>
            )}

            {resumen.sinDefinir > 0 && (
              <p className="dashboard-stock-indefinido">
                Productos sin stock definido:{' '}
                <strong>{resumen.sinDefinir}</strong>
              </p>
            )}
          </div>
        </section>

      </div>
    </main>
  )
}
