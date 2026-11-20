
import { Navigate } from 'react-router-dom'

import useSesion from '../../contextos/useSesion'

// Protege una página según el rol: solo la ve un usuario con sesión cuyo rol esté en "roles".
//  - sin sesión: lo manda a iniciar sesión
//  - con sesión pero sin permiso: muestra "Acceso restringido"
// Uso en las rutas:
//   <Route path="/admin/productos" element={<RutaProtegida roles={['Administrador', 'Vendedor']}><Pagina /></RutaProtegida>} />
// Ojo: esto solo oculta la pantalla. La seguridad real está en el backend, que revisa el rol del token en cada llamada.
export default function RutaProtegida({ roles, children }) {
  const { usuario } = useSesion()

  if (!usuario) {
    return <Navigate to="/iniciar-sesion" replace />
  }

  if (!roles.includes(usuario.rol)) {
    return (
      <main className="container py-5 flex-grow-1">
        <h1>Acceso restringido</h1>

        <p>No tienes permiso para ver esta sección.</p>
      </main>
    )
  }

  return children
}
