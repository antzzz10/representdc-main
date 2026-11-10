// DEV-ONLY FIXTURES for /statehood-bill. Loaded only through the `import.meta.env.DEV`
// branch in useStatehoodBillData, so no production build can reach this file.
//
// Bill-level values are the real 119th-Congress figures (representdc-data archive,
// 2026-11-08; tracker check 2026-11-09): H.R. 51, 209 cosponsors incl. 2 non-voting, 159
// original, introduced 2025-01-03; S. 51, 43 cosponsors, 40 original, introduced
// 2025-01-09; end-of-Congress history 115th–119th.
//
// Every MEMBER row (cosponsors and roster) is deliberately fake: names are "Fixture
// member …", Bioguide IDs are Z100001 and up (real Z IDs are Z000…), websites are
// fixture-member-*.house.gov / .senate.gov hosts that do not exist. They exist to exercise
// the counts, the join and the filters, never to look like real people.

const STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
  'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH',
  'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
const PARTIES = ['D', 'R', 'R', 'D', 'I']
const pad = (n) => String(n).padStart(3, '0')
const HOUSE_SPONSOR = 'Z800001'
const SENATE_SPONSOR = 'Z800002'

function roster() {
  const members = []
  const districtCount = {}
  for (let i = 1; i <= 435; i++) {
    const state = STATES[(i - 1) % STATES.length]
    districtCount[state] = (districtCount[state] ?? 0) + 1
    members.push({
      bioguideId: `Z${100000 + i}`, name: `Fixture member H${pad(i)}`, party: PARTIES[i % PARTIES.length],
      state, district: districtCount[state], chamber: 'house', votingMember: true,
      officialWebsiteUrl: `https://fixture-member-h${pad(i)}.house.gov`,
    })
  }
  ;['DC', 'PR', 'VI', 'GU', 'AS', 'MP'].forEach((state, j) => members.push({
    bioguideId: state === 'DC' ? HOUSE_SPONSOR : `Z${200000 + j}`, name: `Fixture member ${state} non-voting`,
    party: 'D', state, district: null, chamber: 'house', votingMember: false,
    officialWebsiteUrl: j === 3 ? null : `https://fixture-member-${state.toLowerCase()}.house.gov`,
  }))
  for (let i = 1; i <= 100; i++) {
    members.push({
      bioguideId: i === 1 ? SENATE_SPONSOR : `Z${300000 + i}`, name: `Fixture member S${pad(i)}`,
      party: PARTIES[i % PARTIES.length], state: STATES[(i - 1) % STATES.length], district: null,
      chamber: 'senate', votingMember: true, officialWebsiteUrl: `https://fixture-member-s${pad(i)}.senate.gov`,
    })
  }
  return members
}

// Spread n later sponsorship dates between `from` and the real latest date `to`.
function laterDates(n, from, to) {
  const a = Date.parse(`${from}T00:00:00Z`)
  const b = Date.parse(`${to}T00:00:00Z`)
  return Array.from({ length: n }, (_, k) =>
    new Date(n === 1 ? b : a + ((b - a) * (k + 1)) / n).toISOString().slice(0, 10))
}

function cosponsorsFrom(members, { count, original, introduced, latest, nonVoting = [] }) {
  const pool = [
    ...members.filter((m) => nonVoting.includes(m.state)),
    ...members.filter((m) => m.votingMember && m.bioguideId !== HOUSE_SPONSOR && m.bioguideId !== SENATE_SPONSOR),
  ].slice(0, count)
  const later = laterDates(count - original, '2025-02-01', latest)
  return pool.map((m, k) => ({
    bioguideId: m.bioguideId, name: m.name, party: m.party, state: m.state, district: m.district,
    sponsorshipDate: k < original ? introduced : later[k - original], isOriginalCosponsor: k < original,
  }))
}

const CHECKED_AT = '2026-11-09T18:10:00Z'

