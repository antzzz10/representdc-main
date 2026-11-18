import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageview } from '../lib/analytics'

// The site is a single-page app, so a page view is recorded by hand each time the
// router moves to a new path. Renders nothing.
function TrackPageviews() {
  const { pathname } = useLocation()

  useEffect(() => {
    trackPageview(pathname)
  }, [pathname])

  return null
}

export default TrackPageviews
