import { Link } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import StayInTheLoop from './components/StayInTheLoop'
import { EMAIL_WAY, NEWS_WAY, TRACKER_WAY } from './data/followWays'
import './App.css'

// Hub for readers who already accept that D.C. lacks representation and want
// to know where things stand. Every card links to a page that exists; if one
// ever points somewhere unbuilt, cut the card rather than badging it.
const DESTINATIONS = [
  // Same card as the Follow page's, wording from one source; this page keeps its own icon.
  { ...NEWS_WAY, icon: 'rss' },
  {
    icon: 'users',
    title: 'Meet the movement',
    body: 'The organizations working on statehood, and how to get involved with each.',
    to: '/statehood-partner-map',
  },
  {
    icon: 'book-open',
    title: 'The case for statehood',
    body: 'What Congress has blocked, and what statehood would change.',
    to: '/the-case',
  },
  {
    icon: 'library',
    title: 'Reading',
    body: 'Long-form history, analysis, and guest essays, fully sourced and credited.',
    // The Reading hub is the "Analysis & essays" section of /news (2026-09-12).
    to: '/news#analysis',
  },
]

// The "easy plug-ins" this segment was promised (decisions/2026-07-20-segment-mapping.md).
// Wording is reused: the first two cards are the Follow page's, the third is the home
// page picker's "Statehood activist" sentence.
const FIRST_STEPS = [
  { ...EMAIL_WAY, href: undefined, to: '/follow' },
  TRACKER_WAY,
  {
    icon: 'megaphone',
    title: 'Take action',
    body: 'Get talking points, sourced data, and ways to organize.',
    to: '/take-action',
  },
]

// `as` sets the title's heading level: h2 for cards directly under the page's h1, h3 for
// cards under a row heading.
function Card({ card, as }) {
  const Title = as
  const inner = (
    <>
      <Icon name={card.icon} size={28} />
      <Title>{card.title}</Title>
      <p>{card.body}</p>
    </>
  )
  return card.to ? (
    <Link className="preview-card preview-card-live" to={card.to}>{inner}</Link>
  ) : (
    <a className="preview-card preview-card-live" href={card.href}>{inner}</a>
  )
}

function StatehoodCurious() {
  return (
    <div className="app">
      <Nav />
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Statehood curious</span>
          <h1>Already know the problem?</h1>
        </div>
      </header>
      <section className="impact-section">
        <div className="container">
          <div className="preview-grid">
            {DESTINATIONS.map((d) => <Card key={d.title} card={d} as="h2" />)}
          </div>
          <h2 className="row-heading">An easy first step</h2>
          <div className="preview-grid">
            {FIRST_STEPS.map((step) => <Card key={step.title} card={step} as="h3" />)}
          </div>
          <StayInTheLoop />
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default StatehoodCurious
