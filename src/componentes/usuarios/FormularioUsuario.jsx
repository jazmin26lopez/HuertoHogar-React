
import { useState } from 'react'

import CampoFormulario from '../formularios/CampoFormulario'
import SelectorRegionComuna from '../formularios/SelectorRegionComuna'
import { validarUsuario } from '../../funciones/validaciones'
import { formatearRun } from '../../funciones/formato'

const ROLES = ['Cliente', 'Administrador']

const DATOS_VACIOS = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  fechaNacimiento: '',
  region: '',
  comuna: '',
  direccion: '',
  rol: 'Cliente',
  contrasena: '',
  confirmacion: ''
}

// Formulario compartido por el registro público, "nuevo usuario" y "editar usuario".
//  - modo "registro": es público, no deja elegir rol.
//  - modo "crear" / "editar": es del administrador, permite elegir rol.
//  - al editar, el RUN no se cambia y no se pide la contraseña.
// alGuardar(datos) debe devolver un texto de error (por ejemplo "RUN duplicado") o nada.
export default function FormularioUsuario({
  modo = 'registro',
  usuarioInicial = null,
  textoBoton = 'Guardar',
  alGuardar,
  alCancelar
}) {
  const editando = modo === 'editar'

  const [datos, setDatos] = useState(() => ({ ...DATOS_VACIOS, ...usuarioInicial }))
  const [errores, setErrores] = useState({})
  const [mensajeError, setMensajeError] = useState('')

  function cambiar(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value })
  }

  function enviar(evento) {
    evento.preventDefault()
    setMensajeError('')

    const erroresEncontrados = validarUsuario(datos, { conContrasena: !editando })

    setErrores(erroresEncontrados)

    if (Object.keys(erroresEncontrados).length > 0) {
      return
    }

    // La confirmación solo sirve para validar, no se guarda
    const paraGuardar = { ...datos }
    delete paraGuardar.confirmacion

    const problema = alGuardar({
      ...paraGuardar,
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim(),
      direccion: datos.direccion.trim()
    })

    if (problema) {
      setMensajeError(problema)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="card shadow-sm card-body text-start">
      <CampoFormulario
        id="run"
        etiqueta="RUN"
        valor={editando ? formatearRun(datos.run) : datos.run}
        alCambiar={cambiar}
        error={errores.run}
        placeholder="Ej: 12345678-5"
        disabled={editando}
        ayuda={editando ? 'El RUN identifica al usuario y no se puede cambiar.' : ''}
        maxLength={12}
      />

      <div className="row">
        <div className="col-md-6">
          <CampoFormulario
            id="nombre"
            etiqueta="Nombre"
            valor={datos.nombre}
            alCambiar={cambiar}
            error={errores.nombre}
            autoComplete="given-name"
            maxLength={50}
          />
        </div>

        <div className="col-md-6">
          <CampoFormulario
            id="apellidos"
            etiqueta="Apellidos"
            valor={datos.apellidos}
            alCambiar={cambiar}
            error={errores.apellidos}
            autoComplete="family-name"
            maxLength={100}
          />
        </div>
      </div>

      <CampoFormulario
        id="correo"
        etiqueta="Correo electrónico"
        tipo="email"
        valor={datos.correo}
        alCambiar={cambiar}
        error={errores.correo}
        autoComplete="email"
        placeholder="ejemplo@gmail.com"
        maxLength={100}
      />

      <CampoFormulario
        id="fechaNacimiento"
        etiqueta="Fecha de nacimiento (opcional)"
        tipo="date"
        valor={datos.fechaNacimiento}
        alCambiar={cambiar}
        error={errores.fechaNacimiento}
        autoComplete="bday"
      />

      <SelectorRegionComuna
        region={datos.region}
        comuna={datos.comuna}
        errorRegion={errores.region}
        errorComuna={errores.comuna}
        alCambiar={(ubicacion) => setDatos({ ...datos, ...ubicacion })}
      />

      <CampoFormulario
        id="direccion"
        etiqueta="Dirección"
        valor={datos.direccion}
        alCambiar={cambiar}
        error={errores.direccion}
        autoComplete="street-address"
        maxLength={300}
      />

      {modo !== 'registro' && (
        <CampoFormulario
          id="rol"
          etiqueta="Rol"
          tipo="select"
          valor={datos.rol}
          alCambiar={cambiar}
        >
          {ROLES.map((rol) => (
            <option key={rol} value={rol}>
              {rol}
            </option>
          ))}
        </CampoFormulario>
      )}

      {!editando && (
        <div className="row">
          <div className="col-md-6">
            <CampoFormulario
              id="contrasena"
              etiqueta="Contraseña"
              tipo="password"
              valor={datos.contrasena}
              alCambiar={cambiar}
              error={errores.contrasena}
              autoComplete="new-password"
              ayuda="Entre 4 y 10 caracteres."
            />
          </div>

          <div className="col-md-6">
            <CampoFormulario
              id="confirmacion"
              etiqueta="Confirmar contraseña"
              tipo="password"
              valor={datos.confirmacion}
              alCambiar={cambiar}
              error={errores.confirmacion}
              autoComplete="new-password"
            />
          </div>
        </div>
      )}

      {mensajeError && (
        <div className="alert alert-danger" role="alert">
          {mensajeError}
        </div>
      )}

      <div className="d-flex gap-2 flex-wrap">
        <button type="submit" className="btn btn-success">
          {textoBoton}
        </button>

        {alCancelar && (
          <button type="button" className="btn btn-outline-secondary" onClick={alCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
