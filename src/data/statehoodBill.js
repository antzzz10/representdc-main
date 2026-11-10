// Validation and derivations for /statehood-bill. Pure functions only, so the page and any
// future check script share one definition of what the tracker files must look like.
// Anything that fails validation is dropped whole: the page shows no number rather than a
// number from a half-understood file (same rule as useBillStats). The checks below came
// from the Codex medium/high/attack passes of 2026-11-10 (reviews/2026-11-10-statehood-
// bill-page-codex-*.raw.md): every published total is re-derived from the rows it
// summarizes, identities are canonical before any join, and links must point at the
// official host they are labelled with.

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/
const ISO_INSTANT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/
const BIOGUIDE = /^[A-Z]\d{6}$/
const STATE = /^[A-Z]{2}$/
const PARTIES = new Set(['R', 'D', 'I'])
// Non-voting House seats. Puerto Rico's member is a Resident Commissioner; the rest are
// Delegates. Used for courtesy titles and to re-derive the non-voting subtotal.
const NON_VOTING = new Set(['DC', 'PR', 'GU', 'VI', 'AS', 'MP'])
// Upper bounds on any one chamber's population, voting and non-voting seats together.
const CHAMBER_MAX = { house: 441, senate: 100 }
// Freshness limits. The cosponsor check runs daily and the roster weekly; past these, a
// "this month" or "not yet" statement could describe a world that has since changed, so
// those sections are withheld (the count cards still show their own "Last checked" date).
const DAY_MS = 24 * 60 * 60 * 1000
const CHECK_MAX_AGE_MS = 2 * DAY_MS
const ROSTER_MAX_AGE_MS = 15 * DAY_MS

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const isStr = (v) => typeof v === 'string' && v.trim() !== ''
const isCount = (v) => Number.isInteger(v) && v >= 0
const squash = (s) => s.trim().replace(/\s+/g, ' ')

function validCalendar(y, mo, d) {
  const dt = new Date(Date.UTC(y, mo - 1, d))
  return mo >= 1 && mo <= 12 && dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d
}

export function isDateOnly(value) {
  if (typeof value !== 'string') return false
  const m = DATE_ONLY.exec(value)
  return Boolean(m) && validCalendar(Number(m[1]), Number(m[2]), Number(m[3]))
}

// Same rule as useBillStats: Date() silently rolls "2026-02-30" into March, so the calendar
// is checked before the value is trusted.
export function isInstant(value) {
  if (typeof value !== 'string') return false
  const m = ISO_INSTANT.exec(value)
  if (!m) return false
  const [hour, minute, second] = [Number(m[4]), Number(m[5]), Number(m[6] ?? 0)]
  if (hour > 23 || minute > 59 || second > 59) return false
  return validCalendar(Number(m[1]), Number(m[2]), Number(m[3])) && !Number.isNaN(Date.parse(value))
}

/** Eastern calendar date (YYYY-MM-DD) of an instant. */
export function etDate(instant) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date(instant))
  const get = (t) => parts.find((p) => p.type === t).value
  return `${get('year')}-${get('month')}-${get('day')}`
}

// A link is only shown under an official label if it really points at that host: https, no
// embedded credentials, and the expected hostname (exact, or a subdomain where allowed).
function officialUrl(value, hostOk, upgradeHttp = false) {
  if (typeof value !== 'string') return null
  try {
    const u = new URL(value)
    // Congress.gov lists a few member sites as http (e.g. menefee.house.gov, 2026-11-10);
    // House and Senate sites all serve https, so those are upgraded rather than dropped.
    if (upgradeHttp && u.protocol === 'http:') u.protocol = 'https:'
    if (u.protocol !== 'https:' || u.username || u.password || u.port) return null
    return hostOk(u.hostname.toLowerCase(), u.pathname) ? u.href : null
  } catch {
    return null
  }
}
const isCongressGov = (h) => h === 'www.congress.gov' || h === 'congress.gov'
const isGovInfo = (h) => h === 'www.govinfo.gov' || h === 'govinfo.gov'
const isMemberSite = (h) => /^[a-z0-9-]+(\.[a-z0-9-]+)*\.(house|senate)\.gov$/.test(h)

const CHAMBER_PREFIX = { house: /^H\.R\. \d+$/, senate: /^S\. \d+$/ }
const CHAMBER_PATH = { house: 'house-bill', senate: 'senate-bill' }

