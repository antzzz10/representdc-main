import { useParams, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Cite from '../components/Cite'
import '../App.css'
import '../Reading.css'
import { READING } from '../data/reading'

// Every article body lives in its own src/reading/<slug>.md, loaded as raw
// text here so this one component can render any of them — metadata (title,
// author, date, source) stays in the READING registry instead of frontmatter,
// so an import script can write a plain .md file with nothing else to parse.
const BODIES = import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true })

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Reads section headings straight from the raw markdown so the jump-link TOC
// always matches whatever ## headings an article actually has — no per-article
// authoring, and it can't drift from the h2 renderer below since both slugify
// the same heading text.
function extractHeadings(markdown) {
  return [...markdown.matchAll(/^##\s+(.+)$/gm)].map((match) => {
    const text = match[1].trim()
    return { text, slug: slugify(text) }
  })
}

function headingText(children) {
  return Array.isArray(children) ? children.join('') : String(children)
}

const markdownComponents = {
  h2: ({ children }) => <h2 id={slugify(headingText(children))}>{children}</h2>,
  table: ({ children }) => (
    <div className="article-table-wrap">
      <table>{children}</table>
    </div>
  ),
}

function Article() {
  const { slug } = useParams()
  const piece = READING.find((item) => item.slug === slug)
  const body = piece && BODIES[`./${slug}.md`]

  if (!piece || !body) {
    return <Navigate to="/reading" replace />
  }

  const headings = extractHeadings(body)

  return (
    <div className="app">
      <Nav />
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Reading</span>
          <h1>{piece.title}</h1>
        </div>
      </header>
      <section className="impact-section">
        <div className="container">
          <p className="article-byline">
            By {piece.author}
            {piece.sourceUrl && (
              <>
                {' '}
                · Originally published on <Cite href={piece.sourceUrl}>{piece.sourceName}</Cite>
              </>
            )}
            , {formatDate(piece.date)}
          </p>

          {headings.length > 1 && (
            <nav className="article-toc" aria-label="Jump to section">
              <span className="article-toc-label">Jump to section</span>
              <ul>
                {headings.map((h) => (
                  <li key={h.slug}>
                    <a href={`#${h.slug}`}>{h.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="article-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {body}
            </ReactMarkdown>
          </div>

          {piece.sourceUrl && (
            <div className="article-source-note">
              Read the original at <Cite href={piece.sourceUrl}>{piece.sourceName}</Cite>.
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Article
