
import { Route, Routes } from 'react-router-dom'

// Componente compartido
import PaginaPendiente from '../componentes/compartidos/PaginaPendiente'

// Tienda - Jazmín
import Inicio from '../paginas/tienda/Inicio'
import Productos from '../paginas/tienda/Productos'
import DetalleProducto from '../paginas/tienda/DetalleProducto'
import Categorias from '../paginas/tienda/Categorias'

// Administración de productos - Jazmín
import Dashboard from '../paginas/administracion-productos/Dashboard'
import AdministrarProductos from '../paginas/administracion-productos/AdministrarProductos'
import ReportesInventario from '../paginas/administracion-productos/ReportesInventario'

// Rutas reservadas para módulos pendientes
const paginasPendientes = [
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
  { ruta: '/admin/usuarios', titulo: 'Administrar usuarios' },
  { ruta: '/admin/pedidos', titulo: 'Administrar pedidos' }
]

export default function RutasAplicacion() {
  return (
    <Routes>
      {/* INICIO */}
      <Route path="/" element={<Inicio />} />

      {/* TIENDA */}
      <Route path="/productos" element={<Productos />} />
      <Route path="/productos/:id" element={<DetalleProducto />} />
      <Route path="/categorias" element={<Categorias />} />

      {/* ADMINISTRACIÓN */}
      <Route path="/admin" element={<Dashboard />} />

      <Route
        path="/admin/productos"
        element={<AdministrarProductos />}
      />

      <Route
        path="/admin/reportes"
        element={<ReportesInventario />}
      />

      {/* MÓDULOS PENDIENTES */}
      {paginasPendientes.map(({ ruta, titulo }) => (
        <Route
          key={ruta}
          path={ruta}
          element={<PaginaPendiente titulo={titulo} />}
        />
      ))}

      {/* RUTA DESCONOCIDA */}
      <Route
        path="*"
        element={
          <PaginaPendiente titulo="Página no encontrada" />
        }
      />
    </Routes>
  )
}
