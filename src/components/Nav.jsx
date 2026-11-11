import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Logo, Wordmark } from './Logo'
import Icon from './Icon'
import './Nav.css'

const TRACKER_URL = 'https://billtracker.representdc.org'

// One list feeds both the desktop bar and the narrow-screen menu, so the two can't drift.
const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'The case', to: '/the-case' },
  { label: 'Myths', to: '/myths' },
  { label: 'News & analysis', to: '/news' },
  { label: 'Statehood bill', to: '/statehood-bill' },
  { label: 'Bill tracker', href: TRACKER_URL },
  {
    label: 'Candidates',
    href: 'https://candidates.representdc.org',
    title: 'For D.C. voters — 2026 primary candidate positions on statehood',
  },
]

function NavItem({ item, className, onClick }) {
  if (item.to) {
    return <Link className={className} to={item.to} onClick={onClick}>{item.label}</Link>
  }
  return <a className={className} href={item.href} title={item.title} onClick={onClick}>{item.label}</a>
}

function Nav() {
  const location = useLocation()
  // The menu remembers which navigation it was opened on, so any navigation (including
  // a link to the page already showing) closes it without an extra effect.
  const [openedOn, setOpenedOn] = useState(null)
  const open = openedOn === location.key
  const setOpen = (next) => setOpenedOn(next ? location.key : null)
  const navRef = useRef(null)
  const buttonRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    panelRef.current?.querySelector('a')?.focus()

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setOpenedOn(null)
        buttonRef.current?.focus()
      }
    }
    function onPointerDown(event) {
      if (!navRef.current?.contains(event.target)) setOpenedOn(null)
    }
    // The panel only exists below the breakpoint; widening the window past it closes it.
    const wide = window.matchMedia('(min-width: 1025px)')
    function onWide(event) {
      if (event.matches) setOpenedOn(null)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    wide.addEventListener('change', onWide)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      wide.removeEventListener('change', onWide)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <nav className="nav" ref={navRef}>
      <div className="container nav-inner">
        <Link to="/" className="nav-brand" aria-label="RepresentDC — back to top">
          <Logo size={26} />
          <Wordmark size={15} />
        </Link>
        <div className="nav-links">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} item={item} className="nav-link" />
          ))}
          <a className="nav-cta" href={TRACKER_URL}>See the bills</a>
          <button
            ref={buttonRef}
            type="button"
            className="nav-menu-button"
            aria-expanded={open}
            aria-controls="nav-menu"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? 'x' : 'menu'} size={20} />
            <span className="nav-menu-button-label">Menu</span>
          </button>
        </div>
      </div>
      <div id="nav-menu" className="nav-menu" ref={panelRef} hidden={!open}>
        <ul className="container nav-menu-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <NavItem item={item} className="nav-menu-link" onClick={close} />
            </li>
          ))}
          <li className="nav-menu-cta-item">
            <a className="nav-cta" href={TRACKER_URL} onClick={close}>See the bills</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Nav
