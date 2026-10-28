
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import useSesion from '../../contextos/useSesion'
import FormularioUsuario from '../../componentes/usuarios/FormularioUsuario'
import { crearUsuario } from '../../servicios/usuariosServicio'

export default function Registro() {
  const { usuario, iniciarSesionConUsuario } = useSesion()
  const navigate = useNavigate()

  // Solo se redirige si ya había sesión al llegar (ver IniciarSesion)
  const [teniaSesion] = useState(() => Boolean(usuario))

  if (teniaSesion) {
    return <Navigate to="/" replace />
  }

  // Devuelve un texto de error si no se pudo crear (RUN o correo repetidos)
  function registrar(datos) {
    try {
      // El registro público siempre crea clientes
      const nuevo = crearUsuario({ ...datos, rol: 'Cliente' })

      iniciarSesionConUsuario(nuevo)
      navigate('/')
    } catch (error) {
      return error.message
    }
  }

  return (
    <main className="container py-5 flex-grow-1">
      <div className="mx-auto" style={{ maxWidth: '640px' }}>
        <div className="text-center mb-4">
          <span className="badge bg-success mb-2">HUERTOHOGAR</span>
          <h1 className="h3" style={{ color: '#244D36' }}>Crear una cuenta</h1>
          <p className="text-muted">
            Regístrate para disfrutar de nuestros productos frescos y naturales.
          </p>
        </div>

        <FormularioUsuario modo="registro" textoBoton="Crear cuenta" alGuardar={registrar} />

        <p className="text-center mt-3">
          ¿Ya tienes una cuenta? <Link to="/iniciar-sesion">Inicia sesión</Link>
        </p>
      </div>
    </main>
  )
}
