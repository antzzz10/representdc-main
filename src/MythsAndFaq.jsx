import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './App.css'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import './MythsAndFaq.css'

const MYTHS = [
  {
    id: 'myth-1',
    tag: 'Myth 1',
    q: '"Most D.C. residents work for the government or military."',
    a: 'Federal workers are a small slice of the population—D.C. is home to roughly 660,000 people of all occupations, most of whom have lived there 20+ years, across 120 distinct neighborhoods.',
  },
  {
    id: 'myth-2',
    tag: 'Myth 2',
    q: '"D.C. doesn\'t pay U.S. taxes but gets lots of federal money."',
    a: 'D.C. residents pay federal income tax at the highest per-capita rate in the country, plus local "statelike" taxes that Congress must approve. Eight states receive more federal funding as a share of their budget than D.C. does.',
  },
  {
    id: 'myth-3',
    tag: 'Myth 3',
    q: '"D.C. residents have the same rights as other Americans."',
    a: 'They pay federal taxes, serve in the military, and sit on federal juries—but have no voting representation in Congress, and Congress must approve every local law and budget, unlike any state.',
  },
  {
    id: 'myth-4',
    tag: 'Myth 4',
    q: '"Proximity to the Capitol gives D.C. residents influence."',
    a: "Proximity isn't access—most members of Congress know their own home districts, not local D.C. issues.",
  },
  {
    id: 'myth-5',
    tag: 'Myth 5',
    q: '"D.C. is too small to have representation."',
    a: 'D.C. is 63 square miles with a larger population than Wyoming or Vermont—and every state gets equal Senate representation regardless of size.',
  },
  {
    id: 'myth-6',
    tag: 'Myth 6',
    q: '"D.C. is treated differently because it belongs to all Americans."',
    a: 'The National Mall / federal core is a small part of the District; the rest is 120 neighborhoods tourists never see. Eight states have a higher share of federal land ownership than D.C. does.',
  },
]

// One entry from the the51st.org source FAQ is intentionally omitted here: a
// comparison naming a specific political figure's criminal conviction, which
// doesn't fit this page's non-partisan, source-agnostic tone.
const FAQS = [
  {
    id: 'faq-constitutional',
    q: "Isn't D.C. statehood unconstitutional?",
    a: 'No—the Constitution sets an upper size limit on the federal district (100 sq. mi.) but no lower limit, and doesn\'t fix its location. A shrunken federal district (Mall, Capitol, White House, military sites) could remain while the rest becomes a state.',
  },
  {
    id: 'faq-size',
    q: "Isn't D.C. too small or too subsidized to be a state?",
    a: "D.C. has more residents than Wyoming or Vermont and, by this source's figures, pays more federal tax than 22 states. Roughly a quarter of its budget comes from federal funds—on par with or less than several states.",
  },
  {
    id: 'faq-want',
    q: 'Do D.C. residents actually want statehood?',
    a: '86% of D.C. voters approved a 2016 statehood referendum, which also set the proposed state\'s name, borders, and constitution.',
  },
  {
    id: 'faq-achievable',
    q: 'Is statehood actually achievable, or just a slogan?',
    a: 'The U.S. has admitted a new state 37 times since the original 13—a plain congressional majority vote plus a presidential signature, no constitutional amendment required.',
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
          <p>No persuasion pitch—just direct, sourced rebuttals. Jump to any question and share the link.</p>
        </div>
      </header>

      <section className="myth-sec">
        <div className="container">
          <h2>Six popular myths</h2>
          <p className="myth-source-note">
            Source: DC Vote, "Six Popular Myths about the District of Columbia"—
            <a href="https://www.dcvote.org" target="_blank" rel="noopener noreferrer">dcvote.org</a>.
          </p>
          <div className="myth-list">
            {MYTHS.map((m) => (
              <div className="myth-item" id={m.id} key={m.id}>
                <p className="myth-q"><span className="qtag">{m.tag}</span>{m.q}</p>
                <p className="myth-a">{m.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="myth-sec myth-sec-alt">
        <div className="container">
          <h2>More questions, answered</h2>
          <p className="myth-source-note">
            Source: Neighbors United for DC Statehood—
            <a href="https://www.the51st.org/faqs" target="_blank" rel="noopener noreferrer">the51st.org/faqs</a>.
          </p>
          <div className="myth-list">
            {FAQS.map((f) => (
              <div className="faq-item" id={f.id} key={f.id}>
                <p className="myth-q"><span className="qtag">FAQ</span>{f.q}</p>
                <p className="myth-a">{f.a}</p>
              </div>
            ))}
          </div>
          {/* Bridge for warming skeptics — per 2026-07-20 segment mapping */}
          <div className="interim-links">
            <p>Seen the claims—now see the record:</p>
            <div className="interim-row">
              <Link className="cta-secondary" to="/the-case">
                <span>What Congress has actually blocked</span> <Icon name="arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default MythsAndFaq
