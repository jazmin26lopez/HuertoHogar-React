
import { Link, useLocation } from 'react-router-dom'

import useCarrito from '../../contextos/useCarrito'
import { formatearPrecio } from '../../funciones/formato'

// Elemento de menú "🛒 Carrito $total" (como en el template del anexo).
// Pensado para ir dentro de la lista <ul className="navbar-nav"> del encabezado.
export default function EnlaceCarrito({ alNavegar }) {
  const { subtotal } = useCarrito()
  const ubicacion = useLocation()

  return (
    <li className="nav-item">
      <Link
        to="/carrito"
        className={`nav-link ${ubicacion.pathname === '/carrito' ? 'active' : ''}`}
        onClick={alNavegar}
      >
        🛒 Carrito {formatearPrecio(subtotal)}
      </Link>
    </li>
  )
}
