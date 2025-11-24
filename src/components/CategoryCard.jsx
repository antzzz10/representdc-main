import { useState } from 'react'
import './CategoryCard.css'

/**
 * Expandable category card showing historical patterns of anti-DC congressional actions
 * Displays summary, then expands to reveal detailed narrative
 */
function CategoryCard({ category }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`category-card ${isExpanded ? 'expanded' : ''}`}>
      <div
        className="category-card-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="category-header-content">
          <span className="category-icon">{category.icon}</span>
          <div className="category-header-text">
            <h3>{category.title}</h3>
            <p className="category-summary">{category.summary}</p>
          </div>
        </div>
        <button
          className="expand-button"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          aria-expanded={isExpanded}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="category-card-content">
          <div className="category-description">
            {category.description.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="category-footer">
            <a
              href={`https://billtracker.representdc.org?category=${category.billTrackerCategory}`}
              className="view-all-link"
              onClick={(e) => e.stopPropagation()}
            >
              See all current {category.title.toLowerCase()} bills in tracker →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryCard
