
import { useState } from 'react'

import {
  obtenerProductos,
  guardarProductos as guardarProductosEnServicio
} from '../../servicios/productosServicio'

import {
  obtenerEstadoStock,
  LIMITE_STOCK_CRITICO
} from '../../funciones/estadoStock'

import { formatearPrecio } from '../../funciones/formato'

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

  // GUARDAR PRODUCTOS
  function guardarLista(lista) {
    const guardado = guardarProductosEnServicio(lista)

    if (guardado) {
      setProductos(lista)
      return true
    }

    setMensaje('No se pudieron guardar los cambios.')
    return false
  }

  // ACTUALIZAR CAMPOS
  function cambiarCampo(evento) {
    const { name, value } = evento.target

    setFormulario((actual) => ({
      ...actual,
      [name]: value
    }))
  }

  // LIMPIAR FORMULARIO
  function limpiarFormulario() {
    setFormulario({ ...formularioVacio })
    setEditando(false)
  }

  // AGREGAR O EDITAR PRODUCTO
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

  // EDITAR PRODUCTO
  function editarProducto(producto) {
    setFormulario({
      ...formularioVacio,
      ...producto
    })

    setEditando(true)
    setMensaje('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // ELIMINAR PRODUCTO
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

  // RESUMEN DE STOCK
  const resumenStock = {
    disponibles: 0,
    criticos: 0,
    agotados: 0,
    sinDefinir: 0
  }

  productos.forEach((producto) => {
    const nivel = obtenerEstadoStock(producto.stock).nivel

    if (nivel === 'disponible') {
      resumenStock.disponibles += 1
    }

    if (nivel === 'critico') {
      resumenStock.criticos += 1
    }

    if (nivel === 'agotado') {
      resumenStock.agotados += 1
    }

    if (nivel === 'sin-definir') {
      resumenStock.sinDefinir += 1
    }
  })

  // FILTROS
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

  const indicadores = [
    {
      titulo: 'Disponibles',
      cantidad: resumenStock.disponibles,
      clase: 'disponibles'
    },
    {
      titulo: 'Stock crítico',
      cantidad: resumenStock.criticos,
      clase: 'criticos'
    },
    {
      titulo: 'Agotados',
      cantidad: resumenStock.agotados,
      clase: 'agotados'
    },
    {
      titulo: 'Sin definir',
      cantidad: resumenStock.sinDefinir,
      clase: 'sin-definir'
    }
  ]

  return (
    <main className="pagina-admin-productos flex-grow-1">
      <div className="admin-productos-contenedor">

        {/* ENCABEZADO */}
        <header className="admin-productos-encabezado">
          <p className="admin-productos-etiqueta">
            ADMINISTRACIÓN HUERTOHOGAR
          </p>

          <h1>Administración de productos</h1>

          <p>
            Gestión de productos e inventario de HuertoHogar.
          </p>
        </header>

        {/* RESUMEN DE INVENTARIO */}
        <section className="admin-productos-seccion">
          <h2>Resumen de inventario</h2>

          <div className="admin-productos-indicadores">
            {indicadores.map((indicador) => (
              <article
                key={indicador.titulo}
                className={`admin-productos-indicador admin-productos-${indicador.clase}`}
              >
                <p>{indicador.titulo}</p>

                <strong>{indicador.cantidad}</strong>
              </article>
            ))}
          </div>

          <p className="admin-productos-nota">
            Stock crítico: entre 1 y {LIMITE_STOCK_CRITICO} unidades.
            Stock agotado: 0 unidades.
          </p>
        </section>

        {/* MENSAJES */}
        {mensaje && (
          <div className="alert alert-info" role="status">
            {mensaje}
          </div>
        )}

        {/* FORMULARIO */}
        <section className="admin-productos-formulario-tarjeta">
          <h2>
            {editando ? 'Editar producto' : 'Agregar producto'}
          </h2>

          <form onSubmit={guardarFormulario}>
            <div className="row g-3">

              <div className="col-md-4">
                <label
                  htmlFor="producto-id"
                  className="form-label"
                >
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
                <label
                  htmlFor="producto-nombre"
                  className="form-label"
                >
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
                <label
                  htmlFor="producto-categoria"
                  className="form-label"
                >
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
                <label
                  htmlFor="producto-unidad"
                  className="form-label"
                >
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
                <label
                  htmlFor="producto-precio"
                  className="form-label"
                >
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
                <label
                  htmlFor="producto-stock"
                  className="form-label"
                >
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
                <label
                  htmlFor="producto-imagen"
                  className="form-label"
                >
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
                <label
                  htmlFor="producto-descripcion"
                  className="form-label"
                >
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

            <div className="admin-productos-formulario-acciones">
              <button
                type="submit"
                className="admin-productos-boton-principal"
              >
                {editando
                  ? 'Guardar cambios'
                  : 'Agregar producto'}
              </button>

              <button
                type="button"
                className="admin-productos-boton-secundario"
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>

        {/* PRODUCTOS REGISTRADOS */}
        <section className="admin-productos-seccion">
          <div className="admin-productos-listado-encabezado">
            <h2>Productos registrados</h2>

            <span className="admin-productos-total">
              Total: {productos.length}
            </span>
          </div>

          {/* BUSCADOR Y FILTROS */}
          <div className="admin-productos-filtros">
            <input
              type="search"
              className="form-control"
              placeholder="Buscar por código, nombre o categoría"
              aria-label="Buscar productos"
              value={busqueda}
              onChange={(evento) =>
                setBusqueda(evento.target.value)
              }
            />

            <select
              className="form-select"
              aria-label="Filtrar por estado del stock"
              value={filtroStock}
              onChange={(evento) =>
                setFiltroStock(evento.target.value)
              }
            >
              <option value="todos">Todos los estados</option>
              <option value="disponible">Disponibles</option>
              <option value="critico">Stock crítico</option>
              <option value="agotado">Agotados</option>
              <option value="sin-definir">Sin definir</option>
            </select>
          </div>

          {/* TABLA */}
          <div className="admin-productos-tabla-contenedor table-responsive">
            <table className="table table-hover align-middle admin-productos-tabla">
              <thead>
                <tr>
                  <th scope="col">Imagen</th>
                  <th scope="col">Código</th>
                  <th scope="col">Producto</th>
                  <th scope="col">Categoría</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productosFiltrados.map((producto) => {
                  const estado = obtenerEstadoStock(
                    producto.stock
                  )

                  return (
                    <tr key={producto.id}>
                      <td>
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="admin-productos-imagen"
                        />
                      </td>

                      <td>{producto.id}</td>

                      <td className="admin-productos-nombre">
                        {producto.nombre}
                      </td>

                      <td>{producto.categoria}</td>

                      <td>
                        {formatearPrecio(producto.precio)}
                      </td>

                      <td>
                        {estado.nivel === 'sin-definir'
                          ? 'Sin definir'
                          : producto.stock}
                      </td>

                      <td>
                        <span
                          className={`badge ${estado.clase}`}
                        >
                          {estado.nombre}
                        </span>
                      </td>

                      <td>
                        <div className="admin-productos-acciones">
                          <button
                            type="button"
                            className="admin-productos-boton-editar"
                            onClick={() =>
                              editarProducto(producto)
                            }
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="admin-productos-boton-eliminar"
                            onClick={() =>
                              eliminarProducto(producto)
                            }
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
            <p className="admin-productos-sin-resultados">
              No se encontraron productos.
            </p>
          )}
        </section>

      </div>
    </main>
  )
}
