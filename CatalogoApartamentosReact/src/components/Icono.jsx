// Cada valor del objeto es JSX: React permite guardar elementos en variables.
const trazos = {
  casa: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></>,
  edificio: <><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3" /></>,
  cama: <><path d="M2.5 18V6" /><path d="M2.5 14h19v4" /><path d="M21.5 14v-3a3 3 0 0 0-3-3h-8v6" /><circle cx="6.5" cy="11" r="1.6" /></>,
  bano: <><path d="M4 12h16v2.5a5.5 5.5 0 0 1-5.5 5.5h-5A5.5 5.5 0 0 1 4 14.5V12Z" /><path d="M6.5 12V5.5a2 2 0 0 1 3.6-1.2" /><path d="m7 20-1 2M17 20l1 2" /></>,
  ubicacion: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  corazon: <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4 7.4 4c2 0 3.5 1.1 4.6 2.7C13.1 5.1 14.6 4 16.6 4c3.5 0 5.8 3.6 4.6 7.1-1.7 4.8-9.2 9.4-9.2 9.4Z" />,
  sol: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  luna: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
  buscar: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  cerrar: <path d="M18 6 6 18M6 6l12 12" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  flechaIzquierda: <path d="M19 12H5M11 6l-6 6 6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  alerta: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5V13M12 16.5h.01" /></>,
  refrescar: <><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" /><path d="M4 3v5h5" /><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" /><path d="M20 21v-5h-5" /></>,
  mas: <path d="M12 5v14M5 12h14" />,
  menos: <path d="M5 12h14" />,
  moneda: <><circle cx="12" cy="12" r="9" /><path d="M14.5 9.5c-.5-1-1.4-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1.1 1.6 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1.1 0-2-.5-2.5-1.5M12 6.5V8M12 16v1.5" /></>,
  filtro: <><path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" /><circle cx="15" cy="6" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="17" cy="18" r="2" /></>,
}

// Iconos SVG en línea. Heredan el color del texto con currentColor.
export default function Icono({ nombre, tamano = 20, className, ...resto }) {
  return (
    <svg className={className ? 'icon ' + className : 'icon'} width={tamano} height={tamano} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false" {...resto}>
      {trazos[nombre]}
    </svg>
  )
}
