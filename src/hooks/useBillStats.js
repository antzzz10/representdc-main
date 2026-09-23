import { useState, useEffect } from 'react'

// Only a true instant is safe to render in a fixed timezone. A date-only value like
// "2026-09-17" parses as UTC midnight and renders a day early in ET — the bug this
// field replaced — and a malformed one would reach the reader as "Invalid Date".
// Anything that isn't a well-formed ISO-8601 timestamp carrying an offset is dropped,
// and the homepage then shows no date at all rather than a wrong one.
const ISO_INSTANT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/

function normalizeCheckedInstant(value) {
  if (typeof value !== 'string') return null
  const match = ISO_INSTANT.exec(value)
  if (!match) return null

  const [, year, month, day, hour, minute, second = '0'] = match.map(Number)
  // Date() silently rolls impossible dates forward — "2026-02-30" becomes March 2 — so
  // the calendar has to be checked before the value is trusted. Day 0 and month 0 are
  // rejected here too; leap years fall out of the UTC round-trip below.
  if (month < 1 || month > 12 || day < 1 || hour > 23 || minute > 59 || second > 59) return null
  const utc = new Date(Date.UTC(year, month - 1, day))
  if (utc.getUTCMonth() !== month - 1 || utc.getUTCDate() !== day) return null

  return Number.isNaN(new Date(value).getTime()) ? null : value
}

/**
 * Fetches bill statistics from the bill tracker API
 * Falls back to hardcoded values if fetch fails
 */
export function useBillStats() {
  const [stats, setStats] = useState({
    totalBills: 74,
    pendingBills: 61,
    passedBills: 13,
    lastUpdated: '2026-01-20',
    // No fallback: a hardcoded "last checked" date would go stale silently. The
    // homepage hides the date until real stats arrive.
    lastChecked: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://billtracker.representdc.org/api/stats.json')
        if (!response.ok) throw new Error('Failed to fetch')

        const data = await response.json()
        setStats({
          totalBills: data.totalBills,
          pendingBills: data.pendingBills,
          passedBills: data.passedBills,
          lastUpdated: data.lastUpdated,
          // Stamped on every successful daily Congress.gov sweep, even when no bill
          // changed; `lastUpdated` only moves when bill data changes. Older stats
          // files predate this field.
          lastChecked: normalizeCheckedInstant(data.lastChecked),
          loading: false,
          error: null
        })
      } catch (error) {
        // Fallback to hardcoded values
        console.warn('Failed to fetch bill stats, using fallback values')
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }))
      }
    }

    fetchStats()
  }, [])

  return stats
}
