
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  obtenerProductos,
  suscribirseAProductos
} from '../../servicios/productosServicio'

const productosDelInicio = [
  { id: 'FR001', icono: '🍎' },
  { id: 'FR002', icono: '🍊' },
  { id: 'FR003', icono: '🍌' },
  { id: 'VR001', icono: '🥕' },
  { id: 'VR002', icono: '🥬' },
  { id: 'VR003', icono: '🫑' }
]

const noticias = [
  {
    id: 1,
    titulo: 'Caso Curioso #1: Frutas de temporada',
    descripcion:
      'Descubre por qué comer frutas y verduras de temporada no solo es más económico, sino también mejor para tu salud y el medio ambiente.',
    imagen: '/imagenes/frutosFrescos.jpg',
    alt: 'Frutas y verduras de temporada'
  },
  {
    id: 2,
    titulo: 'Caso Curioso #2: Agricultura sostenible',
    descripcion:
      'Conoce cómo los pequeños agricultores chilenos están adoptando prácticas sostenibles para cuidar la tierra y producir alimentos más saludables.',
    imagen: '/imagenes/productores-locales.jpg',
    alt: 'Agricultura sostenible'
  }
]

const formatearPrecio = (precio) =>
  '$' + Number(precio).toLocaleString('es-CL')

export default function Inicio() {
  const [productos, setProductos] = useState(obtenerProductos)

  useEffect(() => {
    const actualizarProductos = () => {
      setProductos(obtenerProductos())
    }

    actualizarProductos()

    return suscribirseAProductos(actualizarProductos)
  }, [])

  const destacados = productosDelInicio
    .map(({ id, icono }) => {
      const producto = productos.find((item) => item.id === id)
      return producto ? { ...producto, icono } : null
    })
    .filter(Boolean)

  return (
    <main className="inicio-huertohogar">

      {/* BANNER ORIGINAL */}
      <section className="hero-nosotros">
        <img
          src="/imagenes/fondo.png"
          alt="Campo y productos frescos de HuertoHogar"
        />

        <div className="hero-contenido">
          <p className="hero-subtitulo">
            HUERTOHOGAR
          </p>

          <h1>
            Del campo
            <br />
            a tu hogar
          </h1>

          <p>
            Conectamos a las familias chilenas con productos
            frescos, naturales y de calidad.
          </p>

          <Link to="/productos" className="btn-historia">
            Ver productos
          </Link>
        </div>
      </section>

      {/* NUESTROS PRODUCTOS */}
      <section className="compromiso">
        <div className="titulo-seccion">
          <p className="etiqueta">
            NUESTROS PRODUCTOS
          </p>

          <h2>
            Frescura directamente del campo
          </h2>

          <p>
            Encuentra productos frescos, naturales y seleccionados
            para llevar lo mejor del campo directamente a tu hogar.
          </p>
        </div>

        <div className="grid-compromiso">
          {destacados.map((producto) => (
            <article
              className="card-compromiso"
              key={producto.id}
            >
              <Link
                to={`/productos/${producto.id}`}
                aria-label={`Ver detalle de ${producto.nombre}`}
              >
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                />
              </Link>

              <div className="contenido-card">
                <span aria-hidden="true">
                  {producto.icono}
                </span>

                <h3>
                  {producto.nombre}
                </h3>

                <p>
                  {formatearPrecio(producto.precio)}
                  {' / '}
                  {producto.unidad}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="inicio-accion-centrada">
          <Link to="/productos" className="btn-historia">
            Ver todos los productos
          </Link>
        </div>
      </section>

      {/* DEL CAMPO A TU HOGAR */}
      <section className="seccion-historia">
        <div className="historia-imagen">
          <img
            src="/imagenes/historia.nosotros.jpg"
            alt="Historia de HuertoHogar"
          />
        </div>

        <div className="historia-texto">
          <span className="etiqueta">
            DEL CAMPO A TU HOGAR
          </span>

          <h2>
            Conectamos familias con productores locales
          </h2>

          <p>
            En HuertoHogar buscamos acercar a las familias
            chilenas productos frescos y naturales
            provenientes de productores locales.
          </p>

          <p>
            Creemos en una conexión más cercana entre
            quienes producen nuestros alimentos y quienes
            los disfrutan en sus hogares.
          </p>

          <Link to="/nosotros" className="btn-historia">
            Conoce nuestra historia
          </Link>
        </div>
      </section>

      {/* NOTICIAS IMPORTANTES */}
      <section className="presencia">
        <div className="titulo-seccion">
          <p className="etiqueta">
            NOTICIAS IMPORTANTES
          </p>

          <h2>
            Consejos y novedades de HuertoHogar
          </h2>

          <p>
            Descubre información interesante sobre alimentación,
            agricultura y productos de temporada.
          </p>
        </div>

        <div className="lista-blogs">
          {noticias.map((noticia) => (
            <article className="card-blog" key={noticia.id}>
              <img
                src={noticia.imagen}
                alt={noticia.alt}
              />

              <div className="info-blog">
                <h2>
                  {noticia.titulo}
                </h2>

                <p>
                  {noticia.descripcion}
                </p>

                <Link
                  to="/blogs"
                  className="boton-ver-caso"
                >
                  Ver caso
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* INVITACIÓN A COMPRAR */}
      <section className="compromiso">
        <div className="titulo-seccion">
          <p className="etiqueta">
            HUERTOHOGAR
          </p>

          <h2>
            Lleva lo mejor del campo a tu hogar
          </h2>

          <p>
            Descubre nuestros productos frescos y naturales
            y disfruta de una experiencia de compra cercana
            y sencilla.
          </p>

          <Link to="/productos" className="btn-historia">
            Comprar productos
          </Link>
        </div>
      </section>

    </main>
  )
}
