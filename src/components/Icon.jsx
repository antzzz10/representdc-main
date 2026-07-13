import * as icons from 'lucide-react'

/**
 * Renders a Lucide icon by kebab-case name (matches the design system's
 * naming, e.g. "arrow-right"). Single source for icon rendering so no
 * component reaches for an emoji or unicode glyph instead.
 */
function toPascalCase(name) {
  return name.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('')
}

function Icon({ name, size = 20, className = '' }) {
  const Component = icons[toPascalCase(name)]
  if (!Component) return null
  return <Component size={size} className={`icon ${className}`} aria-hidden="true" />
}

export default Icon
