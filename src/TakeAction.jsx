import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import './App.css'

const PREVIEWS = [
  {
    icon: 'landmark',
    title: 'Congressional outreach toolkit',
    body: 'Scripts and talking points for contacting key members of Congress, tailored to where each live bill actually stands.',
  },
  {
    icon: 'gavel',
    title: 'State-level statehood advocacy',
    body: 'How to push for statehood resolutions in state legislatures, and how to offer testimony when state-level statehood bills come up for a vote.',
  },
  {
    icon: 'hand-coins',
    title: '"No donation without representation"',
    body: "Before you give money or time to a candidate, ask where they stand on D.C. statehood—and withhold support from those who haven't committed.",
  },
]

function TakeAction() {
  return (
    <div className="app">
      <Nav />
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Coming soon</span>
          <h1>Take action hub</h1>
          <p>Built for people who are already convinced and want to move fast. Here's what's coming.</p>
        </div>
      </header>
      <section className="impact-section">
        <div className="container">
          <div className="preview-grid">
            {PREVIEWS.map((p) => (
              <div className="preview-card" key={p.title}>
                <Icon name={p.icon} size={28} />
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default TakeAction
