// Recibe título y subtítulo como props. children es el contenido que pasa el padre.
// media también es JSX: cada página decide qué imagen mostrar arriba de la tarjeta.
export default function Tarjeta({ titulo, subtitulo, media, nivel = 2, className = '', children }) {
  // El nivel del encabezado se decide al renderizar: h2 en un listado, h3 dentro de una sección.
  const Titulo = 'h' + nivel

  return (
    <article className={('card ' + className).trim()}>
      {media && <div className="card-media">{media}</div>}
      <div className="card-body">
        {subtitulo && <p className="card-subtitle">{subtitulo}</p>}
        <Titulo className="card-title">{titulo}</Titulo>
        {/* Inserta aquí el contenido escrito entre las etiquetas de Tarjeta. */}
        {children}
      </div>
    </article>
  )
}
