
import { Link } from 'react-router-dom'

const COMPROMISOS = [
  {
    icono: '🥕',
    titulo: 'Productos frescos',
    texto: 'Seleccionamos productos de calidad para conservar la frescura y el sabor en cada entrega.',
    imagen: '/imagenes/frutosFrescos.jpg'
  },
  {
    icono: '🌱',
    titulo: 'Agricultura sostenible',
    texto: 'Promovemos prácticas responsables y una relación más consciente con la naturaleza.',
    imagen: '/imagenes/producto-organico.jpg'
  },
  {
    icono: '🤝',
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
    <main className="flex-grow-1 text-start">
      {/* PORTADA */}
      <section className="py-5" style={{ backgroundColor: '#244D36', color: '#fff' }}>
        <div className="container">
          <p className="mb-1 fw-semibold" style={{ letterSpacing: '2px', color: '#F4C542' }}>
            HUERTOHOGAR
          </p>

          <h1 className="display-5 mb-3" style={{ color: '#fff' }}>
            Nuestra historia
          </h1>

          <p className="lead mb-0">
            Conectamos a las familias chilenas con productos frescos, naturales y de calidad.
          </p>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="container py-5">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-md-6">
            <img
              src="/imagenes/historia.nosotros.jpg"
              alt="Productos frescos y agricultura local"
              className="img-fluid rounded shadow-sm w-100"
              style={{ maxHeight: '380px', objectFit: 'cover' }}
            />
          </div>

          <div className="col-12 col-md-6">
            <p className="fw-semibold mb-1" style={{ color: '#2E8B57' }}>
              NUESTRA HISTORIA
            </p>

            <h2 className="mb-3" style={{ color: '#244D36' }}>
              Cultivando confianza desde hace más de 6 años
            </h2>

            <p>
              En HuertoHogar trabajamos para llevar la frescura y calidad de los productos del
              campo directamente a la puerta de nuestros clientes.
            </p>

            <p>
              Creemos en una conexión más cercana entre las familias chilenas y los agricultores
              locales, apoyando una alimentación saludable y prácticas agrícolas sostenibles.
            </p>

            <p className="mb-0">
              Hoy estamos en distintos puntos de Chile, acercando productos frescos y naturales a
              más hogares.
            </p>
          </div>
        </div>
      </section>

      {/* COMPROMISO */}
      <section className="py-5" style={{ backgroundColor: '#f1f6f2' }}>
        <div className="container">
          <p className="fw-semibold mb-1 text-center" style={{ color: '#2E8B57' }}>
            NUESTRO COMPROMISO
          </p>

          <h2 className="text-center mb-4" style={{ color: '#244D36' }}>
            Pequeñas decisiones que hacen una gran diferencia
          </h2>

          <div className="row g-4">
            {COMPROMISOS.map((compromiso) => (
              <div className="col-12 col-md-4" key={compromiso.titulo}>
                <article className="card h-100 shadow-sm">
                  <img
                    src={compromiso.imagen}
                    alt={compromiso.titulo}
                    className="card-img-top"
                    style={{ height: '180px', objectFit: 'cover' }}
                  />

                  <div className="card-body">
                    <h3 className="h5">
                      <span aria-hidden="true">{compromiso.icono} </span>
                      {compromiso.titulo}
                    </h3>

                    <p className="mb-0">{compromiso.texto}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="container py-5">
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <h2 className="h3" style={{ color: '#244D36' }}>
              <span aria-hidden="true">🌱 </span>Nuestra misión
            </h2>

            <p>
              Proporcionar productos frescos y de calidad directamente desde el campo hasta la
              puerta de nuestros clientes, garantizando frescura y sabor en cada entrega.
            </p>

            <p className="mb-0">
              Nos comprometemos a fomentar una conexión más cercana entre los consumidores y los
              agricultores locales, apoyando prácticas agrícolas sostenibles y promoviendo una
              alimentación saludable.
            </p>
          </div>

          <div className="col-12 col-md-6">
            <h2 className="h3" style={{ color: '#244D36' }}>
              <span aria-hidden="true">🌎 </span>Nuestra visión
            </h2>

            <p>
              Ser la tienda online líder en la distribución de productos frescos y naturales en
              Chile, reconocida por nuestra calidad, servicio al cliente y compromiso con la
              sostenibilidad.
            </p>

            <p className="mb-0">
              Aspiramos a expandir nuestra presencia a nivel nacional e internacional,
              estableciendo un nuevo estándar en la distribución de productos agrícolas directos
              del productor al consumidor.
            </p>
          </div>
        </div>
      </section>

      {/* PRESENCIA */}
      <section className="py-5" style={{ backgroundColor: '#244D36', color: '#fff' }}>
        <div className="container text-center">
          <p className="fw-semibold mb-1" style={{ color: '#F4C542' }}>
            CRECEMOS CONTIGO
          </p>

          <h2 className="mb-2" style={{ color: '#fff' }}>
            HuertoHogar está presente en Chile
          </h2>

          <p className="mb-4">
            Llevamos nuestra conexión con el campo a distintos puntos del país.
          </p>

          <ul className="list-unstyled d-flex flex-wrap justify-content-center gap-3 mb-4">
            {CIUDADES.map((ciudad) => (
              <li key={ciudad} className="badge text-bg-light fs-6 fw-normal">
                <span aria-hidden="true">📍 </span>
                {ciudad}
              </li>
            ))}
          </ul>

          <Link to="/productos" className="btn btn-warning">
            Ver productos
          </Link>
        </div>
      </section>
    </main>
  )
}
