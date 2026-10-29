
import { Link } from 'react-router-dom'
import { DATOS_CONTACTO } from '../../datos/contacto'

export default function PiePagina() {
  return (
    <footer>
      <div className="footer-contenido">
        <div className="footer-marca">
          <h2>🌱 HuertoHogar</h2>
          <p>
            Conectamos a las familias chilenas con productos
            frescos, naturales y de productores locales.
          </p>
        </div>

        <div className="footer-seccion">
          <h3>Enlaces</h3>
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/blogs">Blogs</Link>
        </div>

        <div className="footer-seccion">
          <h3>Contacto</h3>

          <a href={`mailto:${DATOS_CONTACTO.correo}`}>
            <span aria-hidden="true">📧 </span>
            {DATOS_CONTACTO.correo}
          </a>

          <p>
            <span aria-hidden="true">📍 </span>
            {DATOS_CONTACTO.ubicacion}
          </p>

          <a href={`tel:${DATOS_CONTACTO.telefonoEnlace}`}>
            <span aria-hidden="true">📞 </span>
            {DATOS_CONTACTO.telefono}
          </a>
        </div>

        <div className="footer-seccion">
          <h3>Mi cuenta y ayuda</h3>
          <Link to="/contacto">Contacto</Link>
          <Link to="/iniciar-sesion">Iniciar sesión</Link>
          <Link to="/registro">Registrarse</Link>
        </div>
      </div>

      <div className="footer-inferior">
        <p>© 2026 HuertoHogar - Del campo al hogar</p>
      </div>
    </footer>
  )
}
