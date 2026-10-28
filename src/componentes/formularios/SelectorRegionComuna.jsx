
import CampoFormulario from './CampoFormulario'
import regiones from '../../datos/regiones'

// Dos selects encadenados: las comunas disponibles dependen de la región elegida.
// alCambiar recibe el par completo { region, comuna } ya consistente.
export default function SelectorRegionComuna({
  region,
  comuna,
  errorRegion = '',
  errorComuna = '',
  alCambiar
}) {
  const comunas = regiones[region] ?? []

  return (
    <div className="row">
      <div className="col-md-6">
        <CampoFormulario
          id="region"
          etiqueta="Región"
          tipo="select"
          valor={region}
          error={errorRegion}
          autoComplete="address-level1"
          // Al cambiar de región se limpia la comuna, porque ya no corresponde
          alCambiar={(evento) => alCambiar({ region: evento.target.value, comuna: '' })}
        >
          <option value="">Selecciona una región</option>
          {Object.keys(regiones).map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </CampoFormulario>
      </div>

      <div className="col-md-6">
        <CampoFormulario
          id="comuna"
          etiqueta="Comuna"
          tipo="select"
          valor={comuna}
          error={errorComuna}
          autoComplete="address-level2"
          disabled={comunas.length === 0}
          alCambiar={(evento) => alCambiar({ region, comuna: evento.target.value })}
        >
          <option value="">Selecciona una comuna</option>
          {comunas.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </CampoFormulario>
      </div>
    </div>
  )
}
