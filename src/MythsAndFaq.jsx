import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './App.css'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import './MythsAndFaq.css'

// One entry from the the51st.org source FAQ is intentionally omitted here: a
// comparison naming a specific political figure's criminal conviction, which
// doesn't fit this page's non-partisan, source-agnostic tone.
const ITEMS = [
  {
    id: 'myth-1',
    type: 'myth',
    tag: 'Myth 1',
    q: '"Most D.C. residents work for the government or military."',
    a: 'Federal workers are a small slice of the population—D.C. is home to roughly 660,000 people of all occupations, most of whom have lived there 20+ years, across 120 distinct neighborhoods.',
    fact: {
      value: '18%',
      label: 'of employed D.C. residents work in public administration',
      detail: 'Management, business, legal, and other occupations employ far more.',
    },
  },
  {
    id: 'myth-2',
    type: 'myth',
    tag: 'Myth 2',
    q: '"D.C. doesn\'t pay U.S. taxes but gets lots of federal money."',
    a: 'D.C. residents pay federal income tax at the highest per-capita rate in the country, plus local "statelike" taxes that Congress must approve. Eight states receive more federal funding as a share of their budget than D.C. does.',
    fact: {
      value: 'Highest',
      label: 'per-capita federal tax rate in the U.S.',
      detail: 'D.C. residents pay more per person than any state.',
    },
  },
  {
    id: 'myth-3',
    type: 'myth',
    tag: 'Myth 3',
    q: '"D.C. residents have the same rights as other Americans."',
    a: (
      <>
        They pay federal taxes, serve in the military, and sit on federal juries—but have no
        voting representation in Congress, and{' '}
        <Link to="/how-congress-controls-dc">
          Congress must approve every local law and budget
        </Link>
        , unlike any state.
      </>
    ),
    fact: {
      value: '499',
      label: 'D.C. residents died in WWI service',
      detail: 'Commemorated on the National Mall—for a war they had no vote to declare.',
    },
  },
  {
    id: 'myth-4',
    type: 'myth',
    tag: 'Myth 4',
    q: '"Proximity to the Capitol gives D.C. residents influence."',
    a: "Proximity isn't access—most members of Congress know their own home districts, not local D.C. issues.",
  },
  {
    id: 'myth-5',
    type: 'myth',
    tag: 'Myth 5',
    q: '"D.C. is too small to have representation."',
    a: 'D.C. is 63 square miles with a larger population than Wyoming or Vermont—and every state gets equal Senate representation regardless of size.',
    fact: {
      value: '129,831',
      label: 'children live in D.C.',
      detail: 'Up from 126,742 just two years earlier (2022).',
    },
  },
  {
    id: 'myth-6',
    type: 'myth',
    tag: 'Myth 6',
    q: '"D.C. is treated differently because it belongs to all Americans."',
    a: 'The National Mall / federal core is a small part of the District; the rest is 120 neighborhoods tourists never see. Eight states have a higher share of federal land ownership than D.C. does.',
    fact: {
      value: '1 of 54',
      label: "National Guard that reports to the President, not a governor",
      detail: "D.C.'s Guard answers directly to the White House. Every state and territory's answers to its own governor.",
    },
  },
  {
    id: 'faq-constitutional',
    type: 'faq',
    tag: 'FAQ',
    q: "Isn't D.C. statehood unconstitutional?",
    a: 'No—the Constitution sets an upper size limit on the federal district (100 sq. mi.) but no lower limit, and doesn\'t fix its location. A shrunken federal district (Mall, Capitol, White House, military sites) could remain while the rest becomes a state.',
  },
  {
    id: 'faq-size',
    type: 'faq',
    tag: 'FAQ',
    q: "Isn't D.C. too small or too subsidized to be a state?",
    a: "D.C. has more residents than Wyoming or Vermont and, by this source's figures, pays more federal tax than 22 states. Roughly a quarter of its budget comes from federal funds—on par with or less than several states.",
    fact: {
      value: '250',
      label: 'public schools operate in D.C.',
      detail: 'For a jurisdiction critics call "too small" to matter.',
    },
  },
  {
    id: 'faq-want',
    type: 'faq',
    tag: 'FAQ',
    q: 'Do D.C. residents actually want statehood?',
    a: (
      <>
        86% of D.C. voters approved a{' '}
        <a href="https://www.dcvote.org" target="_blank" rel="noopener noreferrer">
          2016 statehood referendum
        </a>
        , which also set the proposed state's name, borders, and constitution.
      </>
    ),
  },
  {
    id: 'faq-achievable',
    type: 'faq',
    tag: 'FAQ',
    q: 'Is statehood actually achievable, or just a slogan?',
    a: (
      <>
        The U.S. has{' '}
        <Link to="/the-case">admitted a new state 37 times</Link> since the original 13—a plain
        congressional majority vote plus a presidential signature, no constitutional amendment
        required.
      </>
    ),
  },
]

