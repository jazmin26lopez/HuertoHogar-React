
import { Link } from 'react-router-dom'

import { BLOGS } from '../../datos/blogs'

export default function Blogs() {
  return (
    <main className="pagina-blogs flex-grow-1">
      <div className="blogs-contenedor">

        {/* ENCABEZADO */}
        <header className="blogs-encabezado">
          <p className="blogs-etiqueta">
            HUERTOHOGAR
          </p>

          <h1>Noticias importantes</h1>

          <p className="blogs-descripcion">
            Consejos y novedades de HuertoHogar sobre
            alimentación, agricultura y productos de temporada.
          </p>
        </header>

        {/* ARTÍCULOS DEL BLOG */}
        <section
          className="blogs-lista"
          aria-label="Artículos de HuertoHogar"
        >
          {BLOGS.map((blog) => (
            <article className="blog-tarjeta" key={blog.id}>

              <img
                src={blog.imagen}
                alt={blog.titulo}
                className="blog-imagen"
              />

              <div className="blog-contenido">
                <h2>{blog.titulo}</h2>

                <p>{blog.resumen}</p>

                <Link
                  to={`/blogs/${blog.id}`}
                  className="blog-boton"
                  aria-label={`Ver caso: ${blog.titulo}`}
                >
                  Ver caso
                </Link>
              </div>

            </article>
          ))}
        </section>

        {BLOGS.length === 0 && (
          <div className="blogs-vacio">
            <p>Por ahora no hay noticias disponibles.</p>
          </div>
        )}

      </div>
    </main>
  )
}
