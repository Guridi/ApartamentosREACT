import { useEffect, useRef, useState } from 'react'

function prefiereMenosMovimiento() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Cuenta desde el valor anterior hasta el nuevo durante unos milisegundos.
export default function useNumeroAnimado(destino, duracion = 800) {
  const [valor, setValor] = useState(0)
  // useRef guarda el número mostrado sin provocar otro render.
  const actual = useRef(0)

  useEffect(() => {
    if (prefiereMenosMovimiento()) return

    const origen = actual.current
    const inicio = performance.now()
    let cuadro

    function avanzar(ahora) {
      const progreso = Math.min((ahora - inicio) / duracion, 1)
      // La curva hace que el conteo frene al final.
      const suavizado = 1 - Math.pow(1 - progreso, 3)
      actual.current = Math.round(origen + (destino - origen) * suavizado)
      setValor(actual.current)
      if (progreso < 1) cuadro = requestAnimationFrame(avanzar)
    }

    cuadro = requestAnimationFrame(avanzar)
    // Si el destino cambia a mitad de la animación, se cancela la anterior.
    return () => cancelAnimationFrame(cuadro)
  }, [destino, duracion])

  return prefiereMenosMovimiento() ? destino : valor
}
