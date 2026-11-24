
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import FormularioUsuario from '../../componentes/usuarios/FormularioUsuario'
import {
  crearUsuario,
  actualizarUsuario,
  obtenerUsuario
} from '../../servicios/usuariosServicio'

// Permite crear usuarios y editar usuarios existentes.
export default function EditorUsuario() {
  const { id } = useParams()
  const navigate = useNavigate()

  const editando = Boolean(id)

  const [existente, setExistente] = useState(null)
  const [cargando, setCargando] = useState(editando)
  const [errorCarga, setErrorCarga] = useState('')

  // Al editar: GET /usuarios/{id} para llenar el formulario
  useEffect(() => {
    if (!id) {
      return undefined
    }

    let activo = true

    obtenerUsuario(id)
      .then((usuario) => {
        if (activo) {
          setExistente(usuario)
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
  }, [id])

  async function guardar(datos) {
    try {
      if (editando) {
        await actualizarUsuario(id, datos)
      } else {
        await crearUsuario(datos)
      }

      navigate('/admin/usuarios')
    } catch (error) {
      return error.message
    }
  }

  if (cargando) {
    return (
      <main className="pagina-editor-usuario flex-grow-1">
        <div className="editor-usuario-contenedor">
          <p role="status">Cargando usuario...</p>
        </div>
      </main>
    )
  }

  if (editando && !existente) {
    return (
      <main className="pagina-editor-usuario flex-grow-1">
        <div className="editor-usuario-contenedor">
          <div className="editor-usuario-vacio">
            <h1>Usuario no encontrado</h1>

            <p>
              {errorCarga || 'El usuario que intentas editar no existe.'}
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
