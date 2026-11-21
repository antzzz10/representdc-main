// Shape checks for the items in /api/news.json (`articles` and `newsletters`).

function isHttpsLink(link) {
  if (typeof link !== 'string') return false
  try {
    const url = new URL(link)
    return url.protocol === 'https:' && url.hostname.length > 0
  } catch {
    return false
  }
}

function isValidItem(item) {
  return (
    item !== null &&
    typeof item === 'object' &&
    !Array.isArray(item) &&
    typeof item.title === 'string' &&
    item.title.trim() !== '' &&
    isHttpsLink(item.link) &&
    (item.source === undefined || item.source === null || typeof item.source === 'string') &&
    (item.pubDate === undefined || item.pubDate === null || typeof item.pubDate === 'string')
  )
}

// The feed file is fetched at runtime, so the page cannot assume its shape. One null
// entry or an object where a title should be would otherwise throw during render and
// take the whole news page down. Anything that is not a well-formed item is left out;
// a link must be a real https URL, so nothing like `javascript:` can reach an href.
// A valid feed is returned unchanged.
export function validNewsItems(items) {
  if (!Array.isArray(items)) return []
  const seen = new Set()
  return items.filter((item) => {
    // Links are React keys, so a repeated one is dropped too.
    if (!isValidItem(item) || seen.has(item.link)) return false
    seen.add(item.link)
    return true
  })
}
