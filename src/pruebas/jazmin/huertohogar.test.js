import { describe, it, expect } from 'vitest'

import {
  validarRun,
  validarCorreo,
  validarInicioSesion,
  validarCheckout
} from '../../funciones/validaciones'

import {
  obtenerEstadoStock
} from '../../funciones/estadoStock'

import {
  agregarItem,
  calcularSubtotalItem,
  calcularTotales
} from '../../funciones/carrito'


describe('Pruebas unitarias - HuertoHogar', () => {

  // PRUEBA 1
  it('Rechaza un RUN incorrecto', () => {
    const resultado = validarRun('12.345.678-0')

    expect(resultado).toBe('El RUN ingresado no es válido.')
  })

  // PRUEBA 2
  it('Rechaza correos con dominios no autorizados', () => {
    const resultado = validarCorreo('cliente@hotmail.com')

    expect(resultado).toBe(
      'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.'
    )
  })

  // PRUEBA 3
  it('Detecta credenciales inválidas al iniciar sesión', () => {
    const errores = validarInicioSesion(
      'correo-invalido',
      '12'
    )

    expect(errores).toHaveProperty('correo')
    expect(errores).toHaveProperty('contrasena')
  })

  // PRUEBA 4
  it('Detecta campos obligatorios vacíos en checkout', () => {
    const errores = validarCheckout({
      nombre: '',
      apellidos: '',
      correo: '',
      calle: '',
      region: '',
      comuna: ''
    })

    expect(errores).toHaveProperty('nombre')
    expect(errores).toHaveProperty('correo')
    expect(errores).toHaveProperty('calle')
    expect(errores).toHaveProperty('region')
  })

  // PRUEBA 5
  it('Clasifica correctamente el stock disponible', () => {
    const estado = obtenerEstadoStock(20)

    expect(estado.nivel).toBe('disponible')
  })

  // PRUEBA 6
  it('Identifica productos con stock crítico', () => {
    const estado = obtenerEstadoStock(3)

    expect(estado.nivel).toBe('critico')
  })

  // PRUEBA 7
  it('Identifica productos agotados', () => {
    const estado = obtenerEstadoStock(0)

    expect(estado.nivel).toBe('agotado')
  })

  // PRUEBA 8
  it('No permite agregar más unidades que el stock disponible', () => {
    const producto = {
      id: 'TEST001',
      nombre: 'Manzanas',
      precio: 1200,
      stock: 2,
      unidad: 'kilo',
      imagen: '/imagenes/manzanas.jpg'
    }

    const carrito = agregarItem([], producto, 5)

    expect(carrito).toHaveLength(1)
    expect(carrito[0].cantidad).toBe(2)
  })

  // PRUEBA 9
  it('Calcula correctamente el subtotal de un producto', () => {
    const item = {
      precio: 1200,
      cantidad: 3
    }

    const subtotal = calcularSubtotalItem(item)

    expect(subtotal).toBe(3600)
  })

  // PRUEBA 10
  it('Calcula el total incluyendo el despacho', () => {
    const items = [
      {
        precio: 1200,
        cantidad: 2
      },
      {
        precio: 700,
        cantidad: 3
      }
    ]

    const resultado = calcularTotales(items, 3000)

    expect(resultado).toEqual({
      subtotal: 4500,
      envio: 3000,
      total: 7500
    })
  })

})
