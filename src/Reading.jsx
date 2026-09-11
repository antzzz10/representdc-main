import { Link } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import './App.css'
import './Reading.css'
import { READING, readingRoute } from './data/reading'

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function Reading() {
  return (
    <div className="app">
      <Nav />
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Reading</span>
          <h1>Deeper insights on the DC Statehood movement</h1>
        </div>
      </header>
      <section className="impact-section">
        <div className="container">
          <div className="preview-grid">
            {READING.map((piece) => (
              <Link
                className="preview-card preview-card-live"
                to={readingRoute(piece.slug)}
                key={piece.slug}
              >
                <span className="reading-card-meta">
                  By {piece.author} · {formatDate(piece.date)}
                </span>
                <h3>{piece.title}</h3>
                <p>{piece.dek}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Reading
