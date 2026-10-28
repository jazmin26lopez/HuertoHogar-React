
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

// Compras - Bryam
import Carrito from '../paginas/compras/Carrito'
import Checkout from '../paginas/compras/Checkout'
import CompraExitosa from '../paginas/compras/CompraExitosa'
import CompraFallida from '../paginas/compras/CompraFallida'
import Ofertas from '../paginas/compras/Ofertas'

// Usuarios y sesión - Bryam
import IniciarSesion from '../paginas/usuarios/IniciarSesion'
import Registro from '../paginas/usuarios/Registro'

// Administración de usuarios - Bryam
import AdministrarUsuarios from '../paginas/administracion-usuarios/AdministrarUsuarios'
import EditorUsuario from '../paginas/administracion-usuarios/EditorUsuario'
import RutaAdministrador from '../componentes/usuarios/RutaAdministrador'

// Rutas reservadas para módulos pendientes
const paginasPendientes = [
  { ruta: '/nosotros', titulo: 'Nosotros' },
  { ruta: '/blogs', titulo: 'Blogs' },
  { ruta: '/contacto', titulo: 'Contacto' },
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

      {/* COMPRAS - BRYAM */}

      <Route path="/carrito" element={<Carrito />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/compra-exitosa" element={<CompraExitosa />} />
      <Route path="/compra-fallida" element={<CompraFallida />} />
      <Route path="/ofertas" element={<Ofertas />} />

      {/* USUARIOS Y SESIÓN - BRYAM */}

      <Route path="/iniciar-sesion" element={<IniciarSesion />} />
      <Route path="/registro" element={<Registro />} />

      {/* ADMINISTRACIÓN DE USUARIOS - BRYAM (solo administradores) */}

      <Route
        path="/admin/usuarios"
        element={
          <RutaAdministrador>
            <AdministrarUsuarios />
          </RutaAdministrador>
        }
      />

      <Route
        path="/admin/usuarios/nuevo"
        element={
          <RutaAdministrador>
            <EditorUsuario />
          </RutaAdministrador>
        }
      />

      <Route
        path="/admin/usuarios/:run/editar"
        element={
          <RutaAdministrador>
            <EditorUsuario />
          </RutaAdministrador>
        }
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
