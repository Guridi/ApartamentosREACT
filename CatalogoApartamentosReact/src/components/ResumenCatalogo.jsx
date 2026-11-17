import { useMemo } from 'react'
import { useCatalogo } from '../context/CatalogoContext.jsx'
import useNumeroAnimado from '../hooks/useNumeroAnimado.js'
import { monedaCorta } from '../utils/formato.js'
import EstadoConsulta from './EstadoConsulta.jsx'
import Icono from './Icono.jsx'

// Muestra una cifra que cuenta hasta su valor al aparecer o cambiar.
function Cifra({ etiqueta, icono, valor, formato = numero => numero }) {
  const animado = useNumeroAnimado(valor)
  return (
    <div className="stat">
      <dt><Icono nombre={icono} tamano={18} /> {etiqueta}</dt>
      <dd>{formato(animado)}</dd>
    </div>
  )
}

function EsqueletoCifras() {
  return (
    <div className="stats">
      {Array.from({ length: 4 }, (_, indice) => (
        <div key={indice} className="stat"><span className="skeleton-line title" /><span className="skeleton-line short" /></div>
      ))}
    </div>
  )
}

// Resume con cifras los datos consultados desde ASP.NET Core.
export default function ResumenCatalogo() {
  const { residenciales, apartamentos, carga, error, recargar } = useCatalogo()

  // useMemo repite el cálculo solo cuando cambia la lista de apartamentos.
  const { disponibles, precioMinimo } = useMemo(() => {
    const libres = apartamentos.filter(apartamento => apartamento.disponible)
    return {
      disponibles: libres.length,
      precioMinimo: libres.length ? Math.min(...libres.map(apartamento => apartamento.precio)) : 0,
    }
  }, [apartamentos])

  return (
    <section className="container summary" aria-labelledby="resumen-titulo">
      <h2 id="resumen-titulo" className="sr-only">El catálogo en cifras</h2>
      <EstadoConsulta carga={carga} error={error} reintentar={recargar} esqueleto={<EsqueletoCifras />}>
        <dl className="stats">
          <Cifra etiqueta="Residenciales" icono="edificio" valor={residenciales.length} />
          <Cifra etiqueta="Apartamentos" icono="casa" valor={apartamentos.length} />
          <Cifra etiqueta="Disponibles" icono="check" valor={disponibles} />
          <Cifra etiqueta="Precio desde" icono="moneda" valor={precioMinimo}
            formato={numero => (numero ? monedaCorta.format(numero) : '—')} />
        </dl>
      </EstadoConsulta>
    </section>
  )
}
