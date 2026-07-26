import { Link } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import { useBillStats } from './hooks/useBillStats'
import './App.css'

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
            Here's the full mechanism, not just the headline version.
          </p>
        </div>
      </header>

      <section className="impact-section">
        <div className="container">
          <h2 className="section-title">Before 1973, there was barely a local government at all</h2>
          <p className="section-intro">
            An{' '}
            <a href="https://dccouncil.gov/dc-home-rule/" target="_blank" rel="noopener noreferrer">
              1802 charter
            </a>{' '}
            let D.C. residents elect a council, though the mayor was appointed by the President.
            That lasted about 70 years before collapsing into a system with no elected government
            at all: from the 1870s until 1967, a three-person board appointed entirely by the
            President ran the District. A mayor-commissioner system replaced it in 1967—still
            presidentially appointed, not elected. D.C. residents didn't elect their own mayor and
            council again until the Home Rule Act of 1973 took effect in 1974.
          </p>
          <p className="source-note">
            Source: DC Council, "The History of Home Rule"—
            <a href="https://dccouncil.gov/dc-home-rule/" target="_blank" rel="noopener noreferrer">
              dccouncil.gov
            </a>.
          </p>
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
          <div className="explainer-steps">
            <div className="explainer-step">
              <span className="step-num">1</span>
              <div>
                <h3>Every law goes back to Congress first</h3>
                <p>
                  Before any bill the Council passes can take effect, it sits in front of Congress
                  for 30 days Congress is in session—60 for anything touching D.C.'s criminal
                  code. During that window, Congress can pass a resolution disapproving the law
                  outright, and it never takes effect. No state legislature answers to a review
                  period like this.
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
                  no-turn-on-red law. Riders don't go through the 30/60-day disapproval process at
                  all—they just attach to a bill D.C. can't afford to see fail.
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
          <p className="source-note source-note--spaced">
            Sources: ACLU of DC, "D.C. Home Rule: What It Is, How It Works, and Why It Matters"—
            <a
              href="https://www.acludc.org/news/dc-home-rule-what-it-how-it-works-and-why-it-matters/"
              target="_blank"
              rel="noopener noreferrer"
            >
              acludc.org
            </a>
            ; DC Council—
            <a href="https://dccouncil.gov/dc-home-rule/" target="_blank" rel="noopener noreferrer">
              dccouncil.gov
            </a>.
          </p>
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
          <p className="explainer-next">
            {totalBills} bills using these exact mechanisms—review, riders, and budget
            authority—are moving through Congress right now.
          </p>
          <div className="interim-links">
            <div className="interim-row">
              <Link className="cta-secondary" to="/the-case">
                <span>See what's already been blocked</span> <Icon name="arrow-right" />
              </Link>
              <Link className="cta-secondary" to="/myths-and-faq">
                <span>Read the common objections</span> <Icon name="arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HowCongressControlsDC
