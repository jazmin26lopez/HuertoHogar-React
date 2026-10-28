
const IMAGEN_RESPALDO = '/imagenes/placeholder.svg'

// Miniatura de producto; si la imagen no carga se muestra una de respaldo.
export default function ImagenProducto({ producto, tamano = 56 }) {
  return (
    <img
      src={producto.imagen || IMAGEN_RESPALDO}
      alt={producto.nombre}
      width={tamano}
      height={tamano}
      className="rounded"
      style={{ objectFit: 'cover' }}
      onError={(evento) => {
        // Evita un bucle infinito si el respaldo tampoco carga
        if (!evento.currentTarget.src.endsWith(IMAGEN_RESPALDO)) {
          evento.currentTarget.src = IMAGEN_RESPALDO
        }
      }}
    />
  )
}
