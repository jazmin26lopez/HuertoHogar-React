
import { Link, useNavigate, useParams } from 'react-router-dom'

import FormularioUsuario from '../../componentes/usuarios/FormularioUsuario'
import {
  crearUsuario,
  actualizarUsuario,
  obtenerUsuarioPorRun
} from '../../servicios/usuariosServicio'

// Sirve para dos rutas: /admin/usuarios/nuevo (sin :run) y /admin/usuarios/:run/editar.
export default function EditorUsuario() {
  const { run } = useParams()
  const navigate = useNavigate()

  const editando = Boolean(run)
  const existente = editando ? obtenerUsuarioPorRun(run) : null

  if (editando && !existente) {
    return (
      <main className="container py-5 flex-grow-1">
        <h1>Usuario no encontrado</h1>

        <p>El usuario que intentas editar no existe.</p>

        <Link to="/admin/usuarios" className="btn btn-success">
          Volver al listado
        </Link>
      </main>
    )
  }

  function guardar(datos) {
    try {
      if (editando) {
        actualizarUsuario(run, datos)
      } else {
        crearUsuario(datos)
      }

      navigate('/admin/usuarios')
    } catch (error) {
      return error.message
    }
  }

  return (
    <main className="container py-4 flex-grow-1 text-start">
      <div className="mx-auto" style={{ maxWidth: '680px' }}>
        <Link to="/admin/usuarios" className="btn btn-outline-success mb-3">
          ← Volver al listado
        </Link>

        <h1 className="h3" style={{ color: '#244D36' }}>
          {editando ? 'Editar usuario' : 'Nuevo usuario'}
        </h1>

        <FormularioUsuario
          modo={editando ? 'editar' : 'crear'}
          usuarioInicial={existente}
          textoBoton={editando ? 'Guardar cambios' : 'Crear usuario'}
          alGuardar={guardar}
          alCancelar={() => navigate('/admin/usuarios')}
        />
      </div>
    </main>
  )
}
