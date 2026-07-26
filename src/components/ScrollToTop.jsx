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
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [location])

  return null
}

export default ScrollToTop
