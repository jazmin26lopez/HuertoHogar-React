
import { Link } from 'react-router-dom'

const COMPROMISOS = [
  {
    titulo: 'Productos frescos',
    texto: 'Seleccionamos productos de calidad para conservar la frescura y el sabor en cada entrega.',
    imagen: '/imagenes/frutosFrescos.jpg'
  },
  {
    titulo: 'Agricultura sostenible',
    texto: 'Promovemos prácticas responsables y una relación más consciente con la naturaleza.',
    imagen: '/imagenes/producto-organico.jpg'
  },
  {
    titulo: 'Apoyo local',
    texto: 'Acercamos a los consumidores a los agricultores locales, fortaleciendo esta conexión.',
    imagen: '/imagenes/productores-locales.jpg'
  }
]

const CIUDADES = [
  'Santiago',
  'Puerto Montt',
  'Villarrica',
  'Nacimiento',
  'Viña del Mar',
  'Valparaíso',
  'Concepción'
]

export default function Nosotros() {
  return (
    <main className="pagina-nosotros">

      {/* PORTADA CON IMAGEN */}
      <section className="nosotros-portada">
        <div className="nosotros-portada-contenido">
          <p className="nosotros-etiqueta">
            CONOCE HUERTOHOGAR
          </p>

          <h1>Nuestra historia</h1>

          <p>
            Conectamos a las familias chilenas con
            productos frescos, naturales y de calidad.
          </p>
        </div>
      </section>

      {/* NUESTRA HISTORIA */}
      <section className="nosotros-seccion">
        <div className="nosotros-historia">
          <div className="nosotros-historia-imagen">
            <img
              src="/imagenes/historia.nosotros.jpg"
              alt="Productos frescos y agricultura local"
            />
          </div>

          <div className="nosotros-historia-texto">
            <p className="nosotros-etiqueta">
              NUESTRA HISTORIA
            </p>

            <h2>
              Cultivando confianza desde hace más de 6 años
            </h2>

            <p>
              En HuertoHogar trabajamos para llevar la frescura
              y calidad de los productos del campo directamente
              a la puerta de nuestros clientes.
            </p>

            <p>
              Creemos en una conexión más cercana entre las
              familias chilenas y los agricultores locales,
              apoyando una alimentación saludable y prácticas
              agrícolas sostenibles.
            </p>

            <p>
              Hoy estamos en distintos puntos de Chile,
              acercando productos frescos y naturales
              a más hogares.
            </p>
          </div>
        </div>
      </section>

      {/* NUESTRO COMPROMISO */}
      <section className="nosotros-seccion nosotros-fondo">
        <div className="nosotros-contenedor">
          <div className="nosotros-encabezado">
            <p className="nosotros-etiqueta">
              NUESTRO COMPROMISO
            </p>

            <h2>
              Pequeñas decisiones que hacen una gran diferencia
            </h2>
          </div>

          <div className="nosotros-tarjetas">
            {COMPROMISOS.map((compromiso) => (
              <article
                className="nosotros-tarjeta"
                key={compromiso.titulo}
              >
                <img
                  src={compromiso.imagen}
                  alt={compromiso.titulo}
                />

                <div className="nosotros-tarjeta-contenido">
                  <h3>{compromiso.titulo}</h3>
                  <p>{compromiso.texto}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="nosotros-seccion">
        <div className="nosotros-contenedor">
          <div className="nosotros-encabezado">
            <p className="nosotros-etiqueta">
              LO QUE NOS MUEVE
            </p>

            <h2>Nuestro propósito</h2>
          </div>

          <div className="nosotros-proposito">
            <article className="nosotros-proposito-item">
              <h3>Nuestra misión</h3>

              <p>
                Proporcionar productos frescos y de calidad
                directamente desde el campo hasta la puerta
                de nuestros clientes, garantizando frescura
                y sabor en cada entrega.
              </p>

              <p>
                Nos comprometemos a fomentar una conexión
                más cercana entre los consumidores y los
                agricultores locales, apoyando prácticas
                agrícolas sostenibles y promoviendo una
                alimentación saludable.
              </p>
            </article>

            <article className="nosotros-proposito-item">
              <h3>Nuestra visión</h3>

              <p>
                Ser la tienda online líder en la distribución
                de productos frescos y naturales en Chile,
                reconocida por nuestra calidad, servicio
                al cliente y compromiso con la sostenibilidad.
              </p>

              <p>
                Aspiramos a expandir nuestra presencia a nivel
                nacional e internacional, estableciendo un
                nuevo estándar en la distribución de productos
                agrícolas directos del productor al consumidor.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* PRESENCIA EN CHILE */}
      <section className="nosotros-presencia">
        <div className="nosotros-contenedor">
          <p className="nosotros-etiqueta">
            CRECEMOS CONTIGO
          </p>

          <h2>HuertoHogar está presente en Chile</h2>

          <p>
            Llevamos nuestra conexión con el campo
            a distintos puntos del país.
          </p>

          <ul className="nosotros-ciudades">
            {CIUDADES.map((ciudad) => (
              <li key={ciudad}>
                {ciudad}
              </li>
            ))}
          </ul>

          <Link to="/productos" className="nosotros-boton">
            Ver productos
          </Link>
        </div>
      </section>

    </main>
  )
}
