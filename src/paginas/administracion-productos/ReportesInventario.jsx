
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

const formatoPrecio = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
})

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

  const inventario = productos.map((producto) => ({
    ...producto,
    estado: obtenerEstadoStock(producto.stock)
  }))

  const productosFiltrados = inventario.filter((producto) => {
    return (
      filtro === 'todos' ||
      producto.estado.nivel === filtro
    )
  })

  // Solo se valorizan existencias con stock definido.
  const valorInventario = inventario.reduce((total, producto) => {
    if (producto.estado.nivel === 'sin-definir') {
      return total
    }

    return total +
      Number(producto.precio) * Number(producto.stock)
  }, 0)

  const productosCriticos = inventario.filter(
    (producto) => producto.estado.nivel === 'critico'
  ).length

  const productosAgotados = inventario.filter(
    (producto) => producto.estado.nivel === 'agotado'
  ).length

  const productosSinDefinir = inventario.filter(
    (producto) => producto.estado.nivel === 'sin-definir'
  ).length

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
    <main className="container py-4 flex-grow-1">

      <Link
        to="/admin"
        className="btn btn-outline-success mb-4"
      >
        ← Volver al panel
      </Link>

      <h1 style={{ color: '#8B4513' }}>
        Reportes de inventario
      </h1>

      <p className="text-muted mb-4">
        Consulta las existencias y los productos
        que requieren reposición.
      </p>

      {/* INDICADORES */}
      <section className="row g-3 mb-4">

        <div className="col-6 col-lg-3">
          <article className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h2 className="h6">Productos</h2>
              <p className="fs-2 fw-bold mb-0">
                {productos.length}
              </p>
            </div>
          </article>
        </div>

        <div className="col-6 col-lg-3">
          <article className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h2 className="h6">Stock crítico</h2>
              <p className="fs-2 fw-bold text-warning mb-0">
                {productosCriticos}
              </p>
            </div>
          </article>
        </div>

        <div className="col-6 col-lg-3">
          <article className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h2 className="h6">Agotados</h2>
              <p className="fs-2 fw-bold text-danger mb-0">
                {productosAgotados}
              </p>
            </div>
          </article>
        </div>

        <div className="col-6 col-lg-3">
          <article className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h2 className="h6">Valor del inventario</h2>
              <p className="fs-5 fw-bold text-success mb-0">
                {formatoPrecio.format(valorInventario)}
              </p>
            </div>
          </article>
        </div>

      </section>

      {productosSinDefinir > 0 && (
        <div className="alert alert-info">
          Hay {productosSinDefinir} productos sin stock
          definido. No se incluyen en el valor calculado.
        </div>
      )}

      {/* FILTROS */}
      <section className="mb-3">
        <div className="row g-3 align-items-end">

          <div className="col-12 col-md-6">
            <label
              htmlFor="filtro-reporte"
              className="form-label"
            >
              Filtrar inventario
            </label>

            <select
              id="filtro-reporte"
              className="form-select"
              value={filtro}
              onChange={(evento) => setFiltro(evento.target.value)}
            >
              <option value="todos">Todos los productos</option>
              <option value="disponible">Disponibles</option>
              <option value="critico">Stock crítico</option>
              <option value="agotado">Agotados</option>
              <option value="sin-definir">Sin definir</option>
            </select>
          </div>

          <div className="col-12 col-md-6">
            <button
              type="button"
              className="btn btn-success"
              onClick={descargarCSV}
            >
              Descargar reporte CSV
            </button>
          </div>

        </div>
      </section>

      <p className="text-muted small">
        Umbral de stock crítico: {LIMITE_STOCK_CRITICO} unidades.
        Se utiliza el precio de venta para calcular
        el valor estimado del inventario.
      </p>

      {/* TABLA */}
      <section className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {productosFiltrados.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.categoria}</td>
                <td>{formatoPrecio.format(producto.precio)}</td>
                <td>
                  {producto.estado.nivel === 'sin-definir'
                    ? 'Sin definir'
                    : producto.stock}
                </td>
                <td>
                  <span className={`badge ${producto.estado.clase}`}>
                    {producto.estado.nombre}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {productosFiltrados.length === 0 && (
          <p className="text-muted">
            No existen productos para el filtro seleccionado.
          </p>
        )}
      </section>

    </main>
  )
}
