
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CampoFormulario from '../../componentes/formularios/CampoFormulario'
import FormularioUsuario from '../../componentes/usuarios/FormularioUsuario'
import { renderizarApp } from './utilidades'

import {
  obtenerUsuarios,
  obtenerUsuarioPorRun
} from '../../servicios/usuariosServicio'

import {
  obtenerUsuarioActual
} from '../../servicios/sesionServicio'

describe('10 pruebas de Bryam - HuertoHogar', () => {

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
        usuarioInicial={obtenerUsuarioPorRun('111111111')}
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

    expect(
      screen.getByRole('alert')
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
      'cliente12'
    )

    await usuario.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    )

    expect(
      screen.getByRole('heading', {
        name: 'Frescura directamente del campo'
      })
    ).toBeInTheDocument()

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
      'admin123'
    )

    await usuario.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    )

    expect(
      screen.getByRole('heading', {
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
      'clave123'
    )

    await usuario.type(
      screen.getByLabelText('Confirmar contraseña'),
      'clave123'
    )

    await usuario.click(
      screen.getByRole('button', { name: 'Crear cuenta' })
    )

    expect(
      screen.getByRole('alert')
    ).toHaveTextContent('Ya existe un usuario con ese correo.')

    expect(obtenerUsuarios()).toHaveLength(2)
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
      'admin123'
    )

    await usuario.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    )
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
      'clave123'
    )

    await usuario.type(
      screen.getByLabelText('Confirmar contraseña'),
      'clave123'
    )

    await usuario.click(
      screen.getByRole('button', { name: 'Crear usuario' })
    )

    expect(
      screen.getByRole('heading', {
        name: 'Administración de usuarios'
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText('22.222.222-2')
    ).toBeInTheDocument()

    expect(
      obtenerUsuarioPorRun('222222222').rol
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

    const nombre = screen.getByLabelText('Nombre')

    await usuario.clear(nombre)
    await usuario.type(nombre, 'Camila')

    await usuario.click(
      screen.getByRole('button', { name: 'Guardar cambios' })
    )

    expect(
      screen.getByText('Camila Demostración')
    ).toBeInTheDocument()

    expect(
      obtenerUsuarioPorRun('111111111').nombre
    ).toBe('Camila')
  })

  // PRUEBA 10: PROTECCIÓN DE ADMINISTRADORES
  it('impide que el administrador elimine su propia cuenta', async () => {
    const usuario = userEvent.setup()

    await entrarComoAdmin(usuario)

    const fila = screen
      .getByText('admin@duoc.cl')
      .closest('tr')

    expect(
      within(fila).getByRole('button', {
        name: 'Eliminar'
      })
    ).toBeDisabled()
  })

})
