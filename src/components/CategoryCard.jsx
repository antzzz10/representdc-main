import { useState } from 'react'
import './CategoryCard.css'
import TalkingPoints from './TalkingPoints'
import Icon from './Icon'
import { talkingPoints } from '../data/talkingPoints'

/**
 * Expandable category card showing historical patterns of anti-DC congressional actions
 * Displays summary, then expands to reveal detailed narrative
 */
function CategoryCard({ category }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const categoryTalkingPoints = talkingPoints[category.billTrackerCategory]

  return (
    <div className={`category-card ${isExpanded ? 'expanded' : ''}`}>
      <div
        className="category-card-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="category-header-content">
          <span className="category-icon"><Icon name={category.icon} size={24} /></span>
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
          <Icon name={isExpanded ? 'minus' : 'plus'} size={18} />
        </button>
      </div>

      {isExpanded && (
        <div className="category-card-content">
          <div className="category-description">
            {category.description.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {categoryTalkingPoints && (
            <TalkingPoints
              categoryId={category.billTrackerCategory}
              talkingPoints={categoryTalkingPoints}
            />
          )}

          <div className="category-footer">
            <a
              href={`https://billtracker.representdc.org?category=${category.billTrackerCategory}`}
              className="view-all-link"
              onClick={(e) => e.stopPropagation()}
            >
              See all current {category.title.toLowerCase()} bills in tracker <Icon name="arrow-right" size={15} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryCard
