import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// BrowserRouter doesn't reset scroll position on navigation the way a real
// page load does — without this, clicking a link while scrolled down lands
// you at the same pixel offset on the new page instead of the top.
function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        // A reader who has asked for less motion gets an immediate jump.
        const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        el.scrollIntoView({ behavior: still ? 'auto' : 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [location])

  return null
}

export default ScrollToTop
