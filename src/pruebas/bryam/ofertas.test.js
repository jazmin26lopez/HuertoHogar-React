
import { describe, it, expect } from 'vitest'

import { porcentajeOferta, esOferta, precioConOferta } from '../../funciones/ofertas'
import { formatearPrecio, formatearRun, formatearFecha } from '../../funciones/formato'
import { manzanas, naranjas } from './utilidades'

describe('funciones/ofertas', () => {
  it('reconoce los productos con descuento', () => {
    expect(porcentajeOferta(manzanas)).toBe(20)
    expect(esOferta(manzanas)).toBe(true)
    expect(esOferta(naranjas)).toBe(false)
  })

  it('aplica el porcentaje al precio y redondea', () => {
    expect(precioConOferta(manzanas)).toBe(960)
    expect(precioConOferta({ id: 'PO001', precio: 5000 })).toBe(4500)
    expect(precioConOferta({ id: 'VR001', precio: 999 })).toBe(849)
  })

  it('un producto sin oferta mantiene su precio', () => {
    expect(precioConOferta(naranjas)).toBe(1000)
  })

  it('tolera un producto indefinido', () => {
    expect(porcentajeOferta(undefined)).toBe(0)
  })
})

describe('funciones/formato', () => {
  it('formatea precios en pesos chilenos', () => {
    // El separador puede incluir un espacio especial según el navegador: se compara sin espacios
    expect(formatearPrecio(1200).replace(/\s/g, '')).toBe('$1.200')
    expect(formatearPrecio(0).replace(/\s/g, '')).toBe('$0')
    expect(formatearPrecio('no es número').replace(/\s/g, '')).toBe('$0')
  })

  it('formatea el RUN con puntos y guion', () => {
    expect(formatearRun('123456785')).toBe('12.345.678-5')
    expect(formatearRun('19011022k')).toBe('19.011.022-K')
    expect(formatearRun('5')).toBe('5')
  })

  it('formatea fechas y tolera fechas inválidas', () => {
    expect(formatearFecha('2026-10-28T12:00:00.000Z')).toMatch(/2026/)
    expect(formatearFecha('no es fecha')).toBe('')
  })
})
