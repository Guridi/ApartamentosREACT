import { useId } from 'react'
import { moneda, monedaCorta } from '../utils/formato.js'
import Icono from './Icono.jsx'

// Los botones cambian el mínimo. Cero permite cualquier número de habitaciones.
function ContadorHabitaciones({ minimo, cambiarMinimo }) {
  return (
    <fieldset className="counter">
      <legend>Mínimo de habitaciones</legend>
      <div className="counter-controls">
        <button type="button" aria-label="Reducir habitaciones" disabled={minimo === 0}
          onClick={() => cambiarMinimo(minimo - 1)}>
          <Icono nombre="menos" tamano={18} />
        </button>
        <output aria-live="polite">{minimo === 0 ? 'Cualquiera' : minimo + '+'}</output>
        <button type="button" aria-label="Aumentar habitaciones" disabled={minimo >= 99}
          onClick={() => cambiarMinimo(minimo + 1)}>
          <Icono nombre="mas" tamano={18} />
        </button>
      </div>
    </fieldset>
  )
}

// La casilla, con forma de interruptor, convierte la selección en un valor booleano.
function FiltroDisponibilidad({ soloDisponibles, cambiarDisponibilidad }) {
  return (
    <label className="switch">
      <input type="checkbox" role="switch" checked={soloDisponibles}
        onChange={evento => cambiarDisponibilidad(evento.target.checked)} />
      <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
      Solo disponibles
    </label>
  )
}

// Control deslizante. El extremo derecho significa «sin límite» (null).
function FiltroPrecio({ maximo, rango, cambiarMaximo }) {
  const id = useId()
  if (!rango) return null

  const valor = maximo ?? rango.max
  const texto = maximo === null ? 'Sin límite' : 'Hasta ' + monedaCorta.format(valor)

  return (
    <div className="field range-field">
      <div className="range-label">
        <label htmlFor={id}>Precio máximo</label>
        <output htmlFor={id}>{texto}</output>
      </div>
      <input id={id} type="range" min={rango.min} max={rango.max} step={rango.paso} value={valor}
        aria-valuetext={maximo === null ? 'Sin límite' : moneda.format(valor)}
        onChange={evento => {
          const elegido = Number(evento.target.value)
          cambiarMaximo(elegido >= rango.max ? null : elegido)
        }} />
    </div>
  )
}

// Recibe el filtro de la página y le comunica cada cambio con dispatch.
export default function FiltrosApartamentos({ residenciales, residencialId, cambiarResidencial, filtro, dispatch, rangoPrecio }) {
  const idResidencial = useId()

  return (
    <div className="filter-bar">
      <div className="field">
        <label htmlFor={idResidencial}>Residencial</label>
        <select id={idResidencial} value={residencialId} onChange={evento => cambiarResidencial(evento.target.value)}>
          <option value="">Todos los residenciales</option>
          {residenciales.map(residencial => (
            <option key={residencial.id} value={residencial.id}>{residencial.nombre}</option>
          ))}
        </select>
      </div>
      {/* Cada control envía una acción distinta al reductor del filtro. */}
      <ContadorHabitaciones minimo={filtro.minimoHabitaciones}
        cambiarMinimo={cantidad => dispatch({ type: 'cambiarMinimo', valor: cantidad })} />
      <FiltroPrecio maximo={filtro.precioMaximo} rango={rangoPrecio}
        cambiarMaximo={precio => dispatch({ type: 'cambiarPrecioMaximo', valor: precio })} />
      <FiltroDisponibilidad soloDisponibles={filtro.soloDisponibles}
        cambiarDisponibilidad={disponible => dispatch({ type: 'cambiarDisponibilidad', valor: disponible })} />
    </div>
  )
}
