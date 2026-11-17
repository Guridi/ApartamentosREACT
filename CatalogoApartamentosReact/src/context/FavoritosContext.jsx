import { createContext, useCallback, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage.js'
import { useCatalogo } from './CatalogoContext.jsx'

const FavoritosContext = createContext(null)

// Guarda en el navegador los ID de los apartamentos marcados con el corazón.
export function FavoritosProvider({ children }) {
  const [guardados, setGuardados] = useLocalStorage('catalogo:favoritos', [])
  const favoritos = useMemo(() => (Array.isArray(guardados) ? guardados : []), [guardados])

  const alternarFavorito = useCallback(id => {
    setGuardados(lista => {
      const actual = Array.isArray(lista) ? lista : []
      return actual.includes(id) ? actual.filter(favorito => favorito !== id) : [...actual, id]
    })
  }, [setGuardados])

  const valor = useMemo(() => ({
    favoritos,
    esFavorito: id => favoritos.includes(id),
    alternarFavorito,
  }), [favoritos, alternarFavorito])

  return <FavoritosContext value={valor}>{children}</FavoritosContext>
}

export function useFavoritos() {
  const contexto = useContext(FavoritosContext)
  if (!contexto) throw new Error('useFavoritos debe usarse dentro de FavoritosProvider.')
  return contexto
}

// Combina dos contextos: devuelve los apartamentos favoritos que siguen en el catálogo.
export function useApartamentosFavoritos() {
  const { favoritos } = useFavoritos()
  const { apartamentos } = useCatalogo()
  return useMemo(
    () => apartamentos.filter(apartamento => favoritos.includes(apartamento.id)),
    [apartamentos, favoritos],
  )
}
