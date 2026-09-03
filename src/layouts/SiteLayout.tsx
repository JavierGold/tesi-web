import { Outlet } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { ScrollToTop } from '../components/layout/ScrollToTop'

export function SiteLayout() {
  return (
    <div className="site-shell">
      <ScrollToTop />
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
