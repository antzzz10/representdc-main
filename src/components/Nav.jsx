import { Link } from 'react-router-dom'
import { Logo, Wordmark } from './Logo'
import './Nav.css'

function Nav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link to="/" className="nav-brand" aria-label="RepresentDC — back to top">
          <Logo size={26} />
          <Wordmark size={15} />
        </Link>
        <div className="nav-links">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/the-case">The Case</Link>
          <Link className="nav-link" to="/myths">Myths</Link>
          <a className="nav-link" href="https://billtracker.representdc.org">Bill tracker</a>
          <a
            className="nav-link"
            href="https://candidates.representdc.org"
            title="For D.C. voters — 2026 primary candidate positions on statehood"
          >
            Candidates
          </a>
          <a className="nav-cta" href="https://billtracker.representdc.org">See the bills</a>
        </div>
      </div>
    </nav>
  )
}

export default Nav
