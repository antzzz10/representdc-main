import { Link } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import StayInTheLoop from './components/StayInTheLoop'
import { TRACKER_WAY } from './data/followWays'
import './App.css'

// Interim hub for the "Statehood activist" path. It delivers what the home page picker
// card promises (talking points, data, ways to organize) with pages that exist
// today. Same rule as StatehoodCurious.jsx: every card links somewhere real, and a card
// whose page isn't built is cut, not badged. The fuller toolkit is still to come
// (decisions/2026-07-28-take-action-matcher-scope.md). Card bodies reuse the wording
// already used for each destination elsewhere on the site.
const TOOLS = [
  {
    icon: 'book-open',
    title: 'Talking points',
    body: 'What Congress has done to D.C., category by category.',
    to: '/the-case',
  },
  {
    icon: TRACKER_WAY.icon,
    title: 'Bill tracker',
    body: TRACKER_WAY.body,
    href: TRACKER_WAY.href,
  },
  {
    icon: 'scroll-text',
    title: 'Statehood bill',
    // The statehood bill page's own h1
    body: 'Who is behind the Washington, D.C. Admission Act.',
    to: '/statehood-bill',
  },
  {
    icon: 'users',
    // The same card as on StatehoodCurious.jsx
    title: 'The Statehood Partner Map',
    body: 'The organizations working on statehood.',
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
          <h1>Take action</h1>
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
