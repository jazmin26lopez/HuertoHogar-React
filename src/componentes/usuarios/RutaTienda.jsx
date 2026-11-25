import { Navigate } from 'react-router-dom'

import useSesion from '../../contextos/useSesion'
import { esVendedor } from '../../funciones/roles'

// Protege las páginas de la tienda (inicio, catálogo, carrito, pago, blogs...).
// Según las instrucciones, el Vendedor solo ve productos y órdenes: "todos los demás accesos no deben
// aparecer en la vista del vendedor". Si intenta abrir una página de la tienda, lo llevamos a su panel.
// Los visitantes, los clientes y los administradores pasan sin problema.
export default function RutaTienda({ children, destinoVendedor = '/admin/productos' }) {
  const { usuario } = useSesion()

  if (esVendedor(usuario)) {
    return <Navigate to={destinoVendedor} replace />
  }

  return children
}
