import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import './About.css'

// Team roster. Each additional volunteer who joins the project gets an entry
// here — same card shape, no placeholder slots until someone is actually on.
const TEAM = [
  {
    name: 'Andria Thomas',
    role: 'Chief Builder',
    bio: `Andria is a DC resident and product executive with 15+ years building consumer and B2B software platforms, most recently as Chief Product Officer at FinLocker and before that leading CreditWise at Capital One. She's spent the past several years in DC's statehood movement as an elected DC Democratic State Committee member and Statehood Committee co-chair, and ran citywide for U.S. Shadow Senator in 2018. She designed and built RepresentDC.org, including the bill and candidate trackers, and maintains it as a volunteer alongside her day-to-day work.`,
    photoAlt: 'Photo of Andria Thomas',
  },
]

function TeamCard({ member }) {
  return (
    <div className="team-card">
      <div className="team-photo" role="img" aria-label={member.photoAlt}>
        <Icon name="user" size={40} />
      </div>
      <div className="team-copy">
        <h3>{member.name}</h3>
        <span className="team-role">{member.role}</span>
        <p>{member.bio}</p>
      </div>
    </div>
  )
}

function About() {
  return (
    <div className="app">
      <Nav />
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">About</span>
          <h1>Who's behind RepresentDC</h1>
          <p>
            RepresentDC is volunteer-run. No one on this project is paid, and the
            site isn't a business or nonprofit organization — it's built and kept
            running on personal time by people who care about DC's lack of
            representation.
          </p>
        </div>
      </header>
      <section className="impact-section">
        <div className="container">
          <div className="team-list">
            {TEAM.map((member) => (
              <TeamCard member={member} key={member.name} />
            ))}
          </div>
          <p className="team-note">
            RepresentDC is open to other volunteers who want to help with
            development, research, or outreach. Reach out through the feedback
            form linked in the footer.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default About
