
import RutaProtegida from './RutaProtegida'
import { ROL_ADMINISTRADOR } from '../../funciones/roles'

// Atajo de RutaProtegida: solo la ve un usuario con sesión y rol Administrador.
// Uso en las rutas: <Route path="/admin/..." element={<RutaAdministrador><Pagina /></RutaAdministrador>} />
export default function RutaAdministrador({ children }) {
  return <RutaProtegida roles={[ROL_ADMINISTRADOR]}>{children}</RutaProtegida>
}
