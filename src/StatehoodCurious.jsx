import { Link } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import './App.css'

// Hub for readers who already accept that D.C. lacks representation and want
// to know where things stand. Every card links to a page that exists; if one
// ever points somewhere unbuilt, cut the card rather than badging it.
const DESTINATIONS = [
  {
    icon: 'rss',
    title: 'Statehood in the news',
    body: 'Recent coverage of D.C. statehood and home rule, updated daily.',
    to: '/news',
  },
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
]

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
            {DESTINATIONS.map((d) => (
              <Link className="preview-card preview-card-live" to={d.to} key={d.title}>
                <Icon name={d.icon} size={28} />
                <h3>{d.title}</h3>
                <p>{d.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default StatehoodCurious
