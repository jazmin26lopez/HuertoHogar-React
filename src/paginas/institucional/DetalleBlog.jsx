
import { Link, useParams } from 'react-router-dom'

import { obtenerBlogPorId } from '../../datos/blogs'

export default function DetalleBlog() {
  const { id } = useParams()
  const blog = obtenerBlogPorId(id)

  if (!blog) {
    return (
      <main className="container py-5 flex-grow-1 text-start">
        <h1>Artículo no encontrado</h1>

        <p>El artículo solicitado no existe.</p>

        <Link to="/blogs" className="btn btn-success">
          Volver a Blogs
        </Link>
      </main>
    )
  }

  return (
    <main className="container py-4 flex-grow-1 text-start">
      <Link to="/blogs" className="btn btn-outline-success mb-4">
        ← Volver a Blogs
      </Link>

      <article className="mx-auto" style={{ maxWidth: '820px' }}>
        <img
          src={blog.imagenDetalle}
          alt={blog.tituloArticulo}
          className="img-fluid rounded shadow-sm w-100 mb-4"
          style={{ maxHeight: '380px', objectFit: 'cover' }}
        />

        <h1 className="mb-3" style={{ color: '#244D36' }}>
          {blog.tituloArticulo}
        </h1>

        <p className="lead">{blog.introduccion}</p>

        {blog.secciones.map((seccion) => (
          <section key={seccion.titulo} className="mt-4">
            <h2 className="h4" style={{ color: '#2E8B57' }}>
              {seccion.titulo}
            </h2>

            <p>{seccion.texto}</p>
          </section>
        ))}
      </article>
    </main>
  )
}
