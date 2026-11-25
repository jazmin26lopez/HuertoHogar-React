
import { Route, Routes, useParams } from 'react-router-dom'

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
import RutaTienda from '../componentes/usuarios/RutaTienda'
import DetalleProductoPanel from '../paginas/administracion-productos/DetalleProductoPanel'
import AdministrarPedidos from '../paginas/administracion-pedidos/AdministrarPedidos'
import DetallePedido from '../paginas/administracion-pedidos/DetallePedido'
import { ROL_ADMINISTRADOR, ROL_VENDEDOR } from '../funciones/roles'

// Páginas informativas - Bryam
import Nosotros from '../paginas/institucional/Nosotros'
import Blogs from '../paginas/institucional/Blogs'
import DetalleBlog from '../paginas/institucional/DetalleBlog'
import Contacto from '../paginas/institucional/Contacto'

import AdministrarCategorias from '../paginas/administracion-categorias/AdministrarCategorias'

// Páginas de la tienda: el Vendedor no las ve (lo llevamos a su panel de productos)
const tienda = (pagina) => <RutaTienda>{pagina}</RutaTienda>

// El detalle de producto de la tienda tiene botón de compra: el Vendedor va al detalle de solo consulta del panel
function DetalleTienda() {
  const { id } = useParams()

  return (
    <RutaTienda destinoVendedor={`/admin/productos/${id}`}>
      <DetalleProducto />
    </RutaTienda>
  )
}

export default function RutasAplicacion() {
  return (
    <Routes>
      {/* INICIO */}
      <Route path="/" element={tienda(<Inicio />)} />

      {/* TIENDA */}
      <Route path="/productos" element={tienda(<Productos />)} />
      <Route path="/productos/:id" element={<DetalleTienda />} />
      <Route path="/categorias" element={tienda(<Categorias />)} />

      {/* ADMINISTRACIÓN (solo administradores) */}
      <Route
        path="/admin"
        element={
          <RutaAdministrador>
            <Dashboard />
          </RutaAdministrador>
        }
      />
      <Route
        path="/admin/categorias"
        element={
          <RutaAdministrador>
            <AdministrarCategorias />
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

      {/* Detalle de producto de solo consulta (Administrador y Vendedor) */}
      <Route
        path="/admin/productos/:id"
        element={
          <RutaProtegida roles={[ROL_ADMINISTRADOR, ROL_VENDEDOR]}>
            <DetalleProductoPanel />
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

      <Route path="/carrito" element={tienda(<Carrito />)} />
      <Route path="/checkout" element={tienda(<Checkout />)} />
      <Route path="/compra-exitosa" element={tienda(<CompraExitosa />)} />
      <Route path="/compra-fallida" element={tienda(<CompraFallida />)} />
      <Route path="/ofertas" element={tienda(<Ofertas />)} />

      {/* PÁGINAS INFORMATIVAS - BRYAM */}

      <Route path="/nosotros" element={tienda(<Nosotros />)} />
      <Route path="/blogs" element={tienda(<Blogs />)} />
      <Route path="/blogs/:id" element={tienda(<DetalleBlog />)} />
      <Route path="/contacto" element={tienda(<Contacto />)} />

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

      {/* ÓRDENES (Administrador y Vendedor, solo consulta) */}
      <Route
        path="/admin/pedidos"
        element={
          <RutaProtegida roles={[ROL_ADMINISTRADOR, ROL_VENDEDOR]}>
            <AdministrarPedidos />
          </RutaProtegida>
        }
      />

      <Route
        path="/admin/pedidos/:id"
        element={
          <RutaProtegida roles={[ROL_ADMINISTRADOR, ROL_VENDEDOR]}>
            <DetallePedido />
          </RutaProtegida>
        }
      />

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
