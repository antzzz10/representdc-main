import { Link } from 'react-router-dom'
import './App.css'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import { ITEMS, SOURCES, QUESTION_SET_SOURCE } from './data/mythsAndFaq'
import './MythsAndFaq.css'

function MythsAndFaq() {
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
              <div
                className={item.type === 'myth' ? 'myth-item' : 'faq-item'}
                id={item.id}
                key={item.id}
              >
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
            <p>Seen the claims—now see the record:</p>
            <div className="interim-row">
              <Link className="cta-secondary" to="/the-case">
                <span>What Congress has actually blocked</span> <Icon name="arrow-right" />
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
              <span className="sources-note">
                Question set adapted from Neighbors United for DC Statehood's FAQ—
                <a href={QUESTION_SET_SOURCE.href} target="_blank" rel="noopener noreferrer">
                  {QUESTION_SET_SOURCE.display}
                </a>
                . Figures above are cited to primary sources rather than to that summary.
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default MythsAndFaq
