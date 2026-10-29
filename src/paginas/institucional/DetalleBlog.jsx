
import { Link, useParams } from 'react-router-dom'

import { obtenerBlogPorId } from '../../datos/blogs'

export default function DetalleBlog() {
  const { id } = useParams()
  const blog = obtenerBlogPorId(id)

  if (!blog) {
    return (
      <main className="pagina-detalle-blog flex-grow-1">
        <div className="detalle-blog-contenedor">
          <div className="detalle-blog-vacio">
            <h1>Artículo no encontrado</h1>

            <p>
              El artículo solicitado no existe.
            </p>

            <Link to="/blogs" className="detalle-blog-boton">
              Volver a Blogs
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="pagina-detalle-blog flex-grow-1">
      <div className="detalle-blog-contenedor">

        {/* NAVEGACIÓN */}
        <nav className="detalle-blog-navegacion">
          <Link to="/blogs" className="detalle-blog-volver">
            ← Volver a Blogs
          </Link>
        </nav>

        {/* ARTÍCULO */}
        <article className="detalle-blog-articulo">

          {/* ENCABEZADO */}
          <header className="detalle-blog-encabezado">
            <p className="detalle-blog-etiqueta">
              NOTICIAS HUERTOHOGAR
            </p>

            <h1>{blog.tituloArticulo}</h1>

            <p className="detalle-blog-introduccion">
              {blog.introduccion}
            </p>
          </header>

          {/* IMAGEN DESTACADA */}
          <img
            src={blog.imagenDetalle}
            alt={blog.tituloArticulo}
            className="detalle-blog-imagen"
          />

          {/* CONTENIDO DEL ARTÍCULO */}
          <div className="detalle-blog-contenido">
            {blog.secciones.map((seccion) => (
              <section
                key={seccion.titulo}
                className="detalle-blog-seccion"
              >
                <h2>{seccion.titulo}</h2>

                <p>{seccion.texto}</p>
              </section>
            ))}
          </div>

          {/* VOLVER A NOTICIAS */}
          <div className="detalle-blog-final">
            <Link to="/blogs" className="detalle-blog-boton">
              Ver más noticias
            </Link>
          </div>

        </article>
      </div>
    </main>
  )
}
