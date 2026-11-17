import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CatalogoProvider } from './context/CatalogoContext.jsx'
import { FavoritosProvider } from './context/FavoritosContext.jsx'
import { NotificacionesProvider } from './context/NotificacionesContext.jsx'
import { TemaProvider } from './context/TemaContext.jsx'
import './styles.css'

// Monta React en el elemento raíz, habilita la navegación y comparte los contextos con todo el sitio.
// FavoritosProvider va dentro de CatalogoProvider porque usa los datos del catálogo.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TemaProvider>
        <NotificacionesProvider>
          <CatalogoProvider>
            <FavoritosProvider>
              <App />
            </FavoritosProvider>
          </CatalogoProvider>
        </NotificacionesProvider>
      </TemaProvider>
    </BrowserRouter>
  </StrictMode>,
)
