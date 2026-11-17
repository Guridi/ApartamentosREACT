import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage.js'

const TemaContext = createContext(null)

// La primera vez se respeta la preferencia del sistema operativo.
function temaDelSistema() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

export function TemaProvider({ children }) {
  const [tema, setTema] = useLocalStorage('catalogo:tema', temaDelSistema)

  // Sincroniza React con el DOM: el CSS cambia los colores según data-theme.
  useEffect(() => {
    document.documentElement.dataset.theme = tema
  }, [tema])

  const alternarTema = useCallback(() => {
    setTema(actual => (actual === 'oscuro' ? 'claro' : 'oscuro'))
  }, [setTema])

  const valor = useMemo(() => ({ tema, alternarTema }), [tema, alternarTema])

  return <TemaContext value={valor}>{children}</TemaContext>
}

export function useTema() {
  const contexto = useContext(TemaContext)
  if (!contexto) throw new Error('useTema debe usarse dentro de TemaProvider.')
  return contexto
}
