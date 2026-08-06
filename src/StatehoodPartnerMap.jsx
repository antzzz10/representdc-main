import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import { CATEGORIES, LAYERS, DATA, SOURCES } from './data/statehoodPartners'
import './App.css'
import './StatehoodPartnerMap.css'

function buildGrid() {
  const grid = {}
  CATEGORIES.forEach((c) => {
    grid[c.key] = {}
    LAYERS.forEach((l) => { grid[c.key][l.key] = [] })
  })
  LAYERS.forEach((l) => {
    DATA[l.key].forEach((org) => { grid[org.col][l.key].push(org) })
  })
  return grid
}

function StatehoodPartnerMap() {
  const grid = buildGrid()

  return (
    <div className="app">
      <Nav />

      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Meet the movement</span>
          <h1>The Statehood Partner Map</h1>
          <p>Dozens of organizations, one shared goal — see who's leading, and how to plug in.</p>
        </div>
      </header>

      <section className="impact-section spm-matrix-section">
        <div className="container">
          <h2 className="section-title">At a glance</h2>
          <div className="spm-matrix-card">
            <div className="spm-matrix-scroll">
              <table className="spm-matrix">
                <thead>
                  <tr>
                    <th className="spm-corner"></th>
                    {LAYERS.map((l) => (
                      <th key={l.key} className={`spm-layer-head spm-layer-${l.key}`}>
                        <span className="spm-col-label">{l.label}</span>
                        <span className="spm-col-sub">{l.sub}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIES.map((c) => (
                    <tr key={c.key}>
                      <th>
                        <span className="spm-row-label">{c.label}</span>
                      </th>
                      {LAYERS.map((l) => (
                        <td key={l.key} className="spm-cell">
                          {grid[c.key][l.key].length > 0 && (
                            <div className="spm-chip-stack">
                              {grid[c.key][l.key].map((org) => (
                                <a
                                  key={org.id}
                                  href={`#${org.id}`}
                                  className={`spm-chip spm-layer-${l.key}${org.self ? ' spm-chip-self' : ''}`}
                                >
                                  {org.blurb}
                                </a>
                              ))}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="container">
          <h2 className="section-title">Full directory</h2>
          {LAYERS.map((l) => (
            <div className="spm-layer-block" key={l.key}>
              <h3 className={`spm-layer-heading spm-layer-${l.key}`}>
                <span className="spm-layer-dot"></span>{l.label}
              </h3>
              <p className="spm-layer-desc">{l.desc}</p>
              <div className="spm-card-grid">
                {DATA[l.key].map((org) => (
                  <div className={`spm-org-card${org.self ? ' spm-org-card-self' : ''}`} id={org.id} key={org.id}>
                    <div className="spm-org-card-head">
                      <h4>{org.name}</h4>
                    </div>
                    <div className="spm-org-tags">
                      <span className={`spm-tag-layer spm-layer-${l.key}`}>{l.label}</span>
                      <span className="spm-tag">{CATEGORIES.find((c) => c.key === org.col)?.label}</span>
                      <span className="spm-tag spm-tag-scope">{org.scope === 'national' ? 'National' : 'Local'}</span>
                    </div>
                    <p>{org.desc}</p>
                    <a className="spm-org-link" href={org.url} target="_blank" rel="noopener noreferrer">
                      <span>Visit site</span> <Icon name="external-link" size={13} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="sources-block">
            <h4>Sources</h4>
            <div className="sources-list">
              {SOURCES.map((s) => (
                <span key={s.url}>
                  {s.name}—<a href={s.url} target="_blank" rel="noopener noreferrer">{s.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a>
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

export default StatehoodPartnerMap
