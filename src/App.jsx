
import Encabezado from './componentes/compartidos/Encabezado'
import PiePagina from './componentes/compartidos/PiePagina'
import RutasAplicacion from './rutas/RutasAplicacion'



export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Encabezado />
      <RutasAplicacion/>
      <PiePagina />
    </div>
  )
}
