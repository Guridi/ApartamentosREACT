import { startTransition, useActionState, useEffect, useId, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { crearApartamento } from '../services/catalogoApi.js'
import Icono from './Icono.jsx'

// Convierte los campos de texto a los tipos que espera la API.
function leerApartamento(campos) {
  return {
    numero: campos.get('numero').trim(),
    habitaciones: Number(campos.get('habitaciones')),
    banos: Number(campos.get('banos')),
    precio: Number(campos.get('precio')),
    residencialId: Number(campos.get('residencialId')),
    disponible: campos.has('disponible'),
  }
}

// useFormStatus lee si el formulario que contiene al botón se está enviando.
function BotonGuardar() {
  const { pending } = useFormStatus()
  return (
    <button className="button primary" type="submit" disabled={pending}>
      {pending ? <><span className="spinner" aria-hidden="true" /> Guardando…</> : 'Guardar apartamento'}
    </button>
  )
}

// Lee y envía los campos de un apartamento nuevo.
function FormularioApartamento({ id, residenciales, residencialId, alAgregar, alGuardar, cancelar }) {
  const idTitulo = useId()
  const primerCampo = useRef(null)

  // La acción recibe el estado anterior y los datos del formulario. Lo que devuelve es el estado nuevo.
  async function registrar(anterior, campos) {
    const apartamento = leerApartamento(campos)
    const intento = anterior.intento + 1

    if (!apartamento.numero) {
      return { error: 'Escribe el número del apartamento.', valores: apartamento, intento }
    }

    // Muestra el apartamento en la lista antes de que responda la API.
    alAgregar(apartamento)
    try {
      const creado = await crearApartamento(apartamento)
      // Después de await, startTransition hace que estos cambios terminen junto con la acción.
      startTransition(() => alGuardar(creado))
      return { error: '', valores: null, intento }
    } catch (problema) {
      return { error: problema.message, valores: apartamento, intento }
    }
  }

  // useActionState guarda el resultado de la acción e indica si sigue en curso.
  const [estado, accion, guardando] = useActionState(registrar, { error: '', valores: null, intento: 0 })
  const valores = estado.valores ?? { residencialId, disponible: true }

  // Lleva el foco al primer campo al abrir el formulario y después de cada error.
  useEffect(() => {
    primerCampo.current?.focus()
  }, [estado.intento])

  return (
    <form id={id} className="registration" action={accion} aria-labelledby={idTitulo}
      onKeyDown={evento => evento.key === 'Escape' && cancelar()}>
      <div className="registration-header">
        <h2 id={idTitulo}>Registrar apartamento</h2>
        <p>Todos los campos son obligatorios. Pulsa Esc para cerrar.</p>
      </div>
      <fieldset disabled={guardando}>
        {/* React 19 limpia el formulario al terminar la acción. La clave nueva vuelve a montar
            los campos con los valores enviados, así no se pierden cuando hay un error. */}
        <div className="form-grid" key={estado.intento}>
          <label className="field">Número
            <input ref={primerCampo} name="numero" placeholder="Ej. A-101" maxLength={20} required
              defaultValue={valores.numero} />
          </label>
          <label className="field">Residencial
            <select name="residencialId" defaultValue={valores.residencialId} required>
              <option value="" disabled>Selecciona un residencial</option>
              {residenciales.map(residencial => (
                <option key={residencial.id} value={residencial.id}>{residencial.nombre}</option>
              ))}
            </select>
          </label>
          <label className="field">Precio (RD$)
            <input name="precio" type="number" min="0.01" max="9999999999999999.99" step="0.01" required
              placeholder="Ej. 4500000" defaultValue={valores.precio} />
          </label>
          <label className="field">Habitaciones
            <input name="habitaciones" type="number" min="1" max="99" required defaultValue={valores.habitaciones} />
          </label>
          <label className="field">Baños
            <input name="banos" type="number" min="1" max="99" required defaultValue={valores.banos} />
          </label>
          <label className="switch form-switch">
            <input name="disponible" type="checkbox" role="switch" defaultChecked={valores.disponible} />
            <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
            Disponible
          </label>
        </div>
        {estado.error && (
          <p className="notice notice-error" role="alert"><Icono nombre="alerta" /> {estado.error}</p>
        )}
        <div className="actions">
          <BotonGuardar />
          <button className="button secondary" type="button" onClick={cancelar}>Cancelar</button>
        </div>
      </fieldset>
    </form>
  )
}

// Controla la visibilidad del formulario desde el botón de la página.
export default function RegistroApartamento({ residenciales, residencialId, alAgregar, alGuardar, children }) {
  const [visible, setVisible] = useState(false)
  const idFormulario = useId()
  // Referencia al botón para devolverle el foco al cerrar el formulario.
  const boton = useRef(null)

  function ocultar() {
    setVisible(false)
    boton.current?.focus()
  }

  function completar(apartamento) {
    setVisible(false)
    alGuardar(apartamento)
  }

  return (
    <>
      <div className="page-heading">
        <div>{children}</div>
        <button ref={boton} className={visible ? 'button secondary' : 'button primary'} aria-expanded={visible}
          aria-controls={visible ? idFormulario : undefined} disabled={!residenciales.length}
          onClick={() => setVisible(anterior => !anterior)}>
          {visible ? 'Ocultar formulario' : <><Icono nombre="mas" tamano={18} /> Nuevo apartamento</>}
        </button>
      </div>
      {/* El formulario se monta solo cuando visible es verdadero. */}
      {visible && <FormularioApartamento id={idFormulario} residenciales={residenciales} residencialId={residencialId}
        alAgregar={alAgregar} alGuardar={completar} cancelar={ocultar} />}
    </>
  )
}
