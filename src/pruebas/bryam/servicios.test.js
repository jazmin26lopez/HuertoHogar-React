
import { describe, it, expect, vi, afterEach } from 'vitest'

import {
  CLAVE_USUARIOS,
  obtenerUsuarios,
  obtenerUsuarioPorRun,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  autenticar
} from '../../servicios/usuariosServicio'
import { iniciarSesion, cerrarSesion, obtenerUsuarioActual } from '../../servicios/sesionServicio'
import {
  CLAVE_CARRITO,
  obtenerCarrito,
  guardarCarrito
} from '../../servicios/carritoServicio'
import {
  registrarOrden,
  obtenerOrdenes,
  obtenerOrdenPorId,
  guardarBorrador,
  obtenerBorrador,
  borrarBorrador
} from '../../servicios/ordenesServicio'
import { agregarItem } from '../../funciones/carrito'
import { manzanas } from './utilidades'

const nuevoUsuario = {
  run: '14',
  nombre: 'Luis',
  apellidos: 'Rojas',
  correo: 'luis@gmail.com',
  contrasena: 'clave123',
  region: 'Región Metropolitana',
  comuna: 'Santiago',
  direccion: 'Calle 5'
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('usuariosServicio (CRUD)', () => {
  it('parte con los usuarios de ejemplo', () => {
    expect(obtenerUsuarios().map((u) => u.rol)).toEqual(['Administrador', 'Cliente'])
  })

  it('crea un usuario como Cliente y lo guarda en localStorage', () => {
    const creado = crearUsuario({ ...nuevoUsuario, run: '14' })

    expect(creado.rol).toBe('Cliente')
    expect(obtenerUsuarioPorRun('14')).toBeDefined()
    expect(JSON.parse(localStorage.getItem(CLAVE_USUARIOS))).toHaveLength(3)
  })

  it('normaliza el RUN al crear y al buscar', () => {
    crearUsuario({ ...nuevoUsuario, run: '22.222.222-2', correo: 'otro@gmail.com' })

    expect(obtenerUsuarioPorRun('22.222.222-2').run).toBe('222222222')
  })

  it('no permite RUN ni correo repetidos', () => {
    expect(() => crearUsuario({ ...nuevoUsuario, run: '123456785' })).toThrow(/RUN/)
    expect(() => crearUsuario({ ...nuevoUsuario, correo: 'ADMIN@duoc.cl' })).toThrow(/correo/)
  })

  it('actualiza un usuario sin cambiar su RUN', () => {
    const actualizado = actualizarUsuario('111111111', { nombre: 'Nuevo', run: '999' })

    expect(actualizado.nombre).toBe('Nuevo')
    expect(actualizado.run).toBe('111111111')
    expect(obtenerUsuarioPorRun('111111111').nombre).toBe('Nuevo')
  })

  it('no permite usar el correo de otro usuario al actualizar', () => {
    expect(() => actualizarUsuario('111111111', { correo: 'admin@duoc.cl' })).toThrow(/correo/)
  })

  it('devuelve null al actualizar un usuario que no existe', () => {
    expect(actualizarUsuario('1', { nombre: 'X' })).toBeNull()
  })

  it('elimina un usuario y avisa si no existía', () => {
    expect(eliminarUsuario('111111111')).toBe(true)
    expect(obtenerUsuarioPorRun('111111111')).toBeUndefined()
    expect(eliminarUsuario('111111111')).toBe(false)
  })

  it('autentica con correo (sin importar mayúsculas) y contraseña', () => {
    expect(autenticar(' Admin@duoc.cl ', 'admin123').rol).toBe('Administrador')
    expect(autenticar('admin@duoc.cl', 'incorrecta')).toBeUndefined()
  })

  it('si el almacenamiento está dañado vuelve a los datos de ejemplo', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    localStorage.setItem(CLAVE_USUARIOS, '{esto no es json')

    expect(obtenerUsuarios()).toHaveLength(2)
    expect(console.error).toHaveBeenCalled()
  })
})

describe('sesionServicio', () => {
  it('sin sesión no hay usuario actual', () => {
    expect(obtenerUsuarioActual()).toBeNull()
  })

  it('al iniciar sesión se obtiene el usuario sin su contraseña', () => {
    iniciarSesion(obtenerUsuarioPorRun('123456785'))

    const actual = obtenerUsuarioActual()

    expect(actual.correo).toBe('admin@duoc.cl')
    expect(actual).not.toHaveProperty('contrasena')
  })

  it('al cerrar sesión se borra', () => {
    iniciarSesion(obtenerUsuarioPorRun('123456785'))
    cerrarSesion()

    expect(obtenerUsuarioActual()).toBeNull()
  })

  it('si el usuario fue eliminado, la sesión deja de ser válida', () => {
    iniciarSesion(obtenerUsuarioPorRun('111111111'))
    eliminarUsuario('111111111')

    expect(obtenerUsuarioActual()).toBeNull()
  })
})

describe('carritoServicio', () => {
  it('guarda y recupera el carrito', () => {
    const items = agregarItem([], manzanas, 2)

    expect(guardarCarrito(items)).toBe(true)
    expect(obtenerCarrito()).toEqual(items)
  })

  it('con datos corruptos o que no son un arreglo devuelve un carrito vacío', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    localStorage.setItem(CLAVE_CARRITO, '{"no":"arreglo"}')
    expect(obtenerCarrito()).toEqual([])

    localStorage.setItem(CLAVE_CARRITO, 'basura')
    expect(obtenerCarrito()).toEqual([])
  })

  it('informa si no se pudo guardar (mock de localStorage.setItem)', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Almacenamiento lleno')
    })

    expect(guardarCarrito([])).toBe(false)
  })
})

describe('ordenesServicio', () => {
  const datosOrden = {
    cliente: { nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com' },
    direccion: { calle: 'Calle 1', region: 'Región Metropolitana', comuna: 'Santiago' },
    entrega: { id: 'domicilio', nombre: 'Despacho a domicilio', costo: 3000 },
    metodoPago: 'tarjeta',
    items: agregarItem([], manzanas, 2),
    estado: 'pagada'
  }

  it('registra la orden con número correlativo y totales', () => {
    const primera = registrarOrden(datosOrden)
    const segunda = registrarOrden({ ...datosOrden, estado: 'fallida' })

    expect(primera.id).toBe('20260001')
    expect(primera.codigo).toBe('ORDER20260001')
    expect(primera).toMatchObject({ subtotal: 1920, envio: 3000, total: 4920 })
    expect(segunda.id).toBe('20260002')
    expect(obtenerOrdenes()).toHaveLength(2)
  })

  it('busca una orden por su número', () => {
    registrarOrden(datosOrden)

    expect(obtenerOrdenPorId('20260001').estado).toBe('pagada')
    expect(obtenerOrdenPorId(20260001)).toBeDefined()
    expect(obtenerOrdenPorId('0')).toBeUndefined()
  })

  it('guarda, lee y borra el borrador del checkout', () => {
    expect(obtenerBorrador()).toBeNull()

    guardarBorrador({ nombre: 'Ana' })
    expect(obtenerBorrador()).toEqual({ nombre: 'Ana' })

    borrarBorrador()
    expect(obtenerBorrador()).toBeNull()
  })
})
