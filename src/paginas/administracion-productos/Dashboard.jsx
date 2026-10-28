
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

  const alertas = productos.filter((producto) => {
    const nivel = obtenerEstadoStock(producto.stock).nivel
    return nivel === 'critico' || nivel === 'agotado'
  })

  const indicadores = [
    {
      titulo: 'Productos',
      cantidad: resumen.total,
      color: '#244D36'
    },
    {
      titulo: 'Disponibles',
      cantidad: resumen.disponibles,
      color: '#2E8B57'
    },
    {
      titulo: 'Stock crítico',
      cantidad: resumen.criticos,
      color: '#C58B00'
    },
    {
      titulo: 'Agotados',
      cantidad: resumen.agotados,
      color: '#B42318'
    }
  ]

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
    <main className="container py-3 flex-grow-1">
      {/* ENCABEZADO COMPACTO */}
      <div className="mb-3">
        <h1
          className="h3 mb-1"
          style={{ color: '#8B4513' }}
        >
          Panel de administración
        </h1>

        <p className="text-muted small mb-0">
          Resumen de productos e inventario de HuertoHogar.
        </p>
      </div>

      {/* INDICADORES COMPACTOS */}
      <section className="mb-3">
        <div className="row g-2">
          {indicadores.map((indicador) => (
            <div
              key={indicador.titulo}
              className="col-6 col-lg-3"
            >
              <article className="card shadow-sm h-100">
                <div className="card-body text-center py-2 px-2">
                  <p className="small mb-1">
                    {indicador.titulo}
                  </p>

                  <strong
                    className="fs-3"
                    style={{ color: indicador.color }}
                  >
                    {indicador.cantidad}
                  </strong>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* MÓDULOS ADMINISTRATIVOS */}
      <section className="mb-3">
        <h2 className="h5 mb-2" style={{ color: '#8B4513' }}>
          Módulos administrativos
        </h2>

        <div className="row g-2">
          {modulos.map((modulo) => (
            <div
              key={modulo.titulo}
              className="col-6 col-lg-3"
            >
              <article className="card shadow-sm h-100">
                <div className="card-body p-3">
                  <div
                    className="mb-1"
                    style={{ fontSize: '1.5rem' }}
                    aria-hidden="true"
                  >
                    {modulo.icono}
                  </div>

                  <h3 className="h6 mb-1">
                    {modulo.titulo}
                  </h3>

                  <p className="text-muted small mb-2">
                    {modulo.descripcion}
                  </p>

                  {modulo.disponible ? (
                    <Link
                      to={modulo.ruta}
                      className="btn btn-success btn-sm"
                    >
                      Abrir
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      disabled
                    >
                      Próximamente
                    </button>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* ALERTAS DE INVENTARIO */}
      <section className="mb-3">
        <h2 className="h5 mb-2" style={{ color: '#8B4513' }}>
          Alertas de inventario
        </h2>

        {alertas.length === 0 ? (
          <div className="alert alert-success py-2 mb-0">
            No hay productos con stock crítico o agotado.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {alertas.slice(0, 5).map((producto) => {
                  const estado = obtenerEstadoStock(producto.stock)

                  return (
                    <tr key={producto.id}>
                      <td>{producto.nombre}</td>
                      <td>{producto.stock}</td>
                      <td>
                        <span className={`badge ${estado.clase}`}>
                          {estado.nombre}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {alertas.length > 5 && (
              <p className="small text-muted mt-2 mb-0">
                Se muestran 5 de {alertas.length} alertas.
              </p>
            )}
          </div>
        )}

        <div className="mt-2">
          <Link
            to="/admin/reportes"
            className="btn btn-outline-success btn-sm"
          >
            Ver reporte completo
          </Link>
        </div>

        {resumen.sinDefinir > 0 && (
          <p className="text-muted small mt-2 mb-0">
            Productos sin stock definido: {resumen.sinDefinir}
          </p>
        )}
      </section>
    </main>
  )
}
