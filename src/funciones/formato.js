
const formatoPrecio = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
})

// 1200 -> "$1.200"
export function formatearPrecio(valor) {
  return formatoPrecio.format(Number(valor) || 0)
}

// "2026-10-28T15:30:00.000Z" -> "28-10-2026"
export function formatearFecha(fechaIso) {
  const fecha = new Date(fechaIso)

  if (Number.isNaN(fecha.getTime())) {
    return ''
  }

  return fecha.toLocaleDateString('es-CL')
}

// "123456785" -> "12.345.678-5"
export function formatearRun(run) {
  const limpio = String(run ?? '').toUpperCase()

  if (limpio.length < 2) {
    return limpio
  }

  const cuerpo = limpio.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return `${cuerpo}-${limpio.slice(-1)}`
}
