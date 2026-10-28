
import { Navigate } from 'react-router-dom'

import useSesion from '../../contextos/useSesion'

// Protege una página: solo la ve un usuario con sesión y rol Administrador.
// Uso en las rutas: <Route path="/admin/..." element={<RutaAdministrador><Pagina /></RutaAdministrador>} />
export default function RutaAdministrador({ children }) {
  const { usuario } = useSesion()

  if (!usuario) {
    return <Navigate to="/iniciar-sesion" replace />
  }

  if (usuario.rol !== 'Administrador') {
    return (
      <main className="container py-5 flex-grow-1">
        <h1>Acceso restringido</h1>

        <p>Esta sección es solo para administradores.</p>
      </main>
    )
  }

  return children
}
