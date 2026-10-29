
import { Link, useNavigate, useParams } from 'react-router-dom'

import FormularioUsuario from '../../componentes/usuarios/FormularioUsuario'
import {
  crearUsuario,
  actualizarUsuario,
  obtenerUsuarioPorRun
} from '../../servicios/usuariosServicio'

// Permite crear usuarios y editar usuarios existentes.
export default function EditorUsuario() {
  const { run } = useParams()
  const navigate = useNavigate()

  const editando = Boolean(run)
  const existente = editando ? obtenerUsuarioPorRun(run) : null

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

  if (editando && !existente) {
    return (
      <main className="pagina-editor-usuario flex-grow-1">
        <div className="editor-usuario-contenedor">
          <div className="editor-usuario-vacio">
            <h1>Usuario no encontrado</h1>

            <p>
              El usuario que intentas editar no existe.
            </p>

            <Link
              to="/admin/usuarios"
              className="editor-usuario-boton"
            >
              Volver al listado
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="pagina-editor-usuario flex-grow-1">
      <div className="editor-usuario-contenedor">

        {/* NAVEGACIÓN */}
        <nav className="editor-usuario-navegacion">
          <Link
            to="/admin/usuarios"
            className="editor-usuario-volver"
          >
            ← Volver al listado
          </Link>
        </nav>

        {/* ENCABEZADO */}
        <header className="editor-usuario-encabezado">
          <p className="editor-usuario-etiqueta">
            ADMINISTRACIÓN HUERTOHOGAR
          </p>

          <h1>
            {editando ? 'Editar usuario' : 'Nuevo usuario'}
          </h1>

          <p>
            {editando
              ? 'Actualiza la información del usuario seleccionado.'
              : 'Completa los datos para registrar un nuevo usuario.'}
          </p>
        </header>

        {/* FORMULARIO ORIGINAL DE BRYAM */}
        <div className="editor-usuario-formulario">
          <FormularioUsuario
            modo={editando ? 'editar' : 'crear'}
            usuarioInicial={existente}
            textoBoton={
              editando ? 'Guardar cambios' : 'Crear usuario'
            }
            alGuardar={guardar}
            alCancelar={() => navigate('/admin/usuarios')}
          />
        </div>

      </div>
    </main>
  )
}
