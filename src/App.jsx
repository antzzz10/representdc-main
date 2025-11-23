import './App.css'
import { useBillStats } from './hooks/useBillStats'
import CategoryCard from './components/CategoryCard'
import { categoryDetails } from './data/categoryDetails'

function App() {
  const { totalBills, pendingBills, passedBills, lastUpdated } = useBillStats()

  return (
    <div className="app">
      {/* Hero Section - Loss Framing with Urgency */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">Breaking</div>
          <h1 className="hero-title">
            Congress Is Blocking D.C. Laws <span className="highlight">Right Now</span>
          </h1>
          <p className="hero-subtitle">
            {totalBills} bills pending in Congress to overturn local D.C. decisions—from policing to healthcare to traffic laws
          </p>
          <a href="https://billtracker.representdc.org" className="cta-primary">
            See All {totalBills} Bills →
          </a>
          <p className="hero-note">
            Updated {new Date(lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {passedBills > 0 && ` • ${passedBills} bill${passedBills === 1 ? '' : 's'} just passed the House`}
          </p>
        </div>
      </section>

      {/* Problem Statement - Concrete Facts */}
      <section className="facts-section">
        <div className="container">
          <h2 className="section-title">The Reality for 700,000 Americans</h2>
          <div className="facts-grid">
            <div className="fact-card">
              <div className="fact-number">0</div>
              <div className="fact-label">Senators representing D.C. residents</div>
              <div className="fact-detail">Despite paying more federal taxes per capita than any state</div>
            </div>
            <div className="fact-card">
              <div className="fact-number">0</div>
              <div className="fact-label">Voting members of Congress</div>
              <div className="fact-detail">D.C.'s delegate can introduce bills but cannot vote on final passage</div>
            </div>
            <div className="fact-card highlight-card">
              <div className="fact-number">{totalBills}</div>
              <div className="fact-label">Bills to block local D.C. laws</div>
              <div className="fact-detail">Pending in the current Congress—and counting</div>
            </div>
          </div>
        </div>
      </section>

      {/* Loss Framing - What's Being Taken Away */}
      <section className="impact-section">
        <div className="container">
          <h2 className="section-title">What Congress Has Blocked</h2>
          <p className="section-intro">
            These aren't hypothetical. Congress has used its power to overturn laws passed by D.C. residents.
            Click each category to see specific examples:
          </p>
          <div className="categories-list">
            {categoryDetails.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* American Values Framing */}
      <section className="values-section">
        <div className="container">
          <div className="quote-block">
            <div className="quote-icon">"</div>
            <blockquote className="quote-text">
              No taxation without representation
            </blockquote>
            <p className="quote-attribution">
              The rallying cry of the American Revolution—still denied to D.C. residents today
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <h3>Local Control</h3>
              <p>Americans should govern their own communities, not be micromanaged by distant politicians</p>
            </div>
            <div className="value-card">
              <h3>Equal Rights</h3>
              <p>Every American citizen deserves the same democratic representation</p>
            </div>
            <div className="value-card">
              <h3>Accountability</h3>
              <p>D.C. residents can't vote out the members of Congress who control their laws</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Pattern - Getting Worse Narrative */}
      <section className="trend-section">
        <div className="container">
          <h2 className="section-title">This Isn't New—But It's Accelerating</h2>
          <p className="section-intro">
            Congressional interference in D.C. affairs has grown more aggressive in recent years.
          </p>
          <div className="trend-highlight">
            <div className="trend-stat">
              <span className="trend-number">{totalBills}</span>
              <span className="trend-label">anti-D.C. bills total</span>
            </div>
            <div className="trend-stat">
              <span className="trend-number">{pendingBills}</span>
              <span className="trend-label">bills still pending</span>
            </div>
          </div>
          <a href="https://billtracker.representdc.org" className="cta-secondary">
            Explore the Bill Tracker →
          </a>
        </div>
      </section>

      {/* Solution Section - Soft Introduction */}
      <section className="solution-section">
        <div className="container">
          <h2 className="section-title">The Solution: Full Democracy for D.C.</h2>
          <p className="section-intro">
            D.C. statehood isn't a radical idea—it's about ensuring that all Americans have equal representation.
          </p>

          <div className="solution-points">
            <div className="solution-point">
              <span className="solution-icon">✓</span>
              <div className="solution-content">
                <h3>Two Senators</h3>
                <p>Like every other state, D.C. would elect two senators to represent 700,000 residents</p>
              </div>
            </div>
            <div className="solution-point">
              <span className="solution-icon">✓</span>
              <div className="solution-content">
                <h3>Voting House Member</h3>
                <p>D.C.'s representative could vote on the laws that affect their constituents</p>
              </div>
            </div>
            <div className="solution-point">
              <span className="solution-icon">✓</span>
              <div className="solution-content">
                <h3>Local Control</h3>
                <p>Congress wouldn't be able to overturn laws passed by D.C. voters and their elected officials</p>
              </div>
            </div>
            <div className="solution-point">
              <span className="solution-icon">✓</span>
              <div className="solution-content">
                <h3>Budget Autonomy</h3>
                <p>D.C. could spend its own tax revenue without congressional approval</p>
              </div>
            </div>
          </div>

          <div className="precedent-note">
            <p><strong>Precedent:</strong> The United States has admitted 37 states since the original 13. D.C. has more residents than Wyoming and Vermont.</p>
          </div>
        </div>
      </section>

      {/* Footer with Resources */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p className="footer-statement">
              D.C. statehood is a civil rights issue. These bills undermine the democratic rights of D.C. residents.
            </p>

            <div className="footer-sections">
              <div className="footer-section">
                <h3>Track the Bills</h3>
                <p>
                  <a href="https://billtracker.representdc.org">
                    See all {totalBills} anti-D.C. bills →
                  </a>
                </p>
              </div>
              <div className="footer-section">
                <h3>About This Site</h3>
                <p>
                  This is an independent, volunteer-run project created by a proud DC resident
                  to track anti-DC legislation and advocate for full democracy for D.C. residents.
                  Not affiliated with any organization.
                </p>
              </div>
            </div>

            <p className="footer-copyright">
              Copyright © 2025 Represent DC
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
