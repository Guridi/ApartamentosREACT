import Icono from './Icono.jsx'

// Tarjetas grises que imitan la forma del contenido mientras llega la respuesta.
export function EsqueletoTarjetas({ cantidad = 3 }) {
  return (
    <div className="cards">
      {Array.from({ length: cantidad }, (_, indice) => (
        <div key={indice} className="card skeleton">
          <div className="card-media skeleton-block" />
          <div className="card-body">
            <span className="skeleton-line short" />
            <span className="skeleton-line title" />
            <span className="skeleton-line" />
            <span className="skeleton-line medium" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Durante la consulta muestra el esqueleto. Al terminar muestra el resultado, el error o el aviso de vacío.
// esqueleto y vacio aceptan JSX, así cada página decide cómo se ven esos estados.
export default function EstadoConsulta({ carga, error, reintentar, vacio, esqueleto = <EsqueletoTarjetas />, children }) {
  if (carga) {
    return (
      <div aria-busy="true">
        <p className="sr-only" role="status">Cargando catálogo…</p>
        {esqueleto}
      </div>
    )
  }

  if (error) {
    return (
      <div className="notice notice-error" role="alert">
        <Icono nombre="alerta" />
        <div>
          <p>{error}</p>
          <button className="button secondary" onClick={reintentar}>
            <Icono nombre="refrescar" tamano={16} /> Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (vacio) {
    return (
      <div className="empty-state" role="status">
        <span className="empty-icon"><Icono nombre="buscar" tamano={28} /></span>
        {typeof vacio === 'string' ? <p>{vacio}</p> : vacio}
      </div>
    )
  }

  return children
}
