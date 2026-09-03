import { Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import logoUrl from '../../../Logo/TesiLogo.svg?url'
import { company, navigation } from '../../data/site'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" aria-label="TESI, ir a Home">
            <img className="footer-logo" src={logoUrl} alt="TESI" />
          </Link>
          <p>{company.description}</p>
        </div>

        <nav className="footer-column" aria-label="Navegación del pie de página">
          <h2>Navegación</h2>
          {navigation.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>

        <address className="footer-column footer-contact">
          <h2>Contacto</h2>
          <a href={`mailto:${company.email}`}>
            <Mail size={18} aria-hidden="true" />
            {company.email}
          </a>
          <a href={`tel:+52${company.phone}`}>
            <Phone size={18} aria-hidden="true" />
            {company.phone}
          </a>
          <span>{company.address}</span>
        </address>
      </div>
      <div className="container footer-bottom">
        <small>{company.copyright}</small>
      </div>
    </footer>
  )
}
