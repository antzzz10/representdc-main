import { Link } from 'react-router-dom'
import './App.css'
import { useBillStats } from './hooks/useBillStats'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import { formatCheckedInstant } from './utils/formatCheckedInstant'
import { contextParts, headlineNoun } from './lib/billProgress'
import { track, EVENTS } from './lib/analytics'

// Records which picker card was chosen: one of four fixed labels, nothing else. Handed to
// the browser to send as the page changes, so the link itself is never held up. Covers a
// plain click and a middle click that opens a new tab, like the site-wide link listener.
const pickerClick = (path) => {
  const record = (e) => {
    if (e.type === 'auxclick' && e.button !== 1) return
    track(EVENTS.PICKER_PATH_CHOSEN, { path }, { leaving: true })
  }
  return { onClick: record, onAuxClick: record }
}

function Home() {
  const { totalBills, progress, lastChecked, loading, error } = useBillStats()

  // Counts and the "last checked" date show only once live stats have loaded, so the page
  // never states a placeholder or stale number as current.
  const showBillCount = !loading && !error
  // One headline number everywhere: every tracked anti-DC measure, with the split beneath
  // it as context (Andria, 2026-11-15).
  const context = showBillCount ? contextParts(progress) : []

  return (
    <div className="app">
      <Nav />

      {/* Hero Section - Orientation for four distinct entry points, not one urgency-first funnel */}
      <section className="hero" id="top">
        <div className="container">
          <h1 className="hero-title">
            D.C. has no vote in Congress.
            <br />
            <span className="highlight">Here's what that means for you.</span>
          </h1>
          <a href="#picker" className="cta-primary">
            <span>Find your starting point</span> <Icon name="arrow-down" />
          </a>
        </div>
      </section>

      {/* Problem Statement - Concrete Facts */}
      <section className="facts-section" id="facts">
        <div className="container">
          <h2 className="section-title">The reality for 700,000 Americans</h2>
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
              <div className="fact-number">{showBillCount ? totalBills : '\u00A0'}</div>
              <div className="fact-label">{showBillCount && totalBills === 1 ? 'Threat' : 'Threats'} to D.C. home rule in this Congress</div>
              <div className="fact-detail">
                {context.length > 0 ? context.join(' · ') : 'Bills, resolutions and budget riders'}
              </div>
              {/* Stays mounted with a blank line until stats load, so the card doesn't grow. */}
              <div className="fact-checked">
                {showBillCount && lastChecked ? `Last checked ${formatCheckedInstant(lastChecked)}` : '\u00A0'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Persona picker - segment-specific pathways */}
      <section className="persona-sec" id="picker">
        <div className="container">
          <div className="persona-head">
            <h2>Where do you want to start?</h2>
            <p>
              D.C. residents pay federal taxes but have{' '}
              <span
                className="gloss"
                title="Home rule: the limited local self-government Congress granted D.C. in 1973. Congress can still overturn any D.C. law or budget."
              >
                no vote in Congress
              </span>. Pick the path that fits you, or keep scrolling for the full picture.
            </p>
          </div>
          <div className="persona-grid">
            <Link className="persona-card" to="/how-congress-controls-dc" {...pickerClick('new-to-dc')}>
              <span className="picon"><Icon name="landmark" size={22} /></span>
              <h3>New to D.C.</h3>
              <p>Didn't know D.C. isn't a state? Start with the basics: what home rule means, and why Congress can overturn D.C.'s own laws.</p>
              <span className="plink">Start the explainer <Icon name="arrow-right" size={15} /></span>
            </Link>
            <Link className="persona-card" to="/statehood-curious" {...pickerClick('curious')}>
              <span className="picon"><Icon name="rss" size={22} /></span>
              <h3>Statehood-curious</h3>
              <p>Already know the problem? See the latest coverage and who's organizing for statehood.</p>
              <span className="plink">See what's happening <Icon name="arrow-right" size={15} /></span>
            </Link>
            <Link className="persona-card accent" to="/myths" {...pickerClick('questioning')}>
              <span className="picon"><Icon name="help-circle" size={22} /></span>
              <h3>Statehood-questioning</h3>
              <p>Have doubts or specific objections? Get direct, sourced answers to the most common ones.</p>
              <span className="plink">Read the myths <Icon name="arrow-right" size={15} /></span>
            </Link>
            <Link className="persona-card accent" to="/take-action" {...pickerClick('activist')}>
              <span className="picon"><Icon name="megaphone" size={22} /></span>
              <h3>Statehood activist</h3>
              <p>Already convinced? Get talking points, sourced data, and ways to organize. Built for speed.</p>
              <span className="plink">Open the action hub <Icon name="arrow-right" size={15} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Explainer - the "New to D.C." landing point: what home rule actually means */}
      <section className="explainer-section" id="explainer">
        <div className="container">
          <h2 className="section-title">How Congress controls D.C.</h2>
          <p className="section-intro">
            "Home rule" sounds like self-government. Here's what it actually means, and where it stops.
          </p>
          <div className="explainer-steps">
            <div className="explainer-step">
              <span className="step-num">1</span>
              <div>
                <h3>1973: D.C. gets limited home rule</h3>
                <p>
                  Congress passed the{' '}
                  <a href="https://dccouncil.gov/dc-home-rule/" target="_blank" rel="noopener noreferrer">
                    Home Rule Act
                  </a>
                  , ratified by District voters, letting D.C. elect its own mayor and council with the
                  authority to pass local laws and approve the District's budget.
                </p>
              </div>
            </div>
            <div className="explainer-step">
              <span className="step-num">2</span>
              <div>
                <h3>Congress keeps the final say</h3>
                <p>
                  Every law the D.C. Council passes goes to Congress for review before it can take
                  effect, and Congress retains authority over the District's budget. That standing
                  authority is behind the {showBillCount ? `${totalBills} ${headlineNoun(totalBills)}` : 'threats to D.C. home rule'} in
                  this Congress: bills, resolutions and budget riders aimed at overriding
                  D.C.'s local laws or limiting its self-government.
                </p>
              </div>
            </div>
            <div className="explainer-step">
              <span className="step-num">3</span>
              <div>
                <h3>No vote, no recourse</h3>
                <p>
                  D.C. residents have no senators and no voting House member, so they can't vote out
                  the members of Congress who overturn their laws.
                </p>
              </div>
            </div>
          </div>
          <p className="explainer-next">
            Want the specifics? <Link to="/the-case">See what Congress has blocked</Link>, category by
            category, with sources.
          </p>
        </div>
      </section>

      {/* American Values Framing */}
      <section className="values-section">
        <div className="container">
          <div className="quote-block">
            <Icon name="quote" size={56} className="quote-icon" />
            <blockquote className="quote-text">
              No taxation without representation
            </blockquote>
            <p className="quote-attribution">
              The rallying cry of the American Revolution, still denied to D.C. residents today
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <h3>Self-governance</h3>
              <p>Americans should govern their own communities, not be micromanaged by distant politicians</p>
            </div>
            <div className="value-card">
              <h3>Equal rights</h3>
              <p>Every American citizen deserves the same democratic representation</p>
            </div>
            <div className="value-card">
              <h3>Accountability</h3>
              <p>D.C. residents can't vote out the members of Congress who control their laws</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Pattern - the headline count and how far the measures have got */}
      <section className="trend-section">
        <div className="container">
          <h2 className="section-title">Threats to D.C. home rule in this Congress</h2>
          <div className="trend-highlight">
            <div className="trend-stat">
              <span className="trend-number">{showBillCount ? totalBills : '\u00A0'}</span>
              <span className="trend-label">
                {showBillCount && totalBills === 1 ? 'bill, resolution or budget rider' : 'bills, resolutions and budget riders'}
              </span>
            </div>
          </div>
          {context.length > 0 && <p className="trend-context">{context.join(' · ')}</p>}
          <a href="https://billtracker.representdc.org" className="cta-secondary">
            <span>Explore the bill tracker</span> <Icon name="arrow-right" />
          </a>
        </div>
      </section>

      {/* Solution Section - Soft Introduction */}
      <section className="solution-section" id="solution">
        <div className="container">
          <h2 className="section-title">The solution: full democracy for D.C.</h2>
          <p className="section-intro">
            D.C. statehood isn't a radical idea. It's about ensuring that all Americans have equal representation.
          </p>

          <div className="solution-points">
            <div className="solution-point">
              <span className="solution-icon"><Icon name="check" /></span>
              <div className="solution-content">
                <h3>Two senators</h3>
                <p>Like every other state, D.C. would elect two senators to represent 700,000 residents</p>
              </div>
            </div>
            <div className="solution-point">
              <span className="solution-icon"><Icon name="check" /></span>
              <div className="solution-content">
                <h3>Voting House member</h3>
                <p>D.C.'s representative could vote on the laws that affect their constituents</p>
              </div>
            </div>
            <div className="solution-point">
              <span className="solution-icon"><Icon name="check" /></span>
              <div className="solution-content">
                <h3>Local control</h3>
                <p>Congress wouldn't be able to overturn laws passed by D.C. voters and their elected officials</p>
              </div>
            </div>
            <div className="solution-point">
              <span className="solution-icon"><Icon name="check" /></span>
              <div className="solution-content">
                <h3>Budget autonomy</h3>
                <p>D.C. could spend its own tax revenue without congressional approval</p>
              </div>
            </div>
          </div>

          <div className="precedent-note">
            <p><strong>Precedent:</strong> The United States has admitted 37 states since the original 13. D.C. has more residents than Wyoming and Vermont.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
