import { normalizar } from '../utils/formato.js'

// Divide el texto en partes y envuelve cada coincidencia de la búsqueda en <mark>.
export default function Resaltado({ texto, termino }) {
  const buscado = normalizar(termino.trim())
  if (!buscado) return texto

  // normalizar conserva la longitud, así que las posiciones sirven para el texto original.
  const base = normalizar(texto)
  const partes = []
  let desde = 0
  let indice = base.indexOf(buscado)

  while (indice !== -1) {
    if (indice > desde) partes.push(texto.slice(desde, indice))
    partes.push(<mark key={indice}>{texto.slice(indice, indice + buscado.length)}</mark>)
    desde = indice + buscado.length
    indice = base.indexOf(buscado, desde)
  }
  partes.push(texto.slice(desde))

  return <>{partes}</>
}