function MythsAndFaq() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const el = document.querySelector(location.hash)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [location])

  return (
    <div className="app">
      <Nav />

      <header className="myth-hero">
        <div className="container">
          <span className="eyebrow">Statehood, questioned</span>
          <h1>Straight answers to the most common doubts</h1>
          <p>The claims skeptics raise most often, and what the record actually shows.</p>
        </div>
      </header>

      <section className="myth-sec">
        <div className="container">
          <div className="myth-list">
            {ITEMS.map((item) => (
              <div
                className={item.type === 'myth' ? 'myth-item' : 'faq-item'}
                id={item.id}
                key={item.id}
              >
                <p className="myth-q">
                  <span className="qtag">{item.tag}</span>
                  {item.q}
                </p>
                <p className="myth-a">{item.a}</p>
                {item.fact && (
                  <div className="myth-fact">
                    <span className="myth-fact-value">{item.fact.value}</span>
                    <span className="myth-fact-text">
                      <strong>{item.fact.label}</strong> {item.fact.detail}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="interim-links">
            <p>Seen the claims—now see the record:</p>
            <div className="interim-row">
              <Link className="cta-secondary" to="/the-case">
                <span>What Congress has actually blocked</span> <Icon name="arrow-right" />
              </Link>
            </div>
          </div>

          <div className="sources-block">
            <h4>Sources</h4>
            <div className="sources-list">
              <span>
                DC Vote, "Six Popular Myths about the District of Columbia"—
                <a href="https://www.dcvote.org" target="_blank" rel="noopener noreferrer">dcvote.org</a>
              </span>
              <span>
                Neighbors United for DC Statehood, FAQ—
                <a href="https://www.the51st.org/faqs" target="_blank" rel="noopener noreferrer">the51st.org/faqs</a>
              </span>
              <span>
                U.S. Census Bureau data on D.C. occupations and industries, via Data USA—
                <a href="https://datausa.io/profile/geo/washington-dc/" target="_blank" rel="noopener noreferrer">datausa.io</a>
              </span>
              <span>
                Rep. Eleanor Holmes Norton, "DC Pays the Highest Federal Taxes Per Capita in the Nation"—
                <a href="https://norton.house.gov/dc-pays-the-highest-federal-taxes-per-capita-in-the-nation" target="_blank" rel="noopener noreferrer">norton.house.gov</a>
              </span>
              <span>
                National Park Service, District of Columbia War Memorial—
                <a href="https://home.nps.gov/places/000/district-of-columbia-war-memorial.htm" target="_blank" rel="noopener noreferrer">nps.gov</a>
              </span>
              <span>
                DC Action, "DC Kids Count"—
                <a href="https://wearedcaction.org/dc-kids-count/key-measures/demographics/" target="_blank" rel="noopener noreferrer">wearedcaction.org</a>
              </span>
              <span>
                DC National Guard—
                <a href="https://dcng.dc.gov/page/about-7" target="_blank" rel="noopener noreferrer">dcng.dc.gov</a>
              </span>
              <span>
                Office of the State Superintendent of Education—
                <a href="https://edscape.dc.gov/page/number-leas-and-schools" target="_blank" rel="noopener noreferrer">edscape.dc.gov</a>
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default MythsAndFaq
