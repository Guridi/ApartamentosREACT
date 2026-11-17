// Formatea los precios como pesos dominicanos: RD$4,500,000.
export const moneda = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 0 })

// Versión abreviada para resúmenes: RD$4.5 M.
export const monedaCorta = new Intl.NumberFormat('es-DO', {
  style: 'currency', currency: 'DOP', notation: 'compact', maximumFractionDigits: 1,
})

// Hora de la última consulta a la API: 3:05 p. m.
export const hora = new Intl.DateTimeFormat('es-DO', { hour: 'numeric', minute: '2-digit' })

// Escribe la cantidad con la palabra en singular o plural.
export function plural(cantidad, singular, varios) {
  return cantidad + ' ' + (cantidad === 1 ? singular : varios)
}

// Quita tildes y mayúsculas sin cambiar la longitud del texto.
// Así «santiago» encuentra «Santiago» y «cibao» encuentra «Cibao».
export function normalizar(texto) {
  return Array.from(texto, letra => {
    const simple = letra.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('es')
    return simple.length === letra.length ? simple : letra.toLocaleLowerCase('es')
  }).join('')
}
