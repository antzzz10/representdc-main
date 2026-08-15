import { Link } from 'react-router-dom'
import './App.css'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import { ITEMS, SOURCES } from './data/myths'
import './Myths.css'

function Myths() {
  return (
    <div className="app">
      <Nav />

      <header className="myth-hero">
        <div className="container">
          <span className="eyebrow">Statehood, questioned</span>
          <h1>Straight answers to statehood questions</h1>
        </div>
      </header>

      <section className="myth-sec">
        <div className="container">
          <div className="myth-list">
            {ITEMS.map((item) => (
              <div className="myth-item" id={item.id} key={item.id}>
                <div className={`myth-item-body${item.fact ? ' has-fact' : ''}`}>
                  <div className="myth-item-main">
                    <p className="myth-q">
                      <span className="qtag">{item.tag}</span>
                      {item.q}
                    </p>
                    <p className="myth-a">{item.a}</p>
                  </div>
                  {item.fact && (
                    <div className="myth-fact-panel">
                      <span className="myth-fact-value">{item.fact.value}</span>
                      <span className="myth-fact-label">{item.fact.label}</span>
                      <span className="myth-fact-detail">{item.fact.detail}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="interim-links">
            <div className="interim-row">
              <Link className="cta-secondary" to="/news">
                <span>See the latest in D.C. statehood news</span> <Icon name="arrow-right" />
              </Link>
            </div>
          </div>

          <div className="sources-block">
            <h4>Sources</h4>
            <div className="sources-list">
              {SOURCES.map((source) => (
                <span key={source.href + source.label}>
                  {source.label}—
                  <a href={source.href} target="_blank" rel="noopener noreferrer">
                    {source.display}
                  </a>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Myths
