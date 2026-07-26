import { Link } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import './App.css'

/**
 * Interim page — full build is scoped in WHATS-NEXT.md Phase 4: hybrid
 * case-for-statehood copy, a ported news section (cross-repo fetch of
 * dc-bills-tracker's news.json), a pulled-forward stakeholder org list, and
 * the accuracy eval pipeline. Until then: previews of what's coming plus
 * links to content that already exists, so this click is never a dead end.
 */
const PREVIEWS = [
  {
    icon: 'rss',
    title: 'Statehood in the news',
    body: "The latest statehood-related coverage from vetted sources—powered by the same news pipeline as the bill tracker.",
  },
  {
    icon: 'users',
    title: 'Meet the movement',
    body: 'The organizations doing statehood work right now, and where to plug in with each one.',
  },
  {
    icon: 'book-open',
    title: 'The case, in brief',
    body: 'A tight, sourced walkthrough of why statehood—linking into the deeper case when you want more.',
  },
]

function StatehoodCurious() {
  return (
    <div className="app">
      <Nav />
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Coming soon</span>
          <h1>Already know the problem?</h1>
          <p>This page is under construction.</p>
        </div>
      </header>
      <section className="impact-section">
        <div className="container">
          <div className="preview-grid">
            {PREVIEWS.map((p) => (
              <div className="preview-card" key={p.title}>
                <span className="card-badge">Coming soon</span>
                <Icon name={p.icon} size={28} />
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
          <div className="interim-links">
            <p>In the meantime, start here:</p>
            <div className="interim-row">
              <a className="cta-secondary" href="https://billtracker.representdc.org">
                <span>Track the live bills</span> <Icon name="arrow-right" />
              </a>
              <Link className="cta-secondary" to="/the-case">
                <span>Read the full case</span> <Icon name="arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default StatehoodCurious
