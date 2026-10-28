
import regiones from '../datos/regiones'

// Cada validación devuelve un texto de error, o '' cuando el valor es correcto.
// Son funciones puras (sin React ni DOM), por eso se pueden probar fácilmente.

export const DOMINIOS_PERMITIDOS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com']

// Deja el RUN solo con dígitos y K mayúscula: "12.345.678-5" -> "123456785"
export function normalizarRun(run) {
  return String(run ?? '').replace(/[^0-9kK]/g, '').toUpperCase()
}

// Dígito verificador con módulo 11
export function calcularDigitoVerificador(cuerpo) {
  let suma = 0
  let multiplicador = 2

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resto = 11 - (suma % 11)

  if (resto === 11) return '0'
  if (resto === 10) return 'K'

  return String(resto)
}

export function validarRun(run) {
  const limpio = normalizarRun(run)

  if (limpio === '') {
    return 'Ingresa tu RUN.'
  }

  if (limpio.length < 8 || limpio.length > 9) {
    return 'El RUN debe tener entre 7 y 8 dígitos más el dígito verificador.'
  }

  const cuerpo = limpio.slice(0, -1)
  const digito = limpio.slice(-1)

  if (!/^\d+$/.test(cuerpo) || calcularDigitoVerificador(cuerpo) !== digito) {
    return 'El RUN ingresado no es válido.'
  }

  return ''
}

export function validarTextoObligatorio(valor, etiqueta, maximo = 100) {
  const texto = String(valor ?? '').trim()

  if (texto === '') {
    return `Ingresa ${etiqueta}.`
  }

  if (texto.length > maximo) {
    return `${etiqueta[0].toUpperCase()}${etiqueta.slice(1)} no puede superar los ${maximo} caracteres.`
  }

  return ''
}

export function validarCorreo(correo) {
  const texto = String(correo ?? '').trim()

  if (texto === '') {
    return 'Ingresa tu correo electrónico.'
  }

  if (texto.length > 100) {
    return 'El correo no puede superar los 100 caracteres.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto)) {
    return 'El correo no tiene un formato válido.'
  }

  if (!DOMINIOS_PERMITIDOS.some((dominio) => texto.endsWith(dominio))) {
    return 'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.'
  }

  return ''
}

export function validarContrasena(contrasena) {
  const texto = String(contrasena ?? '')

  if (texto.length < 4 || texto.length > 10) {
    return 'La contraseña debe tener entre 4 y 10 caracteres.'
  }

  return ''
}

export function validarConfirmacion(contrasena, confirmacion) {
  return contrasena === confirmacion ? '' : 'Las contraseñas no coinciden.'
}

export function validarFechaNacimiento(fecha) {
  if (!fecha) {
    return ''
  }

  const nacimiento = new Date(fecha)

  if (Number.isNaN(nacimiento.getTime()) || nacimiento > new Date()) {
    return 'La fecha de nacimiento no es válida.'
  }

  return ''
}

export function validarRegionYComuna(region, comuna) {
  if (!region) {
    return { region: 'Selecciona una región.', comuna: '' }
  }

  if (!regiones[region]) {
    return { region: 'La región seleccionada no existe.', comuna: '' }
  }

  if (!comuna) {
    return { region: '', comuna: 'Selecciona una comuna.' }
  }

  if (!regiones[region].includes(comuna)) {
    return { region: '', comuna: 'La comuna no pertenece a la región.' }
  }

  return { region: '', comuna: '' }
}

// Quita los campos sin error para que el resultado sea fácil de consultar:
// Object.keys(errores).length === 0 significa "formulario válido".
function soloConError(errores) {
  return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje))
}

// opciones.conContrasena: false al editar un usuario (la contraseña no se vuelve a pedir)
export function validarUsuario(datos, opciones = {}) {
  const { conContrasena = true } = opciones
  const { region, comuna } = validarRegionYComuna(datos.region, datos.comuna)

  const errores = {
    run: validarRun(datos.run),
    nombre: validarTextoObligatorio(datos.nombre, 'tu nombre', 50),
    apellidos: validarTextoObligatorio(datos.apellidos, 'tus apellidos', 100),
    correo: validarCorreo(datos.correo),
    fechaNacimiento: validarFechaNacimiento(datos.fechaNacimiento),
    region,
    comuna,
    direccion: validarTextoObligatorio(datos.direccion, 'tu dirección', 300)
  }

  if (conContrasena) {
    errores.contrasena = validarContrasena(datos.contrasena)
    errores.confirmacion = validarConfirmacion(datos.contrasena, datos.confirmacion)
  }

  return soloConError(errores)
}

// Datos del cliente y dirección de entrega del checkout
export function validarCheckout(datos) {
  const { region, comuna } = validarRegionYComuna(datos.region, datos.comuna)

  return soloConError({
    nombre: validarTextoObligatorio(datos.nombre, 'tu nombre', 50),
    apellidos: validarTextoObligatorio(datos.apellidos, 'tus apellidos', 100),
    correo: validarCorreo(datos.correo),
    calle: validarTextoObligatorio(datos.calle, 'la calle', 300),
    region,
    comuna
  })
}

export function validarInicioSesion(correo, contrasena) {
  return soloConError({
    correo: validarCorreo(correo),
    contrasena: validarContrasena(contrasena)
  })
}

// Formulario de contacto: cualquier visitante puede escribir, por eso el correo
// solo se revisa por formato (no por dominio como en el registro).
export function validarContacto(datos) {
  const correo = String(datos.correo ?? '').trim()

  let errorCorreo = ''

  if (correo === '') {
    errorCorreo = 'Ingresa tu correo electrónico.'
  } else if (correo.length > 100) {
    errorCorreo = 'El correo no puede superar los 100 caracteres.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    errorCorreo = 'El correo no tiene un formato válido.'
  }

  return soloConError({
    nombre: validarTextoObligatorio(datos.nombre, 'tu nombre', 100),
    correo: errorCorreo,
    asunto: validarTextoObligatorio(datos.asunto, 'el asunto', 100),
    mensaje: validarTextoObligatorio(datos.mensaje, 'tu mensaje', 500)
  })
}
