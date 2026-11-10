import { useEffect, useState } from 'react'
import { STATS_BASE_URL } from '../utils/statsBaseUrl'
import { parseCosponsors, parseMembers, parseHistory } from '../data/statehoodBill'

// The three tracker files behind /statehood-bill. Each loads and validates on its own, so
// a missing roster hides only the lookup, not the counts. No fallback values: a section
// renders nothing until its file arrives and passes validation (useBillStats rule).
const FILES = {
  cosponsors: { path: '/api/statehood-cosponsors.json', parse: parseCosponsors },
  members: { path: '/api/members-119.json', parse: parseMembers },
  history: { path: '/api/statehood-bill-history.json', parse: parseHistory },
}

const initial = Object.fromEntries(Object.keys(FILES).map((k) => [k, { data: null, status: 'loading' }]))

async function loadRaw(key) {
  // Dev-only fixtures (VITE_STATEHOOD_FIXTURES=1, or =transition for the Senate row's
  // switchover state). `import.meta.env.DEV` is a build-time false in production, so this
  // branch and the fixture module are dropped from the production bundle entirely.
  if (import.meta.env.DEV && import.meta.env.VITE_STATEHOOD_FIXTURES) {
    const { fixture } = await import('../fixtures/statehoodBill.js')
    return fixture(key, import.meta.env.VITE_STATEHOOD_FIXTURES)
  }
  const response = await fetch(`${STATS_BASE_URL}${FILES[key].path}`)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

export function useStatehoodBillData() {
  const [state, setState] = useState(initial)

  useEffect(() => {
    let cancelled = false
    for (const key of Object.keys(FILES)) {
      loadRaw(key)
        .then((raw) => {
          const data = FILES[key].parse(raw)
          if (!data) throw new Error('failed validation')
          if (!cancelled) setState((s) => ({ ...s, [key]: { data, status: 'ready' } }))
        })
        .catch((error) => {
          console.warn(`statehood-bill: ${FILES[key].path} unavailable (${error.message})`)
          if (!cancelled) setState((s) => ({ ...s, [key]: { data: null, status: 'error' } }))
        })
    }
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
