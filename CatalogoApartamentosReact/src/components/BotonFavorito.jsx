import { useFavoritos } from '../context/FavoritosContext.jsx'
import Icono from './Icono.jsx'

// Botón de alternancia: aria-pressed indica si el apartamento ya está en favoritos.
export default function BotonFavorito({ apartamento, conTexto = false }) {
  const { esFavorito, alternarFavorito } = useFavoritos()
  const activo = esFavorito(apartamento.id)

  if (conTexto) {
    return (
      <button type="button" className={activo ? 'button favorite-button is-active' : 'button favorite-button'}
        onClick={() => alternarFavorito(apartamento.id)}>
        <Icono nombre="corazon" />
        {activo ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      </button>
    )
  }

  return (
    <button type="button" className="favorite-toggle" aria-pressed={activo}
      aria-label={'Guardar ' + apartamento.numero + ' en favoritos'}
      title={activo ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      onClick={() => alternarFavorito(apartamento.id)}>
      <Icono nombre="corazon" />
    </button>
  )
}
