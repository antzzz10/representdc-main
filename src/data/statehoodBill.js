// Validation and derivations for /statehood-bill. Pure functions only, so the page and any
// future check script share one definition of what the tracker files must look like.
// Anything that fails validation is dropped whole: the page shows no number rather than a
// number from a half-understood file (same rule as useBillStats).

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/
const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})$/
const PARTIES = new Set(['R', 'D', 'I'])
// Non-voting House seats. Puerto Rico's member is a Resident Commissioner; the rest are
// Delegates. Used only for the courtesy title, never for a count.
const NON_VOTING = new Set(['DC', 'PR', 'GU', 'VI', 'AS', 'MP'])

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const isStr = (v) => typeof v === 'string' && v.trim() !== ''
const isCount = (v) => Number.isInteger(v) && v >= 0

export function isDateOnly(value) {
  if (typeof value !== 'string') return false
  const m = DATE_ONLY.exec(value)
  if (!m) return false
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const dt = new Date(Date.UTC(y, mo - 1, d))
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d
}

export function isInstant(value) {
  return typeof value === 'string' && ISO_INSTANT.test(value) && !Number.isNaN(Date.parse(value))
}

const isHttpsUrl = (v) => {
  if (typeof v !== 'string') return false
  try {
    return new URL(v).protocol === 'https:'
  } catch {
    return false
  }
}

const district = (v) => (v === null || v === undefined || isCount(v) ? v ?? null : undefined)

function person(raw) {
  if (!isObj(raw) || !isStr(raw.bioguideId) || !isStr(raw.name) || !isStr(raw.state)) return null
  const d = district(raw.district)
  if (d === undefined) return null
  return {
    bioguideId: raw.bioguideId,
    name: raw.name.trim(),
    party: PARTIES.has(raw.party) ? raw.party : null,
    state: raw.state.toUpperCase(),
    district: d,
  }
}

function chamberOf(raw) {
  if (raw.chamber === 'house' || raw.chamber === 'senate') return raw.chamber
  if (typeof raw.billNumber === 'string') {
    if (/^H\.\s?R\./i.test(raw.billNumber)) return 'house'
    if (/^S\./i.test(raw.billNumber)) return 'senate'
  }
  return null
}

