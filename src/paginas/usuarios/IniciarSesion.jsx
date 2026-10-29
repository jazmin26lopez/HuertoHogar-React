
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import useSesion from '../../contextos/useSesion'
import CampoFormulario from '../../componentes/formularios/CampoFormulario'
import { validarInicioSesion } from '../../funciones/validaciones'

export default function IniciarSesion() {
  const { usuario, iniciarSesion } = useSesion()
  const navigate = useNavigate()

  const [datos, setDatos] = useState({
    correo: '',
    contrasena: ''
  })

  const [errores, setErrores] = useState({})
  const [mensajeError, setMensajeError] = useState('')

  // Mantener la redirección original de Bryam.
  const [teniaSesion] = useState(() => Boolean(usuario))

  if (teniaSesion) {
    return <Navigate to="/" replace />
  }

  function cambiar(evento) {
    setDatos({
      ...datos,
      [evento.target.name]: evento.target.value
    })
  }

  function enviar(evento) {
    evento.preventDefault()
    setMensajeError('')

    const erroresEncontrados = validarInicioSesion(
      datos.correo,
      datos.contrasena
    )

    setErrores(erroresEncontrados)

    if (Object.keys(erroresEncontrados).length > 0) {
      return
    }

    const encontrado = iniciarSesion(
      datos.correo,
      datos.contrasena
    )

    if (!encontrado) {
      setMensajeError('Correo o contraseña incorrectos.')
      return
    }

    navigate(
      encontrado.rol === 'Administrador'
        ? '/admin/usuarios'
        : '/'
    )
  }

  return (
    <main className="pagina-iniciar-sesion flex-grow-1">
      <div className="inicio-sesion-contenedor">

        {/* ENCABEZADO */}
        <header className="inicio-sesion-encabezado">
          <p className="inicio-sesion-etiqueta">
            HUERTOHOGAR
          </p>

          <h1>¡Qué bueno verte de nuevo!</h1>

          <p>
            Inicia sesión para continuar disfrutando
            de HuertoHogar.
          </p>
        </header>

        {/* FORMULARIO */}
        <form
          onSubmit={enviar}
          noValidate
          className="inicio-sesion-formulario"
        >
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
            <div
              className="alert alert-danger"
              role="alert"
            >
              {mensajeError}
            </div>
          )}

          <button
            type="submit"
            className="inicio-sesion-boton"
          >
            Iniciar sesión
          </button>
        </form>

        {/* ENLACE DE REGISTRO */}
        <p className="inicio-sesion-registro">
          ¿Aún no tienes cuenta?{' '}
          <Link to="/registro">
            Regístrate aquí
          </Link>
        </p>

      </div>
    </main>
  )
}
