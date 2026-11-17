import { useMemo } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import BotonFavorito from '../components/BotonFavorito.jsx'
import EstadoConsulta from '../components/EstadoConsulta.jsx'
import Fachada from '../components/Fachada.jsx'
import Icono from '../components/Icono.jsx'
import TarjetaApartamento from '../components/TarjetaApartamento.jsx'
import { useCatalogo } from '../context/CatalogoContext.jsx'
import { moneda, plural } from '../utils/formato.js'
import NoEncontrado from './NoEncontrado.jsx'

function EsqueletoDetalle() {
  return (
    <div className="detail-grid">
      <div className="skeleton-block detail-media" />
      <div className="price-card"><span className="skeleton-line title" /><span className="skeleton-line" /></div>
    </div>
  )
}

// Ficha de un apartamento. El ID llega en la URL: /apartamentos/5.
export default function DetalleApartamento() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { apartamentos, residencialesPorId, carga, error, recargar } = useCatalogo()

  const apartamento = apartamentos.find(item => String(item.id) === id)
  const residencial = apartamento ? residencialesPorId.get(apartamento.residencialId) : undefined

  // Hasta tres apartamentos más del mismo residencial.
  const otros = useMemo(() => {
    if (!apartamento) return []
    return apartamentos
      .filter(item => item.residencialId === apartamento.residencialId && item.id !== apartamento.id)
      .slice(0, 3)
  }, [apartamentos, apartamento])

  // Si se llegó desde otra página del sitio vuelve atrás. Si el enlace se abrió directamente, va al listado.
  function volver() {
    if (location.key === 'default') navigate('/apartamentos')
    else navigate(-1)
  }

  if (carga || error) {
    return (
      <section className="container page">
        <EstadoConsulta carga={carga} error={error} reintentar={recargar} esqueleto={<EsqueletoDetalle />} />
      </section>
    )
  }

  if (!apartamento) {
    return <NoEncontrado titulo="Este apartamento no existe" mensaje="Puede que se haya eliminado o que el enlace esté incompleto." />
  }

  const { numero, habitaciones, banos, precio, disponible } = apartamento

  return (
    <article className="container page detail">
      <title>{numero + ' · Catálogo de Apartamentos'}</title>
      <div className="detail-topbar">
        <button type="button" className="text-button" onClick={volver}>
          <Icono nombre="flechaIzquierda" tamano={16} /> Volver
        </button>
        <nav aria-label="Ruta de navegación" className="breadcrumb">
          <ol>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/apartamentos">Apartamentos</Link></li>
            <li aria-current="page">{numero}</li>
          </ol>
        </nav>
      </div>

      <header className="detail-header">
        <p className="eyebrow">{residencial?.nombre ?? 'Residencial'}</p>
        <h1>Apartamento {numero}</h1>
        {residencial && <p className="detail-location"><Icono nombre="ubicacion" tamano={18} /> {residencial.ubicacion}</p>}
      </header>

      <div className="detail-grid">
        <div className="detail-main">
          <div className="detail-media"><Fachada habitaciones={habitaciones} residencialId={apartamento.residencialId} /></div>

          <section aria-labelledby="caracteristicas">
            <h2 id="caracteristicas">Características</h2>
            <dl className="detail-features">
              <div><dt><Icono nombre="cama" /> Habitaciones</dt><dd>{habitaciones}</dd></div>
              <div><dt><Icono nombre="bano" /> Baños</dt><dd>{banos}</dd></div>
              <div><dt><Icono nombre="moneda" /> Por habitación</dt><dd>{moneda.format(precio / habitaciones)}</dd></div>
              <div><dt><Icono nombre="check" /> Estado</dt><dd>{disponible ? 'Disponible' : 'No disponible'}</dd></div>
            </dl>
          </section>

          {residencial && (
            <section aria-labelledby="sobre-residencial" className="detail-about">
              <h2 id="sobre-residencial">Sobre {residencial.nombre}</h2>
              <p>{residencial.descripcion}</p>
              <Link className="text-link" to={'/apartamentos?residencialId=' + residencial.id}>
                Ver todos sus apartamentos <Icono nombre="flecha" tamano={16} />
              </Link>
            </section>
          )}
        </div>

        <aside className="detail-aside" aria-label="Precio y acciones">
          <div className="price-card">
            <span className={disponible ? 'status available' : 'status'}>{disponible ? 'Disponible' : 'No disponible'}</span>
            <p className="price-label">Precio de venta</p>
            <p className="price large">{moneda.format(precio)}</p>
            <p className="price-note">{plural(habitaciones, 'habitación', 'habitaciones')} · {plural(banos, 'baño', 'baños')}</p>
            <BotonFavorito apartamento={apartamento} conTexto />
          </div>
        </aside>
      </div>

      {otros.length > 0 && (
        <section className="section" aria-labelledby="otros-titulo">
          <div className="section-heading">
            <h2 id="otros-titulo">Otros apartamentos en {residencial?.nombre ?? 'este residencial'}</h2>
          </div>
          <div className="cards">
            {otros.map(item => (
              <TarjetaApartamento key={item.id} nivel={3} apartamento={item} residencial={residencial?.nombre} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
