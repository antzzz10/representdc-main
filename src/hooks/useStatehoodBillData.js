import { useEffect, useState } from 'react'
import { STATS_BASE_URL } from '../utils/statsBaseUrl'
import { parseCosponsors, parseMembers, parseHistory } from '../data/statehoodBill'

// The tracker files behind /statehood-bill. Each loads and validates on its own, so a
// missing roster hides only the lookup, not the counts. No fallback values: a section
// renders nothing until its file arrives and passes validation (useBillStats rule).
//
// Rosters are per Congress (members-119.json, members-120.json, ...) and are fetched for
// the Congress of each chamber's current bill, so the House and Senate can switch to the
// 120th independently.

async function loadRaw(name) {
  // Dev-only fixtures (VITE_STATEHOOD_FIXTURES=1, or =transition for the Senate row's
  // switchover state). `import.meta.env.DEV` is a build-time false in production, so this
  // branch and the fixture module are dropped from the production bundle entirely.
  if (import.meta.env.DEV && import.meta.env.VITE_STATEHOOD_FIXTURES) {
    const { fixture } = await import('../fixtures/statehoodBill.js')
    return fixture(name, import.meta.env.VITE_STATEHOOD_FIXTURES)
  }
  const response = await fetch(`${STATS_BASE_URL}/api/${name}.json`)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

async function load(name, parse) {
  try {
    const data = parse(await loadRaw(name))
    if (!data) throw new Error('failed validation')
    return { data, status: 'ready' }
  } catch (error) {
    console.warn(`statehood-bill: /api/${name}.json unavailable (${error.message})`)
    return { data: null, status: 'error' }
  }
}

const LOADING = { data: null, status: 'loading' }

export function useStatehoodBillData() {
  const [cosponsors, setCosponsors] = useState(LOADING)
  const [history, setHistory] = useState(LOADING)
  // Keyed by Congress number: { 119: { data, status } }.
  const [rosters, setRosters] = useState({})

  useEffect(() => {
    let cancelled = false
    load('statehood-cosponsors', parseCosponsors).then((r) => !cancelled && setCosponsors(r))
    load('statehood-bill-history', parseHistory).then((r) => !cancelled && setHistory(r))
    return () => {
      cancelled = true
    }
  }, [])

  const bills = cosponsors.data
  const wanted = bills
    ? [...new Set([bills.house, bills.senate].filter((b) => b && b.current && b.complete).map((b) => b.congress))].join(',')
    : ''

  useEffect(() => {
    if (!wanted) return undefined
    let cancelled = false
    for (const congress of wanted.split(',').map(Number)) {
      load(`members-${congress}`, (raw) => parseMembers(raw, congress))
        .then((r) => !cancelled && setRosters((s) => ({ ...s, [congress]: r })))
    }
    return () => {
      cancelled = true
    }
  }, [wanted])

  return { cosponsors, history, rosters }
}
