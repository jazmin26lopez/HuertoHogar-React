
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import useCarrito from '../../contextos/useCarrito'
import useSesion from '../../contextos/useSesion'
import CampoFormulario from '../../componentes/formularios/CampoFormulario'
import SelectorRegionComuna from '../../componentes/formularios/SelectorRegionComuna'
import ImagenProducto from '../../componentes/compras/ImagenProducto'

import {
  OPCIONES_ENTREGA,
  METODOS_PAGO,
  calcularTotales,
  calcularSubtotalItem,
  simularPago
} from '../../funciones/carrito'

import { formatearPrecio } from '../../funciones/formato'
import { validarCheckout } from '../../funciones/validaciones'

import {
  registrarOrden,
  guardarBorrador,
  obtenerBorrador,
  borrarBorrador
} from '../../servicios/ordenesServicio'

function crearDatosIniciales(usuario) {
  const borrador = obtenerBorrador()

  if (borrador) {
    return borrador
  }

  return {
    nombre: usuario?.nombre ?? '',
    apellidos: usuario?.apellidos ?? '',
    correo: usuario?.correo ?? '',
    calle: usuario?.direccion ?? '',
    departamento: '',
    region: usuario?.region ?? '',
    comuna: usuario?.comuna ?? '',
    indicaciones: '',
    entrega: 'domicilio',
    metodoPago: 'tarjeta'
  }
}

