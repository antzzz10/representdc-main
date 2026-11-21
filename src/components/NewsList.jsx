import Icon from './Icon'
import { validNewsItems } from '../utils/newsItems'

function formatRelativeDate(pubDate) {
  const date = new Date(pubDate)
  if (isNaN(date)) return ''
  const days = Math.floor((Date.now() - date) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// One list markup for both lists on /news: the headlines and the newsletters.
function NewsList({ items }) {
  const valid = validNewsItems(items)
  if (valid.length === 0) return null
  return (
    <ul className="news-list">
      {valid.map((item) => (
        <li className="news-item" key={item.link}>
          <a
            className="news-item-title"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.title}
            <Icon name="external-link" size={14} />
          </a>
          <span className="news-item-meta">
            {item.source && <span>{item.source}</span>}
            {item.source && item.pubDate && <span className="news-item-dot"> · </span>}
            {item.pubDate && <span>{formatRelativeDate(item.pubDate)}</span>}
          </span>
        </li>
      ))}
    </ul>
  )
}

// Newsletters carry more opinion than news coverage, so they get their own heading and
// list, apart from the headlines and from the AI summary written from those headlines
// (scripts/news/newsletters.mjs). Renders nothing at all, heading included, when there is
// no valid item: an older feed file has no `newsletters` field, and a failed newsletter
// fetch publishes [].
export function NewsletterSection({ newsletters }) {
  const valid = validNewsItems(newsletters)
  if (valid.length === 0) return null
  return (
    <>
      <h3 className="news-subheading">Newsletters and opinion</h3>
      <NewsList items={valid} />
    </>
  )
}

export default NewsList
