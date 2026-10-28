
import { useState } from 'react'
import {
  obtenerProductos,
  guardarProductos as guardarProductosEnServicio
} from '../../servicios/productosServicio'

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

  // Guardar productos mediante el servicio compartido
  const guardarProductos = (lista) => {
    const guardado = guardarProductosEnServicio(lista)

    if (guardado) {
      setProductos(lista)
      return true
    }

    setMensaje('No se pudieron guardar los cambios.')
    return false
  }

  // Actualizar los campos del formulario
  const cambiarCampo = (evento) => {
    const { name, value } = evento.target

    setFormulario((actual) => ({
      ...actual,
      [name]: value
    }))
  }

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormulario({ ...formularioVacio })
    setEditando(false)
  }

  // Crear o actualizar producto
  const guardarFormulario = (evento) => {
    evento.preventDefault()

    const id = formulario.id.trim()
    const nombre = formulario.nombre.trim()
    const precio = Number(formulario.precio)
    const stock = Number(formulario.stock)

    if (
      !id ||
      !nombre ||
      !Number.isFinite(precio) ||
      precio <= 0 ||
      !Number.isInteger(precio) ||
      !Number.isInteger(stock) ||
      stock < 0 ||
      !formulario.categoria.trim() ||
      !formulario.unidad.trim()
    ) {
      setMensaje(
        'Revisa los datos: el precio debe ser un entero mayor que 0 y el stock un entero no negativo.'
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
      ? productos.map((p) =>
          p.id === id ? producto : p
        )
      : [...productos, producto]

    if (guardarProductos(actualizados)) {
      setMensaje(
        editando
          ? 'Producto actualizado correctamente.'
          : 'Producto agregado correctamente.'
      )

      limpiarFormulario()
    }
  }

  // Cargar datos de un producto en el formulario
  const editarProducto = (producto) => {
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

  // Eliminar producto
  const eliminarProducto = (producto) => {
    const confirmar = window.confirm(
      `¿Estás segura de eliminar "${producto.nombre}"?`
    )

    if (!confirmar) return

    const actualizados = productos.filter(
      (p) => p.id !== producto.id
    )

    if (guardarProductos(actualizados)) {
      setMensaje('Producto eliminado correctamente.')

      if (formulario.id === producto.id) {
        limpiarFormulario()
      }
    }
  }

  // Buscar productos
  const productosFiltrados = productos.filter((producto) =>
    `${producto.nombre} ${producto.id} ${producto.categoria}`
      .toLowerCase()
      .includes(busqueda.toLowerCase().trim())
  )

  // Formato de precio chileno
  const formatearPrecio = (precio) =>
    '$' + Number(precio).toLocaleString('es-CL')

  return (
    <main className="container py-4 flex-grow-1">
      <h1
        className="mb-2"
        style={{ color: '#244D36' }}
      >
        Administración de productos
      </h1>

      <p className="text-muted">
        Agrega, consulta, modifica y elimina productos
        de HuertoHogar.
      </p>

      {mensaje && (
        <div
          className="alert alert-info"
          role="status"
        >
          {mensaje}
        </div>
      )}

      {/* FORMULARIO */}
      <section className="card p-4 mb-4 shadow-sm">
        <h2 className="h4 mb-3">
          {editando
            ? 'Editar producto'
            : 'Agregar producto'}
        </h2>

        <form onSubmit={guardarFormulario}>
          <div className="row g-3">
            {/* Código */}
            <div className="col-md-4">
              <label
                htmlFor="producto-id"
                className="form-label"
              >
                Código
              </label>

              <input
                id="producto-id"
                type="text"
                className="form-control"
                name="id"
                value={formulario.id}
                onChange={cambiarCampo}
                disabled={editando}
                required
              />
            </div>

            {/* Nombre */}
            <div className="col-md-8">
              <label
                htmlFor="producto-nombre"
                className="form-label"
              >
                Nombre
              </label>

              <input
                id="producto-nombre"
                type="text"
                className="form-control"
                name="nombre"
                value={formulario.nombre}
                onChange={cambiarCampo}
                required
              />
            </div>

            {/* Categoría */}
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
                <option value="Frutas Frescas">
                  Frutas Frescas
                </option>

                <option value="Verduras Orgánicas">
                  Verduras Orgánicas
                </option>

                <option value="Productos Orgánicos">
                  Productos Orgánicos
                </option>

                <option value="Productos Lácteos">
                  Productos Lácteos
                </option>
              </select>
            </div>

            {/* Unidad */}
            <div className="col-md-6">
              <label
                htmlFor="producto-unidad"
                className="form-label"
              >
                Unidad de venta
              </label>

              <input
                id="producto-unidad"
                type="text"
                className="form-control"
                name="unidad"
                value={formulario.unidad}
                onChange={cambiarCampo}
                placeholder="Ejemplo: kilo, litro, bolsa 500g"
                required
              />
            </div>

            {/* Precio */}
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
                className="form-control"
                name="precio"
                min="1"
                step="1"
                value={formulario.precio}
                onChange={cambiarCampo}
                required
              />
            </div>

            {/* Stock */}
            <div className="col-md-6">
              <label
                htmlFor="producto-stock"
                className="form-label"
              >
                Stock disponible
              </label>

              <input
                id="producto-stock"
                type="number"
                className="form-control"
                name="stock"
                min="0"
                step="1"
                value={formulario.stock}
                onChange={cambiarCampo}
                required
              />
            </div>

            {/* Imagen */}
            <div className="col-12">
              <label
                htmlFor="producto-imagen"
                className="form-label"
              >
                Ruta de la imagen
              </label>

              <input
                id="producto-imagen"
                type="text"
                className="form-control"
                name="imagen"
                value={formulario.imagen}
                onChange={cambiarCampo}
                placeholder="/imagenes/manzanas.jpg"
              />

              <small className="text-muted">
                Las imágenes deben encontrarse en
                public/imagenes.
              </small>
            </div>

            {/* Descripción */}
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
                placeholder="Descripción del producto"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="d-flex gap-2 mt-3 flex-wrap">
            <button
              type="submit"
              className="btn btn-success"
            >
              {editando
                ? 'Guardar cambios'
                : 'Agregar producto'}
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

      {/* LISTA DE PRODUCTOS */}
      <section>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h2 className="h4 mb-0">
            Productos registrados
          </h2>

          <span className="badge bg-success">
            Total: {productos.length}
          </span>
        </div>

        {/* Buscador */}
        <input
          type="search"
          className="form-control mb-3"
          placeholder="Buscar por código, nombre o categoría"
          aria-label="Buscar productos"
          value={busqueda}
          onChange={(evento) =>
            setBusqueda(evento.target.value)
          }
        />

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
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productosFiltrados.map((producto) => (
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

                  <td>
                    {formatearPrecio(producto.precio)}
                  </td>

                  <td>
                    {producto.stock === undefined ||
                    producto.stock === null
                      ? 'Sin definir'
                      : Number(producto.stock) === 0
                        ? 'Agotado'
                        : producto.stock}
                  </td>

                  <td>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        onClick={() =>
                          editarProducto(producto)
                        }
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          eliminarProducto(producto)
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
