
import ImagenProducto from './ImagenProducto'
import { formatearPrecio, formatearFecha } from '../../funciones/formato'
import { calcularSubtotalItem } from '../../funciones/carrito'

// Campo gris de solo lectura, igual que en las Figuras 7 y 8 del anexo
function CampoSoloLectura({ id, etiqueta, valor, tipo = 'input' }) {
  const propiedades = {
    id,
    className: 'form-control bg-body-secondary',
    value: valor ?? '',
    readOnly: true
  }

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {etiqueta}
      </label>

      {tipo === 'textarea' ? <textarea rows={3} {...propiedades} /> : <input type="text" {...propiedades} />}
    </div>
  )
}

// Boleta de una orden: datos del cliente, dirección, productos y total (solo lectura).
// La usan las vistas de compra exitosa y compra fallida.
export default function DetalleOrden({ orden, etiquetaTotal = 'Total pagado' }) {
  const { cliente, direccion, entrega, items } = orden

  return (
    <div>
      <div className="row">
        <div className="col-md-4">
          <CampoSoloLectura id="orden-nombre" etiqueta="Nombre" valor={cliente.nombre} />
        </div>

        <div className="col-md-4">
          <CampoSoloLectura id="orden-apellidos" etiqueta="Apellidos" valor={cliente.apellidos} />
        </div>

        <div className="col-md-4">
          <CampoSoloLectura id="orden-correo" etiqueta="Correo" valor={cliente.correo} />
        </div>
      </div>

      <h2 className="h5">Dirección de entrega de los productos</h2>

      <div className="row">
        <div className="col-md-6">
          <CampoSoloLectura id="orden-calle" etiqueta="Calle" valor={direccion.calle} />
        </div>

        <div className="col-md-6">
          <CampoSoloLectura id="orden-departamento" etiqueta="Departamento (opcional)" valor={direccion.departamento} />
        </div>

        <div className="col-md-6">
          <CampoSoloLectura id="orden-region" etiqueta="Región" valor={direccion.region} />
        </div>

        <div className="col-md-6">
          <CampoSoloLectura id="orden-comuna" etiqueta="Comuna" valor={direccion.comuna} />
        </div>
      </div>

      <CampoSoloLectura
        id="orden-indicaciones"
        etiqueta="Indicaciones para la entrega (opcional)"
        valor={direccion.indicaciones}
        tipo="textarea"
      />

      <CampoSoloLectura id="orden-entrega" etiqueta="Tipo de entrega" valor={entrega.nombre} />

      <div className="table-responsive">
        <table className="table align-middle bg-white">
          <caption className="visually-hidden">Productos de la compra</caption>
          <thead>
            <tr>
              <th scope="col">Imagen</th>
              <th scope="col">Nombre</th>
              <th scope="col">Precio</th>
              <th scope="col">Cantidad</th>
              <th scope="col" className="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <ImagenProducto producto={item} tamano={40} />
                </td>
                <td>{item.nombre}</td>
                <td>{formatearPrecio(item.precio)}</td>
                <td>{item.cantidad}</td>
                <td className="text-end">{formatearPrecio(calcularSubtotalItem(item))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card shadow-sm text-center mb-3">
        <div className="card-body">
          <p className="text-muted small mb-1">
            Subtotal {formatearPrecio(orden.subtotal)} · Envío{' '}
            {orden.envio === 0 ? 'gratis' : formatearPrecio(orden.envio)} · {formatearFecha(orden.fecha)}
          </p>

          <p className="fs-3 mb-0" data-testid="total-orden">
            {etiquetaTotal}: {formatearPrecio(orden.total)}
          </p>
        </div>
      </div>
    </div>
  )
}
