import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { consultarCatalogo } from '../services/catalogoApi.js'

// El contexto permite que cualquier página lea el catálogo sin pasarlo por props.
const CatalogoContext = createContext(null)

const estadoInicial = { residenciales: [], apartamentos: [], carga: true, error: '', actualizado: null }

// El reductor concentra en un solo lugar todos los cambios del catálogo.
function catalogoReducer(estado, accion) {
  switch (accion.type) {
    case 'consultar':
      return { ...estado, carga: true, error: '' }
    case 'recibir':
      return {
        residenciales: accion.residenciales,
        apartamentos: accion.apartamentos,
        carga: false,
        error: '',
        actualizado: accion.fecha,
      }
    case 'fallar':
      return { ...estado, carga: false, error: accion.error }
    case 'agregarApartamento':
      return { ...estado, apartamentos: [...estado.apartamentos, accion.apartamento] }
    default:
      throw new Error('Acción del catálogo desconocida: ' + accion.type)
  }
}

// Consulta la API una sola vez y comparte el resultado con todas las páginas.
export function CatalogoProvider({ children }) {
  const [estado, dispatch] = useReducer(catalogoReducer, estadoInicial)
  const [intento, setIntento] = useState(0)

  // Se ejecuta al abrir el sitio y cada vez que se solicita una recarga.
  useEffect(() => {
    const controlador = new AbortController()
    dispatch({ type: 'consultar' })

    consultarCatalogo(controlador.signal)
      .then(([residenciales, apartamentos]) => {
        if (controlador.signal.aborted) return
        dispatch({ type: 'recibir', residenciales, apartamentos, fecha: new Date() })
      })
      .catch(() => {
        if (controlador.signal.aborted) return
        dispatch({
          type: 'fallar',
          error: 'No se pudo consultar el catálogo. Comprueba que la API de ASP.NET Core esté en ejecución e inténtalo de nuevo.',
        })
      })

    // Cancela la petición si se repite la consulta antes de que termine.
    return () => controlador.abort()
  }, [intento])

  // useCallback mantiene la misma función entre renders.
  const recargar = useCallback(() => setIntento(anterior => anterior + 1), [])
  const agregarApartamento = useCallback(apartamento => dispatch({ type: 'agregarApartamento', apartamento }), [])

  // useMemo evita que los componentes que leen el contexto se rendericen sin necesidad.
  const valor = useMemo(() => ({
    residenciales: estado.residenciales,
    apartamentos: estado.apartamentos,
    error: estado.error,
    actualizado: estado.actualizado,
    // Primera carga: todavía no hay datos que mostrar.
    carga: estado.carga && !estado.actualizado,
    // Recarga posterior: los datos anteriores siguen en pantalla.
    actualizando: estado.carga && Boolean(estado.actualizado),
    residencialesPorId: new Map(estado.residenciales.map(residencial => [residencial.id, residencial])),
    recargar,
    agregarApartamento,
  }), [estado, recargar, agregarApartamento])

  // En React 19 el propio contexto funciona como proveedor.
  return <CatalogoContext value={valor}>{children}</CatalogoContext>
}

// Hook personalizado para leer el catálogo desde cualquier componente.
export function useCatalogo() {
  const contexto = useContext(CatalogoContext)
  if (!contexto) throw new Error('useCatalogo debe usarse dentro de CatalogoProvider.')
  return contexto
}
