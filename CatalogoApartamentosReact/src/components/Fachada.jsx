// Nueve ventanas en tres filas. Cada objeto describe dónde dibujar una ventana.
const ventanas = Array.from({ length: 9 }, (_, indice) => ({
  indice,
  x: 86 + (indice % 3) * 26,
  y: 26 + Math.floor(indice / 3) * 20,
}))

// Ilustración SVG generada con datos: las ventanas encendidas son las habitaciones.
// El color del cielo cambia según el residencial.
export default function Fachada({ habitaciones, residencialId = 0 }) {
  return (
    <svg className={'facade sky-' + (residencialId % 4)} viewBox="0 0 240 120"
      preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <circle className="facade-sun" cx="196" cy="28" r="12" />
      <circle className="facade-tree" cx="42" cy="92" r="13" />
      <circle className="facade-tree" cx="198" cy="92" r="13" />
      <rect className="facade-ground" x="40" y="98" width="4" height="10" />
      <rect className="facade-ground" x="196" y="98" width="4" height="10" />
      <rect className="facade-building" x="74" y="16" width="92" height="90" rx="5" />
      {ventanas.map(ventana => (
        <rect key={ventana.indice} x={ventana.x} y={ventana.y} width="16" height="12" rx="2"
          className={ventana.indice < habitaciones ? 'facade-window is-lit' : 'facade-window'} />
      ))}
      <rect className="facade-door" x="110" y="86" width="20" height="20" rx="2" />
      <rect className="facade-ground" x="0" y="106" width="240" height="14" />
    </svg>
  )
}
