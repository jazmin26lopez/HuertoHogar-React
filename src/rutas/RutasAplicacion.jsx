
import { Route, Routes } from 'react-router-dom'

// Componentes compartidos
import PaginaPendiente from '../componentes/compartidos/PaginaPendiente'

// Páginas de tienda - Jazmín
import Productos from '../paginas/tienda/Productos'
import DetalleProducto from '../paginas/tienda/DetalleProducto'
import Categorias from '../paginas/tienda/Categorias'

// Administración de productos - Jazmín
import AdministrarProductos from '../paginas/administracion-productos/AdministrarProductos'

// Rutas provisionales
// Se reemplazarán cuando las páginas estén desarrolladas
const paginasPendientes = [
  { ruta: '/', titulo: 'Inicio' },
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
  { ruta: '/admin/usuarios', titulo: 'Administrar usuarios' }
]

export default function RutasAplicacion() {
  return (
    <Routes>
      {/* TIENDA - JAZMÍN */}

      <Route
        path="/productos"
        element={<Productos />}
      />

      <Route
        path="/productos/:id"
        element={<DetalleProducto />}
      />

      <Route
        path="/categorias"
        element={<Categorias />}
      />

      {/* ADMINISTRACIÓN DE PRODUCTOS - JAZMÍN */}

      <Route
        path="/admin/productos"
        element={<AdministrarProductos />}
      />

      {/* PÁGINAS PENDIENTES */}

      {paginasPendientes.map(({ ruta, titulo }) => (
        <Route
          key={ruta}
          path={ruta}
          element={
            <PaginaPendiente titulo={titulo} />
          }
        />
      ))}

      {/* PÁGINAS NO ENCONTRADAS */}

      <Route
        path="*"
        element={
          <PaginaPendiente titulo="Página no encontrada" />
        }
      />
    </Routes>
  )
}
