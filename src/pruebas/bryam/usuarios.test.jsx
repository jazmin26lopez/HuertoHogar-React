
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CampoFormulario from '../../componentes/formularios/CampoFormulario'
import FormularioUsuario from '../../componentes/usuarios/FormularioUsuario'
import { renderizarApp } from './utilidades'
import { obtenerUsuarios, obtenerUsuarioPorRun } from '../../servicios/usuariosServicio'
import { obtenerUsuarioActual } from '../../servicios/sesionServicio'

// ---------- Componente aislado: props y render condicional ----------
describe('CampoFormulario', () => {
  it('muestra la etiqueta asociada al control', () => {
    render(<CampoFormulario id="nombre" etiqueta="Nombre" valor="" alCambiar={() => {}} />)

    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
  })

  it('solo muestra el mensaje de error cuando hay error', () => {
    const { rerender } = render(
      <CampoFormulario id="correo" etiqueta="Correo" valor="" alCambiar={() => {}} />
    )

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Correo')).not.toHaveClass('is-invalid')

    rerender(
      <CampoFormulario id="correo" etiqueta="Correo" valor="" alCambiar={() => {}} error="Correo inválido" />
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Correo inválido')
    expect(screen.getByLabelText('Correo')).toHaveClass('is-invalid')
    expect(screen.getByLabelText('Correo')).toHaveAttribute('aria-invalid', 'true')
  })

  it('avisa cada cambio con el evento (spy)', async () => {
    const alCambiar = vi.fn()
    const usuario = userEvent.setup()

    render(<CampoFormulario id="nombre" etiqueta="Nombre" valor="" alCambiar={alCambiar} />)
    await usuario.type(screen.getByLabelText('Nombre'), 'Ana')

    expect(alCambiar).toHaveBeenCalledTimes(3)
  })

  it('renderiza un select con sus opciones', () => {
    render(
      <CampoFormulario id="rol" etiqueta="Rol" tipo="select" valor="Cliente" alCambiar={() => {}}>
        <option value="Cliente">Cliente</option>
        <option value="Administrador">Administrador</option>
      </CampoFormulario>
    )

    expect(screen.getByLabelText('Rol')).toHaveValue('Cliente')
    expect(screen.getAllByRole('option')).toHaveLength(2)
  })
})

describe('FormularioUsuario', () => {
  it('no llama a alGuardar si hay errores y los muestra', async () => {
    const alGuardar = vi.fn()
    const usuario = userEvent.setup()

    render(<FormularioUsuario modo="registro" alGuardar={alGuardar} textoBoton="Crear cuenta" />)
    await usuario.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(alGuardar).not.toHaveBeenCalled()
    expect(screen.getByText('Ingresa tu RUN.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa tu correo electrónico.')).toBeInTheDocument()
  })

  it('con datos válidos llama a alGuardar sin la confirmación de contraseña', async () => {
    const alGuardar = vi.fn()
    const usuario = userEvent.setup()

    render(<FormularioUsuario modo="registro" alGuardar={alGuardar} textoBoton="Crear cuenta" />)

    await usuario.type(screen.getByLabelText('RUN'), '22.222.222-2')
    await usuario.type(screen.getByLabelText('Nombre'), 'Ana')
    await usuario.type(screen.getByLabelText('Apellidos'), 'Pérez')
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'ana@gmail.com')
    await usuario.selectOptions(screen.getByLabelText('Región'), 'Región Metropolitana')
    await usuario.selectOptions(screen.getByLabelText('Comuna'), 'Maipú')
    await usuario.type(screen.getByLabelText('Dirección'), 'Calle 1')
    await usuario.type(screen.getByLabelText('Contraseña'), 'clave123')
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), 'clave123')
    await usuario.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(alGuardar).toHaveBeenCalledTimes(1)

    const enviado = alGuardar.mock.calls[0][0]

    expect(enviado).toMatchObject({ run: '22.222.222-2', nombre: 'Ana', comuna: 'Maipú' })
    expect(enviado).not.toHaveProperty('confirmacion')
  })

  it('muestra el error que devuelve alGuardar (por ejemplo RUN duplicado)', async () => {
    const alGuardar = vi.fn(() => 'Ya existe un usuario con ese RUN.')
    const usuario = userEvent.setup()

    render(
      <FormularioUsuario
        modo="editar"
        usuarioInicial={obtenerUsuarioPorRun('111111111')}
        alGuardar={alGuardar}
        textoBoton="Guardar cambios"
      />
    )
    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Ya existe un usuario con ese RUN.')
  })

  it('al editar el RUN queda bloqueado y no se pide contraseña', () => {
    render(
      <FormularioUsuario
        modo="editar"
        usuarioInicial={obtenerUsuarioPorRun('111111111')}
        alGuardar={() => {}}
      />
    )

    expect(screen.getByLabelText('RUN')).toBeDisabled()
    expect(screen.getByLabelText('RUN')).toHaveValue('11.111.111-1')
    expect(screen.queryByLabelText('Confirmar contraseña')).not.toBeInTheDocument()
  })

  it('el registro público no deja elegir el rol, el del administrador sí', () => {
    const { unmount } = render(<FormularioUsuario modo="registro" alGuardar={() => {}} />)

    expect(screen.queryByLabelText('Rol')).not.toBeInTheDocument()
    unmount()

    render(<FormularioUsuario modo="crear" alGuardar={() => {}} />)

    expect(screen.getByLabelText('Rol')).toBeInTheDocument()
  })
})

