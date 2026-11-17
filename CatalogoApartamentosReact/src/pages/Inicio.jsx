import { useId, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EstadoConsulta from '../components/EstadoConsulta.jsx'
import Icono from '../components/Icono.jsx'
import ResumenCatalogo from '../components/ResumenCatalogo.jsx'
import TarjetaApartamento from '../components/TarjetaApartamento.jsx'
import { useCatalogo } from '../context/CatalogoContext.jsx'

// Formulario de la portada. La acción recibe los datos y navega al listado con los filtros elegidos.
function BusquedaRapida({ residenciales }) {
  const navigate = useNavigate()
  const idResidencial = useId()
  const idHabitaciones = useId()

  // En React 19, action acepta una función que recibe un FormData.
  function buscar(campos) {
    const residencialId = campos.get('residencialId')
    navigate(
      { pathname: '/apartamentos', search: residencialId ? '?residencialId=' + residencialId : '' },
      // state viaja con la navegación sin aparecer en la URL.
      { state: { minimoHabitaciones: Number(campos.get('habitaciones')) } },
    )
  }

  return (
    <form className="quick-search" action={buscar} role="search" aria-label="Búsqueda rápida de apartamentos">
      <div className="field">
        <label htmlFor={idResidencial}>Residencial</label>
        <select id={idResidencial} name="residencialId" defaultValue="">
          <option value="">Todos</option>
          {residenciales.map(residencial => (
            <option key={residencial.id} value={residencial.id}>{residencial.nombre}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={idHabitaciones}>Habitaciones</label>
        <select id={idHabitaciones} name="habitaciones" defaultValue="0">
          <option value="0">Cualquiera</option>
          {[1, 2, 3, 4].map(cantidad => <option key={cantidad} value={cantidad}>{cantidad}+</option>)}
        </select>
      </div>
      <button className="button primary" type="submit">
        <Icono nombre="buscar" tamano={18} /> Buscar
      </button>
    </form>
  )
}

// Presenta el catálogo, enlaza las otras páginas y muestra el resumen de la API.
export default function Inicio() {
  const { residenciales, apartamentos, residencialesPorId, carga, error, recargar } = useCatalogo()

  // Los tres apartamentos disponibles registrados más recientemente.
  const destacados = useMemo(
    () => apartamentos.filter(apartamento => apartamento.disponible).sort((a, b) => b.id - a.id).slice(0, 3),
    [apartamentos],
  )

  return (
    <div className="home">
      {/* React 19 mueve <title> al <head> del documento. */}
      <title>Catálogo de Apartamentos</title>
      <section className="container">
        <div className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Catálogo inmobiliario · República Dominicana</p>
            <h1>Encuentra tu próximo apartamento.</h1>
            <p className="hero-lead">Explora los residenciales y compara precios, habitaciones y disponibilidad en un solo lugar.</p>
            <BusquedaRapida residenciales={residenciales} />
            <Link className="hero-link" to="/residenciales">
              O conoce primero los residenciales <Icono nombre="flecha" tamano={16} />
            </Link>
          </div>
          <div className="hero-image">
            <img src="/imagenes/hero.svg" alt="Ilustración de tres edificios residenciales" width="480" height="320" />
          </div>
        </div>
      </section>

      <ResumenCatalogo />

      <section className="container section" aria-labelledby="destacados-titulo">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Disponibles ahora</p>
            <h2 id="destacados-titulo">Apartamentos destacados</h2>
          </div>
          <Link className="text-link" to="/apartamentos">Ver todos <Icono nombre="flecha" tamano={16} /></Link>
        </div>
        <EstadoConsulta carga={carga} error={error} reintentar={recargar}
          vacio={!destacados.length && 'Por ahora no hay apartamentos disponibles.'}>
          <div className="cards">
            {destacados.map(apartamento => (
              <TarjetaApartamento key={apartamento.id} nivel={3} apartamento={apartamento}
                residencial={residencialesPorId.get(apartamento.residencialId)?.nombre} />
            ))}
          </div>
        </EstadoConsulta>
      </section>
    </div>
  )
}
