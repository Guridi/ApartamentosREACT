import { Component } from 'react'
import { Link } from 'react-router-dom'

// Los límites de error todavía se escriben como componentes de clase.
// Si una página falla al renderizar, se muestra este aviso en lugar de una pantalla en blanco.
export default class LimiteErrores extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, informacion) {
    console.error('Error al mostrar la página:', error, informacion.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <section className="container page not-found">
        <p className="not-found-code" aria-hidden="true">Ups</p>
        <h1>Algo salió mal</h1>
        <p className="description">Ocurrió un error al mostrar esta página. Puedes intentarlo de nuevo o volver al inicio.</p>
        <div className="actions">
          <button className="button primary" onClick={() => this.setState({ error: null })}>Intentar de nuevo</button>
          <Link className="button secondary" to="/">Volver al inicio</Link>
        </div>
      </section>
    )
  }
}