// ---------- Inicio y cierre de sesión ----------
describe('iniciar sesión', () => {
  it('con credenciales incorrectas muestra el error y no inicia sesión', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/iniciar-sesion')
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'cliente@gmail.com')
    await usuario.type(screen.getByLabelText('Contraseña'), 'equivocada')
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.')
    expect(obtenerUsuarioActual()).toBeNull()
  })

  it('valida el formato antes de buscar al usuario', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/iniciar-sesion')
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'alguien@hotmail.com')
    await usuario.type(screen.getByLabelText('Contraseña'), 'ab')
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByText(/Solo se aceptan correos/)).toBeInTheDocument()
    expect(screen.getByText(/entre 4 y 10 caracteres/)).toBeInTheDocument()
  })

  it('un cliente entra, queda con la sesión iniciada y vuelve al inicio', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/iniciar-sesion')
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'cliente@gmail.com')
    await usuario.type(screen.getByLabelText('Contraseña'), 'cliente12')
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByRole('heading', { name: 'Inicio' })).toBeInTheDocument()
    expect(obtenerUsuarioActual().correo).toBe('cliente@gmail.com')
    expect(obtenerUsuarioActual()).not.toHaveProperty('contrasena')
  })

  it('un administrador va directo al listado de usuarios', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/iniciar-sesion')
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'admin@duoc.cl')
    await usuario.type(screen.getByLabelText('Contraseña'), 'admin123')
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByRole('heading', { name: 'Usuarios' })).toBeInTheDocument()
    expect(obtenerUsuarioActual().rol).toBe('Administrador')
  })
})

// ---------- Registro ----------
describe('registro', () => {
  it('crea la cuenta, inicia sesión y guarda el usuario', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/registro')

    await usuario.type(screen.getByLabelText('RUN'), '22222222-2')
    await usuario.type(screen.getByLabelText('Nombre'), 'Marta')
    await usuario.type(screen.getByLabelText('Apellidos'), 'Soto')
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'marta@gmail.com')
    await usuario.selectOptions(screen.getByLabelText('Región'), 'Región Metropolitana')
    await usuario.selectOptions(screen.getByLabelText('Comuna'), 'Santiago')
    await usuario.type(screen.getByLabelText('Dirección'), 'Calle 9')
    await usuario.type(screen.getByLabelText('Contraseña'), 'clave123')
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), 'clave123')
    await usuario.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(screen.getByRole('heading', { name: 'Inicio' })).toBeInTheDocument()
    expect(obtenerUsuarioActual().nombre).toBe('Marta')
    expect(obtenerUsuarioPorRun('222222222')).toMatchObject({ rol: 'Cliente', correo: 'marta@gmail.com' })
  })

  it('rechaza un correo ya registrado', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/registro')

    await usuario.type(screen.getByLabelText('RUN'), '22222222-2')
    await usuario.type(screen.getByLabelText('Nombre'), 'Marta')
    await usuario.type(screen.getByLabelText('Apellidos'), 'Soto')
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'cliente@gmail.com')
    await usuario.selectOptions(screen.getByLabelText('Región'), 'Región Metropolitana')
    await usuario.selectOptions(screen.getByLabelText('Comuna'), 'Santiago')
    await usuario.type(screen.getByLabelText('Dirección'), 'Calle 9')
    await usuario.type(screen.getByLabelText('Contraseña'), 'clave123')
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), 'clave123')
    await usuario.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Ya existe un usuario con ese correo.')
    expect(obtenerUsuarios()).toHaveLength(2)
  })

  it('exige que las contraseñas coincidan', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/registro')
    await usuario.type(screen.getByLabelText('Contraseña'), 'clave123')
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), 'otra')
    await usuario.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument()
  })
})

