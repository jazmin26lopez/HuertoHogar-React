
import { useState } from 'react'
import { Link } from 'react-router-dom'

import useSesion from '../../contextos/useSesion'
import {
  obtenerUsuarios,
  eliminarUsuario
} from '../../servicios/usuariosServicio'
import { formatearRun } from '../../funciones/formato'

export default function AdministrarUsuarios() {
  const { usuario: sesion } = useSesion()

  const [usuarios, setUsuarios] = useState(obtenerUsuarios)
  const [pendiente, setPendiente] = useState(null)
  const [mensaje, setMensaje] = useState('')

  function confirmarEliminacion() {
    eliminarUsuario(pendiente.run)
    setUsuarios(obtenerUsuarios())

    setMensaje(
      `Se eliminó a ${pendiente.nombre} ${pendiente.apellidos}.`
    )

    setPendiente(null)
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

            <p>
              {usuarios.length}{' '}
              {usuarios.length === 1
                ? 'usuario registrado'
                : 'usuarios registrados'}
            </p>
          </div>

          <Link
            to="/admin/usuarios/nuevo"
            className="admin-usuarios-boton-principal"
          >
            + Nuevo usuario
          </Link>
        </header>

        {/* MENSAJE DE ÉXITO */}
        {mensaje && (
          <div className="alert alert-success" role="status">
            {mensaje}
          </div>
        )}

        {/* CONFIRMACIÓN DE ELIMINACIÓN */}
        {pendiente && (
          <div
            className="admin-usuarios-confirmacion"
            role="alert"
          >
            <p>
              ¿Eliminar a{' '}
              <strong>
                {pendiente.nombre} {pendiente.apellidos}
              </strong>
              ? Esta acción no se puede deshacer.
            </p>

            <div className="admin-usuarios-confirmacion-botones">
              <button
                type="button"
                className="admin-usuarios-boton-eliminar"
                onClick={confirmarEliminacion}
              >
                Sí, eliminar
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

        {/* LISTADO DE USUARIOS */}
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
                const esElMismo = sesion?.run === u.run

                return (
                  <tr key={u.run}>
                    <td>{formatearRun(u.run)}</td>

                    <td className="admin-usuarios-nombre">
                      {u.nombre} {u.apellidos}
                    </td>

                    <td>{u.correo}</td>
                    <td>{u.comuna}</td>

                    <td>
                      <span
                        className={
                          u.rol === 'Administrador'
                            ? 'admin-usuarios-rol admin-usuarios-rol-admin'
                            : 'admin-usuarios-rol admin-usuarios-rol-cliente'
                        }
                      >
                        {u.rol}
                      </span>
                    </td>

                    <td>
                      <div className="admin-usuarios-acciones">
                        <Link
                          to={`/admin/usuarios/${u.run}/editar`}
                          className="admin-usuarios-boton-editar"
                        >
                          Editar
                        </Link>

                        <button
                          type="button"
                          className="admin-usuarios-boton-eliminar"
                          disabled={esElMismo}
                          title={
                            esElMismo
                              ? 'No puedes eliminar tu propia cuenta'
                              : undefined
                          }
                          onClick={() => setPendiente(u)}
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

        {usuarios.length === 0 && (
          <p className="admin-usuarios-sin-datos">
            No hay usuarios registrados.
          </p>
        )}

      </div>
    </main>
  )
}
