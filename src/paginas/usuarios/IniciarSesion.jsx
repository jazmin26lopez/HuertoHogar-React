
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import useSesion from '../../contextos/useSesion'
import CampoFormulario from '../../componentes/formularios/CampoFormulario'
import { validarInicioSesion } from '../../funciones/validaciones'

export default function IniciarSesion() {
  const { usuario, iniciarSesion } = useSesion()
  const navigate = useNavigate()

  const [datos, setDatos] = useState({ correo: '', contrasena: '' })
  const [errores, setErrores] = useState({})
  const [mensajeError, setMensajeError] = useState('')

  // Quien llega a esta página con la sesión ya iniciada no necesita ver el formulario.
  // Se mira solo al llegar: si se mirara siempre, al iniciar sesión esta redirección
  // se cruzaría con la navegación hacia el panel de administración.
  const [teniaSesion] = useState(() => Boolean(usuario))

  if (teniaSesion) {
    return <Navigate to="/" replace />
  }

  function cambiar(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value })
  }

  function enviar(evento) {
    evento.preventDefault()
    setMensajeError('')

    const erroresEncontrados = validarInicioSesion(datos.correo, datos.contrasena)

    setErrores(erroresEncontrados)

    if (Object.keys(erroresEncontrados).length > 0) {
      return
    }

    const encontrado = iniciarSesion(datos.correo, datos.contrasena)

    if (!encontrado) {
      setMensajeError('Correo o contraseña incorrectos.')
      return
    }

    navigate(encontrado.rol === 'Administrador' ? '/admin/usuarios' : '/')
  }

  return (
    <main className="container py-5 flex-grow-1">
      <div className="mx-auto" style={{ maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <span className="fs-1" aria-hidden="true">🌿</span>
          <h1 className="h3" style={{ color: '#244D36' }}>¡Qué bueno verte de nuevo!</h1>
          <p className="text-muted">Inicia sesión para continuar disfrutando de HuertoHogar.</p>
        </div>

        <form onSubmit={enviar} noValidate className="card shadow-sm card-body text-start">
          <CampoFormulario
            id="correo"
            etiqueta="Correo electrónico"
            tipo="email"
            valor={datos.correo}
            alCambiar={cambiar}
            error={errores.correo}
            autoComplete="email"
            placeholder="ejemplo@correo.com"
          />

          <CampoFormulario
            id="contrasena"
            etiqueta="Contraseña"
            tipo="password"
            valor={datos.contrasena}
            alCambiar={cambiar}
            error={errores.contrasena}
            autoComplete="current-password"
            placeholder="Ingresa tu contraseña"
          />

          {mensajeError && (
            <div className="alert alert-danger" role="alert">
              {mensajeError}
            </div>
          )}

          <button type="submit" className="btn btn-success">
            Iniciar sesión
          </button>
        </form>

        <p className="text-center mt-3">
          ¿Aún no tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </main>
  )
}
