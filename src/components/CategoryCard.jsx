import { useState } from 'react'
import './CategoryCard.css'

/**
 * Expandable category card showing anti-DC congressional actions
 * Displays summary, then expands to show specific bill examples with status
 */
function CategoryCard({ category }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusClass = (status) => {
    switch (status) {
      case 'passed-law':
        return 'status-passed-law'
      case 'enacted':
        return 'status-enacted'
      case 'passed-house':
      case 'passed-senate':
        return 'status-passed-chamber'
      case 'passed-committee':
        return 'status-passed-committee'
      case 'pending':
        return 'status-pending'
      default:
        return 'status-pending'
    }
  }

  // Count bills by status for summary
  const statusCounts = category.examples.reduce((acc, bill) => {
    const key = bill.status === 'passed-law' || bill.status === 'enacted' ? 'enacted' : 'pending'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

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
        <div className="category-header-actions">
          <div className="status-counts">
            {statusCounts.enacted > 0 && (
              <span className="status-count enacted-count" title="Passed into law or enacted">
                {statusCounts.enacted} Enacted
              </span>
            )}
            {statusCounts.pending > 0 && (
              <span className="status-count pending-count" title="Pending in Congress">
                {statusCounts.pending} Pending
              </span>
            )}
          </div>
          <button className="expand-button" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
            {isExpanded ? '−' : '+'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="category-card-content">
          <div className="examples-header">
            <h4>Recent Congressional Actions:</h4>
          </div>
          <div className="examples-list">
            {category.examples.map((bill, index) => (
              <div key={index} className="bill-example">
                <div className="bill-header">
                  <div className="bill-number-title">
                    <span className="bill-number">{bill.number}</span>
                    <span className={`bill-status ${getStatusClass(bill.status)}`}>
                      {bill.statusLabel}
                    </span>
                  </div>
                  <a
                    href={bill.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bill-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Details →
                  </a>
                </div>
                <h5 className="bill-name">{bill.name}</h5>
                <p className="bill-description">{bill.description}</p>
                <p className="bill-impact">
                  <strong>Impact:</strong> {bill.impact}
                </p>
              </div>
            ))}
          </div>
          <div className="category-footer">
            <a
              href={`https://billtracker.representdc.org?category=${category.billTrackerCategory}`}
              className="view-all-link"
              onClick={(e) => e.stopPropagation()}
            >
              See all {category.title.toLowerCase()} bills in tracker →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryCard
