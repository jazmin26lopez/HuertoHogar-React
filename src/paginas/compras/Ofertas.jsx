
import { useEffect, useState } from 'react'

import TarjetaOferta from '../../componentes/compras/TarjetaOferta'
import useCarrito from '../../contextos/useCarrito'
import { esOferta } from '../../funciones/ofertas'
import {
  obtenerProductos,
  suscribirseAProductos
} from '../../servicios/productosServicio'

export default function Ofertas() {
  const { agregar } = useCarrito()
  const [productos, setProductos] = useState(obtenerProductos)
  const [mensaje, setMensaje] = useState('')

  // Actualizar ofertas cuando cambia el catálogo
  useEffect(() => {
    const actualizar = () => {
      setProductos(obtenerProductos())
    }

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
    <main className="pagina-ofertas flex-grow-1">
      <div className="ofertas-contenedor">

        {/* ENCABEZADO */}
        <header className="ofertas-encabezado">
          <p className="ofertas-etiqueta">
            HUERTOHOGAR
          </p>

          <h1>Ofertas</h1>

          <p className="ofertas-descripcion">
            Aprovecha los descuentos de la semana
            en productos frescos.
          </p>
        </header>

        {/* MENSAJE DEL CARRITO */}
        {mensaje && (
          <div className="alert alert-info" role="status">
            {mensaje}
          </div>
        )}

        {/* CATÁLOGO DE OFERTAS */}
        {ofertas.length === 0 ? (
          <div className="ofertas-vacio" role="status">
            <h2>No hay ofertas disponibles</h2>

            <p>
              Por ahora no hay productos en oferta.
              Vuelve pronto para descubrir nuevos descuentos.
            </p>
          </div>
        ) : (
          <section
            className="grid-productos"
            aria-label="Productos en oferta"
          >
            {ofertas.map((producto) => (
              <TarjetaOferta
                key={producto.id}
                producto={producto}
                alAgregar={agregarAlCarrito}
              />
            ))}
          </section>
        )}

      </div>
    </main>
  )
}
