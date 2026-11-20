
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CampoFormulario from '../../componentes/formularios/CampoFormulario'
import FormularioUsuario from '../../componentes/usuarios/FormularioUsuario'
import { renderizarApp } from './utilidades'
import { instalarApiFalsa } from './apiFalsa'

import {
  obtenerUsuarioActual
} from '../../servicios/sesionServicio'

describe('10 pruebas de Bryam - HuertoHogar', () => {

  // La API falsa reemplaza a fetch: responde como el backend, sin necesitarlo encendido.
  let api

  beforeEach(() => {
    api = instalarApiFalsa()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // PRUEBA 1: RENDERIZADO CONDICIONAL
  it('CampoFormulario muestra errores solamente cuando corresponde', () => {
    const { rerender } = render(
      <CampoFormulario
        id="correo"
        etiqueta="Correo"
        valor=""
        alCambiar={() => {}}
      />
    )

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Correo')).not.toHaveClass('is-invalid')

    rerender(
      <CampoFormulario
        id="correo"
        etiqueta="Correo"
        valor=""
        alCambiar={() => {}}
        error="Correo inválido"
      />
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Correo inválido')
    expect(screen.getByLabelText('Correo')).toHaveClass('is-invalid')
    expect(screen.getByLabelText('Correo')).toHaveAttribute(
      'aria-invalid',
      'true'
    )
  })

  // PRUEBA 2: EDICIÓN DE USUARIOS
  it('al editar un usuario el RUN queda bloqueado', () => {
    render(
      <FormularioUsuario
        modo="editar"
        usuarioInicial={{ ...api.usuarios[1], contrasena: undefined }}
        alGuardar={() => {}}
      />
    )

    expect(screen.getByLabelText('RUN')).toBeDisabled()

    expect(screen.getByLabelText('RUN')).toHaveValue(
      '11.111.111-1'
    )

    expect(
      screen.queryByLabelText('Confirmar contraseña')
    ).not.toBeInTheDocument()
  })

  // PRUEBA 3: CONTROL DE ROLES
  it('el registro público no permite elegir el rol de administrador', () => {
    const { unmount } = render(
      <FormularioUsuario
        modo="registro"
        alGuardar={() => {}}
      />
    )

    expect(
      screen.queryByLabelText('Rol')
    ).not.toBeInTheDocument()

    unmount()

    render(
      <FormularioUsuario
        modo="crear"
        alGuardar={() => {}}
      />
    )

    expect(
      screen.getByLabelText('Rol')
    ).toBeInTheDocument()
  })

  // PRUEBA 4: INICIO DE SESIÓN INCORRECTO
  it('rechaza credenciales incorrectas y no inicia sesión', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/iniciar-sesion')

    await usuario.type(
      screen.getByLabelText('Correo electrónico'),
      'cliente@gmail.com'
    )

    await usuario.type(
      screen.getByLabelText('Contraseña'),
      'equivocada'
    )

    await usuario.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    )

    // el backend responde 401 y la pantalla muestra el mensaje
    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent('Correo o contraseña incorrectos.')

    expect(obtenerUsuarioActual()).toBeNull()
  })

  // PRUEBA 5: INICIO DE SESIÓN CLIENTE
  it('permite iniciar sesión correctamente a un cliente', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/iniciar-sesion')

    await usuario.type(
      screen.getByLabelText('Correo electrónico'),
      'cliente@gmail.com'
    )

    await usuario.type(
      screen.getByLabelText('Contraseña'),
      'Cliente2026!'
    )

    await usuario.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Frescura directamente del campo'
      })
    ).toBeInTheDocument()

    // la sesión guardada (token + usuario) nunca incluye la contraseña
    expect(obtenerUsuarioActual().correo).toBe(
      'cliente@gmail.com'
    )

    expect(obtenerUsuarioActual()).not.toHaveProperty(
      'contrasena'
    )
  })

  // PRUEBA 6: INICIO DE SESIÓN ADMINISTRADOR
  it('redirige al administrador al listado de usuarios', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/iniciar-sesion')

    await usuario.type(
      screen.getByLabelText('Correo electrónico'),
      'admin@duoc.cl'
    )

    await usuario.type(
      screen.getByLabelText('Contraseña'),
      'Admin2026!'
    )

    await usuario.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Administración de usuarios'
      })
    ).toBeInTheDocument()

    expect(obtenerUsuarioActual().rol).toBe('Administrador')
  })

  // PRUEBA 7: CORREO DUPLICADO EN REGISTRO
  it('rechaza el registro de un correo ya existente', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/registro')

    await usuario.type(screen.getByLabelText('RUN'), '22222222-2')
    await usuario.type(screen.getByLabelText('Nombre'), 'Marta')
    await usuario.type(screen.getByLabelText('Apellidos'), 'Soto')

    await usuario.type(
      screen.getByLabelText('Correo electrónico'),
      'cliente@gmail.com'
    )

    await usuario.selectOptions(
      screen.getByLabelText('Región'),
      'Región Metropolitana'
    )

    await usuario.selectOptions(
      screen.getByLabelText('Comuna'),
      'Santiago'
    )

    await usuario.type(
      screen.getByLabelText('Dirección'),
      'Calle 9'
    )

    await usuario.type(
      screen.getByLabelText('Contraseña'),
      'clave1234'
    )

    await usuario.type(
      screen.getByLabelText('Confirmar contraseña'),
      'clave1234'
    )

    await usuario.click(
      screen.getByRole('button', { name: 'Crear cuenta' })
    )

    // el backend responde 409 con su mensaje y no se crea ningún usuario
    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent('Correo ya registrado')

    expect(api.usuarios).toHaveLength(3)
  })

  // FUNCIÓN AUXILIAR PARA PRUEBAS ADMINISTRATIVAS
  async function entrarComoAdmin(usuario) {
    renderizarApp('/iniciar-sesion')

    await usuario.type(
      screen.getByLabelText('Correo electrónico'),
      'admin@duoc.cl'
    )

    await usuario.type(
      screen.getByLabelText('Contraseña'),
      'Admin2026!'
    )

    await usuario.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    )

    // espera a que el listado termine de cargar desde la API
    await screen.findByText('cliente@gmail.com')
  }

  // PRUEBA 8: CREACIÓN DE USUARIOS
  it('crea un usuario nuevo desde administración', async () => {
    const usuario = userEvent.setup()

    await entrarComoAdmin(usuario)

    await usuario.click(
      screen.getByRole('link', { name: '+ Nuevo usuario' })
    )

    await usuario.type(screen.getByLabelText('RUN'), '22222222-2')
    await usuario.type(screen.getByLabelText('Nombre'), 'Pedro')
    await usuario.type(screen.getByLabelText('Apellidos'), 'Díaz')

    await usuario.type(
      screen.getByLabelText('Correo electrónico'),
      'pedro@duoc.cl'
    )

    await usuario.selectOptions(
      screen.getByLabelText('Región'),
      'Región Metropolitana'
    )

    await usuario.selectOptions(
      screen.getByLabelText('Comuna'),
      'Santiago'
    )

    await usuario.type(
      screen.getByLabelText('Dirección'),
      'Calle 3'
    )

    await usuario.selectOptions(
      screen.getByLabelText('Rol'),
      'Administrador'
    )

    await usuario.type(
      screen.getByLabelText('Contraseña'),
      'clave1234'
    )

    await usuario.type(
      screen.getByLabelText('Confirmar contraseña'),
      'clave1234'
    )

    await usuario.click(
      screen.getByRole('button', { name: 'Crear usuario' })
    )

    expect(
      await screen.findByText('22.222.222-2')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'Administración de usuarios'
      })
    ).toBeInTheDocument()

    expect(
      api.usuarios.find((u) => u.run === '222222222').rol
    ).toBe('Administrador')
  })

  // PRUEBA 9: EDICIÓN DE USUARIOS
  it('edita un usuario y guarda los cambios', async () => {
    const usuario = userEvent.setup()

    await entrarComoAdmin(usuario)

    const fila = screen
      .getByText('cliente@gmail.com')
      .closest('tr')

    await usuario.click(
      within(fila).getByRole('link', { name: 'Editar' })
    )

    const nombre = await screen.findByLabelText('Nombre')

    await usuario.clear(nombre)
    await usuario.type(nombre, 'Camila')

    await usuario.click(
      screen.getByRole('button', { name: 'Guardar cambios' })
    )

    expect(
      await screen.findByText('Camila Demostración')
    ).toBeInTheDocument()

    expect(
      api.usuarios.find((u) => u.run === '111111111').nombre
    ).toBe('Camila')
  })

  // PRUEBA 10: PROTECCIÓN DE ADMINISTRADORES
  it('impide que el administrador desactive su propia cuenta', async () => {
    const usuario = userEvent.setup()

    await entrarComoAdmin(usuario)

    const fila = screen
      .getByText('admin@duoc.cl')
      .closest('tr')

    expect(
      within(fila).getByRole('button', {
        name: 'Desactivar'
      })
    ).toBeDisabled()
  })

})