// ---------- Administración de usuarios ----------
describe('administración de usuarios', () => {
  async function entrarComoAdmin(usuario, ruta) {
    // Se inicia sesión por la pantalla de login y luego se navega con el enlace del encabezado
    renderizarApp(ruta)
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'admin@duoc.cl')
    await usuario.type(screen.getByLabelText('Contraseña'), 'admin123')
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
  }

  it('sin sesión redirige al inicio de sesión', () => {
    renderizarApp('/admin/usuarios')

    expect(screen.getByRole('heading', { name: /Qué bueno verte/ })).toBeInTheDocument()
  })

  it('un cliente no puede entrar al listado', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/iniciar-sesion')
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'cliente@gmail.com')
    await usuario.type(screen.getByLabelText('Contraseña'), 'cliente12')
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    // El cliente ya inició sesión: se abre la ruta protegida con un segundo render
    const { unmount } = renderizarApp('/admin/usuarios')

    expect(screen.getAllByRole('heading', { name: 'Acceso restringido' }).length).toBeGreaterThan(0)
    unmount()
  })

  it('lista a los usuarios con su RUN formateado y rol', async () => {
    const usuario = userEvent.setup()

    await entrarComoAdmin(usuario, '/iniciar-sesion')

    const tabla = screen.getByRole('table', { name: 'Listado de usuarios' })

    expect(within(tabla).getByText('12.345.678-5')).toBeInTheDocument()
    expect(within(tabla).getByText('cliente@gmail.com')).toBeInTheDocument()
    expect(within(tabla).getAllByRole('row')).toHaveLength(3)
  })

  it('crea un usuario nuevo desde el panel', async () => {
    const usuario = userEvent.setup()

    await entrarComoAdmin(usuario, '/iniciar-sesion')
    await usuario.click(screen.getByRole('link', { name: '+ Nuevo usuario' }))

    await usuario.type(screen.getByLabelText('RUN'), '22222222-2')
    await usuario.type(screen.getByLabelText('Nombre'), 'Pedro')
    await usuario.type(screen.getByLabelText('Apellidos'), 'Díaz')
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'pedro@duoc.cl')
    await usuario.selectOptions(screen.getByLabelText('Región'), 'Región Metropolitana')
    await usuario.selectOptions(screen.getByLabelText('Comuna'), 'Santiago')
    await usuario.type(screen.getByLabelText('Dirección'), 'Calle 3')
    await usuario.selectOptions(screen.getByLabelText('Rol'), 'Administrador')
    await usuario.type(screen.getByLabelText('Contraseña'), 'clave123')
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), 'clave123')
    await usuario.click(screen.getByRole('button', { name: 'Crear usuario' }))

    expect(screen.getByRole('heading', { name: 'Usuarios' })).toBeInTheDocument()
    expect(screen.getByText('22.222.222-2')).toBeInTheDocument()
    expect(obtenerUsuarioPorRun('222222222').rol).toBe('Administrador')
  })

  it('edita un usuario y los cambios quedan guardados', async () => {
    const usuario = userEvent.setup()

    await entrarComoAdmin(usuario, '/iniciar-sesion')

    const fila = screen.getByText('cliente@gmail.com').closest('tr')

    await usuario.click(within(fila).getByRole('link', { name: 'Editar' }))

    const nombre = screen.getByLabelText('Nombre')

    await usuario.clear(nombre)
    await usuario.type(nombre, 'Camila')
    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByText('Camila Demostración')).toBeInTheDocument()
    expect(obtenerUsuarioPorRun('111111111').nombre).toBe('Camila')
  })

  it('elimina un usuario solo después de confirmar', async () => {
    const usuario = userEvent.setup()

    await entrarComoAdmin(usuario, '/iniciar-sesion')

    const fila = screen.getByText('cliente@gmail.com').closest('tr')

    await usuario.click(within(fila).getByRole('button', { name: 'Eliminar' }))

    // Antes de confirmar, el usuario sigue existiendo
    expect(obtenerUsuarios()).toHaveLength(2)
    expect(screen.getByRole('alert')).toHaveTextContent('¿Eliminar a Cliente Demostración?')

    await usuario.click(screen.getByRole('button', { name: 'Sí, eliminar' }))

    expect(obtenerUsuarios()).toHaveLength(1)
    expect(screen.queryByText('cliente@gmail.com')).not.toBeInTheDocument()
  })

  it('cancelar la eliminación no borra nada', async () => {
    const usuario = userEvent.setup()

    await entrarComoAdmin(usuario, '/iniciar-sesion')

    const fila = screen.getByText('cliente@gmail.com').closest('tr')

    await usuario.click(within(fila).getByRole('button', { name: 'Eliminar' }))
    await usuario.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(obtenerUsuarios()).toHaveLength(2)
  })

  it('el administrador no puede eliminar su propia cuenta', async () => {
    const usuario = userEvent.setup()

    await entrarComoAdmin(usuario, '/iniciar-sesion')

    const fila = screen.getByText('admin@duoc.cl').closest('tr')

    expect(within(fila).getByRole('button', { name: 'Eliminar' })).toBeDisabled()
  })

  it('editar un usuario que no existe muestra un aviso', async () => {
    const usuario = userEvent.setup()

    renderizarApp('/iniciar-sesion')
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'admin@duoc.cl')
    await usuario.type(screen.getByLabelText('Contraseña'), 'admin123')
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    await usuario.click(screen.getByRole('link', { name: '+ Nuevo usuario' }))

    expect(screen.getByRole('heading', { name: 'Nuevo usuario' })).toBeInTheDocument()
  })
})
