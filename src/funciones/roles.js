
// Roles del sistema y qué puede ver cada uno (según las instrucciones de la evaluación):
//  - Administrador: acceso total.
//  - Vendedor: solo ve la lista y el detalle de productos y de órdenes.
//  - Cliente: solo la tienda.
export const ROL_ADMINISTRADOR = 'Administrador'
export const ROL_VENDEDOR = 'Vendedor'
export const ROL_CLIENTE = 'Cliente'

export const ROLES = [ROL_CLIENTE, ROL_VENDEDOR, ROL_ADMINISTRADOR]

// Página a la que va cada rol justo después de iniciar sesión
export function paginaInicialPorRol(rol) {
  if (rol === ROL_ADMINISTRADOR) {
    return '/admin/usuarios'
  }

  if (rol === ROL_VENDEDOR) {
    return '/admin/productos'
  }

  return '/'
}

// ¿El usuario puede ver el panel interno (productos y órdenes)?
export function esPersonalInterno(usuario) {
  return usuario?.rol === ROL_ADMINISTRADOR || usuario?.rol === ROL_VENDEDOR
}

export function esAdministrador(usuario) {
  return usuario?.rol === ROL_ADMINISTRADOR
}
