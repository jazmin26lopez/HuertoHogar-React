
import { Link } from 'react-router-dom'

import { BLOGS } from '../../datos/blogs'

export default function Blogs() {
  return (
    <main className="container py-4 flex-grow-1 text-start">
      <h1 style={{ color: '#244D36' }}>Noticias importantes</h1>

      <p className="text-muted mb-4">
        Consejos y novedades de HuertoHogar sobre alimentación, agricultura y productos de
        temporada.
      </p>

      <div className="row g-4">
        {BLOGS.map((blog) => (
          <div className="col-12 col-md-6" key={blog.id}>
            <article className="card h-100 shadow-sm">
              <img
                src={blog.imagen}
                alt={blog.titulo}
                className="card-img-top"
                style={{ height: '220px', objectFit: 'cover' }}
              />

              <div className="card-body d-flex flex-column">
                <h2 className="h4" style={{ color: '#244D36' }}>
                  {blog.titulo}
                </h2>

                <p>{blog.resumen}</p>

                <Link
                  to={`/blogs/${blog.id}`}
                  className="btn btn-success mt-auto align-self-start"
                  aria-label={`Ver caso: ${blog.titulo}`}
                >
                  Ver caso
                </Link>
              </div>
            </article>
          </div>
        ))}
      </div>
    </main>
  )
}
