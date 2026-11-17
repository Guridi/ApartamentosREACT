import { useDeferredValue, useId, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import EstadoConsulta from '../components/EstadoConsulta.jsx'
import Icono from '../components/Icono.jsx'
import Resaltado from '../components/Resaltado.jsx'
import Tarjeta from '../components/Tarjeta.jsx'
import { useCatalogo } from '../context/CatalogoContext.jsx'
import { monedaCorta, normalizar, plural } from '../utils/formato.js'

// Muestra los residenciales devueltos por la API y permite buscarlos.
export default function Residenciales() {
  const [busqueda, setBusqueda] = useState('')
  // useDeferredValue atiende primero la escritura y actualiza la lista justo después.
  const busquedaDiferida = useDeferredValue(busqueda)
  const desactualizado = busqueda !== busquedaDiferida
  const campo = useRef(null)
  const idBusqueda = useId()
  const { residenciales, apartamentos, carga, error, recargar } = useCatalogo()

  // Agrupa los apartamentos por residencial: total, disponibles y precio más bajo disponible.
  const estadisticas = useMemo(() => {
    const porResidencial = new Map()
    for (const apartamento of apartamentos) {
      const datos = porResidencial.get(apartamento.residencialId) ?? { total: 0, disponibles: 0, desde: Infinity }
      datos.total++
      if (apartamento.disponible) {
        datos.disponibles++
        datos.desde = Math.min(datos.desde, apartamento.precio)
      }
      porResidencial.set(apartamento.residencialId, datos)
    }
    return porResidencial
  }, [apartamentos])

  // Compara el nombre y la ubicación sin distinguir mayúsculas ni tildes.
  const resultados = useMemo(() => {
    const termino = normalizar(busquedaDiferida.trim())
    return residenciales.filter(({ nombre, ubicacion }) =>
      [nombre, ubicacion].some(valor => normalizar(valor).includes(termino)),
    )
  }, [residenciales, busquedaDiferida])

  function limpiarBusqueda() {
    setBusqueda('')
    campo.current.focus()
  }

  return (
    <section className="container page">
      <title>Residenciales · Catálogo de Apartamentos</title>
      <p className="eyebrow">Catálogo</p>
      <h1>Residenciales</h1>
      <p className="description">Conoce cada residencial y consulta sus apartamentos registrados.</p>

      <div className="search">
        <label htmlFor={idBusqueda}>Buscar por nombre o ubicación</label>
        <div className="search-input">
          <Icono nombre="buscar" />
          <input id={idBusqueda} ref={campo} type="search" value={busqueda} placeholder="Ej. Santiago"
            onChange={evento => setBusqueda(evento.target.value)} />
          {busqueda && (
            <button type="button" className="icon-button small" aria-label="Borrar búsqueda" onClick={limpiarBusqueda}>
              <Icono nombre="cerrar" tamano={16} />
            </button>
          )}
        </div>
      </div>

      <EstadoConsulta carga={carga} error={error} reintentar={recargar} esqueleto={<EsqueletoResidenciales />}
        vacio={!resultados.length && (
          <>
            <p>No hay residenciales que coincidan con «{busqueda}».</p>
            <button className="button secondary" onClick={limpiarBusqueda}>Borrar búsqueda</button>
          </>
        )}>
        <p className="result-count" aria-live="polite">{plural(resultados.length, 'residencial', 'residenciales')}</p>
        <div className={desactualizado ? 'cards cards-wide is-stale' : 'cards cards-wide'}>
          {resultados.map(residencial => {
            const datos = estadisticas.get(residencial.id) ?? { total: 0, disponibles: 0, desde: Infinity }
            return (
              // Tarjeta recibe el nombre y la ubicación como props. El párrafo, las cifras y el enlace son children.
              <Tarjeta key={residencial.id} className={'card-residential sky-' + (residencial.id % 4)}
                titulo={<Resaltado texto={residencial.nombre} termino={busquedaDiferida} />}
                subtitulo={<><Icono nombre="ubicacion" tamano={16} /> <Resaltado texto={residencial.ubicacion} termino={busquedaDiferida} /></>}
                media={<img src="/imagenes/hero.svg" alt="" width="480" height="320" loading="lazy" />}>
                <p className="card-text">{residencial.descripcion}</p>
                <dl className="mini-stats">
                  <div><dt>Apartamentos</dt><dd>{datos.total}</dd></div>
                  <div><dt>Disponibles</dt><dd>{datos.disponibles}</dd></div>
                  <div><dt>Desde</dt><dd>{datos.desde === Infinity ? '—' : monedaCorta.format(datos.desde)}</dd></div>
                </dl>
                <Link className="text-link" to={'/apartamentos?residencialId=' + residencial.id}>
                  {datos.total === 1 ? 'Ver 1 apartamento' : 'Ver apartamentos (' + datos.total + ')'}
                  <Icono nombre="flecha" tamano={16} />
                </Link>
              </Tarjeta>
            )
          })}
        </div>
      </EstadoConsulta>
    </section>
  )
}

function EsqueletoResidenciales() {
  return (
    <div className="cards cards-wide">
      {[1, 2].map(indice => (
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
