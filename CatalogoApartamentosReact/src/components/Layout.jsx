import { Suspense, useEffect, useState, version } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useCatalogo } from '../context/CatalogoContext.jsx'
import { useApartamentosFavoritos } from '../context/FavoritosContext.jsx'
import { useTema } from '../context/TemaContext.jsx'
import { hora } from '../utils/formato.js'
import Icono from './Icono.jsx'
import LimiteErrores from './LimiteErrores.jsx'

// Reutiliza el nombre y el enlace de inicio en el encabezado y el pie.
function Marca() {
  return (
    <Link className="brand" to="/">
      <span className="brand-icon" aria-hidden="true"><Icono nombre="casa" tamano={18} /></span>
      <span>Catálogo<span className="brand-secondary"> de Apartamentos</span></span>
    </Link>
  )
}

function BotonTema() {
  const { tema, alternarTema } = useTema()
  const oscuro = tema === 'oscuro'
  return (
    <button type="button" className="icon-button" onClick={alternarTema}
      aria-label={oscuro ? 'Usar tema claro' : 'Usar tema oscuro'} title={oscuro ? 'Tema claro' : 'Tema oscuro'}>
      <Icono nombre={oscuro ? 'sol' : 'luna'} />
    </button>
  )
}

// NavLink identifica en el menú la ruta que está activa.
export function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const favoritos = useApartamentosFavoritos()
  const cerrarMenu = () => setMenuAbierto(false)

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Marca />
        <nav id="menu-principal" aria-label="Navegación principal" className={menuAbierto ? 'main-nav is-open' : 'main-nav'}>
          <NavLink end to="/" onClick={cerrarMenu}>Inicio</NavLink>
          <NavLink to="/residenciales" onClick={cerrarMenu}>Residenciales</NavLink>
          <NavLink to="/apartamentos" onClick={cerrarMenu}>Apartamentos</NavLink>
          <NavLink to="/favoritos" onClick={cerrarMenu}>
            Favoritos
            {favoritos.length > 0 && <span className="badge"><span className="sr-only">: </span>{favoritos.length}</span>}
          </NavLink>
        </nav>
        <div className="header-actions">
          <BotonTema />
          <button type="button" className="icon-button menu-toggle" aria-expanded={menuAbierto}
            aria-controls="menu-principal" aria-label="Menú" onClick={() => setMenuAbierto(abierto => !abierto)}>
            <Icono nombre={menuAbierto ? 'cerrar' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  )
}

// Indica si la API respondió y permite volver a consultarla.
function EstadoApi() {
  const { carga, actualizando, error, actualizado, recargar } = useCatalogo()

  let estado = 'ok'
  let texto = actualizado ? 'API conectada · ' + hora.format(actualizado) : 'API conectada'
  if (carga || actualizando) {
    estado = 'pendiente'
    texto = 'Consultando la API…'
  } else if (error) {
    estado = 'error'
    texto = 'Sin conexión con la API'
  }

  return (
    <div className="api-status" data-estado={estado}>
      <span className="api-dot" aria-hidden="true" />
      <span>{texto}</span>
      <button type="button" className="text-button" onClick={recargar} disabled={carga || actualizando}>
        <Icono nombre="refrescar" tamano={14} className={actualizando ? 'spin' : undefined} /> Actualizar
      </button>
    </div>
  )
}

// Pie común con el nombre del catálogo, enlaces y la asignatura.
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Marca />
          <p>Residenciales y apartamentos en República Dominicana, en un solo lugar.</p>
        </div>
        <nav aria-label="Enlaces del pie" className="footer-nav">
          <Link to="/residenciales">Residenciales</Link>
          <Link to="/apartamentos">Apartamentos</Link>
          <Link to="/favoritos">Favoritos</Link>
        </nav>
        <EstadoApi />
      </div>
      <div className="container footer-bottom">
        <span>Programación Web II · República Dominicana</span>
        <span>Hecho con React {version}</span>
      </div>
    </footer>
  )
}

function CargandoPagina() {
  return (
    <div className="container page page-loading" role="status">
      <span className="spinner large" aria-hidden="true" />
      <span className="sr-only">Cargando página…</span>
    </div>
  )
}

// Ruta de diseño: comparte el encabezado y el pie, y muestra la página activa en <Outlet />.
export default function Layout() {
  const { pathname } = useLocation()

  // Al cambiar de página, vuelve al principio.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <a className="skip-link" href="#contenido">Ir al contenido</a>
      <Header />
      <main id="contenido" tabIndex={-1}>
        {/* La clave reinicia el límite de errores al navegar a otra ruta. */}
        <LimiteErrores key={pathname}>
          {/* Suspense muestra el indicador mientras se descarga el código de una página. */}
          <Suspense fallback={<CargandoPagina />}>
            <Outlet />
          </Suspense>
        </LimiteErrores>
      </main>
      <Footer />
    </>
  )
}
