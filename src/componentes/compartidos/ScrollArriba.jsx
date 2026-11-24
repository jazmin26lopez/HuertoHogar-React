import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router cambia de página sin recargar, así que el navegador conserva el desplazamiento anterior.
// Este componente no dibuja nada: solo lleva la vista arriba cada vez que cambia la dirección.
export default function ScrollArriba() {
  const { pathname } = useLocation()

  useEffect(() => {
    // 'instant': el sitio tiene scroll-behavior: smooth en el CSS y la subida debe ser inmediata
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
