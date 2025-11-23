import { useState, useEffect } from 'react'

/**
 * Fetches bill statistics from the bill tracker API
 * Falls back to hardcoded values if fetch fails
 */
export function useBillStats() {
  const [stats, setStats] = useState({
    totalBills: 71,
    pendingBills: 69,
    passedBills: 2,
    lastUpdated: '2025-11-22',
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
