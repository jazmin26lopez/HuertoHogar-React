
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

// Si hay sesión iniciada los datos se completan solos (nota de la Figura 6 del anexo).
// Si el pago anterior falló, se recupera lo que el cliente había escrito.
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

  const entrega = OPCIONES_ENTREGA.find((o) => o.id === datos.entrega)
  const totales = calcularTotales(items, entrega.costo)

  if (items.length === 0) {
    return (
      <main className="container py-5 flex-grow-1">
        <h1 style={{ color: '#244D36' }}>Finalizar compra</h1>

        <div className="alert alert-info mt-4" role="status">
          No tienes productos en el carrito para pagar.
        </div>

        <Link to="/productos" className="btn btn-success">
          Ir al catálogo
        </Link>
      </main>
    )
  }

  function cambiar(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value })
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
      cliente: { nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim(), correo: datos.correo.trim() },
      direccion: {
        calle: datos.calle.trim(),
        departamento: datos.departamento.trim(),
        region: datos.region,
        comuna: datos.comuna,
        indicaciones: datos.indicaciones.trim()
      },
      entrega: { id: entrega.id, nombre: entrega.nombre, costo: entrega.costo },
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

    // Pago rechazado: el carrito se conserva y se guardan los datos escritos
    guardarBorrador({ ...datos, metodoPago: 'tarjeta' })
    navigate(`/compra-fallida?orden=${orden.id}`)
  }

  return (
    <main className="container py-4 flex-grow-1">
      <form onSubmit={enviar} noValidate className="card shadow-sm mx-auto text-start" style={{ maxWidth: '900px' }}>
        <div className="card-body p-4">
          {/* ---------- ENCABEZADO: título y total a pagar ---------- */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
            <div>
              <h1 className="h3 mb-1">Carrito de compra</h1>
              <p className="text-muted mb-0">Completa la siguiente información</p>
            </div>

            <div className="bg-primary text-white rounded px-3 py-2">
              Total a pagar:{' '}
              <strong data-testid="total-pagar">{formatearPrecio(totales.total)}</strong>
            </div>
          </div>

          {/* ---------- PRODUCTOS ---------- */}
          <div className="table-responsive mb-4">
            <table className="table align-middle mb-0">
              <caption className="visually-hidden">Productos a comprar</caption>
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
                    <td><ImagenProducto producto={item} tamano={40} /></td>
                    <td>{item.nombre}</td>
                    <td>{formatearPrecio(item.precio)}</td>
                    <td>{item.cantidad}</td>
                    <td>{formatearPrecio(calcularSubtotalItem(item))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ---------- INFORMACIÓN DEL CLIENTE ---------- */}
          <h2 className="h5">Información del cliente</h2>
          <p className="text-muted small">
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

          {/* ---------- DIRECCIÓN DE ENTREGA ---------- */}
          <h2 className="h5 mt-2">Dirección de entrega de los productos</h2>
          <p className="text-muted small">Ingrese dirección de forma detallada</p>

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
            alCambiar={(ubicacion) => setDatos({ ...datos, ...ubicacion })}
          />

          <CampoFormulario
            id="indicaciones"
            etiqueta="Indicaciones para la entrega (opcional)"
            tipo="textarea"
            valor={datos.indicaciones}
            alCambiar={cambiar}
            placeholder="Ej: Entre calles, color del edificio, no tiene timbre."
          />

          {/* ---------- OPCIONES DE ENTREGA Y PAGO ---------- */}
          <h2 className="h5 mt-2">Opciones de entrega y pago</h2>

          <fieldset className="mb-3">
            <legend className="form-label fs-6">Tipo de entrega</legend>

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
                <label className="form-check-label" htmlFor={`entrega-${opcion.id}`}>
                  {opcion.nombre} ({opcion.costo === 0 ? 'Gratis' : formatearPrecio(opcion.costo)})
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

          {/* ---------- PAGAR ---------- */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
            <Link to="/carrito" className="btn btn-outline-secondary">
              ← Volver al carrito
            </Link>

            <div className="text-end">
              <p className="text-muted small mb-1">
                Subtotal {formatearPrecio(totales.subtotal)} · Envío{' '}
                {totales.envio === 0 ? 'gratis' : formatearPrecio(totales.envio)}
              </p>

              <button type="submit" className="btn btn-success btn-lg">
                Pagar ahora {formatearPrecio(totales.total)}
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  )
}
