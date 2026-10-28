
// Campo de formulario reutilizable: etiqueta + control + mensaje de error.
// Sirve para input, textarea y select (tipo="select" recibe las <option> como children).
// El "id" también se usa como "name", así el mismo manejador sirve para todos los campos.
export default function CampoFormulario({
  id,
  etiqueta,
  tipo = 'text',
  valor,
  alCambiar,
  error = '',
  ayuda = '',
  children,
  ...resto
}) {
  const claseBase = tipo === 'select' ? 'form-select' : 'form-control'
  const clase = `${claseBase}${error ? ' is-invalid' : ''}`
  const idError = `${id}-error`

  const propiedades = {
    id,
    name: id,
    className: clase,
    value: valor,
    onChange: alCambiar,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': error ? idError : undefined,
    ...resto
  }

  let control

  if (tipo === 'select') {
    control = <select {...propiedades}>{children}</select>
  } else if (tipo === 'textarea') {
    control = <textarea rows={3} {...propiedades} />
  } else {
    control = <input type={tipo} {...propiedades} />
  }

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {etiqueta}
      </label>

      {control}

      {ayuda && !error && <div className="form-text">{ayuda}</div>}

      {error && (
        <div id={idError} className="invalid-feedback" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
