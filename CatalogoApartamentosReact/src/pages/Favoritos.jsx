import { Link } from 'react-router-dom'
import EstadoConsulta from '../components/EstadoConsulta.jsx'
import TarjetaApartamento from '../components/TarjetaApartamento.jsx'
import { useCatalogo } from '../context/CatalogoContext.jsx'
import { useApartamentosFavoritos } from '../context/FavoritosContext.jsx'
import { plural } from '../utils/formato.js'

// Lista los apartamentos guardados con el corazón. Se conservan en este navegador.
export default function Favoritos() {
  const favoritos = useApartamentosFavoritos()
  const { residencialesPorId, carga, error, recargar } = useCatalogo()

  return (
    <section className="container page">
      <title>Favoritos · Catálogo de Apartamentos</title>
      <p className="eyebrow">Tu selección</p>
      <h1>Favoritos</h1>
      <p className="description">Los apartamentos que marcas con el corazón se guardan en este navegador.</p>

      <EstadoConsulta carga={carga} error={error} reintentar={recargar}
        vacio={!favoritos.length && (
          <>
            <p>Todavía no tienes favoritos. Pulsa el corazón de un apartamento para guardarlo aquí.</p>
            <Link className="button primary" to="/apartamentos">Explorar apartamentos</Link>
          </>
        )}>
        <p className="result-count" aria-live="polite">{plural(favoritos.length, 'apartamento guardado', 'apartamentos guardados')}</p>
        <div className="cards">
          {favoritos.map(apartamento => (
            <TarjetaApartamento key={apartamento.id} apartamento={apartamento}
              residencial={residencialesPorId.get(apartamento.residencialId)?.nombre} />
          ))}
        </div>
      </EstadoConsulta>
    </section>
  )
}
