
import { Link } from 'react-router-dom'

const formatoPrecio = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
})

export default function TarjetaProducto({
  producto,
  alAgregar
}) {
  return (
    <article className="card-producto">
      <img
        src={producto.imagen}
        alt={producto.nombre}
      />

      <h3>{producto.nombre}</h3>

      <p className="precio">
        {formatoPrecio.format(producto.precio)}
        {' / '}
        {producto.unidad}
      </p>

      <div className="d-flex flex-wrap gap-2 justify-content-center mb-3">
        <Link
          to={`/productos/${producto.id}`}
          className="btn btn-outline-success btn-sm"
        >
          Ver detalle
        </Link>

        <button
          type="button"
          className="btn btn-warning btn-sm"
          onClick={() => alAgregar(producto)}
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  )
}
