import { Link } from 'react-router-dom'
import { moneda, plural } from '../utils/formato.js'
import BotonFavorito from './BotonFavorito.jsx'
import Fachada from './Fachada.jsx'
import Icono from './Icono.jsx'
import Tarjeta from './Tarjeta.jsx'

// Presenta la disponibilidad, las habitaciones, los baños y el precio.
// pendiente es verdadero mientras la API guarda un apartamento recién registrado.
export default function TarjetaApartamento({ apartamento, residencial, nivel }) {
  const { id, numero, habitaciones, banos, precio, disponible, residencialId, pendiente } = apartamento

  let estado = disponible ? 'Disponible' : 'No disponible'
  if (pendiente) estado = 'Guardando…'

  return (
    <Tarjeta nivel={nivel} titulo={numero} subtitulo={residencial}
      className={pendiente ? 'card-apartment is-pending' : 'card-apartment'}
      media={
        <>
          <Fachada habitaciones={habitaciones} residencialId={residencialId} />
          <span className={disponible && !pendiente ? 'status available' : 'status'}>{estado}</span>
          {!pendiente && <BotonFavorito apartamento={apartamento} />}
        </>
      }>
      <ul className="features">
        <li><Icono nombre="cama" tamano={18} /> {plural(habitaciones, 'habitación', 'habitaciones')}</li>
        <li><Icono nombre="bano" tamano={18} /> {plural(banos, 'baño', 'baños')}</li>
      </ul>
      <div className="card-footer">
        <p className="price">{moneda.format(precio)}</p>
        {!pendiente && (
          <Link className="card-link" to={'/apartamentos/' + id}>
            Ver detalle<span className="sr-only"> de {numero}</span> <Icono nombre="flecha" tamano={16} />
          </Link>
        )}
      </div>
    </Tarjeta>
  )
}
