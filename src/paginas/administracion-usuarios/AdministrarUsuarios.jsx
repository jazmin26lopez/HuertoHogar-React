
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import useSesion from '../../contextos/useSesion'
import {
  listarUsuarios,
  desactivarUsuario
} from '../../servicios/usuariosServicio'
import { formatearRun } from '../../funciones/formato'

// Clase de color de la etiqueta según el rol
function claseRol(rol) {
  if (rol === 'Administrador') {
    return 'admin-usuarios-rol admin-usuarios-rol-admin'
  }

  if (rol === 'Vendedor') {
    return 'admin-usuarios-rol admin-usuarios-rol-vendedor'
  }

  return 'admin-usuarios-rol admin-usuarios-rol-cliente'
}

export default function AdministrarUsuarios() {
  const { usuario: sesion } = useSesion()

  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [pendiente, setPendiente] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [errorAccion, setErrorAccion] = useState('')

  // GET /usuarios al abrir la página
  useEffect(() => {
    let activo = true

    listarUsuarios()
      .then((lista) => {
        if (activo) {
          setUsuarios(lista)
        }
      })
      .catch((error) => {
        if (activo) {
          setErrorCarga(error.message)
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

  async function confirmarDesactivacion() {
    const objetivo = pendiente

    setErrorAccion('')
    setMensaje('')
    setPendiente(null)

    try {
      // DELETE /usuarios/{id}: el backend lo deja inactivo, no lo borra
      await desactivarUsuario(objetivo.usuarioId)

      setUsuarios((actuales) =>
        actuales.map((u) =>
          u.usuarioId === objetivo.usuarioId ? { ...u, activo: 'N' } : u
        )
      )

      setMensaje(
        `Se desactivó a ${objetivo.nombre} ${objetivo.apellidos}.`
      )
    } catch (error) {
      setErrorAccion(error.message)
    }
  }

  return (
    <main className="pagina-admin-usuarios flex-grow-1">
      <div className="admin-usuarios-contenedor">

        {/* ENCABEZADO */}
        <header className="admin-usuarios-encabezado">
          <div className="admin-usuarios-titulo">
            <p className="admin-usuarios-etiqueta">
              ADMINISTRACIÓN HUERTOHOGAR
            </p>

            <h1>Administración de usuarios</h1>

            {!cargando && !errorCarga && (
              <p>
                {usuarios.length}{' '}
                {usuarios.length === 1
                  ? 'usuario registrado'
                  : 'usuarios registrados'}
              </p>
            )}
          </div>

          <Link
            to="/admin/usuarios/nuevo"
            className="admin-usuarios-boton-principal"
          >
            + Nuevo usuario
          </Link>
        </header>

        {/* MENSAJES */}
        {mensaje && (
          <div className="alert alert-success" role="status">
            {mensaje}
          </div>
        )}

        {errorAccion && (
          <div className="alert alert-danger" role="alert">
            {errorAccion}
          </div>
        )}

        {/* CONFIRMACIÓN DE DESACTIVACIÓN */}
        {pendiente && (
          <div
            className="admin-usuarios-confirmacion"
            role="alert"
          >
            <p>
              ¿Desactivar a{' '}
              <strong>
                {pendiente.nombre} {pendiente.apellidos}
              </strong>
              ? Ya no podrá iniciar sesión.
            </p>

            <div className="admin-usuarios-confirmacion-botones">
              <button
                type="button"
                className="admin-usuarios-boton-eliminar"
                onClick={confirmarDesactivacion}
              >
                Sí, desactivar
              </button>

              <button
                type="button"
                className="admin-usuarios-boton-cancelar"
                onClick={() => setPendiente(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {cargando && (
          <p className="admin-usuarios-sin-datos" role="status">
            Cargando usuarios...
          </p>
        )}

        {errorCarga && (
          <div className="alert alert-danger" role="alert">
            No se pudieron cargar los usuarios. {errorCarga}
          </div>
        )}

        {/* LISTADO DE USUARIOS */}
        {!cargando && !errorCarga && (
          <div className="admin-usuarios-tabla-contenedor table-responsive">
            <table className="table table-hover align-middle admin-usuarios-tabla">
              <caption className="visually-hidden">
                Listado de usuarios
              </caption>

              <thead>
                <tr>
                  <th scope="col">RUN</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Correo</th>
                  <th scope="col">Comuna</th>
                  <th scope="col">Rol</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map((u) => {
                  const esElMismo = sesion?.usuarioId === u.usuarioId
                  const inactivo = u.activo === 'N'

                  return (
                    <tr key={u.usuarioId}>
                      <td>{formatearRun(u.run)}</td>

                      <td className="admin-usuarios-nombre">
                        {u.nombre} {u.apellidos}
                      </td>

                      <td>{u.correo}</td>
                      <td>{u.comuna}</td>

                      <td>
                        <span className={claseRol(u.rol)}>
                          {u.rol}
                        </span>

                        {inactivo && (
                          <span className="admin-usuarios-rol admin-usuarios-rol-inactivo">
                            Inactivo
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="admin-usuarios-acciones">
                          <Link
                            to={`/admin/usuarios/${u.usuarioId}/editar`}
                            className="admin-usuarios-boton-editar"
                          >
                            Editar
                          </Link>

                          <button
                            type="button"
                            className="admin-usuarios-boton-eliminar"
                            disabled={esElMismo || inactivo}
                            title={
                              esElMismo
                                ? 'No puedes desactivar tu propia cuenta'
                                : undefined
                            }
                            onClick={() => setPendiente(u)}
                          >
                            Desactivar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {!cargando && !errorCarga && usuarios.length === 0 && (
          <p className="admin-usuarios-sin-datos">
            No hay usuarios registrados.
          </p>
        )}

      </div>
    </main>
  )
}
