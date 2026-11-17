import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icono from '../components/Icono.jsx'

const NotificacionesContext = createContext(null)
const DURACION = 5000

// Cada aviso programa su cierre y limpia el temporizador si se cierra antes.
function Aviso({ aviso, cerrar }) {
  useEffect(() => {
    const temporizador = setTimeout(() => cerrar(aviso.id), DURACION)
    return () => clearTimeout(temporizador)
  }, [aviso.id, cerrar])

  return (
    <div className={'toast toast-' + aviso.tipo}>
      <Icono nombre={aviso.tipo === 'error' ? 'alerta' : 'check'} />
      <p>{aviso.mensaje}</p>
      <button type="button" className="icon-button small" aria-label="Cerrar aviso" onClick={() => cerrar(aviso.id)}>
        <Icono nombre="cerrar" tamano={16} />
      </button>
    </div>
  )
}

export function NotificacionesProvider({ children }) {
  const [avisos, setAvisos] = useState([])
  // El contador no se muestra en pantalla, por eso basta con useRef.
  const siguienteId = useRef(1)

  const cerrar = useCallback(id => {
    setAvisos(lista => lista.filter(aviso => aviso.id !== id))
  }, [])

  const notificar = useCallback((mensaje, tipo = 'exito') => {
    const id = siguienteId.current++
    // Muestra como máximo tres avisos a la vez.
    setAvisos(lista => [...lista.slice(-2), { id, mensaje, tipo }])
  }, [])

  return (
    <NotificacionesContext value={notificar}>
      {children}
      {/* createPortal dibuja los avisos al final de <body>, por encima de cualquier página. */}
      {createPortal(
        <div className="toasts" role="status" aria-live="polite">
          {avisos.map(aviso => <Aviso key={aviso.id} aviso={aviso} cerrar={cerrar} />)}
        </div>,
        document.body,
      )}
    </NotificacionesContext>
  )
}

// Devuelve la función para mostrar un aviso: notificar('Mensaje', 'exito' | 'error').
export function useNotificar() {
  const notificar = useContext(NotificacionesContext)
  if (!notificar) throw new Error('useNotificar debe usarse dentro de NotificacionesProvider.')
  return notificar
}
