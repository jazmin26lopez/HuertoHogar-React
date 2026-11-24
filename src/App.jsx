
import Encabezado from './componentes/compartidos/Encabezado'
import ScrollArriba from './componentes/compartidos/ScrollArriba'
import PiePagina from './componentes/compartidos/PiePagina'
import RutasAplicacion from './rutas/RutasAplicacion'



export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrollArriba />
      <Encabezado />
      <RutasAplicacion/>
      <PiePagina />
    </div>
  )
}
