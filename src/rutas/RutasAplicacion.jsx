
import { Route, Routes } from 'react-router-dom'
import PaginaPendiente from '../componentes/compartidos/PaginaPendiente'
import Productos from '../paginas/tienda/Productos'

const paginasPendientes = [
  { ruta: '/', titulo: 'Inicio' },
  { ruta: '/categorias', titulo: 'Categorías' },
  { ruta: '/productos/:id', titulo: 'Detalle de producto' },
  { ruta: '/carrito', titulo: 'Carrito de compras' },
  { ruta: '/checkout', titulo: 'Finalizar compra' },
  { ruta: '/compra-exitosa', titulo: 'Compra exitosa' },
  { ruta: '/compra-fallida', titulo: 'Compra fallida' },
  { ruta: '/ofertas', titulo: 'Ofertas' },
  { ruta: '/iniciar-sesion', titulo: 'Iniciar sesión' },
  { ruta: '/registro', titulo: 'Registrarse' },
  { ruta: '/nosotros', titulo: 'Nosotros' },
  { ruta: '/blogs', titulo: 'Blogs' },
  { ruta: '/contacto', titulo: 'Contacto' },
  { ruta: '/admin', titulo: 'Administración' },
  { ruta: '/admin/productos', titulo: 'Administrar productos' },
  { ruta: '/admin/usuarios', titulo: 'Administrar usuarios' }
]

export default function RutasAplicacion() {
  return (
    <Routes>
      <Route path="/productos" element={<Productos />} />

      {paginasPendientes.map(({ ruta, titulo }) => (
        <Route
          key={ruta}
          path={ruta}
          element={<PaginaPendiente titulo={titulo} />}
        />
      ))}

      <Route
        path="*"
        element={<PaginaPendiente titulo="Página no encontrada" />}
      />
    </Routes>
  )
}
