
/* ==========================================
   HUERTOHOGAR - FUNCIONES DE FORMATO
   ========================================== */

// FORMATO DE PRECIOS EN PESOS CHILENOS (CLP)
// Ejemplos:
// 700   -> $700
// 1200  -> $1.200
// 10400 -> $10.400

const formatoPrecio = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  currencyDisplay: 'symbol',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})

export function formatearPrecio(valor) {
  const numero = Number(valor)

  if (!Number.isFinite(numero)) {
    return '$0'
  }

  // Elimina espacios especiales que puede insertar Intl
  // y asegura que el símbolo vaya antes del valor.
  const precio = formatoPrecio.format(numero)
    .replace(/\s/g, '')

  return precio
}


// FORMATO DE FECHAS
// "2026-10-28T15:30:00.000Z" -> fecha local chilena

export function formatearFecha(fechaIso) {
  const fecha = new Date(fechaIso)

  if (Number.isNaN(fecha.getTime())) {
    return ''
  }

  return fecha.toLocaleDateString('es-CL')
}


// FORMATO DE RUN CHILENO
// "123456785" -> "12.345.678-5"

export function formatearRun(run) {
  const limpio = String(run ?? '').toUpperCase()

  if (limpio.length < 2) {
    return limpio
  }

  const cuerpo = limpio
    .slice(0, -1)
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return `${cuerpo}-${limpio.slice(-1)}`
}
