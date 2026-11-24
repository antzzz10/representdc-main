import { Link, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import { Logo, Wordmark } from './components/Logo'
import BlueskySection from './components/BlueskySection'
import { EMAIL_WAY, PARTNER_FOLLOWS } from './data/followWays'
import { DATA } from './data/statehoodPartners'
import './App.css'
import './Follow.css'

// Three things, in this order: the email, Bluesky, and statehood groups to follow
// directly. The only link back to this site is "All statehood partners", to the partner
// map. The email wording and the
// partner links live in src/data/followWays.js. The Bluesky section shows itself once
// the account has posts.
const BLUESKY_HANDLE = 'bills.representdc.org'

const PARTNERS = Object.values(DATA).flat()
const partnerFollows = PARTNER_FOLLOWS.map((follow) => ({
  ...follow,
  name: PARTNERS.find((partner) => partner.id === follow.id)?.name,
})).filter((follow) => follow.name)

// The section names are the email template's own. The grey bars stand in for text.
const EMAIL_SECTIONS = ['What Congress did', 'Around the movement', 'How you can help']

// A drawing of the email, for sighted readers only: the sentence it carries is the
// paragraph beside it.
function EmailPicture() {
  return (
    <div className="follow-email-picture" aria-hidden="true">
      <div className="follow-email-banner">
        <span className="follow-email-logo">
          <Logo variant="reversed" size={22} />
          <Wordmark variant="reversed" size={15} />
        </span>
        <span className="follow-email-stars">
          {'★'.repeat(50)}
          <b>★</b>
        </span>
      </div>
      <div className="follow-email-body">
        {EMAIL_SECTIONS.map((label) => (
          <div className="follow-email-block" key={label}>
            <span className="follow-email-label">{label}</span>
            <span className="follow-email-line" />
            <span className="follow-email-line follow-email-line--short" />
          </div>
        ))}
      </div>
    </div>
  )
}

function Follow() {
  const preview = new URLSearchParams(useLocation().search).get('preview') === 'bluesky'
  return (
    <div className="app">
      <Nav />
      <header className="page-hero">
        <div className="container">
          <h1>Follow</h1>
        </div>
      </header>
      <section className="impact-section">
        <div className="container">
          <section className="follow-email" aria-labelledby="follow-email-heading">
            <div className="follow-email-text">
              <h2 id="follow-email-heading">{EMAIL_WAY.title}</h2>
              <p>{EMAIL_WAY.body}</p>
              <a className="follow-email-button" href={EMAIL_WAY.href}>
                {EMAIL_WAY.cta} <Icon name="arrow-right" size={16} />
              </a>
            </div>
            <EmailPicture />
          </section>

          <BlueskySection handle={BLUESKY_HANDLE} preview={preview} />

          <section className="follow-partners" aria-labelledby="follow-partners-heading">
            <h2 id="follow-partners-heading">Statehood partners</h2>
            <p>Follow D.C.&apos;s statehood groups directly.</p>
            <ul>
              {partnerFollows.map((partner) => (
                <li key={partner.id}>
                  <a href={partner.href}>
                    <strong>{partner.name}</strong>
                    <span>
                      {partner.cta} <Icon name="arrow-right" size={15} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <Link className="follow-partners-all" to="/statehood-partner-map">
              All statehood partners
            </Link>
          </section>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Follow
