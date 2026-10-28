
import { Link } from 'react-router-dom'

import { formatearPrecio } from '../../funciones/formato'
import { porcentajeOferta, precioConOferta } from '../../funciones/ofertas'

// Tarjeta de un producto en oferta: precio anterior tachado, precio final y % de descuento.
export default function TarjetaOferta({ producto, alAgregar }) {
  return (
    <article className="card-producto position-relative">
      <span className="badge bg-danger position-absolute top-0 end-0 m-2">
        -{porcentajeOferta(producto)}%
      </span>

      <img src={producto.imagen} alt={producto.nombre} />

      <h3>{producto.nombre}</h3>

      <p className="mb-1 text-muted">
        <del>{formatearPrecio(producto.precio)}</del>
      </p>

      <p className="precio">
        {formatearPrecio(precioConOferta(producto))}
        {' / '}
        {producto.unidad}
      </p>

      <div className="d-flex flex-wrap gap-2 justify-content-center mb-3">
        <Link to={`/productos/${producto.id}`} className="btn btn-outline-success btn-sm">
          Ver detalle
        </Link>

        <button type="button" className="btn btn-warning btn-sm" onClick={() => alAgregar(producto)}>
          Agregar al carrito
        </button>
      </div>
    </article>
  )
}
