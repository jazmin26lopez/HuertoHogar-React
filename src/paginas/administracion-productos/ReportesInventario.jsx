
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  obtenerProductos,
  suscribirseAProductos
} from '../../servicios/productosServicio'

import {
  obtenerEstadoStock,
  LIMITE_STOCK_CRITICO
} from '../../funciones/estadoStock'

import { formatearPrecio } from '../../funciones/formato'

export default function ReportesInventario() {
  const [productos, setProductos] = useState(obtenerProductos)
  const [filtro, setFiltro] = useState('todos')

  useEffect(() => {
    const actualizar = () => {
      setProductos(obtenerProductos())
    }

    actualizar()

    return suscribirseAProductos(actualizar)
  }, [])

  // INVENTARIO CON ESTADO DE STOCK
  const inventario = productos.map((producto) => ({
    ...producto,
    estado: obtenerEstadoStock(producto.stock)
  }))

  // FILTRO DE PRODUCTOS
  const productosFiltrados = inventario.filter((producto) => {
    return (
      filtro === 'todos' ||
      producto.estado.nivel === filtro
    )
  })

  // VALORIZACIÓN DEL INVENTARIO
  // Solo se consideran productos con stock definido.
  const valorInventario = inventario.reduce((total, producto) => {
    if (producto.estado.nivel === 'sin-definir') {
      return total
    }

    return total +
      Number(producto.precio) * Number(producto.stock)
  }, 0)

  // INDICADORES
  const productosCriticos = inventario.filter(
    (producto) => producto.estado.nivel === 'critico'
  ).length

  const productosAgotados = inventario.filter(
    (producto) => producto.estado.nivel === 'agotado'
  ).length

  const productosSinDefinir = inventario.filter(
    (producto) => producto.estado.nivel === 'sin-definir'
  ).length

  const indicadores = [
    {
      titulo: 'Productos',
      cantidad: productos.length,
      clase: 'total'
    },
    {
      titulo: 'Stock crítico',
      cantidad: productosCriticos,
      clase: 'criticos'
    },
    {
      titulo: 'Agotados',
      cantidad: productosAgotados,
      clase: 'agotados'
    },
    {
      titulo: 'Valor del inventario',
      cantidad: formatearPrecio(valorInventario),
      clase: 'valor'
    }
  ]

  // DESCARGA DE REPORTE CSV
  function descargarCSV() {
    const filas = [
      [
        'Código',
        'Producto',
        'Categoría',
        'Precio CLP',
        'Stock',
        'Estado'
      ],
      ...productosFiltrados.map((producto) => [
        producto.id,
        producto.nombre,
        producto.categoria,
        producto.precio,
        producto.estado.nivel === 'sin-definir'
          ? 'Sin definir'
          : producto.stock,
        producto.estado.nombre
      ])
    ]

    const escaparCSV = (valor) => {
      const texto = String(valor ?? '')

      return `"${texto.replace(/"/g, '""')}"`
    }

    const contenido = filas
      .map((fila) => fila.map(escaparCSV).join(';'))
      .join('\r\n')

    const archivo = new Blob(
      ['\uFEFF', contenido],
      { type: 'text/csv;charset=utf-8;' }
    )

    const url = URL.createObjectURL(archivo)
    const enlace = document.createElement('a')

    enlace.href = url
    enlace.download = 'reporte_inventario_huertohogar.csv'

    document.body.appendChild(enlace)
    enlace.click()
    enlace.remove()

    URL.revokeObjectURL(url)
  }

  return (
    <main className="pagina-reportes-inventario flex-grow-1">
      <div className="reportes-inventario-contenedor">

        {/* NAVEGACIÓN */}
        <nav className="reportes-inventario-navegacion">
          <Link
            to="/admin"
            className="reportes-inventario-volver"
          >
            ← Volver al panel
          </Link>
        </nav>

        {/* ENCABEZADO */}
        <header className="reportes-inventario-encabezado">
          <p className="reportes-inventario-etiqueta">
            ADMINISTRACIÓN HUERTOHOGAR
          </p>

          <h1>Reportes de inventario</h1>

          <p>
            Consulta las existencias y los productos
            que requieren reposición.
          </p>
        </header>

        {/* INDICADORES */}
        <section
          className="reportes-inventario-seccion"
          aria-label="Resumen del inventario"
        >
          <div className="reportes-inventario-indicadores">
            {indicadores.map((indicador) => (
              <article
                key={indicador.titulo}
                className={`reportes-inventario-indicador reportes-inventario-${indicador.clase}`}
              >
                <p>{indicador.titulo}</p>

                <strong>{indicador.cantidad}</strong>
              </article>
            ))}
          </div>
        </section>

        {/* PRODUCTOS SIN STOCK DEFINIDO */}
        {productosSinDefinir > 0 && (
          <div
            className="reportes-inventario-aviso"
            role="status"
          >
            Hay {productosSinDefinir} productos sin stock
            definido. No se incluyen en el valor calculado.
          </div>
        )}

        {/* FILTROS Y DESCARGA */}
        <section className="reportes-inventario-filtros-tarjeta">
          <h2>Consultar inventario</h2>

          <div className="reportes-inventario-controles">
            <div className="reportes-inventario-campo">
              <label htmlFor="filtro-reporte">
                Filtrar inventario
              </label>

              <select
                id="filtro-reporte"
                className="form-select"
                value={filtro}
                onChange={(evento) =>
                  setFiltro(evento.target.value)
                }
              >
                <option value="todos">
                  Todos los productos
                </option>

                <option value="disponible">
                  Disponibles
                </option>

                <option value="critico">
                  Stock crítico
                </option>

                <option value="agotado">
                  Agotados
                </option>

                <option value="sin-definir">
                  Sin definir
                </option>
              </select>
            </div>

            <button
              type="button"
              className="reportes-inventario-boton"
              onClick={descargarCSV}
            >
              Descargar reporte CSV
            </button>
          </div>

          <p className="reportes-inventario-nota">
            Umbral de stock crítico: {LIMITE_STOCK_CRITICO} unidades.
            Se utiliza el precio de venta para calcular
            el valor estimado del inventario.
          </p>
        </section>

        {/* TABLA DEL INVENTARIO */}
        <section className="reportes-inventario-seccion">
          <div className="reportes-inventario-listado-encabezado">
            <h2>Detalle de inventario</h2>

            <span className="reportes-inventario-total">
              {productosFiltrados.length}{' '}
              {productosFiltrados.length === 1
                ? 'producto'
                : 'productos'}
            </span>
          </div>

          <div className="reportes-inventario-tabla-contenedor table-responsive">
            <table className="table table-hover align-middle reportes-inventario-tabla">
              <thead>
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Producto</th>
                  <th scope="col">Categoría</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>

              <tbody>
                {productosFiltrados.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>

                    <td className="reportes-inventario-nombre">
                      {producto.nombre}
                    </td>

                    <td>{producto.categoria}</td>

                    <td>
                      {formatearPrecio(producto.precio)}
                    </td>

                    <td>
                      {producto.estado.nivel === 'sin-definir'
                        ? 'Sin definir'
                        : producto.stock}
                    </td>

                    <td>
                      <span
                        className={`badge ${producto.estado.clase}`}
                      >
                        {producto.estado.nombre}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {productosFiltrados.length === 0 && (
              <p className="reportes-inventario-sin-resultados">
                No existen productos para el filtro seleccionado.
              </p>
            )}
          </div>
        </section>

      </div>
    </main>
  )
}
