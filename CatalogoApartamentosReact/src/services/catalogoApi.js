// Envía solicitudes al backend a través del proxy de Vite.
async function solicitar(ruta, opciones) {
  const respuesta = await fetch('/api/' + ruta, opciones)
  const tipo = respuesta.headers.get('content-type') ?? ''

  // Usa el mensaje de validación de la API si está disponible.
  if (!respuesta.ok) {
    if (respuesta.status < 500 && tipo.includes('json')) {
      const problema = await respuesta.json()
      const mensaje = Object.values(problema.errors ?? {}).flat()[0] ?? problema.detail
      if (mensaje) throw new Error(mensaje)
    }
    throw new Error('La API respondió con un error (' + respuesta.status + ').')
  }

  if (!tipo.includes('json')) {
    throw new Error('La respuesta de la API no tiene el formato esperado.')
  }

  return respuesta.json()
}

// Consulta residenciales y apartamentos en paralelo.
export function consultarCatalogo(signal) {
  return Promise.all([
    solicitar('residenciales', { signal }),
    solicitar('apartamentos', { signal }),
  ])
}

// Envía los datos del formulario como JSON mediante POST.
export function crearApartamento(apartamento) {
  return solicitar('apartamentos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(apartamento),
  })
}