function chamberFromNumber(billNumber) {
  if (CHAMBER_PREFIX.house.test(billNumber)) return 'house'
  if (CHAMBER_PREFIX.senate.test(billNumber)) return 'senate'
  return null
}

function person(raw) {
  if (!isObj(raw) || typeof raw.bioguideId !== 'string' || !isStr(raw.name) || typeof raw.state !== 'string') return null
  const bioguideId = raw.bioguideId.trim().toUpperCase()
  const state = raw.state.trim().toUpperCase()
  if (!BIOGUIDE.test(bioguideId) || !STATE.test(state)) return null
  const d = raw.district
  if (!(d === null || d === undefined || isCount(d))) return null
  return {
    bioguideId,
    name: squash(raw.name),
    party: PARTIES.has(raw.party) ? raw.party : null,
    state,
    district: d ?? null,
  }
}

function bill(raw) {
  if (!isObj(raw) || !isStr(raw.billNumber)) return null
  const billNumber = squash(raw.billNumber)
  const chamber = chamberFromNumber(billNumber)
  // The chamber field, the bill number and the official URL must all agree.
  if (!chamber || (raw.chamber !== undefined && raw.chamber !== chamber)) return null
  const congressGovUrl = officialUrl(raw.congressGovUrl, (h, path) =>
    isCongressGov(h) && path.replace(/\/+$/, '') === `/bill/${ordinal(raw.congress)}-congress/${CHAMBER_PATH[chamber]}/${billNumber.match(/\d+$/)[0]}`)
  const sponsor = person(raw.sponsor)
  const action = raw.latestAction
  const totals = raw.totals
  const complete = raw.complete !== false
  if (
    !Number.isInteger(raw.congress) || raw.congress < 100 ||
    typeof raw.current !== 'boolean' ||
    !sponsor ||
    !isDateOnly(raw.introducedDate) ||
    !isObj(action) || !isDateOnly(action.actionDate) || !isStr(action.text) ||
    !congressGovUrl ||
    // The tracker publishes `complete: false` (empty list, zero totals, no checkedAt) when
    // the last fetch did not return the whole list. That bill keeps its official facts but
    // shows no counts, sign-ons or lookup.
    (complete && !isInstant(raw.checkedAt)) ||
    !Array.isArray(raw.cosponsors) ||
    !isObj(totals) || !isCount(totals.cosponsors) || !isCount(totals.original) || !isCount(totals.nonVoting)
  ) return null

  const checkedDate = complete ? etDate(raw.checkedAt) : null
  // Chronology: nothing happens before introduction or after the check that recorded it.
  if (action.actionDate < raw.introducedDate || (checkedDate && action.actionDate > checkedDate)) return null

  const cosponsors = []
  for (const c of raw.cosponsors) {
    const p = person(c)
    if (!p || !isDateOnly(c.sponsorshipDate) || typeof c.isOriginalCosponsor !== 'boolean') return null
    if (p.bioguideId === sponsor.bioguideId) return null // the sponsor is never a cosponsor
    if (c.sponsorshipDate < raw.introducedDate || (checkedDate && c.sponsorshipDate > checkedDate)) return null
    cosponsors.push({ ...p, sponsorshipDate: c.sponsorshipDate, isOriginalCosponsor: c.isOriginalCosponsor })
  }
  if (!complete && (cosponsors.length > 0 || totals.cosponsors > 0)) return null

  // Every published total must equal what the list itself says, or neither is trusted.
  const nonVoting = chamber === 'house' ? cosponsors.filter((c) => NON_VOTING.has(c.state)).length : 0
  if (
    cosponsors.length !== totals.cosponsors ||
    cosponsors.length > CHAMBER_MAX[chamber] ||
    new Set(cosponsors.map((c) => c.bioguideId)).size !== cosponsors.length ||
    cosponsors.filter((c) => c.isOriginalCosponsor).length !== totals.original ||
    nonVoting !== totals.nonVoting
  ) return null

  return {
    chamber,
    complete,
    congress: raw.congress,
    billNumber,
    current: raw.current,
    sponsor,
    introducedDate: raw.introducedDate,
    latestAction: { actionDate: action.actionDate, text: squash(action.text) },
    congressGovUrl,
    checkedAt: complete ? raw.checkedAt : null,
    cosponsors,
    totals: { cosponsors: totals.cosponsors, original: totals.original, nonVoting },
  }
}

