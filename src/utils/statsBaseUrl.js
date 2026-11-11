// Where the bill tracker publishes its data files. Production by default; set
// VITE_STATS_BASE_URL (e.g. in .env.local) to read a local tracker build instead.
export const STATS_BASE_URL = (import.meta.env.VITE_STATS_BASE_URL || 'https://billtracker.representdc.org').replace(/\/+$/, '')
