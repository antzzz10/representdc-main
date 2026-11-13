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
  { label: 'Follow', to: '/follow' },
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
  // a link to the page already showing) closes it. The stale key is also dropped, so
  // Back to that history entry can't reopen it. (Adjusting state during render is
  // React's documented alternative to a reset effect.)
  const [openedOn, setOpenedOn] = useState(null)
  if (openedOn !== null && openedOn !== location.key) setOpenedOn(null)
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
        // Only pull focus back if it was in the nav; don't yank it from elsewhere.
        const active = document.activeElement
        if (!active || active === document.body || navRef.current?.contains(active)) {
          buttonRef.current?.focus()
        }
      }
    }
    function onPointerDown(event) {
      if (!navRef.current?.contains(event.target)) setOpenedOn(null)
    }
    // The panel only exists below the breakpoint; widening the window past it closes it.
    const wide = window.matchMedia('(min-width: 1120px)')
    function onWide(event) {
      if (!event.matches) return
      // The menu button vanishes at this width too, so park focus on the brand link.
      const active = document.activeElement
      if (panelRef.current?.contains(active) || active === buttonRef.current) {
        navRef.current?.querySelector('.nav-brand')?.focus()
      }
      setOpenedOn(null)
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

  // Tabbing past the last menu item would otherwise leave focus on page content hidden
  // under the open panel.
  function onBlur(event) {
    if (open && event.relatedTarget && !navRef.current?.contains(event.relatedTarget)) close()
  }

  return (
    <nav className="nav" ref={navRef} onBlur={onBlur}>
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
