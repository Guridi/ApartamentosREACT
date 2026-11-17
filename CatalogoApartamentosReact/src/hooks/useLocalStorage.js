import { useEffect, useState } from 'react'

// Funciona como useState, pero conserva el valor en el navegador entre visitas.
export default function useLocalStorage(clave, valorInicial) {
  // La función inicial solo se ejecuta en el primer render.
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(clave)
      if (guardado !== null) return JSON.parse(guardado)
    } catch {
      // Si el navegador bloquea el almacenamiento, se usa el valor inicial.
    }
    return typeof valorInicial === 'function' ? valorInicial() : valorInicial
  })

  // Guarda cada cambio después de que React actualiza la pantalla.
  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor))
    } catch {
      // El valor sigue disponible en memoria aunque no se pueda guardar.
    }
  }, [clave, valor])

  return [valor, setValor]
}