function bills(scenario) {
  const members = roster()
  const house = members.filter((m) => m.chamber === 'house')
  const senate = members.filter((m) => m.chamber === 'senate')
  return {
    generatedAt: CHECKED_AT,
    bills: [
      {
        chamber: 'house', congress: 119, billNumber: 'H.R. 51', current: true,
        sponsor: { bioguideId: HOUSE_SPONSOR, name: 'Fixture member DC non-voting', party: 'D', state: 'DC', district: null },
        introducedDate: '2025-01-03',
        latestAction: { actionDate: '2025-01-03', text: 'Referred to the Committee on Oversight and Government Reform.' },
        congressGovUrl: 'https://www.congress.gov/bill/119th-congress/house-bill/51',
        checkedAt: CHECKED_AT,
        cosponsors: cosponsorsFrom(house, { count: 209, original: 159, introduced: '2025-01-03', latest: '2026-10-09', nonVoting: ['PR', 'VI'] }),
        totals: { cosponsors: 209, original: 159, nonVoting: 2 },
      },
      {
        chamber: 'senate', congress: 119, billNumber: 'S. 51', current: scenario !== 'transition',
        sponsor: { bioguideId: SENATE_SPONSOR, name: 'Fixture member S001', party: 'D', state: 'AL', district: null },
        introducedDate: '2025-01-09',
        latestAction: { actionDate: '2025-01-09', text: 'Read twice and referred to the Committee on Homeland Security and Governmental Affairs.' },
        congressGovUrl: 'https://www.congress.gov/bill/119th-congress/senate-bill/51',
        checkedAt: CHECKED_AT,
        cosponsors: cosponsorsFrom(senate, { count: 43, original: 40, introduced: '2025-01-09', latest: '2025-04-29' }),
        totals: { cosponsors: 43, original: 40, nonVoting: 0 },
      },
    ],
  }
}

const govinfo = (c, type, n) => `https://www.govinfo.gov/bulkdata/BILLSTATUS/${c}/${type}/BILLSTATUS-${c}${type}${n}.xml`

const HISTORY = {
  generatedAt: CHECKED_AT,
  congresses: [
    { congress: 115, startYear: 2017, endYear: 2019, house: { billNumber: 'H.R. 1291', cosponsors: 181, url: govinfo(115, 'hr', 1291) }, senate: { billNumber: 'S. 1278', cosponsors: 30, url: govinfo(115, 's', 1278) }, furthestAction: null },
    { congress: 116, startYear: 2019, endYear: 2021, house: { billNumber: 'H.R. 51', cosponsors: 227, url: govinfo(116, 'hr', 51) }, senate: { billNumber: 'S. 631', cosponsors: 42, url: govinfo(116, 's', 631) }, furthestAction: { text: 'Passed House', date: '2020-06-26' } },
    { congress: 117, startYear: 2021, endYear: 2023, house: { billNumber: 'H.R. 51', cosponsors: 216, url: govinfo(117, 'hr', 51) }, senate: { billNumber: 'S. 51', cosponsors: 45, url: govinfo(117, 's', 51) }, furthestAction: { text: 'Passed House', date: '2021-04-22' } },
    { congress: 118, startYear: 2023, endYear: 2025, house: { billNumber: 'H.R. 51', cosponsors: 211, url: govinfo(118, 'hr', 51) }, senate: { billNumber: 'S. 51', cosponsors: 46, url: govinfo(118, 's', 51) }, furthestAction: null },
    { congress: 119, startYear: 2025, endYear: null, final: false, house: { billNumber: 'H.R. 51', cosponsors: 209 }, senate: { billNumber: 'S. 51', cosponsors: 43 }, furthestAction: null },
  ],
}

export function fixture(key, scenario) {
  if (key === 'statehood-cosponsors') return bills(scenario)
  if (key === 'members-119') {
    const members = roster()
    const n = (fn) => members.filter(fn).length
    const counts = {
      house: n((m) => m.chamber === 'house'), senate: n((m) => m.chamber === 'senate'),
      houseVoting: n((m) => m.chamber === 'house' && m.votingMember), houseNonVoting: n((m) => m.chamber === 'house' && !m.votingMember),
    }
    return { congress: 119, generatedAt: CHECKED_AT, counts, members }
  }
  if (key === 'statehood-bill-history') return structuredClone(HISTORY)
  throw new Error(`no fixture for ${key}`)
}
