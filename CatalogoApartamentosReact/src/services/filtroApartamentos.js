// Valores del filtro cuando no hay ninguna restricción activa.
export const FILTRO_VACIO = {
  minimoHabitaciones: 0,
  soloDisponibles: false,
  precioMaximo: null,
  orden: 'recientes',
}

// Cada opción de orden tiene su texto y su función de comparación.
export const ORDENES = {
  recientes: { etiqueta: 'Más recientes', comparar: (a, b) => b.id - a.id },
  precioAsc: { etiqueta: 'Precio: menor a mayor', comparar: (a, b) => a.precio - b.precio },
  precioDesc: { etiqueta: 'Precio: mayor a menor', comparar: (a, b) => b.precio - a.precio },
  habitaciones: { etiqueta: 'Más habitaciones', comparar: (a, b) => b.habitaciones - a.habitaciones || a.precio - b.precio },
}

const PASO_PRECIO = 100000

// El reductor recibe el filtro actual y una acción, y devuelve el filtro nuevo.
export function filtroReducer(filtro, accion) {
  switch (accion.type) {
    case 'cambiarMinimo':
      return { ...filtro, minimoHabitaciones: Math.min(Math.max(accion.valor, 0), 99) }
    case 'cambiarDisponibilidad':
      return { ...filtro, soloDisponibles: accion.valor }
    case 'cambiarPrecioMaximo':
      return { ...filtro, precioMaximo: accion.valor }
    case 'cambiarOrden':
      return { ...filtro, orden: accion.valor }
    case 'limpiar':
      // El orden no es un filtro, así que se conserva.
      return { ...FILTRO_VACIO, orden: filtro.orden }
    default:
      throw new Error('Acción de filtro desconocida: ' + accion.type)
  }
}

// Crea el filtro inicial con el mínimo elegido en la búsqueda rápida de Inicio.
export function crearFiltroInicial(estadoNavegacion) {
  const minimo = Number(estadoNavegacion?.minimoHabitaciones)
  return {
    ...FILTRO_VACIO,
    minimoHabitaciones: Number.isInteger(minimo) && minimo > 0 ? Math.min(minimo, 99) : 0,
  }
}

// Comprueba a la vez el residencial, la disponibilidad, las habitaciones y el precio.
export function cumpleFiltro(apartamento, residencialId, filtro) {
  return (!residencialId || String(apartamento.residencialId) === residencialId) &&
    (!filtro.soloDisponibles || apartamento.disponible) &&
    apartamento.habitaciones >= filtro.minimoHabitaciones &&
    (filtro.precioMaximo === null || apartamento.precio <= filtro.precioMaximo)
}

export function hayFiltrosActivos(residencialId, filtro) {
  return Boolean(residencialId) || filtro.minimoHabitaciones > 0 ||
    filtro.soloDisponibles || filtro.precioMaximo !== null
}

// Calcula los límites del control de precio a partir de los datos de la API.
export function calcularRangoPrecio(apartamentos) {
  if (!apartamentos.length) return null
  const precios = apartamentos.map(apartamento => apartamento.precio)
  return {
    min: Math.floor(Math.min(...precios) / PASO_PRECIO) * PASO_PRECIO,
    max: Math.ceil(Math.max(...precios) / PASO_PRECIO) * PASO_PRECIO,
    paso: PASO_PRECIO,
  }
}
