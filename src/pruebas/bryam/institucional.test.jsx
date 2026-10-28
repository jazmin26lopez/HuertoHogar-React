
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderizarApp } from './utilidades'
import { validarContacto } from '../../funciones/validaciones'
import { obtenerMensajes, guardarMensaje } from '../../servicios/contactoServicio'
import { obtenerBlogPorId, BLOGS } from '../../datos/blogs'

afterEach(() => {
  vi.restoreAllMocks()
})

const contactoValido = {
  nombre: 'Ana Pérez',
  correo: 'ana@hotmail.com',
  asunto: 'Consulta de despacho',
  mensaje: '¿Despachan a Villarrica?'
}

describe('validarContacto', () => {
  it('acepta datos completos y un correo de cualquier dominio', () => {
    expect(validarContacto(contactoValido)).toEqual({})
  })

  it('exige todos los campos', () => {
    const errores = validarContacto({ nombre: '', correo: '', asunto: ' ', mensaje: '' })

    expect(Object.keys(errores)).toEqual(['nombre', 'correo', 'asunto', 'mensaje'])
  })

  it('rechaza un correo sin formato válido', () => {
    expect(validarContacto({ ...contactoValido, correo: 'ana@' }).correo).toMatch(/formato válido/)
  })

  it('limita el mensaje a 500 caracteres', () => {
    expect(validarContacto({ ...contactoValido, mensaje: 'a'.repeat(501) }).mensaje).toMatch(/500/)
  })
})

describe('contactoServicio y blogs', () => {
  it('guarda los mensajes con fecha y número correlativo', () => {
    expect(guardarMensaje(contactoValido)).toBe(true)
    expect(guardarMensaje(contactoValido)).toBe(true)

    expect(obtenerMensajes()).toMatchObject([{ id: 1, nombre: 'Ana Pérez' }, { id: 2 }])
    expect(obtenerMensajes()[0].fecha).toBeTruthy()
  })

  it('si el almacenamiento falla, devuelve false', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('lleno')
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(guardarMensaje(contactoValido)).toBe(false)
  })

  it('encuentra un blog por su id y devuelve null si no existe', () => {
    expect(obtenerBlogPorId('2').id).toBe('2')
    expect(obtenerBlogPorId('99')).toBeNull()
    expect(BLOGS).toHaveLength(2)
  })
})

describe('páginas informativas', () => {
  it('el encabezado enlaza a Nosotros, Blogs y Contacto', () => {
    renderizarApp('/')

    const encabezado = within(screen.getByRole('banner'))

    expect(encabezado.getByRole('link', { name: 'Nosotros' })).toHaveAttribute('href', '/nosotros')
    expect(encabezado.getByRole('link', { name: 'Blogs' })).toHaveAttribute('href', '/blogs')
    expect(encabezado.getByRole('link', { name: 'Contacto' })).toHaveAttribute('href', '/contacto')
  })

  it('Nosotros muestra la historia, la misión, la visión y las ciudades', () => {
    renderizarApp('/nosotros')

    expect(screen.getByRole('heading', { name: 'Nuestra historia' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Nuestra misión/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Nuestra visión/ })).toBeInTheDocument()
    expect(screen.getByText(/Puerto Montt/)).toBeInTheDocument()
  })

  it('Blogs lista los artículos y "Ver caso" abre el detalle', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/blogs')

    expect(screen.getAllByRole('link', { name: /Ver caso/ })).toHaveLength(2)

    await usuario.click(screen.getByRole('link', { name: /Ver caso: Caso Curioso #1/ }))

    expect(
      screen.getByRole('heading', { name: 'Los beneficios de comer frutas y verduras de temporada' })
    ).toBeInTheDocument()

    await usuario.click(screen.getByRole('link', { name: /Volver a Blogs/ }))

    expect(screen.getByRole('heading', { name: 'Noticias importantes' })).toBeInTheDocument()
  })

  it('un artículo que no existe muestra un aviso', () => {
    renderizarApp('/blogs/99')

    expect(screen.getByRole('heading', { name: 'Artículo no encontrado' })).toBeInTheDocument()
  })
})

describe('formulario de contacto', () => {
  it('muestra los errores si se envía vacío y no guarda nada', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/contacto')

    await usuario.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getAllByRole('alert')).toHaveLength(4)
    expect(obtenerMensajes()).toHaveLength(0)
  })

  it('un mensaje válido se guarda y se confirma', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/contacto')

    await usuario.type(screen.getByLabelText('Nombre completo'), contactoValido.nombre)
    await usuario.type(screen.getByLabelText('Correo electrónico'), contactoValido.correo)
    await usuario.type(screen.getByLabelText('Asunto'), contactoValido.asunto)
    await usuario.type(screen.getByLabelText('Mensaje'), contactoValido.mensaje)
    await usuario.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByRole('status')).toHaveTextContent('Recibimos tu mensaje')
    expect(obtenerMensajes()).toMatchObject([{ nombre: 'Ana Pérez', asunto: 'Consulta de despacho' }])
    expect(screen.getByLabelText('Mensaje')).toHaveValue('')
  })

  it('con sesión iniciada, completa el nombre y el correo solo', () => {
    localStorage.setItem('huertohogar_sesion', '123456785')

    renderizarApp('/contacto')

    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('admin@duoc.cl')
    expect(screen.getByLabelText('Nombre completo').value).toMatch(/Administrador/)
  })
})
