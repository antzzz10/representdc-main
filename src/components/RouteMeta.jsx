import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { metaForPath } from '../data/routeMeta'

// Keeps <title> and the meta description in step with client-side navigation. The
// prerendered HTML already carries the right values for a first load
// (scripts/prerender-routes.mjs); this covers moving between pages without a reload.
function RouteMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const { title, description } = metaForPath(pathname)
    document.title = title
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', description)
  }, [pathname])

  return null
}

export default RouteMeta
