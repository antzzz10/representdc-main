import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import './About.css'

// Team roster. Each additional volunteer who joins the project gets an entry
// here — same card shape, no placeholder slots until someone is actually on.
const TEAM = [
  {
    name: 'Andria Thomas',
    role: 'Founder & Chief Builder',
    bio: `Andria is a proud DC resident, product leader, business strategist, and impatient activist. She first organized for Statehood at her dining room table, then with her own local community organization in partnership with the broad range of motivated and deeply experienced advocacy groups working hard to make DC statehood a reality. Andria ran for DC Shadow Senator in 2018 and won the most votes of any challenger in a year when every incumbent won; however she was also elected to the DC Democratic Party that year and appointed co-chair of their Statehood Committee. Andria co-led the Statehood Committee until stepping down from the DC Democratic Party in September 2026. She designed and built RepresentDC.org, including the bill and candidate trackers, and maintains it as a volunteer alongside her day-to-day work.`,
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
