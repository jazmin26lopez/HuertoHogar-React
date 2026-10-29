
import { useState } from 'react'

import CampoFormulario from '../../componentes/formularios/CampoFormulario'
import useSesion from '../../contextos/useSesion'
import { validarContacto } from '../../funciones/validaciones'
import { guardarMensaje } from '../../servicios/contactoServicio'

const DATOS_VACIOS = {
  nombre: '',
  correo: '',
  asunto: '',
  mensaje: ''
}

export default function Contacto() {
  const { usuario } = useSesion()

  // Completar los datos si hay una sesión iniciada
  const [datos, setDatos] = useState(() => ({
    ...DATOS_VACIOS,
    nombre: usuario
      ? `${usuario.nombre} ${usuario.apellidos}`.trim()
      : '',
    correo: usuario?.correo ?? ''
  }))

  const [errores, setErrores] = useState({})
  const [resultado, setResultado] = useState(null)

  function cambiar(evento) {
    setDatos({
      ...datos,
      [evento.target.name]: evento.target.value
    })
  }

  function enviar(evento) {
    evento.preventDefault()
    setResultado(null)

    const erroresEncontrados = validarContacto(datos)
    setErrores(erroresEncontrados)

    if (Object.keys(erroresEncontrados).length > 0) {
      return
    }

    if (guardarMensaje(datos)) {
      setResultado({
        tipo: 'success',
        texto: '¡Gracias! Recibimos tu mensaje y te responderemos pronto.'
      })

      setDatos({
        ...datos,
        asunto: '',
        mensaje: ''
      })
    } else {
      setResultado({
        tipo: 'danger',
        texto: 'No pudimos guardar tu mensaje. Inténtalo de nuevo.'
      })
    }
  }

  return (
    <main className="pagina-contacto flex-grow-1">
      <div className="contacto-contenedor">

        {/* ENCABEZADO */}
        <header className="contacto-encabezado">
          <p className="contacto-etiqueta">
            HUERTOHOGAR
          </p>

          <h1>¡Estamos para ayudarte!</h1>

          <p className="contacto-descripcion">
            Escríbenos y nos pondremos en contacto
            contigo lo antes posible.
          </p>
        </header>

        {/* FORMULARIO */}
        <form
          onSubmit={enviar}
          noValidate
          className="contacto-formulario"
        >
          <CampoFormulario
            id="nombre"
            etiqueta="Nombre completo"
            valor={datos.nombre}
            alCambiar={cambiar}
            error={errores.nombre}
            placeholder="Ingresa tu nombre"
            autoComplete="name"
            maxLength={100}
          />

          <CampoFormulario
            id="correo"
            etiqueta="Correo electrónico"
            tipo="email"
            valor={datos.correo}
            alCambiar={cambiar}
            error={errores.correo}
            placeholder="ejemplo@correo.com"
            autoComplete="email"
            maxLength={100}
          />

          <CampoFormulario
            id="asunto"
            etiqueta="Asunto"
            valor={datos.asunto}
            alCambiar={cambiar}
            error={errores.asunto}
            placeholder="¿En qué podemos ayudarte?"
            maxLength={100}
          />

          <CampoFormulario
            id="mensaje"
            etiqueta="Mensaje"
            tipo="textarea"
            rows={5}
            valor={datos.mensaje}
            alCambiar={cambiar}
            error={errores.mensaje}
            placeholder="Escribe tu mensaje aquí..."
            maxLength={500}
          />

          {/* MENSAJE DE RESULTADO */}
          {resultado && (
            <div
              className={`alert alert-${resultado.tipo}`}
              role="status"
            >
              {resultado.texto}
            </div>
          )}

          {/* BOTÓN */}
          <div className="contacto-acciones">
            <button
              type="submit"
              className="contacto-boton"
            >
              Enviar mensaje
            </button>
          </div>
        </form>

      </div>
    </main>
  )
}
