
import { describe, it, expect } from 'vitest'

import {
  normalizarRun,
  calcularDigitoVerificador,
  validarRun,
  validarTextoObligatorio,
  validarCorreo,
  validarContrasena,
  validarConfirmacion,
  validarFechaNacimiento,
  validarRegionYComuna,
  validarUsuario,
  validarCheckout,
  validarInicioSesion
} from '../../funciones/validaciones'

const usuarioValido = {
  run: '12.345.678-5',
  nombre: 'Ana',
  apellidos: 'Pérez Soto',
  correo: 'ana@gmail.com',
  fechaNacimiento: '2000-05-10',
  region: 'Región Metropolitana',
  comuna: 'Santiago',
  direccion: 'Calle 1 #123',
  contrasena: 'clave123',
  confirmacion: 'clave123'
}

describe('RUN', () => {
  it('normaliza puntos, guion y minúsculas', () => {
    expect(normalizarRun('12.345.678-5')).toBe('123456785')
    expect(normalizarRun('19.011.022-k')).toBe('19011022K')
  })

  it('calcula el dígito verificador (incluye 0 y K)', () => {
    expect(calcularDigitoVerificador('12345678')).toBe('5')
    expect(calcularDigitoVerificador('11111111')).toBe('1')
    expect(calcularDigitoVerificador('6')).toBe('K')
    expect(calcularDigitoVerificador('14')).toBe('0')
  })

  it('acepta un RUN válido con o sin formato', () => {
    expect(validarRun('12.345.678-5')).toBe('')
    expect(validarRun('123456785')).toBe('')
  })

  it('rechaza RUN vacío, corto o con dígito verificador incorrecto', () => {
    expect(validarRun('')).toMatch(/Ingresa/)
    expect(validarRun('123')).toMatch(/entre 7 y 8/)
    expect(validarRun('12345678-9')).toMatch(/no es válido/)
    expect(validarRun('K2345678K')).toMatch(/no es válido/)
  })
})

describe('correo', () => {
  it('acepta los dominios permitidos', () => {
    expect(validarCorreo('a@duoc.cl')).toBe('')
    expect(validarCorreo('a@profesor.duoc.cl')).toBe('')
    expect(validarCorreo('a@gmail.com')).toBe('')
  })

  it('rechaza dominios no permitidos, formato inválido y vacío', () => {
    expect(validarCorreo('a@hotmail.com')).toMatch(/Solo se aceptan/)
    expect(validarCorreo('sin-arroba')).toMatch(/formato/)
    expect(validarCorreo('  ')).toMatch(/Ingresa/)
  })

  it('rechaza correos de más de 100 caracteres', () => {
    expect(validarCorreo(`${'a'.repeat(95)}@gmail.com`)).toMatch(/100/)
  })
})

describe('contraseña', () => {
  it('exige entre 4 y 10 caracteres', () => {
    expect(validarContrasena('abc')).not.toBe('')
    expect(validarContrasena('abcd')).toBe('')
    expect(validarContrasena('a'.repeat(10))).toBe('')
    expect(validarContrasena('a'.repeat(11))).not.toBe('')
  })

  it('la confirmación debe coincidir', () => {
    expect(validarConfirmacion('abcd', 'abcd')).toBe('')
    expect(validarConfirmacion('abcd', 'abce')).toMatch(/no coinciden/)
  })
})

describe('otros campos', () => {
  it('texto obligatorio respeta el máximo', () => {
    expect(validarTextoObligatorio('', 'tu nombre')).toMatch(/Ingresa tu nombre/)
    expect(validarTextoObligatorio('Ana', 'tu nombre', 50)).toBe('')
    expect(validarTextoObligatorio('x'.repeat(51), 'tu nombre', 50)).toMatch(/50/)
  })

  it('la fecha de nacimiento es opcional pero no puede ser futura', () => {
    expect(validarFechaNacimiento('')).toBe('')
    expect(validarFechaNacimiento('2000-01-01')).toBe('')
    expect(validarFechaNacimiento('2999-01-01')).toMatch(/no es válida/)
  })

  it('la comuna debe pertenecer a la región', () => {
    expect(validarRegionYComuna('', '').region).toMatch(/Selecciona/)
    expect(validarRegionYComuna('Inventada', 'X').region).toMatch(/no existe/)
    expect(validarRegionYComuna('Región Metropolitana', '').comuna).toMatch(/Selecciona/)
    expect(validarRegionYComuna('Región Metropolitana', 'Valparaíso').comuna).toMatch(/no pertenece/)
    expect(validarRegionYComuna('Región Metropolitana', 'Santiago')).toEqual({ region: '', comuna: '' })
  })
})

describe('formularios completos', () => {
  it('un usuario válido no tiene errores', () => {
    expect(validarUsuario(usuarioValido)).toEqual({})
  })

  it('devuelve un error por cada campo inválido', () => {
    const errores = validarUsuario({ ...usuarioValido, run: '1', correo: 'x', confirmacion: 'otra' })

    expect(Object.keys(errores).sort()).toEqual(['confirmacion', 'correo', 'run'])
  })

  it('al editar no se pide la contraseña', () => {
    const sinClave = { ...usuarioValido, contrasena: '', confirmacion: '' }

    expect(validarUsuario(sinClave, { conContrasena: false })).toEqual({})
    expect(validarUsuario(sinClave)).toHaveProperty('contrasena')
  })

  it('valida los datos del checkout', () => {
    const datos = {
      nombre: 'Ana',
      apellidos: 'Pérez',
      correo: 'ana@gmail.com',
      calle: 'Calle 1',
      region: 'Región Metropolitana',
      comuna: 'Santiago'
    }

    expect(validarCheckout(datos)).toEqual({})
    expect(Object.keys(validarCheckout({ ...datos, calle: '', comuna: '' })).sort()).toEqual(['calle', 'comuna'])
  })

  it('valida el inicio de sesión', () => {
    expect(validarInicioSesion('a@gmail.com', 'abcd')).toEqual({})
    expect(Object.keys(validarInicioSesion('', ''))).toEqual(['correo', 'contrasena'])
  })
})
