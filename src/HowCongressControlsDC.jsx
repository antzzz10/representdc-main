import { Link } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import { useBillStats } from './hooks/useBillStats'
import './App.css'
import './HowCongressControlsDC.css'

function HowCongressControlsDC() {
  const { totalBills } = useBillStats()

  return (
    <div className="app">
      <Nav />
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">For D.C. newcomers</span>
          <h1>How Congress controls D.C.</h1>
          <p>
            If you just moved here, this is the one thing about D.C. that's different from
            anywhere else you've lived: the local government you vote for isn't the final word.
          </p>
        </div>
      </header>

      <section className="impact-section">
        <div className="container">
          <h2 className="section-title">Before 1973, there was barely a local government at all</h2>
          <p className="section-intro">
            An 1802 charter let D.C. residents elect a council, though the mayor was appointed by
            the President. That lasted about 70 years before collapsing into a system with no
            elected government at all: from the 1870s until 1967, a three-person board appointed
            entirely by the President ran the District. A mayor-commissioner system replaced it in
            1967—still presidentially appointed, not elected. D.C. residents didn't elect their own
            mayor and council again until the Home Rule Act of 1973 took effect in 1974.
          </p>
          <div className="gov-chart">
            <div className="gov-chart-col">
              <h4>1874–1967</h4>
              <div className="gov-chart-nodes">
                <span className="gov-node">President appoints</span>
                <span className="gov-connector"></span>
                <span className="gov-node">3-person Board of Commissioners</span>
                <span className="gov-connector"></span>
                <span className="gov-node muted">D.C. residents—no vote, no local ballot</span>
              </div>
            </div>
            <div className="gov-chart-col">
              <h4>1973–present</h4>
              <div className="gov-chart-nodes">
                <span className="gov-node">D.C. voters elect</span>
                <span className="gov-connector"></span>
                <div className="gov-node-row">
                  <span className="gov-node">Mayor</span>
                  <span className="gov-node">13-member Council</span>
                </div>
                <span className="gov-connector"></span>
                <span className="gov-node ceiling">Congress reviews and can override</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="container">
          <h2 className="section-title">1973: real authority, with a ceiling</h2>
          <p className="section-intro">
            The Home Rule Act gave D.C. an elected Council—a chairman elected citywide, four
            at-large members, and one from each of the city's eight wards—plus an elected mayor,
            with authority to pass local laws and set the District's own budget. But home rule
            isn't statehood: Congress wrote itself back into the process in three specific ways.
          </p>
        </div>
      </section>

      <section className="explainer-section">
        <div className="container">
          <h2 className="section-title">The mechanisms Congress kept</h2>
          <div className="bill-type-grid">
            <div className="bill-type-card">
              <div className="bill-type-days">30 days</div>
              <div className="bill-type-label">Civil legislation</div>
              <div className="bill-type-detail">Congress can disapprove before it takes effect</div>
            </div>
            <div className="bill-type-card">
              <div className="bill-type-days">60 days</div>
              <div className="bill-type-label">Criminal-code legislation</div>
              <div className="bill-type-detail">Longer review window for changes to D.C.'s criminal code</div>
            </div>
            <div className="bill-type-card alert">
              <div className="bill-type-days">0 days</div>
              <div className="bill-type-label">Appropriations rider</div>
              <div className="bill-type-detail">Skips review entirely—attaches straight to a funding bill</div>
            </div>
          </div>
          <div className="explainer-steps">
            <div className="explainer-step">
              <span className="step-num">1</span>
              <div>
                <h3>Every law goes back to Congress first</h3>
                <p>
                  Before any bill the Council passes can take effect, it sits in front of Congress
                  for the review period shown above. During that window, Congress can pass a
                  resolution disapproving the law outright, and it never takes effect. No state
                  legislature answers to a review period like this.
                </p>
              </div>
            </div>
            <div className="explainer-step">
              <span className="step-num">2</span>
              <div>
                <h3>Riders can skip that process entirely</h3>
                <p>
                  Congress has a second lever: attaching a rider to the District's annual federal
                  appropriations bill—funding legislation D.C. depends on in a way states don't.
                  In 2025, for example, a rider in the House's D.C. appropriations bill (H.R. 8773)
                  tried to bar the District from spending its own local funds to enforce its
                  no-turn-on-red law.
                </p>
              </div>
            </div>
            <div className="explainer-step">
              <span className="step-num">3</span>
              <div>
                <h3>The budget itself needs congressional sign-off</h3>
                <p>
                  The Council approves D.C.'s annual budget, built from the District's own local
                  tax revenue—but Congress reviews it and retains authority over it before D.C.
                  can spend a dollar. States don't send their budgets to Congress for approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="container">
          <h2 className="section-title">One seat, no vote</h2>
          <p className="section-intro">
            D.C. has elected a delegate to the House since 1970—the delegate can introduce
            legislation and vote in committee, but not on the House floor, where bills are
            actually decided. D.C. has never had a senator.
          </p>
          <div className="norton-callout">
            <h3>D.C.'s only voice in the House since 1991</h3>
            <p>
              Eleanor Holmes Norton has held that one seat for more than three decades—17 terms as
              of 2026. Before Congress, she was a civil-rights attorney who took part in the 1964
              Mississippi Freedom Summer, won a landmark 1970 sex-discrimination case against
              Newsweek, and became the first woman to chair the U.S. Equal Employment Opportunity
              Commission. She has announced she won't seek re-election, closing out a career spent
              as D.C.'s only voice in the room—even without a vote on the floor.
            </p>
            <div className="norton-callout-links">
              <a href="https://www.womenshistory.org/education-resources/biographies/eleanor-holmes-norton" target="_blank" rel="noopener noreferrer">
                Full biography <Icon name="external-link" size={13} />
              </a>
              <a href="https://ballotpedia.org/Eleanor_Holmes_Norton" target="_blank" rel="noopener noreferrer">
                Congressional record <Icon name="external-link" size={13} />
              </a>
            </div>
          </div>
          <p className="explainer-next">
            {totalBills} bills using these exact mechanisms—review, riders, and budget
            authority—are moving through Congress right now.
          </p>
          <div className="interim-links">
            <div className="interim-row">
              <Link className="cta-secondary" to="/the-case">
                <span>See what's already been blocked</span> <Icon name="arrow-right" />
              </Link>
              <Link className="cta-secondary" to="/myths">
                <span>Read the common objections</span> <Icon name="arrow-right" />
              </Link>
            </div>
          </div>
          <div className="sources-block">
            <h4>Sources</h4>
            <div className="sources-list">
              <span>
                DC Council, "The History of Home Rule"—
                <a href="https://dccouncil.gov/dc-home-rule/" target="_blank" rel="noopener noreferrer">dccouncil.gov</a>
              </span>
              <span>
                ACLU of DC, "D.C. Home Rule: What It Is, How It Works, and Why It Matters" (Feb 2026)—
                <a href="https://www.acludc.org/news/dc-home-rule-what-it-how-it-works-and-why-it-matters/" target="_blank" rel="noopener noreferrer">acludc.org</a>
              </span>
              <span>
                National Women's History Museum, "Eleanor Holmes Norton"—
                <a href="https://www.womenshistory.org/education-resources/biographies/eleanor-holmes-norton" target="_blank" rel="noopener noreferrer">womenshistory.org</a>
              </span>
              <span>
                Ballotpedia, "Eleanor Holmes Norton"—
                <a href="https://ballotpedia.org/Eleanor_Holmes_Norton" target="_blank" rel="noopener noreferrer">ballotpedia.org</a>
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HowCongressControlsDC
