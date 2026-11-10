import { useEffect, useState } from 'react'
import Icon from './Icon'
import './BlueskySection.css'

// The bill tracker's Bluesky account, shown the way Bluesky shows it: the account's own
// avatar and name, the butterfly, and its latest posts. Read live from Bluesky's public API
// in the visitor's browser (no login; the API allows cross-origin reads), so a new post
// appears on the next page load and a deleted one disappears; nothing is stored here.
// The section renders only when the account exists and has posts, so the page never
// lists something that isn't live. `preview` shows labelled sample posts for design
// review (/follow?preview=bluesky); it never runs for ordinary visitors.

const API = 'https://public.api.bsky.app/xrpc'
const MAX_POSTS = 5

// Bluesky's butterfly, from Simple Icons (CC0), drawn in Bluesky's blue.
const BUTTERFLY = 'M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z'

function Butterfly({ size = 18 }) {
  return (
    <svg className="bsky-butterfly" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={BUTTERFLY} fill="currentColor" />
    </svg>
  )
}

const SAMPLE_PROFILE = { displayName: 'DC Statehood Bill Tracker', avatar: null }
const SAMPLE_POSTS = [
  { text: 'Passed the House: H.R. 5103. Track it: billtracker.representdc.org', date: '2026-03-25' },
  { text: 'Passed the Senate: H.J.Res. 142. It now goes to the President.', date: '2026-02-12' },
]

const formatDate = (iso) =>
  new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

// A post's links live in "facets", located by UTF-8 byte offsets. Rebuild the text as
// plain strings and links, so links are clickable as they are on Bluesky. A facet is used
// only if it is well formed: whole-number offsets inside the text that don't split a
// character, and a valid http(s) URL. Anything else, including overlaps, stays plain
// text, so a malformed post can never break the section.
const isCharBoundary = (bytes, i) => i === bytes.length || (bytes[i] & 0xc0) !== 0x80
function safeLink(facet, bytes) {
  const { byteStart, byteEnd } = facet?.index || {}
  if (!Number.isInteger(byteStart) || !Number.isInteger(byteEnd)) return null
  if (byteStart < 0 || byteEnd > bytes.length || byteStart >= byteEnd) return null
  if (!isCharBoundary(bytes, byteStart) || !isCharBoundary(bytes, byteEnd)) return null
  const features = Array.isArray(facet.features) ? facet.features : []
  const uri = features.find((f) => f?.$type === 'app.bsky.richtext.facet#link')?.uri
  try {
    const parsed = new URL(uri)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null
  } catch {
    return null
  }
  return { byteStart, byteEnd, uri }
}

function renderText(text, facets) {
  const bytes = new TextEncoder().encode(text)
  const decode = (a, b) => new TextDecoder().decode(bytes.slice(a, b))
  const links = (Array.isArray(facets) ? facets : [])
    .map((f) => safeLink(f, bytes))
    .filter(Boolean)
    .sort((a, b) => a.byteStart - b.byteStart)
  const parts = []
  let at = 0
  for (const link of links) {
    if (link.byteStart < at) continue
    parts.push(decode(at, link.byteStart))
    parts.push(<a key={link.byteStart} href={link.uri}>{decode(link.byteStart, link.byteEnd)}</a>)
    at = link.byteEnd
  }
  parts.push(decode(at, bytes.length))
  return parts
}

function useBluesky(handle, preview) {
  const [state, setState] = useState({ status: 'loading', profile: null, posts: [] })

  useEffect(() => {
    if (preview) return undefined
    let cancelled = false
    const get = (path) => fetch(`${API}/${path}`).then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
    // The profile only adds the avatar and display name: if it fails, the posts still show
    // with the handle. If the feed fails, the section hides.
    const profileRequest = get(`app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`).catch(() => null)
    Promise.all([
      profileRequest,
      // Fetch extra so reposts can be dropped and still leave MAX_POSTS originals.
      get(`app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(handle)}&filter=posts_no_replies&limit=${MAX_POSTS * 3}`),
    ])
      .then(([profile, data]) => {
        if (cancelled) return
        const posts = (Array.isArray(data?.feed) ? data.feed : [])
          // Skip reposts and anything malformed (a post needs a string id and a date).
          .filter((item) => typeof item?.post?.uri === 'string' && !item.reason &&
            typeof (item.post.record?.createdAt || item.post.indexedAt) === 'string')
          .slice(0, MAX_POSTS)
          .map(({ post }) => ({
            text: typeof post.record?.text === 'string' ? post.record.text : '',
            facets: post.record?.facets,
            date: post.record?.createdAt || post.indexedAt,
            url: `https://bsky.app/profile/${handle}/post/${post.uri.split('/').pop()}`,
          }))
        setState({ status: posts.length ? 'ready' : 'empty', profile, posts })
      })
      .catch(() => !cancelled && setState({ status: 'error', profile: null, posts: [] }))
    return () => {
      cancelled = true
    }
  }, [handle, preview])

  return preview ? { status: 'ready', profile: SAMPLE_PROFILE, posts: SAMPLE_POSTS } : state
}

function Avatar({ src, size }) {
  return src
    ? <img className="bsky-avatar" src={src} alt="" width={size} height={size} loading="lazy" />
    : <span className="bsky-avatar bsky-avatar-blank" style={{ width: size, height: size }} aria-hidden="true" />
}

function BlueskySection({ handle, preview = false }) {
  const { status, profile, posts } = useBluesky(handle, preview)
  if (status !== 'ready') return null

  const profileUrl = `https://bsky.app/profile/${handle}`
  const name = profile?.displayName || handle

  return (
    <section className="bsky-section" aria-labelledby="bsky-heading">
      {preview && <p className="bsky-preview-flag">Preview: sample posts, not live</p>}
      <h2 id="bsky-heading" className="bsky-heading">
        <Butterfly size={20} /> Bluesky
      </h2>
      <div className="bsky-account">
        <a className="bsky-account-id" href={profileUrl}>
          <Avatar src={profile?.avatar} size={48} />
          <span className="bsky-account-names">
            <strong>{name}</strong>
            <span className="bsky-handle">@{handle}</span>
          </span>
        </a>
        <div className="bsky-actions">
          <a className="bsky-follow-btn" href={profileUrl}>
            <Butterfly size={16} /> Follow on Bluesky
          </a>
          <a className="bsky-rss" href={`${profileUrl}/rss`}>
            <Icon name="rss" size={15} /> RSS
          </a>
        </div>
      </div>
      <ol className="bsky-posts">
        {posts.map((post) => (
          <li key={post.url || post.date + post.text.slice(0, 20)} className="bsky-post">
            <Avatar src={profile?.avatar} size={36} />
            <div className="bsky-post-body">
              <p className="bsky-post-meta">
                <strong>{name}</strong> <span className="bsky-handle">@{handle}</span>
                {' · '}
                {post.url ? <a href={post.url}>{formatDate(post.date)}</a> : <span>{formatDate(post.date)}</span>}
              </p>
              <p className="bsky-post-text">{renderText(post.text, post.facets)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default BlueskySection
