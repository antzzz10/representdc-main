import { useEffect, useState } from 'react'
import Icon from './Icon'
import './BlueskySection.css'

// Bluesky follow card plus the account's latest posts, read from Bluesky's public API
// (no login; the API allows cross-origin reads). The section renders only when the
// account exists and has posts, so the page never lists something that isn't live.
// `preview` shows sample posts for design review (/follow?preview=bluesky) and is
// labelled as such; it never runs for ordinary visitors.

const API = 'https://public.api.bsky.app/xrpc'

// Sample posts for the design preview, written from real tracker events.
const SAMPLE_POSTS = [
  {
    text: 'Passed the House: H.R. 5103, Make the District of Columbia Safe and Beautiful Act of 2025. Track it: billtracker.representdc.org',
    date: '2026-03-25',
  },
  {
    text: 'Passed the Senate: H.J.Res. 142, disapproving D.C.\'s tax decoupling from federal changes. It now goes to the President. billtracker.representdc.org',
    date: '2026-02-12',
  },
  {
    text: 'Passed the House: H.J.Res. 142, disapproving D.C.\'s tax decoupling from federal changes. Next: the Senate. billtracker.representdc.org',
    date: '2026-02-04',
  },
]

const formatDate = (iso) =>
  new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

function useAuthorFeed(handle, preview) {
  const [state, setState] = useState({ status: 'loading', posts: [] })

  useEffect(() => {
    if (preview) return undefined
    let cancelled = false
    const url = `${API}/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(handle)}&filter=posts_no_replies&limit=5`
    fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data) => {
        if (cancelled) return
        const posts = (data.feed || [])
          .filter((item) => !item.reason) // skip reposts
          .map(({ post }) => ({
            text: post.record?.text || '',
            date: post.record?.createdAt || post.indexedAt,
            url: `https://bsky.app/profile/${handle}/post/${post.uri.split('/').pop()}`,
          }))
        setState({ status: posts.length ? 'ready' : 'empty', posts })
      })
      .catch(() => !cancelled && setState({ status: 'error', posts: [] }))
    return () => {
      cancelled = true
    }
  }, [handle, preview])

  return preview ? { status: 'ready', posts: SAMPLE_POSTS } : state
}

function BlueskySection({ handle, preview = false }) {
  const { status, posts } = useAuthorFeed(handle, preview)
  if (status !== 'ready') return null

  const profileUrl = `https://bsky.app/profile/${handle}`

  return (
    <section className="bsky-section" aria-labelledby="bsky-heading">
      {preview && (
        <p className="bsky-preview-flag">Preview: sample posts, not live</p>
      )}
      <div className="bsky-follow">
        <div>
          <h2 id="bsky-heading">On Bluesky</h2>
          <p>
            A post whenever a D.C. bill moves in Congress: new bills, hearings and votes.
          </p>
        </div>
        <div className="bsky-actions">
          <a className="bsky-follow-btn" href={profileUrl}>
            <Icon name="at-sign" size={16} /> Follow @{handle}
          </a>
          <a className="bsky-rss" href={`${profileUrl}/rss`}>
            <Icon name="rss" size={15} /> RSS
          </a>
        </div>
      </div>
      <ol className="bsky-posts">
        {posts.map((post) => (
          <li key={post.url || post.date + post.text.slice(0, 20)} className="bsky-post">
            <p>{post.text}</p>
            {post.url ? (
              <a href={post.url}>{formatDate(post.date)}</a>
            ) : (
              <span>{formatDate(post.date)}</span>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

export default BlueskySection
