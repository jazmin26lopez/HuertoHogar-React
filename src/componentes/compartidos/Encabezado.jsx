
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import EnlaceCarrito from '../compras/EnlaceCarrito'
import MenuSesion from '../usuarios/MenuSesion'

export default function Encabezado() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const ubicacion = useLocation()

  const enlaces = [
    { ruta: '/', texto: 'Inicio' },
    { ruta: '/productos', texto: 'Productos' },
    { ruta: '/categorias', texto: 'Categorías' },
    { ruta: '/ofertas', texto: 'Ofertas' },
    { ruta: '/nosotros', texto: 'Nosotros' },
    { ruta: '/blogs', texto: 'Blogs' },
    { ruta: '/contacto', texto: 'Contacto' }
  ]

  return (
    <header
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: '#2E8B57' }}
    >
      <div className="container-fluid px-3 px-lg-4">
        <Link
          className="navbar-brand fw-bold"
          to="/"
          onClick={() => setMenuAbierto(false)}
        >
          🥑 HuertoHogar
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          aria-controls="menuHuertoHogar"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <nav
          id="menuHuertoHogar"
          className={`collapse navbar-collapse ${
            menuAbierto ? 'show' : ''
          }`}
        >
          <ul className="navbar-nav ms-auto align-items-lg-center flex-lg-wrap justify-content-lg-end">
            {enlaces.map(({ ruta, texto }) => (
              <li className="nav-item" key={ruta}>
                <Link
                  to={ruta}
                  className={`nav-link ${
                    ubicacion.pathname === ruta ? 'active' : ''
                  }`}
                  onClick={() => setMenuAbierto(false)}
                >
                  {texto}
                </Link>
              </li>
            ))}

            <EnlaceCarrito alNavegar={() => setMenuAbierto(false)} />
            <MenuSesion alNavegar={() => setMenuAbierto(false)} />
          </ul>
        </nav>
      </div>
    </header>
  )
}
