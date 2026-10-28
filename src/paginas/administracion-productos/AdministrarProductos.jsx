
import { useState } from 'react'
import {
  obtenerProductos,
  guardarProductos as guardarProductosEnServicio
} from '../../servicios/productosServicio'
import {
  obtenerEstadoStock,
  LIMITE_STOCK_CRITICO
} from '../../funciones/estadoStock'

const formularioVacio = {
  id: '',
  nombre: '',
  categoria: 'Frutas Frescas',
  precio: '',
  unidad: 'kilo',
  stock: '',
  imagen: '/imagenes/placeholder.svg',
  descripcion: ''
}

export default function AdministrarProductos() {
  const [productos, setProductos] = useState(obtenerProductos)
  const [formulario, setFormulario] = useState(formularioVacio)
  const [editando, setEditando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [filtroStock, setFiltroStock] = useState('todos')

  function guardarLista(lista) {
    const guardado = guardarProductosEnServicio(lista)

    if (guardado) {
      setProductos(lista)
      return true
    }

    setMensaje('No se pudieron guardar los cambios.')
    return false
  }

  function cambiarCampo(evento) {
    const { name, value } = evento.target

    setFormulario((actual) => ({
      ...actual,
      [name]: value
    }))
  }

  function limpiarFormulario() {
    setFormulario({ ...formularioVacio })
    setEditando(false)
  }

  function guardarFormulario(evento) {
    evento.preventDefault()

    const id = formulario.id.trim()
    const nombre = formulario.nombre.trim()
    const precio = Number(formulario.precio)
    const stock = Number(formulario.stock)

    if (
      !id ||
      !nombre ||
      !Number.isInteger(precio) ||
      precio <= 0 ||
      !Number.isInteger(stock) ||
      stock < 0 ||
      !formulario.categoria.trim() ||
      !formulario.unidad.trim()
    ) {
      setMensaje(
        'Revisa los datos: precio entero mayor que 0 y stock entero no negativo.'
      )
      return
    }

    if (!editando && productos.some((p) => p.id === id)) {
      setMensaje('Ya existe un producto con ese código.')
      return
    }

    if (editando && !productos.some((p) => p.id === id)) {
      setMensaje('El producto que intentas editar ya no existe.')
      return
    }

    const producto = {
      ...formulario,
      id,
      nombre,
      precio,
      stock,
      categoria: formulario.categoria.trim(),
      unidad: formulario.unidad.trim(),
      imagen:
        formulario.imagen.trim() ||
        '/imagenes/placeholder.svg',
      descripcion: formulario.descripcion.trim()
    }

    const actualizados = editando
      ? productos.map((p) => (p.id === id ? producto : p))
      : [...productos, producto]

    if (guardarLista(actualizados)) {
      setMensaje(
        editando
          ? 'Producto actualizado correctamente.'
          : 'Producto agregado correctamente.'
      )
      limpiarFormulario()
    }
  }

  function editarProducto(producto) {
    setFormulario({
      ...formularioVacio,
      ...producto
    })
    setEditando(true)
    setMensaje('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function eliminarProducto(producto) {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) {
      return
    }

    const actualizados = productos.filter(
      (p) => p.id !== producto.id
    )

    if (guardarLista(actualizados)) {
      setMensaje('Producto eliminado correctamente.')

      if (formulario.id === producto.id) {
        limpiarFormulario()
      }
    }
  }

  const resumenStock = {
    disponibles: 0,
    criticos: 0,
    agotados: 0,
    sinDefinir: 0
  }

  productos.forEach((producto) => {
    const nivel = obtenerEstadoStock(producto.stock).nivel

    if (nivel === 'disponible') resumenStock.disponibles += 1
    if (nivel === 'critico') resumenStock.criticos += 1
    if (nivel === 'agotado') resumenStock.agotados += 1
    if (nivel === 'sin-definir') resumenStock.sinDefinir += 1
  })

  const productosFiltrados = productos.filter((producto) => {
    const texto =
      `${producto.nombre} ${producto.id} ${producto.categoria}`
        .toLocaleLowerCase('es-CL')

    const coincideBusqueda = texto.includes(
      busqueda.toLocaleLowerCase('es-CL').trim()
    )

    const coincideStock =
      filtroStock === 'todos' ||
      obtenerEstadoStock(producto.stock).nivel === filtroStock

    return coincideBusqueda && coincideStock
  })

  function formatearPrecio(valor) {
    return '$' + Number(valor).toLocaleString('es-CL')
  }

  return (
    <main className="container py-4 flex-grow-1">
      <h1 className="mb-2" style={{ color: '#244D36' }}>
        Administración de productos
      </h1>

      <p className="text-muted">
        Gestión de productos e inventario de HuertoHogar.
      </p>

      {/* RESUMEN DEL INVENTARIO */}
      <section className="mb-4">
        <h2 className="h4 mb-3">Resumen de inventario</h2>

        <div className="row g-3">
          {[
            {
              titulo: 'Disponibles',
              cantidad: resumenStock.disponibles,
              color: 'success'
            },
            {
              titulo: 'Stock crítico',
              cantidad: resumenStock.criticos,
              color: 'warning'
            },
            {
              titulo: 'Agotados',
              cantidad: resumenStock.agotados,
              color: 'danger'
            },
            {
              titulo: 'Sin definir',
              cantidad: resumenStock.sinDefinir,
              color: 'secondary'
            }
          ].map((indicador) => (
            <div className="col-6 col-lg-3" key={indicador.titulo}>
              <div className={`card h-100 border-${indicador.color} shadow-sm`}>
                <div className="card-body text-center">
                  <h3 className="h6">{indicador.titulo}</h3>
                  <p className="display-6 fw-bold mb-0">
                    {indicador.cantidad}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-muted small mt-2">
          Stock crítico: entre 1 y {LIMITE_STOCK_CRITICO} unidades.
          Stock agotado: 0 unidades.
        </p>
      </section>

      {mensaje && (
        <div className="alert alert-info" role="status">
          {mensaje}
        </div>
      )}

      {/* FORMULARIO */}
      <section className="card p-4 mb-4 shadow-sm">
        <h2 className="h4 mb-3">
          {editando ? 'Editar producto' : 'Agregar producto'}
        </h2>

        <form onSubmit={guardarFormulario}>
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="producto-id" className="form-label">
                Código
              </label>
              <input
                id="producto-id"
                className="form-control"
                name="id"
                value={formulario.id}
                onChange={cambiarCampo}
                disabled={editando}
                required
              />
            </div>

            <div className="col-md-8">
              <label htmlFor="producto-nombre" className="form-label">
                Nombre
              </label>
              <input
                id="producto-nombre"
                className="form-control"
                name="nombre"
                value={formulario.nombre}
                onChange={cambiarCampo}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="producto-categoria" className="form-label">
                Categoría
              </label>
              <select
                id="producto-categoria"
                className="form-select"
                name="categoria"
                value={formulario.categoria}
                onChange={cambiarCampo}
              >
                <option>Frutas Frescas</option>
                <option>Verduras Orgánicas</option>
                <option>Productos Orgánicos</option>
                <option>Productos Lácteos</option>
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="producto-unidad" className="form-label">
                Unidad de venta
              </label>
              <input
                id="producto-unidad"
                className="form-control"
                name="unidad"
                value={formulario.unidad}
                onChange={cambiarCampo}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="producto-precio" className="form-label">
                Precio (CLP)
              </label>
              <input
                id="producto-precio"
                type="number"
                min="1"
                step="1"
                className="form-control"
                name="precio"
                value={formulario.precio}
                onChange={cambiarCampo}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="producto-stock" className="form-label">
                Stock
              </label>
              <input
                id="producto-stock"
                type="number"
                min="0"
                step="1"
                className="form-control"
                name="stock"
                value={formulario.stock}
                onChange={cambiarCampo}
                required
              />
            </div>

            <div className="col-12">
              <label htmlFor="producto-imagen" className="form-label">
                Ruta de imagen
              </label>
              <input
                id="producto-imagen"
                className="form-control"
                name="imagen"
                value={formulario.imagen}
                onChange={cambiarCampo}
                placeholder="/imagenes/manzanas.jpg"
              />
              <small className="text-muted">
                Las imágenes deben estar en public/imagenes.
              </small>
            </div>

            <div className="col-12">
              <label htmlFor="producto-descripcion" className="form-label">
                Descripción
              </label>
              <textarea
                id="producto-descripcion"
                className="form-control"
                name="descripcion"
                rows="3"
                value={formulario.descripcion}
                onChange={cambiarCampo}
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-3 flex-wrap">
            <button type="submit" className="btn btn-success">
              {editando ? 'Guardar cambios' : 'Agregar producto'}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={limpiarFormulario}
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>

      {/* TABLA DE PRODUCTOS */}
      <section>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h2 className="h4 mb-0">Productos registrados</h2>
          <span className="badge bg-success">
            Total: {productos.length}
          </span>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-md-7">
            <input
              type="search"
              className="form-control"
              placeholder="Buscar por código, nombre o categoría"
              aria-label="Buscar productos"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </div>

          <div className="col-md-5">
            <select
              className="form-select"
              aria-label="Filtrar por estado del stock"
              value={filtroStock}
              onChange={(evento) => setFiltroStock(evento.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="disponible">Disponibles</option>
              <option value="critico">Stock crítico</option>
              <option value="agotado">Agotados</option>
              <option value="sin-definir">Sin definir</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productosFiltrados.map((producto) => {
                const estado = obtenerEstadoStock(producto.stock)

                return (
                  <tr key={producto.id}>
                    <td>
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        width="55"
                        height="55"
                        style={{
                          objectFit: 'cover',
                          borderRadius: '6px'
                        }}
                      />
                    </td>

                    <td>{producto.id}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.categoria}</td>

                    <td>{formatearPrecio(producto.precio)}</td>

                    <td>
                      {estado.nivel === 'sin-definir'
                        ? 'Sin definir'
                        : producto.stock}
                    </td>

                    <td>
                      <span className={`badge ${estado.clase}`}>
                        {estado.nombre}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success"
                          onClick={() => editarProducto(producto)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => eliminarProducto(producto)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {productosFiltrados.length === 0 && (
          <p className="text-muted">
            No se encontraron productos.
          </p>
        )}
      </section>
    </main>
  )
}
