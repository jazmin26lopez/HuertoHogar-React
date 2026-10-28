
import { useState } from 'react'

import CampoFormulario from '../../componentes/formularios/CampoFormulario'
import useSesion from '../../contextos/useSesion'
import { validarContacto } from '../../funciones/validaciones'
import { guardarMensaje } from '../../servicios/contactoServicio'

const DATOS_VACIOS = { nombre: '', correo: '', asunto: '', mensaje: '' }

export default function Contacto() {
  const { usuario } = useSesion()

  // Si hay sesión iniciada, el nombre y el correo se completan solos
  const [datos, setDatos] = useState(() => ({
    ...DATOS_VACIOS,
    nombre: usuario ? `${usuario.nombre} ${usuario.apellidos}`.trim() : '',
    correo: usuario?.correo ?? ''
  }))
  const [errores, setErrores] = useState({})
  const [resultado, setResultado] = useState(null)

  function cambiar(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value })
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
      setResultado({ tipo: 'success', texto: '¡Gracias! Recibimos tu mensaje y te responderemos pronto.' })
      setDatos({ ...datos, asunto: '', mensaje: '' })
    } else {
      setResultado({ tipo: 'danger', texto: 'No pudimos guardar tu mensaje. Inténtalo de nuevo.' })
    }
  }

  return (
    <main className="container py-4 flex-grow-1 text-start">
      <div className="row g-4 justify-content-center">
        <div className="col-12 col-lg-7">
          <h1 style={{ color: '#244D36' }}>
            <span aria-hidden="true">🌱 </span>¡Estamos para ayudarte!
          </h1>

          <p className="text-muted mb-4">
            Escríbenos y nos pondremos en contacto contigo lo antes posible.
          </p>

          <form onSubmit={enviar} noValidate className="card shadow-sm card-body">
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

            {resultado && (
              <div className={`alert alert-${resultado.tipo}`} role="status">
                {resultado.texto}
              </div>
            )}

            <div>
              <button type="submit" className="btn btn-success">
                Enviar mensaje
              </button>
            </div>
          </form>
        </div>

        <aside className="col-12 col-lg-4" aria-label="Datos de contacto">
          <div className="card shadow-sm card-body">
            <h2 className="h5" style={{ color: '#244D36' }}>
              Otras formas de contactarnos
            </h2>

            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <span aria-hidden="true">📧 </span>contacto@huertohogar.cl
              </li>
              <li className="mb-2">
                <span aria-hidden="true">📍 </span>Chile
              </li>
              <li>
                <span aria-hidden="true">📞 </span>+569 12345678
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}
