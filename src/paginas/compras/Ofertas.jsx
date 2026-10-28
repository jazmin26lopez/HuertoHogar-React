
import { useEffect, useState } from 'react'

import TarjetaOferta from '../../componentes/compras/TarjetaOferta'
import useCarrito from '../../contextos/useCarrito'
import { esOferta } from '../../funciones/ofertas'
import { obtenerProductos, suscribirseAProductos } from '../../servicios/productosServicio'

export default function Ofertas() {
  const { agregar } = useCarrito()
  const [productos, setProductos] = useState(obtenerProductos)
  const [mensaje, setMensaje] = useState('')

  // Si el administrador cambia el catálogo, las ofertas se actualizan solas
  useEffect(() => {
    const actualizar = () => setProductos(obtenerProductos())

    return suscribirseAProductos(actualizar)
  }, [])

  const ofertas = productos.filter(esOferta)

  function agregarAlCarrito(producto) {
    const agregado = agregar(producto)

    setMensaje(
      agregado
        ? `${producto.nombre} se agregó al carrito.`
        : `No hay más stock disponible de ${producto.nombre}.`
    )
  }

  return (
    <main className="container py-4 flex-grow-1">
      <h1 style={{ color: '#244D36' }}>Ofertas</h1>
      <p className="text-muted">Aprovecha los descuentos de la semana en productos frescos.</p>

      {mensaje && (
        <div className="alert alert-info" role="status">
          {mensaje}
        </div>
      )}

      {ofertas.length === 0 ? (
        <div className="alert alert-secondary" role="status">
          Por ahora no hay productos en oferta.
        </div>
      ) : (
        <section className="grid-productos" aria-label="Productos en oferta">
          {ofertas.map((producto) => (
            <TarjetaOferta key={producto.id} producto={producto} alAgregar={agregarAlCarrito} />
          ))}
        </section>
      )}
    </main>
  )
}