/** Returns { house, senate } (either may be null) or null if the file is unusable. */
export function parseCosponsors(json) {
  const list = Array.isArray(json?.bills) ? json.bills : null
  if (!list) return null
  const out = { house: null, senate: null }
  for (const raw of list) {
    const b = bill(raw)
    if (!b) return null
    if (out[b.chamber]) return null // two bills claiming one chamber: ambiguous
    out[b.chamber] = b
  }
  return out.house || out.senate ? out : null
}

/**
 * Returns { congress, members } or null. `expectedCongress` is the Congress named in the
 * file's URL; the file must say the same, and its published counts must match its rows.
 */
export function parseMembers(json, expectedCongress) {
  if (!isObj(json) || json.congress !== expectedCongress || !Array.isArray(json.members) || !isInstant(json.generatedAt)) return null
  const members = []
  const seen = new Set()
  for (const raw of json.members) {
    const p = person(raw)
    if (!p || (raw.chamber !== 'house' && raw.chamber !== 'senate') || typeof raw.votingMember !== 'boolean') return null
    // Seat and voting status must agree: senators and state House seats vote, the six
    // territorial/district seats do not.
    const shouldVote = raw.chamber === 'senate' || !NON_VOTING.has(p.state)
    if (raw.votingMember !== shouldVote || (raw.chamber === 'senate' && NON_VOTING.has(p.state))) return null
    if (seen.has(p.bioguideId)) return null
    seen.add(p.bioguideId)
    members.push({
      ...p,
      chamber: raw.chamber,
      votingMember: raw.votingMember,
      officialWebsiteUrl: officialUrl(raw.officialWebsiteUrl, isMemberSite, true),
    })
  }
  const count = (fn) => members.filter(fn).length
  const actual = {
    house: count((m) => m.chamber === 'house'),
    senate: count((m) => m.chamber === 'senate'),
    houseVoting: count((m) => m.chamber === 'house' && m.votingMember),
    houseNonVoting: count((m) => m.chamber === 'house' && !m.votingMember),
  }
  const c = json.counts
  if (!isObj(c) || Object.keys(actual).some((k) => c[k] !== actual[k])) return null
  if (actual.house === 0 || actual.senate === 0 || actual.house > CHAMBER_MAX.house || actual.senate > CHAMBER_MAX.senate) return null
  return { congress: expectedCongress, generatedAt: json.generatedAt, members }
}

function historyBill(raw, chamber) {
  if (raw === null || raw === undefined) return null
  if (!isObj(raw) || !isStr(raw.billNumber) || !isCount(raw.cosponsors)) return undefined
  const billNumber = squash(raw.billNumber)
  if (chamberFromNumber(billNumber) !== chamber || raw.cosponsors > CHAMBER_MAX[chamber]) return undefined
  return { billNumber, cosponsors: raw.cosponsors, url: officialUrl(raw.url, isGovInfo) }
}

/** Returns an array of rows ordered by Congress, or null. */
export function parseHistory(json) {
  const rows = Array.isArray(json?.congresses) ? json.congresses : null
  if (!rows || rows.length === 0) return null
  const out = []
  const seen = new Set()
  for (const raw of rows) {
    if (!isObj(raw) || !Number.isInteger(raw.congress) || !Number.isInteger(raw.startYear) || seen.has(raw.congress)) return null
    seen.add(raw.congress)
    const house = historyBill(raw.house, 'house')
    const senate = historyBill(raw.senate, 'senate')
    if (house === undefined || senate === undefined || (!house && !senate)) return null
    const fa = raw.furthestAction
    let furthestAction = null
    if (fa !== null && fa !== undefined) {
      if (!isObj(fa) || !isStr(fa.text) || (fa.date != null && !isDateOnly(fa.date))) return null
      furthestAction = { text: squash(fa.text), date: fa.date ?? null }
    }
    out.push({
      congress: raw.congress,
      startYear: raw.startYear,
      endYear: Number.isInteger(raw.endYear) ? raw.endYear : null,
      // Only an explicit `final: false` marks a snapshot the live file may update.
      final: raw.final !== false,
      house,
      senate,
      furthestAction,
    })
  }
  return out.sort((a, b) => a.congress - b.congress)
}

