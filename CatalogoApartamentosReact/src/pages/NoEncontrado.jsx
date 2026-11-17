import { Link } from 'react-router-dom'

// Página 404. También la usa el detalle cuando el ID no existe, con otro título y mensaje.
export default function NoEncontrado({
  titulo = 'Página no encontrada',
  mensaje = 'La dirección que buscas no existe o cambió de lugar.',
}) {
  return (
    <section className="container page not-found">
      <title>{titulo + ' · Catálogo de Apartamentos'}</title>
      <p className="not-found-code" aria-hidden="true">404</p>
      <h1>{titulo}</h1>
      <p className="description">{mensaje}</p>
      <div className="actions">
        <Link className="button primary" to="/">Volver al inicio</Link>
        <Link className="button secondary" to="/apartamentos">Ver apartamentos</Link>
      </div>
    </section>
  )
}
