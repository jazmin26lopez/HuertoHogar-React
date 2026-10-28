
import { describe, it, expect } from 'vitest'

import {
  limiteStock,
  agregarItem,
  cambiarCantidadItem,
  quitarItem,
  calcularSubtotal,
  contarUnidades,
  calcularTotales,
  simularPago,
  OPCIONES_ENTREGA
} from '../../funciones/carrito'
import { manzanas, naranjas } from './utilidades'

describe('funciones/carrito', () => {
  describe('agregarItem', () => {
    it('agrega un producto nuevo con cantidad 1 y precio de oferta', () => {
      const items = agregarItem([], manzanas)

      expect(items).toHaveLength(1)
      expect(items[0]).toMatchObject({ id: 'FR001', cantidad: 1, precio: 960, precioNormal: 1200 })
    })

    it('suma la cantidad si el producto ya estaba en el carrito', () => {
      const items = agregarItem(agregarItem([], manzanas), manzanas, 2)

      expect(items).toHaveLength(1)
      expect(items[0].cantidad).toBe(3)
    })

    it('no modifica el arreglo original (inmutabilidad)', () => {
      const original = agregarItem([], manzanas)
      const copia = JSON.parse(JSON.stringify(original))

      agregarItem(original, manzanas)

      expect(original).toEqual(copia)
    })

    it('respeta el stock disponible', () => {
      const items = agregarItem([], naranjas, 10)

      expect(items[0].cantidad).toBe(3)
    })

    it('devuelve el mismo arreglo si ya no queda stock', () => {
      const lleno = agregarItem([], naranjas, 3)

      expect(agregarItem(lleno, naranjas)).toBe(lleno)
    })

    it('guarda "sin límite" como null para que sobreviva a JSON (Infinity se perdería)', () => {
      const items = agregarItem([], manzanas)

      expect(items[0].stock).toBeNull()
      expect(JSON.parse(JSON.stringify(items))).toEqual(items)
      expect(cambiarCantidadItem(items, 'FR001', 50)[0].cantidad).toBe(50)
    })

    it('no agrega productos con stock 0 ni cantidades menores a 1', () => {
      const agotado = { ...naranjas, stock: 0 }

      expect(agregarItem([], agotado)).toEqual([])
      expect(agregarItem([], manzanas, 0)).toEqual([])
    })
  })

  describe('limiteStock', () => {
    it('es infinito cuando el catálogo no informa stock', () => {
      expect(limiteStock(manzanas)).toBe(Infinity)
      expect(limiteStock({ stock: '' })).toBe(Infinity)
      expect(limiteStock({ stock: 'abc' })).toBe(Infinity)
    })

    it('devuelve el stock cuando es un número válido', () => {
      expect(limiteStock({ stock: 7 })).toBe(7)
      expect(limiteStock({ stock: '4' })).toBe(4)
    })
  })

  describe('cambiarCantidadItem', () => {
    const items = agregarItem(agregarItem([], manzanas), naranjas)

    it('cambia la cantidad del producto indicado', () => {
      const resultado = cambiarCantidadItem(items, 'FR001', 5)

      expect(resultado.find((i) => i.id === 'FR001').cantidad).toBe(5)
      expect(resultado.find((i) => i.id === 'FR002').cantidad).toBe(1)
    })

    it('nunca baja de 1 ni supera el stock', () => {
      expect(cambiarCantidadItem(items, 'FR001', 0)[0].cantidad).toBe(1)
      expect(cambiarCantidadItem(items, 'FR001', -4)[0].cantidad).toBe(1)
      expect(cambiarCantidadItem(items, 'FR002', 99)[1].cantidad).toBe(3)
    })

    it('ignora valores que no son números', () => {
      expect(cambiarCantidadItem(items, 'FR001', 'hola')).toBe(items)
    })
  })

  describe('quitarItem', () => {
    it('elimina solo el producto indicado', () => {
      const items = agregarItem(agregarItem([], manzanas), naranjas)

      expect(quitarItem(items, 'FR001').map((i) => i.id)).toEqual(['FR002'])
    })
  })

  describe('totales', () => {
    const items = agregarItem(agregarItem([], manzanas, 2), naranjas, 1)

    it('calcula subtotal y unidades', () => {
      expect(calcularSubtotal(items)).toBe(2 * 960 + 1000)
      expect(contarUnidades(items)).toBe(3)
    })

    it('suma el costo de envío al total', () => {
      const domicilio = OPCIONES_ENTREGA.find((o) => o.id === 'domicilio')

      expect(calcularTotales(items, domicilio.costo)).toEqual({
        subtotal: 2920,
        envio: 3000,
        total: 5920
      })
    })

    it('un carrito vacío vale 0', () => {
      expect(calcularTotales([])).toEqual({ subtotal: 0, envio: 0, total: 0 })
    })
  })

  describe('simularPago', () => {
    it('aprueba los métodos normales', () => {
      expect(simularPago('tarjeta').aprobado).toBe(true)
      expect(simularPago('transferencia').aprobado).toBe(true)
    })

    it('rechaza la tarjeta de prueba', () => {
      expect(simularPago('tarjeta-rechazada').aprobado).toBe(false)
    })
  })
})
