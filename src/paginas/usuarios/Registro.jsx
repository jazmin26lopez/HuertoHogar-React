
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import useSesion from '../../contextos/useSesion'
import FormularioUsuario from '../../componentes/usuarios/FormularioUsuario'

export default function Registro() {
  const { usuario, registrarse } = useSesion()
  const navigate = useNavigate()

  // Redirigir solamente si ya tenía una sesión al ingresar.
  const [teniaSesion] = useState(() => Boolean(usuario))

  if (teniaSesion) {
    return <Navigate to="/" replace />
  }

  async function registrar(datos) {
    try {
      // POST /auth/registro: el backend siempre crea un Cliente y entrega el token,
      // así que la sesión queda iniciada apenas se crea la cuenta.
      await registrarse(datos)
      navigate('/')
    } catch (error) {
      return error.message
    }
  }

  return (
    <main className="pagina-registro flex-grow-1">
      <div className="registro-contenedor">

        {/* ENCABEZADO */}
        <header className="registro-encabezado">
          <p className="registro-etiqueta">
            HUERTOHOGAR
          </p>

          <h1>Crear una cuenta</h1>

          <p>
            Regístrate para disfrutar de nuestros
            productos frescos y naturales.
          </p>
        </header>

        {/* FORMULARIO ORIGINAL DE BRYAM */}
        <div className="registro-formulario">
          <FormularioUsuario
            modo="registro"
            textoBoton="Crear cuenta"
            alGuardar={registrar}
          />
        </div>

        {/* ENLACE A INICIAR SESIÓN */}
        <p className="registro-iniciar-sesion">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/iniciar-sesion">
            Inicia sesión
          </Link>
        </p>

      </div>
    </main>
  )
}
