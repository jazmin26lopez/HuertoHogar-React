
import { vi } from 'vitest'

import { URL_API } from '../../servicios/apiCliente'

// API falsa en memoria para las pruebas: reemplaza a fetch y responde igual que el backend
// (mismas rutas, mismos códigos 200/201/204/401/403/404/409 y mismo formato JSON),
// así las pruebas no necesitan el backend ni Oracle encendidos.

function codificar(objeto) {
  return btoa(JSON.stringify(objeto)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
}

// Token con la misma forma que un JWT (cabecera.contenido.firma) para que el frontend pueda leer "exp"
export function crearTokenFalso(usuarioId, minutos = 60) {
  const exp = Math.floor(Date.now() / 1000) + minutos * 60

  return `${codificar({ alg: 'HS256' })}.${codificar({ sub: String(usuarioId), exp })}.firma`
}

const usuariosIniciales = [
  {
    usuarioId: 1,
    run: '123456785',
    nombre: 'Administrador',
    apellidos: 'HuertoHogar',
    correo: 'admin@duoc.cl',
    contrasena: 'Admin2026!',
    fechaNacimiento: null,
    region: 'Región Metropolitana',
    comuna: 'Santiago',
    direccion: 'Av. Principal 123',
    rol: 'Administrador',
    activo: 'S'
  },
  {
    usuarioId: 2,
    run: '111111111',
    nombre: 'Cliente',
    apellidos: 'Demostración',
    correo: 'cliente@gmail.com',
    contrasena: 'Cliente2026!',
    fechaNacimiento: null,
    region: 'Región Metropolitana',
    comuna: 'Maipú',
    direccion: 'Calle Los Olivos 456',
    rol: 'Cliente',
    activo: 'S'
  },
  {
    usuarioId: 3,
    run: '999999999',
    nombre: 'Vendedor',
    apellidos: 'HuertoHogar',
    correo: 'vendedor@duoc.cl',
    contrasena: 'Vendedor2026!',
    fechaNacimiento: null,
    region: 'Región Metropolitana',
    comuna: 'Santiago',
    direccion: 'Calle Comercio 10',
    rol: 'Vendedor',
    activo: 'S'
  }
]

function responder(estado, cuerpo) {
  if (cuerpo === undefined) {
    return new Response(null, { status: estado })
  }

  return new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { 'Content-Type': 'application/json' }
  })
}

function publico(usuario) {
  const copia = { ...usuario }
  delete copia.contrasena

  return copia
}

// Instala la API falsa en lugar de fetch y devuelve su estado:
//   estado.usuarios  → la "tabla USUARIO" en memoria
//   estado.llamadas  → lista de { metodo, ruta } recibidas
export function instalarApiFalsa() {
  const estado = {
    usuarios: usuariosIniciales.map((u) => ({ ...u })),
    siguienteId: 4,
    llamadas: []
  }

  function usuarioDelToken(cabeceras) {
    const texto = cabeceras?.Authorization ?? ''

    if (!texto.startsWith('Bearer ')) {
      return null
    }

    try {
      const contenido = texto.slice(7).split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const id = Number(JSON.parse(atob(contenido)).sub)

      return estado.usuarios.find((u) => u.usuarioId === id && u.activo === 'S') ?? null
    } catch {
      return null
    }
  }

  function respuestaAuth(usuario, estadoHttp = 200) {
    return responder(estadoHttp, {
      token: crearTokenFalso(usuario.usuarioId),
      tipo: 'Bearer',
      expiraEnMinutos: 60,
      usuario: publico(usuario)
    })
  }

  function validarDuplicados(datos, idPropio = null) {
    const otros = estado.usuarios.filter((u) => u.usuarioId !== idPropio)

    if (idPropio === null && otros.some((u) => u.run === datos.run)) {
      return responder(409, { status: 409, message: 'RUN ya registrado' })
    }

    if (otros.some((u) => u.correo.toLowerCase() === datos.correo.toLowerCase())) {
      return responder(409, { status: 409, message: 'Correo ya registrado' })
    }

    return null
  }

  async function manejar(url, opciones = {}) {
    const metodo = opciones.method ?? 'GET'
    const ruta = String(url).replace(URL_API, '')
    const cuerpo = opciones.body ? JSON.parse(opciones.body) : undefined
    const actual = usuarioDelToken(opciones.headers)

    estado.llamadas.push({ metodo, ruta })

    // --- autenticación ---
    if (metodo === 'POST' && ruta === '/auth/login') {
      const encontrado = estado.usuarios.find(
        (u) =>
          u.correo.toLowerCase() === cuerpo.correo.toLowerCase() &&
          u.activo === 'S' &&
          u.contrasena === cuerpo.contrasena
      )

      return encontrado
        ? respuestaAuth(encontrado)
        : responder(401, { status: 401, message: 'Credenciales invalidas' })
    }

    if (metodo === 'POST' && ruta === '/auth/registro') {
      const duplicado = validarDuplicados(cuerpo)

      if (duplicado) {
        return duplicado
      }

      // el rol nunca viene del cliente: el registro público siempre crea un Cliente
      const nuevo = { ...cuerpo, usuarioId: estado.siguienteId++, rol: 'Cliente', activo: 'S' }
      estado.usuarios.push(nuevo)

      return respuestaAuth(nuevo, 201)
    }

    if (ruta === '/auth/me' || ruta === '/auth/refresh') {
      return actual
        ? ruta === '/auth/me'
          ? responder(200, publico(actual))
          : respuestaAuth(actual)
        : responder(401, { status: 401 })
    }

    // --- usuarios: solo Administrador ---
    if (ruta.startsWith('/usuarios')) {
      if (!actual) {
        return responder(401, { status: 401 })
      }

      if (actual.rol !== 'Administrador') {
        return responder(403, { status: 403 })
      }

      const id = Number(ruta.split('/')[2])
      const objetivo = estado.usuarios.find((u) => u.usuarioId === id)

      if (metodo === 'GET' && ruta === '/usuarios') {
        return responder(200, estado.usuarios.map(publico))
      }

      if (metodo === 'POST' && ruta === '/usuarios') {
        const duplicado = validarDuplicados(cuerpo)

        if (duplicado) {
          return duplicado
        }

        const nuevo = { ...cuerpo, usuarioId: estado.siguienteId++, activo: 'S' }
        estado.usuarios.push(nuevo)

        return responder(201, publico(nuevo))
      }

      if (!objetivo) {
        return responder(404, { status: 404, message: 'Usuario no encontrado' })
      }

      if (metodo === 'GET') {
        return responder(200, publico(objetivo))
      }

      if (metodo === 'PUT') {
        const duplicado = validarDuplicados(cuerpo, id)

        if (duplicado) {
          return duplicado
        }

        // el RUN no se modifica y una contraseña ausente no se cambia
        Object.assign(objetivo, { ...cuerpo, run: objetivo.run })

        return responder(200, publico(objetivo))
      }

      if (metodo === 'DELETE') {
        objetivo.activo = 'N'

        return responder(204)
      }
    }

    return responder(404, { status: 404 })
  }

  vi.stubGlobal('fetch', vi.fn(manejar))

  return estado
}
