import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './layouts/SiteLayout'
import { HomePage } from './pages/HomePage'

const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })),
)
const EmploymentPage = lazy(() =>
  import('./pages/EmploymentPage').then((module) => ({ default: module.EmploymentPage })),
)
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })),
)

function RouteLoader() {
  return (
    <div className="route-loader" role="status" aria-label="Cargando">
      <span aria-hidden="true" />
    </div>
  )
}

function loadPage(page: ReactNode) {
  return <Suspense fallback={<RouteLoader />}>{page}</Suspense>
}

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="nosotros" element={loadPage(<AboutPage />)} />
        <Route path="empleo" element={loadPage(<EmploymentPage />)} />
        <Route path="contacto" element={loadPage(<ContactPage />)} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
