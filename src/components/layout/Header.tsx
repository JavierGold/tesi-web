import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logoUrl from '../../../Logo/TesiLogo.svg?url'
import { navigation } from '../../data/site'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const navigationRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpen)

    if (isOpen) {
      navigationRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        menuButtonRef.current?.focus()
        return
      }

      if (event.key !== 'Tab' || !isOpen) return

      const links = Array.from(
        navigationRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [],
      )
      const focusable = [menuButtonRef.current, ...links].filter(
        (element): element is HTMLButtonElement | HTMLAnchorElement => element !== null,
      )
      const first = focusable[0]
      const last = focusable.at(-1)

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 761px)')
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false)
    }

    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand-link" to="/" aria-label="TESI, ir a Home">
          <img className="brand-logo" src={logoUrl} alt="TESI" />
        </Link>

        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <nav
          ref={navigationRef}
          className={`primary-navigation${isOpen ? ' is-open' : ''}`}
          id="primary-navigation"
          aria-label="Navegación principal"
        >
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                `nav-link${isActive ? ' is-active' : ''}`
              }
              to={item.to}
              end={item.to === '/'}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
