
import { useState } from 'react'
import { Link } from 'react-router-dom'

import useSesion from '../../contextos/useSesion'
import { obtenerUsuarios, eliminarUsuario } from '../../servicios/usuariosServicio'
import { formatearRun } from '../../funciones/formato'

export default function AdministrarUsuarios() {
  const { usuario: sesion } = useSesion()

  const [usuarios, setUsuarios] = useState(obtenerUsuarios)
  const [pendiente, setPendiente] = useState(null)
  const [mensaje, setMensaje] = useState('')

  function confirmarEliminacion() {
    eliminarUsuario(pendiente.run)
    setUsuarios(obtenerUsuarios())
    setMensaje(`Se eliminó a ${pendiente.nombre} ${pendiente.apellidos}.`)
    setPendiente(null)
  }

  return (
    <main className="container py-4 flex-grow-1 text-start">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h1 className="h3 mb-0" style={{ color: '#244D36' }}>Usuarios</h1>
          <p className="text-muted mb-0">{usuarios.length} usuarios registrados</p>
        </div>

        <Link to="/admin/usuarios/nuevo" className="btn btn-success">
          + Nuevo usuario
        </Link>
      </div>

      {mensaje && (
        <div className="alert alert-success" role="status">
          {mensaje}
        </div>
      )}

      {pendiente && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center flex-wrap gap-2" role="alert">
          <span>
            ¿Eliminar a <strong>{pendiente.nombre} {pendiente.apellidos}</strong>? Esta acción no se puede deshacer.
          </span>

          <span className="d-flex gap-2">
            <button type="button" className="btn btn-danger btn-sm" onClick={confirmarEliminacion}>
              Sí, eliminar
            </button>

            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setPendiente(null)}>
              Cancelar
            </button>
          </span>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover align-middle bg-white shadow-sm">
          <caption className="visually-hidden">Listado de usuarios</caption>
          <thead>
            <tr>
              <th scope="col">RUN</th>
              <th scope="col">Nombre</th>
              <th scope="col">Correo</th>
              <th scope="col">Comuna</th>
              <th scope="col">Rol</th>
              <th scope="col">
                <span className="visually-hidden">Acciones</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => {
              const esElMismo = sesion?.run === u.run

              return (
                <tr key={u.run}>
                  <td>{formatearRun(u.run)}</td>
                  <td>{u.nombre} {u.apellidos}</td>
                  <td>{u.correo}</td>
                  <td>{u.comuna}</td>
                  <td>
                    <span className={`badge ${u.rol === 'Administrador' ? 'bg-dark' : 'bg-success'}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="text-nowrap">
                    <Link to={`/admin/usuarios/${u.run}/editar`} className="btn btn-sm btn-outline-primary me-2">
                      Editar
                    </Link>

                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      disabled={esElMismo}
                      title={esElMismo ? 'No puedes eliminar tu propia cuenta' : undefined}
                      onClick={() => setPendiente(u)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </main>
  )
}
