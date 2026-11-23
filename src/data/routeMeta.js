// Per-route <title> and meta description. One source for both the prerendered HTML
// (scripts/prerender-routes.mjs, which also fails the build if a route in App.jsx has no
// entry here) and client-side navigation (src/components/RouteMeta.jsx), so search
// results, link previews and browser tabs all agree.
//
// Titles follow "Page | RepresentDC", drawn from each page's h1 (or its eyebrow where the
// h1 doesn't work as a tab title). Descriptions say what the page holds in one plain
// sentence: no question openers, and no words that vouch for the site.
// Plain JS with no JSX or browser APIs: Node imports this file at build time.
import { READING, readingRoute } from './reading.js'

export const SITE_NAME = 'RepresentDC'

const pageTitle = (page) => `${page} | ${SITE_NAME}`

export const ROUTE_META = {
  '/': {
    title: pageTitle('D.C. has no vote in Congress'),
    description: 'D.C. residents pay federal taxes but have no vote in Congress.',
  },
  '/myths': {
    title: pageTitle('Answers to statehood myths'),
    description: 'Answers to the most common objections to D.C. statehood.',
  },
  '/the-case': {
    title: pageTitle('What Congress has done to D.C.'),
    description: 'Congress has blocked D.C. laws and is voting on bills to block more.',
  },
  '/statehood-curious': {
    title: pageTitle('Statehood-curious'),
    description: "The latest coverage and who's organizing for statehood.",
  },
  '/take-action': {
    title: pageTitle('Take action'),
    description: 'Talking points, data and ways to organize.',
  },
  '/news': {
    title: pageTitle('News & analysis'),
    description: 'Recent coverage of D.C. statehood and home rule, updated daily.',
  },
  '/how-congress-controls-dc': {
    title: pageTitle('How Congress controls D.C.'),
    description: "What home rule means, and why Congress can overturn D.C.'s laws.",
  },
  '/statehood-partner-map': {
    title: pageTitle('The Statehood Partner Map'),
    description: 'The organizations working on statehood.',
  },
  '/about': {
    title: pageTitle('About'),
    description: "RepresentDC is volunteer-run. The site isn't a business or nonprofit organization.",
  },
  '/follow': {
    title: pageTitle('Follow'),
    description: "Email updates, the bill tracker, news and D.C.'s statehood groups.",
  },
  '/statehood-bill': {
    title: pageTitle('Who is behind the Washington, D.C. Admission Act'),
    description: 'Who has cosponsored the Washington, D.C. Admission Act, checked daily.',
  },
}

for (const piece of READING) {
  ROUTE_META[readingRoute(piece.slug)] = { title: pageTitle(piece.title), description: piece.dek }
}

/**
 * Metadata for a pathname. Matches the way React Router matches: case-insensitive,
 * percent-decoded, trailing slashes ignored. Unknown paths get the home entry.
 */
export function metaForPath(pathname) {
  let path = pathname
  try {
    path = decodeURIComponent(path)
  } catch {
    // Malformed escapes: fall back to the raw path.
  }
  path = path.toLowerCase().replace(/\/+$/, '') || '/'
  return ROUTE_META[path] || ROUTE_META['/']
}
