
import { Link, useLocation, useNavigate } from 'react-router-dom'

import useSesion from '../../contextos/useSesion'

// Elementos de menú según la sesión:
//  - sin sesión: "Iniciar sesión" y "Registrarse"
//  - con sesión: "Hola, nombre" y "Cerrar sesión" (más "Administración" si es administrador)
// Pensado para ir dentro de la lista <ul className="navbar-nav"> del encabezado.
export default function MenuSesion({ alNavegar }) {
  const { usuario, cerrarSesion } = useSesion()
  const ubicacion = useLocation()
  const navigate = useNavigate()

  function salir() {
    cerrarSesion()
    alNavegar?.()
    navigate('/')
  }

  const enlace = (ruta, texto) => (
    <li className="nav-item">
      <Link
        to={ruta}
        className={`nav-link ${ubicacion.pathname === ruta ? 'active' : ''}`}
        onClick={alNavegar}
      >
        {texto}
      </Link>
    </li>
  )

  if (!usuario) {
    return (
      <>
        {enlace('/iniciar-sesion', 'Iniciar sesión')}
        {enlace('/registro', 'Registrarse')}
      </>
    )
  }

  return (
    <>
      {usuario.rol === 'Administrador' && enlace('/admin/usuarios', 'Administración')}

      <li className="nav-item d-flex align-items-center gap-2">
        <span className="navbar-text text-white">Hola, {usuario.nombre}</span>

        <button type="button" className="btn btn-outline-light btn-sm" onClick={salir}>
          Cerrar sesión
        </button>
      </li>
    </>
  )
}
