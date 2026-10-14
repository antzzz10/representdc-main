// Matches the bill tracker's freshness line ("September 21, 2026 at 2:59 PM ET"): Eastern
// Time for a DC audience. Callers must pass a validated ISO instant — that is what makes
// pinning a timezone safe. Shared by the homepage (bill sweep) and /news (feed check).
export const formatCheckedInstant = (isoInstant) =>
  `${new Date(isoInstant).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })} ET`