export default function Checkout() {
  const { items, vaciar } = useCarrito()
  const { usuario } = useSesion()
  const navigate = useNavigate()

  const [datos, setDatos] = useState(() => crearDatosIniciales(usuario))
  const [errores, setErrores] = useState({})

  const entrega = OPCIONES_ENTREGA.find(
    (opcion) => opcion.id === datos.entrega
  )

  const totales = calcularTotales(items, entrega.costo)

  function cambiar(evento) {
    setDatos({
      ...datos,
      [evento.target.name]: evento.target.value
    })
  }

  function enviar(evento) {
    evento.preventDefault()

    const erroresEncontrados = validarCheckout(datos)
    setErrores(erroresEncontrados)

    if (Object.keys(erroresEncontrados).length > 0) {
      return
    }

    const pago = simularPago(datos.metodoPago)

    const orden = registrarOrden({
      cliente: {
        nombre: datos.nombre.trim(),
        apellidos: datos.apellidos.trim(),
        correo: datos.correo.trim()
      },
      direccion: {
        calle: datos.calle.trim(),
        departamento: datos.departamento.trim(),
        region: datos.region,
        comuna: datos.comuna,
        indicaciones: datos.indicaciones.trim()
      },
      entrega: {
        id: entrega.id,
        nombre: entrega.nombre,
        costo: entrega.costo
      },
      metodoPago: datos.metodoPago,
      items,
      estado: pago.aprobado ? 'pagada' : 'fallida',
      usuarioRun: usuario?.run ?? null
    })

    if (pago.aprobado) {
      borrarBorrador()
      vaciar()
      navigate(`/compra-exitosa?orden=${orden.id}`)
      return
    }

    // Si el pago falla, conservar el carrito y los datos.
    guardarBorrador({
      ...datos,
      metodoPago: 'tarjeta'
    })

    navigate(`/compra-fallida?orden=${orden.id}`)
  }

  if (items.length === 0) {
    return (
      <main className="pagina-checkout flex-grow-1">
        <div className="checkout-contenedor">
          <header className="checkout-encabezado">
            <p className="checkout-etiqueta">HUERTOHOGAR</p>
            <h1>Finalizar compra</h1>
          </header>

          <div className="checkout-vacio" role="status">
            <h2>Tu carrito está vacío</h2>
            <p>No tienes productos en el carrito para pagar.</p>

            <Link to="/productos" className="checkout-boton-principal">
              Ir al catálogo
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="pagina-checkout flex-grow-1">
      <div className="checkout-contenedor">

        {/* ENCABEZADO */}
        <header className="checkout-encabezado">
          <p className="checkout-etiqueta">HUERTOHOGAR</p>
          <h1>Finalizar compra</h1>
          <p>
            Revisa tu pedido y completa la información
            para continuar con tu compra.
          </p>
        </header>

        <form
          onSubmit={enviar}
          noValidate
          className="checkout-formulario"
        >

          {/* RESUMEN DE PEDIDO */}
          <section className="checkout-seccion">
            <div className="checkout-resumen-encabezado">
              <div>
                <h2>Resumen de tu pedido</h2>
                <p>Productos seleccionados para comprar</p>
              </div>

              <div className="checkout-total-destacado">
                <span>Total a pagar</span>
                <strong data-testid="total-pagar">
                  {formatearPrecio(totales.total)}
                </strong>
              </div>
            </div>

            <div className="checkout-tabla-contenedor table-responsive">
              <table className="table align-middle checkout-tabla">
                <caption className="visually-hidden">
                  Productos a comprar
                </caption>

                <thead>
                  <tr>
                    <th scope="col">Imagen</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <ImagenProducto producto={item} tamano={45} />
                      </td>
                      <td>{item.nombre}</td>
                      <td>{formatearPrecio(item.precio)}</td>
                      <td>{item.cantidad}</td>
                      <td>
                        {formatearPrecio(calcularSubtotalItem(item))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* INFORMACIÓN DEL CLIENTE */}
          <section className="checkout-seccion">
            <h2>Información del cliente</h2>

            <p className="checkout-texto-ayuda">
              {usuario
                ? 'Completamos tus datos con la información de tu cuenta.'
                : 'Completa la siguiente información.'}
            </p>

            <div className="row">
              <div className="col-md-6">
                <CampoFormulario
                  id="nombre"
                  etiqueta="Nombre"
                  valor={datos.nombre}
                  alCambiar={cambiar}
                  error={errores.nombre}
                  autoComplete="given-name"
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
                />
              </div>

              <div className="col-md-6">
                <CampoFormulario
                  id="correo"
                  etiqueta="Correo"
                  tipo="email"
                  valor={datos.correo}
                  alCambiar={cambiar}
                  error={errores.correo}
                  autoComplete="email"
                />
              </div>
            </div>
          </section>

          {/* DIRECCIÓN */}
          <section className="checkout-seccion">
            <h2>Dirección de entrega de los productos</h2>

            <p className="checkout-texto-ayuda">
              Ingresa tu dirección de forma detallada.
            </p>

            <div className="row">
              <div className="col-md-6">
                <CampoFormulario
                  id="calle"
                  etiqueta="Calle"
                  valor={datos.calle}
                  alCambiar={cambiar}
                  error={errores.calle}
                  autoComplete="street-address"
                />
              </div>

              <div className="col-md-6">
                <CampoFormulario
                  id="departamento"
                  etiqueta="Departamento (opcional)"
                  valor={datos.departamento}
                  alCambiar={cambiar}
                  placeholder="Ej: 603"
                />
              </div>
            </div>

            <SelectorRegionComuna
              region={datos.region}
              comuna={datos.comuna}
              errorRegion={errores.region}
              errorComuna={errores.comuna}
              alCambiar={(ubicacion) =>
                setDatos({ ...datos, ...ubicacion })
              }
            />

            <CampoFormulario
              id="indicaciones"
              etiqueta="Indicaciones para la entrega (opcional)"
              tipo="textarea"
              valor={datos.indicaciones}
              alCambiar={cambiar}
              placeholder="Ej: Entre calles, color del edificio, no tiene timbre."
            />
          </section>

          {/* ENTREGA Y PAGO */}
          <section className="checkout-seccion">
            <h2>Opciones de entrega y pago</h2>

            <fieldset className="checkout-opciones-entrega">
              <legend>Tipo de entrega</legend>

              {OPCIONES_ENTREGA.map((opcion) => (
                <div className="form-check" key={opcion.id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="entrega"
                    id={`entrega-${opcion.id}`}
                    value={opcion.id}
                    checked={datos.entrega === opcion.id}
                    onChange={cambiar}
                  />

                  <label
                    className="form-check-label"
                    htmlFor={`entrega-${opcion.id}`}
                  >
                    {opcion.nombre}{' '}
                    ({opcion.costo === 0
                      ? 'Gratis'
                      : formatearPrecio(opcion.costo)})
                  </label>
                </div>
              ))}
            </fieldset>

            <CampoFormulario
              id="metodoPago"
              etiqueta="Método de pago (simulado)"
              tipo="select"
              valor={datos.metodoPago}
              alCambiar={cambiar}
            >
              {METODOS_PAGO.map((metodo) => (
                <option key={metodo.id} value={metodo.id}>
                  {metodo.nombre}
                </option>
              ))}
            </CampoFormulario>
          </section>

          {/* CONFIRMACIÓN */}
          <div className="checkout-acciones">
            <Link to="/carrito" className="checkout-boton-volver">
              ← Volver al carrito
            </Link>

            <div className="checkout-confirmacion">
              <p>
                Subtotal: {formatearPrecio(totales.subtotal)}
                {' · '}
                Envío: {totales.envio === 0
                  ? 'Gratis'
                  : formatearPrecio(totales.envio)}
              </p>

              <button
                type="submit"
                className="checkout-boton-principal"
              >
                Pagar ahora {formatearPrecio(totales.total)}
              </button>
            </div>
          </div>

        </form>
      </div>
    </main>
  )
}
