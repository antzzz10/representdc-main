// The ways to follow RepresentDC, with the wording the owner wrote for each. One source,
// so the Follow page, the "Stay in the loop" closing block and the cards that point at
// these from other pages cannot drift apart. Lists only ways that exist today, per the
// site rule. The email card (added 2026-11-17) points at the newsletter's sign-up page on
// beehiiv. It names no schedule until issues are going out: say "weekly" here once that
// is true.
export const TRACKER_URL = 'https://billtracker.representdc.org'

export const EMAIL_WAY = {
  icon: 'mail',
  title: 'Email updates',
  body: 'What Congress does to D.C., what D.C. is doing about it, and how you can help, sent to your inbox.',
  href: 'https://representdc.beehiiv.com/subscribe',
  cta: 'Sign up',
}

export const TRACKER_WAY = {
  icon: 'landmark',
  title: 'Bill tracker',
  body: "Bills in Congress that target D.C.'s laws, budget or government, with where each one stands. Checked against Congress.gov daily.",
  href: TRACKER_URL,
  cta: 'Open the tracker',
}

export const NEWS_WAY = {
  icon: 'newspaper',
  title: 'Statehood in the news',
  body: 'Recent coverage of D.C. statehood and home rule, updated daily.',
  to: '/news',
  cta: 'Read the news',
}

export const WAYS = [
  EMAIL_WAY,
  TRACKER_WAY,
  NEWS_WAY,
  {
    icon: 'users',
    title: 'The people organizing',
    body: "D.C.'s statehood groups run their own newsletters, events and actions. Pick the ones that fit you.",
    to: '/statehood-partner-map',
    cta: 'See the partner map',
  },
]
