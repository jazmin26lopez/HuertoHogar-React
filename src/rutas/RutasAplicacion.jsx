
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
import RutaProtegida from '../componentes/usuarios/RutaProtegida'
import { ROL_ADMINISTRADOR, ROL_VENDEDOR } from '../funciones/roles'

// Páginas informativas - Bryam
import Nosotros from '../paginas/institucional/Nosotros'
import Blogs from '../paginas/institucional/Blogs'
import DetalleBlog from '../paginas/institucional/DetalleBlog'
import Contacto from '../paginas/institucional/Contacto'

// Rutas reservadas para módulos pendientes (las ven el Administrador y el Vendedor)
const paginasPendientes = [
  { ruta: '/admin/pedidos', titulo: 'Administrar pedidos', protegida: true }
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

      {/* ADMINISTRACIÓN (solo administradores) */}
      <Route
        path="/admin"
        element={
          <RutaAdministrador>
            <Dashboard />
          </RutaAdministrador>
        }
      />

      {/* El Vendedor también entra, pero solo para consultar */}
      <Route
        path="/admin/productos"
        element={
          <RutaProtegida roles={[ROL_ADMINISTRADOR, ROL_VENDEDOR]}>
            <AdministrarProductos />
          </RutaProtegida>
        }
      />

      <Route
        path="/admin/reportes"
        element={
          <RutaAdministrador>
            <ReportesInventario />
          </RutaAdministrador>
        }
      />

      {/* COMPRAS - BRYAM */}

      <Route path="/carrito" element={<Carrito />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/compra-exitosa" element={<CompraExitosa />} />
      <Route path="/compra-fallida" element={<CompraFallida />} />
      <Route path="/ofertas" element={<Ofertas />} />

      {/* PÁGINAS INFORMATIVAS - BRYAM */}

      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/:id" element={<DetalleBlog />} />
      <Route path="/contacto" element={<Contacto />} />

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
        path="/admin/usuarios/:id/editar"
        element={
          <RutaAdministrador>
            <EditorUsuario />
          </RutaAdministrador>
        }
      />

      {/* MÓDULOS PENDIENTES */}
      {paginasPendientes.map(({ ruta, titulo, protegida }) => (
        <Route
          key={ruta}
          path={ruta}
          element={
            protegida ? (
              <RutaProtegida roles={[ROL_ADMINISTRADOR, ROL_VENDEDOR]}>
                <PaginaPendiente titulo={titulo} />
              </RutaProtegida>
            ) : (
              <PaginaPendiente titulo={titulo} />
            )
          }
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
