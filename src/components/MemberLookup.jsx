import { useId, useMemo, useRef, useState } from 'react'
import { MemberRow } from './MemberRow'
import { memberStatuses, ordinal } from '../data/statehoodBill'

const CHAMBERS = [
  { key: 'house', label: 'House', plural: 'House members' },
  { key: 'senate', label: 'Senate', plural: 'senators' },
]
const FILTERS = [
  { key: 'not-yet', label: 'Not yet signed on' },
  { key: 'signed', label: 'Signed on' },
  { key: 'all', label: 'All' },
]

// The organizer view: every current member, their status on this chamber's bill.
// Tabs follow the WAI-ARIA tabs pattern (arrow keys move between them); filters are a
// native radio group, so they work by keyboard with no extra code.
function MemberLookup({ bills, roster }) {
  const [chamber, setChamber] = useState('house')
  const [filter, setFilter] = useState('not-yet')
  const [stateCode, setStateCode] = useState('')
  const [query, setQuery] = useState('')
  const tabRefs = useRef({})
  const id = useId()

  const bill = bills[chamber]
  // A roster only answers "not yet" for its own Congress, and only while this chamber's
  // bill is the current one.
  const usable = bill && bill.current && bill.complete && (roster.congress === null || roster.congress === bill.congress)

  const all = useMemo(() => (usable ? memberStatuses(roster.members, bill) : []), [usable, roster, bill])
  const states = useMemo(() => [...new Set(all.map((m) => m.state))].sort(), [all])
  const needle = query.trim().toLowerCase()
  const shown = all.filter((m) =>
    (filter === 'all' || m.status === filter || (filter === 'signed' && m.status === 'sponsor')) &&
    (!stateCode || m.state === stateCode) &&
    (!needle || m.name.toLowerCase().includes(needle)))

  const selectTab = (key) => {
    setChamber(key)
    setStateCode('')
    tabRefs.current[key]?.focus()
  }
  const onTabKey = (e) => {
    const i = CHAMBERS.findIndex((c) => c.key === chamber)
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: CHAMBERS.length - 1 }[e.key]
    if (next === undefined) return
    e.preventDefault()
    selectTab(CHAMBERS[(next + CHAMBERS.length) % CHAMBERS.length].key)
  }

  const active = CHAMBERS.find((c) => c.key === chamber)

  return (
    <div className="lookup">
      <div className="lookup-tabs" role="tablist" aria-label="Chamber">
        {CHAMBERS.map((c) => (
          <button
            key={c.key}
            ref={(el) => { tabRefs.current[c.key] = el }}
            type="button"
            role="tab"
            id={`${id}-tab-${c.key}`}
            aria-selected={chamber === c.key}
            aria-controls={`${id}-panel`}
            tabIndex={chamber === c.key ? 0 : -1}
            className="lookup-tab"
            onClick={() => selectTab(c.key)}
            onKeyDown={onTabKey}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${chamber}`} className="lookup-panel">
        {!usable ? (
          bill && !bill.current
            ? <p className="lookup-empty">No confirmed {ordinal(bill.congress + 1)}-Congress bill linked yet.</p>
            : null
        ) : (
          <>
            <div className="lookup-controls">
              <fieldset className="lookup-filters">
                <legend className="sr-only">Show</legend>
                {FILTERS.map((f) => (
                  <label key={f.key} className="filter-chip">
                    <input type="radio" name={`${id}-filter`} value={f.key} checked={filter === f.key} onChange={() => setFilter(f.key)} />
                    <span>{f.label}</span>
                  </label>
                ))}
              </fieldset>
              <label className="lookup-field">
                <span>State</span>
                <select value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
                  <option value="">All states</option>
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="lookup-field">
                <span>Search by name</span>
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
              </label>
            </div>
            <p className="lookup-count" role="status" aria-live="polite">
              Showing {shown.length} of {all.length} {active.plural}.
            </p>
            {shown.length > 0 && (
              <ul className="member-list">
                {shown.map((m) => <MemberRow key={m.bioguideId} member={m} />)}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MemberLookup
