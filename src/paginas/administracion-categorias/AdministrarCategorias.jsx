
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../../servicios/categoriasServicio'

const formularioInicial = {
  nombre: '',
  descripcion: ''
}

export default function AdministrarCategorias() {
  const [categorias, setCategorias] = useState([])
  const [formulario, setFormulario] = useState(formularioInicial)
  const [editandoId, setEditandoId] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  async function cargar() {
    setCargando(true)
    setError('')

    try {
      const datos = await listarCategorias()
      setCategorias(datos)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  function cambiarCampo(evento) {
    const { name, value } = evento.target

    setFormulario(actual => ({
      ...actual,
      [name]: value
    }))
  }

  function limpiar() {
    setFormulario({ ...formularioInicial })
    setEditandoId(null)
  }

  function editar(categoria) {
    setEditandoId(categoria.categoriaId)

    setFormulario({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion ?? ''
    })

    setError('')
    setMensaje('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function guardar(evento) {
    evento.preventDefault()
    setError('')
    setMensaje('')

    const datos = {
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim()
    }

    if (!datos.nombre || datos.nombre.length > 100) {
      setError('El nombre debe tener entre 1 y 100 caracteres.')
      return
    }

    if (datos.descripcion.length > 500) {
      setError('La descripción no puede superar los 500 caracteres.')
      return
    }

    setGuardando(true)

    try {
      if (editandoId !== null) {
        await actualizarCategoria(editandoId, datos)
        setMensaje('Categoría actualizada correctamente.')
      } else {
        await crearCategoria(datos)
        setMensaje('Categoría creada correctamente.')
      }

      limpiar()
      await cargar()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar(categoria) {
    const confirmado = window.confirm(
      `¿Eliminar la categoría "${categoria.nombre}"?`
    )

    if (!confirmado) return

    setError('')
    setMensaje('')
    setGuardando(true)

    try {
      await eliminarCategoria(categoria.categoriaId)
      setMensaje('Categoría eliminada correctamente.')

      if (editandoId === categoria.categoriaId) {
        limpiar()
      }

      await cargar()
    } catch (err) {
      if (err.estado === 409) {
        setError(
          'No se puede eliminar esta categoría porque tiene productos asociados.'
        )
      } else {
        setError(err.message)
      }
    } finally {
      setGuardando(false)
    }
  }

  const filtradas = categorias.filter(categoria =>
    `${categoria.nombre} ${categoria.descripcion ?? ''}`
      .toLocaleLowerCase('es-CL')
      .includes(busqueda.toLocaleLowerCase('es-CL').trim())
  )

  return (
    <main className="pagina-admin-productos flex-grow-1">
      <div className="admin-productos-contenedor">

        <header className="admin-productos-encabezado">
          <p className="admin-productos-etiqueta">
            ADMINISTRACIÓN HUERTOHOGAR
          </p>

          <h1>Administración de categorías</h1>
          <p>
            Crear, editar y eliminar categorías del catálogo.
          </p>

          <Link
            to="/admin"
            className="admin-productos-boton-secundario d-inline-block"
          >
            Volver al panel
          </Link>
        </header>

        {mensaje && (
          <div className="alert alert-success" role="status">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <section className="admin-productos-formulario-tarjeta">
          <h2>
            {editandoId !== null
              ? 'Editar categoría'
              : 'Agregar categoría'}
          </h2>

          <form onSubmit={guardar}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="categoria-nombre" className="form-label">
                  Nombre
                </label>

                <input
                  id="categoria-nombre"
                  name="nombre"
                  className="form-control"
                  maxLength={100}
                  required
                  value={formulario.nombre}
                  onChange={cambiarCampo}
                  disabled={guardando}
                />
              </div>

              <div className="col-12">
                <label
                  htmlFor="categoria-descripcion"
                  className="form-label"
                >
                  Descripción
                </label>

                <textarea
                  id="categoria-descripcion"
                  name="descripcion"
                  className="form-control"
                  maxLength={500}
                  rows={3}
                  value={formulario.descripcion}
                  onChange={cambiarCampo}
                  disabled={guardando}
                />
              </div>
            </div>

            <div className="admin-productos-formulario-acciones">
              <button
                type="submit"
                className="admin-productos-boton-principal"
                disabled={guardando}
              >
                {guardando
                  ? 'Guardando...'
                  : editandoId !== null
                    ? 'Guardar cambios'
                    : 'Agregar categoría'}
              </button>

              <button
                type="button"
                className="admin-productos-boton-secundario"
                onClick={limpiar}
                disabled={guardando}
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>

        <section className="admin-productos-seccion">
          <div className="admin-productos-listado-encabezado">
            <h2>Categorías registradas</h2>
            <span className="admin-productos-total">
              Total: {categorias.length}
            </span>
          </div>

          <div className="admin-productos-filtros">
            <input
              type="search"
              className="form-control"
              placeholder="Buscar categoría"
              aria-label="Buscar categoría"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>

          {cargando ? (
            <p role="status">Cargando categorías...</p>
          ) : (
            <div className="admin-productos-tabla-contenedor table-responsive">
              <table className="table table-hover align-middle admin-productos-tabla">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {filtradas.map(categoria => (
                    <tr key={categoria.categoriaId}>
                      <td>{categoria.categoriaId}</td>
                      <td>{categoria.nombre}</td>
                      <td>{categoria.descripcion || 'Sin descripción'}</td>
                      <td>
                        <div className="admin-productos-acciones">
                          <button
                            type="button"
                            className="admin-productos-boton-editar"
                            onClick={() => editar(categoria)}
                            disabled={guardando}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => eliminar(categoria)}
                            disabled={guardando}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtradas.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center">
                        No se encontraron categorías.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
