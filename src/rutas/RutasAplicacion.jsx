
import { Route, Routes } from 'react-router-dom'

// Componentes compartidos
import PaginaPendiente from '../componentes/compartidos/PaginaPendiente'

// Páginas de tienda - Jazmín
import Productos from '../paginas/tienda/Productos'
import DetalleProducto from '../paginas/tienda/DetalleProducto'
import Categorias from '../paginas/tienda/Categorias'

// Administración de productos - Jazmín
import AdministrarProductos from '../paginas/administracion-productos/AdministrarProductos'

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

// Rutas provisionales
// Se reemplazarán cuando las páginas estén desarrolladas
const paginasPendientes = [
  { ruta: '/', titulo: 'Inicio' },
  { ruta: '/nosotros', titulo: 'Nosotros' },
  { ruta: '/blogs', titulo: 'Blogs' },
  { ruta: '/contacto', titulo: 'Contacto' },
  { ruta: '/admin', titulo: 'Administración' }
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
