import { Link, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import BlueskySection from './components/BlueskySection'
import { WAYS } from './data/followWays'
import './App.css'

// The cards and their wording live in src/data/followWays.js, shared with the pages that
// point here. The Bluesky section shows itself once the account has posts.
const BLUESKY_HANDLE = 'bills.representdc.org'

function WayCard({ way }) {
  const inner = (
    <>
      <Icon name={way.icon} size={28} />
      {/* h2: the cards sit directly under the page's h1 */}
      <h2>{way.title}</h2>
      <p>{way.body}</p>
      <p className="follow-cta">
        {way.cta} <Icon name="arrow-right" size={15} />
      </p>
    </>
  )
  return way.to ? (
    <Link className="preview-card preview-card-live follow-card" to={way.to}>{inner}</Link>
  ) : (
    <a className="preview-card preview-card-live follow-card" href={way.href}>{inner}</a>
  )
}

function Follow() {
  const preview = new URLSearchParams(useLocation().search).get('preview') === 'bluesky'
  return (
    <div className="app">
      <Nav />
      <header className="page-hero">
        <div className="container">
          <h1>Follow</h1>
        </div>
      </header>
      <section className="impact-section">
        <div className="container">
          <div className="preview-grid">
            {WAYS.map((way) => <WayCard key={way.title} way={way} />)}
          </div>
          <BlueskySection handle={BLUESKY_HANDLE} preview={preview} />
          <div className="interim-links">
            <p>
              Public data:{' '}
              <a href="https://billtracker.representdc.org/api/stats.json">bill stats</a> and{' '}
              <a href="/api/news.json">news</a>.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Follow