// ---- Derivations -------------------------------------------------------------------

export function ordinal(n) {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  return `${n}${{ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th'}`
}

/** Courtesy title from chamber and seat (validated: seat and voting status agree). */
export function memberTitle(chamber, state) {
  if (chamber === 'senate') return 'Sen.'
  if (!NON_VOTING.has(state)) return 'Rep.'
  return state === 'PR' ? 'Res. Comm.' : 'Del.'
}

export function seatLabel(chamber, state, dist) {
  return chamber === 'house' && dist ? `${state}-${dist}` : state
}

/** "January 3, 2025" from a validated YYYY-MM-DD, pinned to UTC so it never shifts a day. */
export function formatDate(dateOnly, month = 'long') {
  return new Date(`${dateOnly}T00:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC', month, day: 'numeric', year: 'numeric',
  })
}

/**
 * Cosponsors who signed on in the current Eastern calendar month (`now`), across the bills
 * shown, plus the latest sponsorship date overall for the empty state. Null (section
 * hidden) when any shown bill's last successful check is more than two days old.
 */
export function signedThisMonth(bills, now = new Date()) {
  const shown = bills.filter((b) => b && b.complete)
  if (shown.length === 0) return null
  // Every chamber shown must have been checked recently, or "since <date>" overreaches.
  if (shown.some((b) => now - Date.parse(b.checkedAt) > CHECK_MAX_AGE_MS)) return null
  const month = etDate(now).slice(0, 7)
  const rows = []
  let latestDate = null
  for (const b of shown) {
    for (const c of b.cosponsors) {
      if (!latestDate || c.sponsorshipDate > latestDate) latestDate = c.sponsorshipDate
      if (c.sponsorshipDate.slice(0, 7) === month) rows.push({ ...c, chamber: b.chamber, billNumber: b.billNumber })
    }
  }
  rows.sort((a, b) => b.sponsorshipDate.localeCompare(a.sponsorshipDate) || a.name.localeCompare(b.name))
  return { rows, latestDate }
}

/**
 * Every current member of the chamber with their status on this bill, joined by Bioguide
 * ID: the sponsor, a cosponsor (with date), or not yet. Members who cosponsored and have
 * since left are absent from the roster, so they count in the recorded total but not
 * here. Returns null if the two files disagree about who someone is (same ID, different
 * state), since a wrong "Not yet" is worse than no list.
 */
export function memberStatuses(roster, bill, now = new Date()) {
  if (!roster || roster.congress !== bill.congress) return null
  if (now - Date.parse(roster.generatedAt) > ROSTER_MAX_AGE_MS) return null
  const members = roster.members.filter((m) => m.chamber === bill.chamber)
  const byId = new Map(members.map((m) => [m.bioguideId, m]))
  // Same ID must mean the same seat (state and, in the House, district; at-large is 0).
  for (const p of [bill.sponsor, ...bill.cosponsors]) {
    const m = byId.get(p.bioguideId)
    if (m && (m.state !== p.state || (bill.chamber === 'house' && (m.district ?? 0) !== (p.district ?? 0)))) return null
  }
  const signed = new Map(bill.cosponsors.map((c) => [c.bioguideId, c.sponsorshipDate]))
  return members
    .map((m) => {
      if (m.bioguideId === bill.sponsor.bioguideId) return { ...m, status: 'sponsor', date: null }
      if (signed.has(m.bioguideId)) return { ...m, status: 'signed', date: signed.get(m.bioguideId) }
      return { ...m, status: 'not-yet', date: null }
    })
    .sort((a, b) => a.state.localeCompare(b.state) || (a.district ?? 0) - (b.district ?? 0) || a.name.localeCompare(b.name))
}

/**
 * History rows. A row the tracker marks provisional (`final: false`) takes its count from
 * the live cosponsor file when that file holds the same bill as the current, complete one,
 * so the table and the headline never disagree. Final rows are never overwritten.
 */
export function historyWithLive(history, house, senate) {
  return history.map((row) => {
    if (row.final) return row
    const live = (b, side) => (b && b.current && b.complete && side && b.congress === row.congress && b.billNumber === side.billNumber
      ? { ...side, cosponsors: b.totals.cosponsors }
      : side)
    return { ...row, house: live(house, row.house), senate: live(senate, row.senate) }
  })
}
