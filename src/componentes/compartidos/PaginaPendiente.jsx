
import { Link } from 'react-router-dom'

export default function PaginaPendiente({ titulo }) {
  return (
    <main className="container py-5 flex-grow-1">
      <h1>{titulo}</h1>
      <p>Esta sección está en desarrollo.</p>
      <Link to="/" className="btn btn-success">
        Volver al inicio
      </Link>
    </main>
  )
}
