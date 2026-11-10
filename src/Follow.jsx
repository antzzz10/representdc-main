import { Link, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import BlueskySection from './components/BlueskySection'
import './App.css'

// Lists only ways to follow that exist today, per the site rule. A weekly email digest gets
// a card when it ships; the Bluesky section shows itself once the account has posts.
const BLUESKY_HANDLE = 'bills.representdc.org'

const WAYS = [
  {
    icon: 'landmark',
    title: 'Bill tracker',
    body: "Bills in Congress that target D.C.'s laws, budget or government, with where each one stands. Checked against Congress.gov daily.",
    href: 'https://billtracker.representdc.org',
    cta: 'Open the tracker',
  },
  {
    icon: 'newspaper',
    title: 'Statehood in the news',
    body: 'Recent coverage of D.C. statehood and home rule, updated daily.',
    to: '/news',
    cta: 'Read the news',
  },
  {
    icon: 'users',
    title: 'The people organizing',
    body: "D.C.'s statehood groups run their own newsletters, events and actions. Pick the ones that fit you.",
    to: '/statehood-partner-map',
    cta: 'See the partner map',
  },
]

function WayCard({ way }) {
  const inner = (
    <>
      <Icon name={way.icon} size={28} />
      <h3>{way.title}</h3>
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
          <h1>Stay in the loop</h1>
          <p>
            Congress can overturn D.C.'s laws and budget, and it introduces bills to do so every
            session. Follow along in the way that suits you.
          </p>
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
              Use an AI assistant? The tracker and news data are public:{' '}
              <a href="https://billtracker.representdc.org/api/stats.json">bill stats</a> and{' '}
              <a href="/api/news.json">news</a>. Point your assistant at them and ask where
              things stand.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Follow
