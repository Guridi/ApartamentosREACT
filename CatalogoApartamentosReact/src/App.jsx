import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'

// lazy divide el código: cada página se descarga la primera vez que se visita.
const Inicio = lazy(() => import('./pages/Inicio.jsx'))
const Residenciales = lazy(() => import('./pages/Residenciales.jsx'))
const Apartamentos = lazy(() => import('./pages/Apartamentos.jsx'))
const DetalleApartamento = lazy(() => import('./pages/DetalleApartamento.jsx'))
const Favoritos = lazy(() => import('./pages/Favoritos.jsx'))
const NoEncontrado = lazy(() => import('./pages/NoEncontrado.jsx'))

// Define las rutas. Todas comparten el encabezado y el pie de Layout.
export default function App() {
  return (
    <Routes>
      {/* Ruta de diseño: Layout muestra la página elegida dentro de <Outlet />. */}
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="residenciales" element={<Residenciales />} />
        <Route path="apartamentos" element={<Apartamentos />} />
        {/* :id es un parámetro dinámico que la página lee con useParams. */}
        <Route path="apartamentos/:id" element={<DetalleApartamento />} />
        <Route path="favoritos" element={<Favoritos />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  )
}
