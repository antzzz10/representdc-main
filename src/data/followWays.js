// The ways to follow RepresentDC. The email sentence is the owner's own wording. One source,
// so the Follow page, the closing block (StayInTheLoop.jsx) and the cards that point at
// these from other pages cannot drift apart. Lists only ways that exist today, per the
// site rule. The Follow page itself shows the email, Bluesky and partner groups only, with
// no cards for this site's own pages (Andria, 2026-11-24). The email card (added 2026-11-17) points at the newsletter's sign-up page on
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
  body: 'Bills in Congress that target D.C. Checked daily.',
  href: TRACKER_URL,
  cta: 'Open the tracker',
}

export const NEWS_WAY = {
  icon: 'newspaper',
  title: 'News & analysis',
  body: 'Recent coverage of D.C. statehood and home rule, updated daily.',
  to: '/news',
  cta: 'Read the news',
}

// Statehood groups a reader can follow directly, on the Follow page. Each `id` is an entry
// in statehoodPartners.js, which supplies the name. Each link is the group's own sign-up
// or newsletter page, found on the group's own site (checked 2026-11-24). Together for DC's
// sign-up form is on its home page. The three groups and their order are the owner's choice
// (2026-11-24). Check a link again before changing one.
export const PARTNER_FOLLOWS = [
  { id: 'dc-vote', cta: 'Join their list', href: 'https://secure.everyaction.com/3ZM6w-dtx0qU65CDjuFhnA2' },
  { id: 'lwv-dc', cta: 'Read their newsletter', href: 'https://lwvdc.substack.com/' },
  { id: 'together-for-dc', cta: 'Sign up', href: 'https://togetherfordc.org/' },
]
