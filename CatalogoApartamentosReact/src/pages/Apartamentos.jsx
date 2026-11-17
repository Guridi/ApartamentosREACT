import { useMemo, useOptimistic, useReducer } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import EstadoConsulta from '../components/EstadoConsulta.jsx'
import FiltrosApartamentos from '../components/FiltrosApartamentos.jsx'
import Icono from '../components/Icono.jsx'
import RegistroApartamento from '../components/RegistroApartamento.jsx'
import TarjetaApartamento from '../components/TarjetaApartamento.jsx'
import { useCatalogo } from '../context/CatalogoContext.jsx'
import { useNotificar } from '../context/NotificacionesContext.jsx'
import {
  ORDENES, calcularRangoPrecio, crearFiltroInicial, cumpleFiltro, filtroReducer, hayFiltrosActivos,
} from '../services/filtroApartamentos.js'
import { plural } from '../utils/formato.js'

export default function Apartamentos() {
  const [parametros, setParametros] = useSearchParams()
  const { state } = useLocation()
  // El contador, el interruptor y el precio comparten el estado del filtro mediante un reductor.
  // El tercer argumento crea el estado inicial una sola vez con los datos de la búsqueda rápida.
  const [filtro, dispatch] = useReducer(filtroReducer, state, crearFiltroInicial)
  const {
    residenciales, apartamentos, residencialesPorId, carga, actualizando, error, recargar, agregarApartamento,
  } = useCatalogo()
  const notificar = useNotificar()

  // Mientras la API guarda, el apartamento nuevo aparece en la lista. Si falla, React lo retira.
  const [listado, agregarOptimista] = useOptimistic(apartamentos, (lista, nuevo) => [
    ...lista,
    { ...nuevo, id: Number.MAX_SAFE_INTEGER, pendiente: true },
  ])

  // Lee el ID de la URL, incluido en los enlaces de la página Residenciales.
  const residencialId = parametros.get('residencialId') ?? ''
  const residencialSeleccionado = residenciales.some(residencial => String(residencial.id) === residencialId)
  const filtrosActivos = hayFiltrosActivos(residencialId, filtro)

  const rangoPrecio = useMemo(() => calcularRangoPrecio(apartamentos), [apartamentos])

  // Aplica todos los filtros y el orden. Solo se recalcula cuando cambia alguno de ellos.
  const resultados = useMemo(
    () => listado.filter(apartamento => cumpleFiltro(apartamento, residencialId, filtro)).sort(ORDENES[filtro.orden].comparar),
    [listado, residencialId, filtro],
  )

  function cambiarResidencial(id) {
    setParametros(id ? { residencialId: id } : {}, { replace: true })
  }

  function limpiarFiltros() {
    dispatch({ type: 'limpiar' })
    cambiarResidencial('')
  }

  // Se ejecuta cuando la API confirma el registro.
  function alGuardar(apartamento) {
    agregarApartamento(apartamento)
    const mensaje = 'Se registró el apartamento ' + apartamento.numero + '.'
    notificar(cumpleFiltro(apartamento, residencialId, filtro)
      ? mensaje
      : mensaje + ' No aparece en la lista porque no coincide con los filtros activos.')
  }

  return (
    <section className="container page">
      <title>Apartamentos · Catálogo de Apartamentos</title>
      <RegistroApartamento residenciales={residenciales} residencialId={residencialSeleccionado ? residencialId : ''}
        alAgregar={agregarOptimista} alGuardar={alGuardar}>
        <p className="eyebrow">Catálogo</p>
        <h1>Apartamentos</h1>
        <p className="description">Consulta precios y disponibilidad. Usa los filtros para encontrar lo que buscas.</p>
      </RegistroApartamento>

      <FiltrosApartamentos residenciales={residenciales} residencialId={residencialSeleccionado ? residencialId : ''}
        cambiarResidencial={cambiarResidencial} filtro={filtro} dispatch={dispatch} rangoPrecio={rangoPrecio} />

      {residencialId && !residencialSeleccionado && !carga && !error && (
        <div className="notice">
          <Icono nombre="alerta" />
          <p>El residencial seleccionado no está en el catálogo.</p>
          <button className="button secondary" onClick={() => cambiarResidencial('')}>Ver todos</button>
        </div>
      )}

      <div className="results-toolbar">
        <p className="result-count" aria-live="polite">
          {carga ? 'Cargando…' : plural(resultados.length, 'apartamento', 'apartamentos')}
        </p>
        <div className="toolbar-actions">
          {filtrosActivos && (
            <button type="button" className="text-button" onClick={limpiarFiltros}>
              <Icono nombre="cerrar" tamano={14} /> Limpiar filtros
            </button>
          )}
          <label className="sort">
            <span>Ordenar por</span>
            <select value={filtro.orden} onChange={evento => dispatch({ type: 'cambiarOrden', valor: evento.target.value })}>
              {Object.entries(ORDENES).map(([clave, orden]) => <option key={clave} value={clave}>{orden.etiqueta}</option>)}
            </select>
          </label>
          <button type="button" className="icon-button" onClick={recargar} disabled={carga || actualizando}
            aria-label="Actualizar listado" title="Actualizar listado">
            <Icono nombre="refrescar" className={actualizando ? 'spin' : undefined} />
          </button>
        </div>
      </div>

      <EstadoConsulta carga={carga} error={error} reintentar={recargar}
        vacio={!resultados.length && (
          <>
            <p>No hay apartamentos que coincidan con los filtros.</p>
            {filtrosActivos && <button className="button secondary" onClick={limpiarFiltros}>Limpiar filtros</button>}
          </>
        )}>
        <div className="cards">
          {resultados.map(apartamento => (
            <TarjetaApartamento key={apartamento.id} apartamento={apartamento}
              residencial={residencialesPorId.get(apartamento.residencialId)?.nombre} />
          ))}
        </div>
      </EstadoConsulta>
    </section>
  )
}
