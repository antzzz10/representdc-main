// Ordering and party options for the member list on /statehood-bill. Pure functions.

// Lower-case words that begin a surname ("Van Hollen", "De La Cruz"). The tracker
// publishes names as "First Last" with no separate family name, so the last word is taken
// as the surname and these particles are pulled in with it. Unhyphenated double surnames
// ("Wasserman Schultz") cannot be told apart from a middle name plus surname ("Holmes
// Norton"), so those sort by their final word.
const PARTICLES = new Set(['van', 'von', 'de', 'del', 'della', 'la', 'le', 'du', 'st', 'st.'])
const SUFFIX = /^(jr\.?|sr\.?|i{1,3}|iv|v)$/i

const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** "hollen van chris" style key: surname first (with particles), then the rest. */
export function lastNameKey(name) {
  const tokens = fold(name).replace(/,/g, ' ').split(/\s+/).filter(Boolean)
  while (tokens.length > 1 && SUFFIX.test(tokens.at(-1))) tokens.pop()
  let start = tokens.length - 1
  while (start > 1 && PARTICLES.has(tokens[start - 1])) start -= 1
  return [...tokens.slice(start), ...tokens.slice(0, start)].join(' ')
}

const byName = (a, b) => lastNameKey(a.name).localeCompare(lastNameKey(b.name))
// Sign-on order: dated cosponsors first, then the sponsor, then members not yet signed on.
const RANK = { signed: 0, sponsor: 1, 'not-yet': 2 }

export const SORTS = [
  { key: 'name', label: 'Last name (A–Z)' },
  { key: 'recent', label: 'Most recently signed on' },
  { key: 'state', label: 'State' },
]

/**
 * Returns a new array in the chosen order. `members` arrives in state order (state,
 * district, name) from memberStatuses, so 'state' is the order as given. 'recent' puts the
 * newest sign-on first; most cosponsors share the introduction date, so ties fall back to
 * last name. Rows without a sign-on date (the sponsor, then members not yet signed on)
 * follow the dated ones rather than being dropped.
 */
export function sortMembers(members, sort) {
  if (sort === 'state') return members
  if (sort === 'recent') {
    return [...members].sort((a, b) =>
      RANK[a.status] - RANK[b.status] ||
      (b.date ?? '').localeCompare(a.date ?? '') ||
      byName(a, b))
  }
  return [...members].sort(byName)
}

const PARTY_LABELS = { D: 'Democrats', R: 'Republicans', I: 'Independents' }
// A member whose party the tracker did not publish is still listed, under its own option.
export const NO_PARTY = 'none'
export const partyKey = (member) => member.party ?? NO_PARTY

/** Party options present among `members`, in a fixed order, each with its count. */
export function partyOptions(members) {
  const counts = {}
  for (const m of members) counts[partyKey(m)] = (counts[partyKey(m)] ?? 0) + 1
  return ['D', 'R', 'I', NO_PARTY]
    .filter((key) => counts[key])
    .map((key) => ({ key, label: PARTY_LABELS[key] ?? 'Party not listed', count: counts[key] }))
}
