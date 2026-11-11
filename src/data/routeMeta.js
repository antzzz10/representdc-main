// Per-route <title> and meta description. One source for both the prerendered HTML
// (scripts/prerender-routes.mjs, which also fails the build if a route in App.jsx has no
// entry here) and client-side navigation (src/components/RouteMeta.jsx), so search
// results, link previews and browser tabs all agree.
//
// Titles follow "Page | RepresentDC", drawn from each page's h1 (or its eyebrow where the
// h1 is a question that doesn't work as a tab title). Descriptions reuse sentences
// already on the site — the page's own subtitle, or the card that links to it.
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
    title: pageTitle('Straight answers to statehood questions'),
    description: 'Have doubts or specific objections? Get direct, sourced answers to the most common ones.',
  },
  '/the-case': {
    title: pageTitle('What Congress has blocked'),
    description: "These aren't hypothetical. Congress has used its power to overturn laws passed by D.C. residents.",
  },
  '/statehood-curious': {
    title: pageTitle('Statehood curious'),
    description: "Already know the problem? See the latest coverage and who's organizing for statehood.",
  },
  '/take-action': {
    title: pageTitle('Take action hub'),
    description: 'Already convinced? Get talking points, sourced data, and ways to organize—built for speed.',
  },
  '/news': {
    title: pageTitle('News & analysis'),
    description: 'Recent coverage of D.C. statehood and home rule, updated daily.',
  },
  '/how-congress-controls-dc': {
    title: pageTitle('How Congress controls D.C.'),
    description: "Didn't know D.C. isn't a state? Start with the basics—what home rule means, and why Congress can overturn D.C.'s own laws.",
  },
  '/statehood-partner-map': {
    title: pageTitle('The Statehood Partner Map'),
    description: 'The organizations working on statehood, and how to get involved with each.',
  },
  '/about': {
    title: pageTitle('About'),
    description: "RepresentDC is volunteer-run. No one on this project is paid, and the site isn't a business or nonprofit organization.",
  },
  '/follow': {
    title: pageTitle('Stay in the loop'),
    description: "Congress can overturn D.C.'s laws and budget, and it introduces bills to do so every session. Follow along in the way that suits you.",
  },
  '/statehood-bill': {
    title: pageTitle('Who is behind the Washington, D.C. Admission Act'),
    description: 'The Washington, D.C. Admission Act would admit the land outside a shrunken federal district as a state by legislation, the route used for all 37 states admitted after the original 13.',
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