function bill(raw) {
  if (!isObj(raw)) return null
  const chamber = chamberOf(raw)
  const sponsor = person(raw.sponsor)
  const action = raw.latestAction
  const totals = raw.totals
  if (
    !chamber ||
    !Number.isInteger(raw.congress) ||
    !isStr(raw.billNumber) ||
    typeof raw.current !== 'boolean' ||
    !sponsor ||
    !isDateOnly(raw.introducedDate) ||
    !isObj(action) || !isDateOnly(action.actionDate) || !isStr(action.text) ||
    !isHttpsUrl(raw.congressGovUrl) ||
    // The tracker publishes `complete: false` (empty list, zero totals, no checkedAt) when
    // the last fetch did not return the whole list. That bill keeps its official facts but
    // shows no counts, sign-ons or lookup.
    (raw.complete !== false && !isInstant(raw.checkedAt)) ||
    !Array.isArray(raw.cosponsors) ||
    !isObj(totals) || !isCount(totals.cosponsors) || !isCount(totals.original) || !isCount(totals.nonVoting)
  ) return null

  const cosponsors = []
  for (const c of raw.cosponsors) {
    const p = person(c)
    if (!p || !isDateOnly(c.sponsorshipDate) || typeof c.isOriginalCosponsor !== 'boolean') return null
    cosponsors.push({ ...p, sponsorshipDate: c.sponsorshipDate, isOriginalCosponsor: c.isOriginalCosponsor })
  }
  // The published total must agree with the list it summarizes, or neither is trusted.
  if (cosponsors.length !== totals.cosponsors) return null
  if (new Set(cosponsors.map((c) => c.bioguideId)).size !== cosponsors.length) return null
  if (cosponsors.filter((c) => c.isOriginalCosponsor).length !== totals.original) return null
  if (totals.nonVoting > totals.cosponsors) return null

  const complete = raw.complete !== false
  if (!complete && (cosponsors.length > 0 || totals.cosponsors > 0)) return null

  return {
    chamber,
    complete,
    congress: raw.congress,
    billNumber: raw.billNumber.trim(),
    current: raw.current,
    sponsor,
    introducedDate: raw.introducedDate,
    latestAction: { actionDate: action.actionDate, text: action.text.trim() },
    congressGovUrl: raw.congressGovUrl,
    checkedAt: complete ? raw.checkedAt : null,
    cosponsors,
    totals: { cosponsors: totals.cosponsors, original: totals.original, nonVoting: totals.nonVoting },
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

/** Returns { congress, members } or null. */
export function parseMembers(json) {
  const rows = Array.isArray(json) ? json : Array.isArray(json?.members) ? json.members : null
  if (!rows || rows.length === 0) return null
  const members = []
  const seen = new Set()
  for (const raw of rows) {
    const p = person(raw)
    if (!p || (raw.chamber !== 'house' && raw.chamber !== 'senate') || typeof raw.votingMember !== 'boolean') return null
    if (seen.has(p.bioguideId)) return null
    seen.add(p.bioguideId)
    members.push({
      ...p,
      chamber: raw.chamber,
      votingMember: raw.votingMember,
      officialWebsiteUrl: isHttpsUrl(raw.officialWebsiteUrl) ? raw.officialWebsiteUrl : null,
    })
  }
  return { congress: Number.isInteger(json?.congress) ? json.congress : null, members }
}

function historyBill(raw) {
  if (raw === null || raw === undefined) return null
  if (!isObj(raw) || !isStr(raw.billNumber) || !isCount(raw.cosponsors)) return undefined
  return { billNumber: raw.billNumber.trim(), cosponsors: raw.cosponsors, url: isHttpsUrl(raw.url) ? raw.url : null }
}

/** Returns an array of rows ordered by Congress, or null. */
export function parseHistory(json) {
  const rows = Array.isArray(json?.congresses) ? json.congresses : null
  if (!rows || rows.length === 0) return null
  const out = []
  for (const raw of rows) {
    if (!isObj(raw) || !Number.isInteger(raw.congress) || !Number.isInteger(raw.startYear)) return null
    const house = historyBill(raw.house)
    const senate = historyBill(raw.senate)
    if (house === undefined || senate === undefined) return null
    const fa = raw.furthestAction
    let furthestAction = null
    if (fa !== null && fa !== undefined) {
      if (!isObj(fa) || !isStr(fa.text) || (fa.date != null && !isDateOnly(fa.date))) return null
      furthestAction = { text: fa.text.trim(), date: fa.date ?? null }
    }
    out.push({
      congress: raw.congress,
      startYear: raw.startYear,
      endYear: Number.isInteger(raw.endYear) ? raw.endYear : null,
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

/** Courtesy title from chamber and seat; Senate and voting House members are unambiguous. */
export function memberTitle(chamber, state, votingMember) {
  if (chamber === 'senate') return 'Sen.'
  const nonVoting = votingMember === undefined ? NON_VOTING.has(state) : !votingMember
  if (!nonVoting) return 'Rep.'
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

const etYearMonth = (instant) => {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit' })
    .formatToParts(new Date(instant))
  const get = (t) => parts.find((p) => p.type === t).value
  return `${get('year')}-${get('month')}`
}

/**
 * Cosponsors who signed on in the calendar month (Eastern) of the most recent check, across
 * the bills shown, plus the latest sponsorship date overall for the empty state.
 */
export function signedThisMonth(bills) {
  const shown = bills.filter((b) => b && b.complete)
  if (shown.length === 0) return null
  const latestCheck = shown.map((b) => b.checkedAt).sort((a, b) => Date.parse(b) - Date.parse(a))[0]
  const month = etYearMonth(latestCheck)
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
 * since left are simply absent from the roster, so they appear in the recorded count but
 * not here.
 */
export function memberStatuses(members, bill) {
  const signed = new Map(bill.cosponsors.map((c) => [c.bioguideId, c.sponsorshipDate]))
  return members
    .filter((m) => m.chamber === bill.chamber)
    .map((m) => {
      if (m.bioguideId === bill.sponsor.bioguideId) return { ...m, status: 'sponsor', date: null }
      if (signed.has(m.bioguideId)) return { ...m, status: 'signed', date: signed.get(m.bioguideId) }
      return { ...m, status: 'not-yet', date: null }
    })
    .sort((a, b) => a.state.localeCompare(b.state) || (a.district ?? 0) - (b.district ?? 0) || a.name.localeCompare(b.name))
}

/**
 * History rows, with the row for the bill's own Congress taking its counts from the live
 * cosponsor file so the table and the headline never disagree.
 */
export function historyWithLive(history, house, senate) {
  return history.map((row) => {
    const live = (b, side) => (b && b.complete && side && b.congress === row.congress && b.billNumber === side.billNumber
      ? { ...side, cosponsors: b.totals.cosponsors }
      : side)
    return { ...row, house: live(house, row.house), senate: live(senate, row.senate) }
  })
}
