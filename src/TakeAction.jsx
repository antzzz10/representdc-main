import { Link } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import StayInTheLoop from './components/StayInTheLoop'
import { TRACKER_WAY } from './data/followWays'
import { ROUTE_META } from './data/routeMeta'
import './App.css'

// Interim hub for the "Statehood activist" path. It delivers what the home page picker
// card promises (talking points, sourced data, ways to organize) with pages that exist
// today. Same rule as StatehoodCurious.jsx: every card links somewhere real, and a card
// whose page isn't built is cut, not badged. The fuller toolkit is still to come
// (decisions/2026-07-28-take-action-matcher-scope.md). Card bodies reuse the wording
// already used for each destination elsewhere on the site.
const TOOLS = [
  {
    icon: 'book-open',
    title: 'Talking points',
    // The Case card on StatehoodCurious.jsx
    body: 'What Congress has blocked, and what statehood would change.',
    to: '/the-case',
  },
  {
    icon: TRACKER_WAY.icon,
    title: 'Sourced data',
    body: TRACKER_WAY.body,
    href: TRACKER_WAY.href,
  },
  {
    icon: 'scroll-text',
    title: 'Statehood bill',
    body: ROUTE_META['/statehood-bill'].description,
    to: '/statehood-bill',
  },
  {
    icon: 'users',
    title: 'Ways to organize',
    // The "Meet the movement" card on StatehoodCurious.jsx
    body: 'The organizations working on statehood, and how to get involved with each.',
    to: '/statehood-partner-map',
  },
]

function ToolCard({ tool }) {
  const inner = (
    <>
      <Icon name={tool.icon} size={28} />
      {/* h2: the cards sit directly under the page's h1 */}
      <h2>{tool.title}</h2>
      <p>{tool.body}</p>
    </>
  )
  return tool.to ? (
    <Link className="preview-card preview-card-live" to={tool.to}>{inner}</Link>
  ) : (
    <a className="preview-card preview-card-live" href={tool.href}>{inner}</a>
  )
}

function TakeAction() {
  return (
    <div className="app">
      <Nav />
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Statehood activist</span>
          <h1>Take action hub</h1>
          <p>Built for people who are already convinced and want to move fast.</p>
        </div>
      </header>
      <section className="impact-section">
        <div className="container">
          <div className="preview-grid">
            {TOOLS.map((tool) => <ToolCard key={tool.title} tool={tool} />)}
          </div>
          <StayInTheLoop />
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default TakeAction
