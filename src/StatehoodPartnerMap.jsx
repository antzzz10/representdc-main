import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import './App.css'
import './StatehoodPartnerMap.css'

const CATEGORIES = [
  { key: 'gov', label: 'Official government' },
  { key: 'policy', label: 'DC Policy' },
  { key: 'community', label: 'DC Community Advocacy' },
  { key: 'national', label: 'National Advocacy' },
  { key: 'party', label: 'Party-affiliated' },
  { key: 'student', label: 'Student organizing' },
  { key: 'funding', label: 'Funding / PAC' },
  { key: 'coalition', label: 'Coalition / partnership' },
]

const LAYERS = [
  { key: 'inner', label: 'Inner', sub: 'all in on statehood', desc: 'Statehood is the entire reason the org exists.' },
  { key: 'middle', label: 'Middle', sub: 'core, broader mandate', desc: 'Named, core part of a broader mission.' },
  { key: 'outer', label: 'Outer', sub: 'supportive, not core', desc: 'On record in support, not a sustained core focus.' },
]

const DATA = {
  inner: [
    {
      id: 'new-columbia-commission', name: 'New Columbia Statehood Commission', col: 'gov',
      scope: 'local', url: 'https://statehood.dc.gov/',
      blurb: 'New Columbia Comm.',
      desc: "Created in 2014 to coordinate D.C.'s statehood strategy on behalf of the District government and support the District's “shadow” congressional delegation. Led by the Mayor, the Council Chairman, and D.C.'s shadow senators.",
    },
    {
      id: 'dc-vote', name: 'DC Vote', col: 'policy',
      scope: 'local', url: 'https://www.dcvote.org/',
      blurb: 'DC Vote',
      desc: 'Founded in 1998, a citizen engagement and advocacy organization focused on full democracy for D.C. — budget and legislative autonomy free of congressional interference, and equal representation in the House and Senate. A member of the National Coalition for Statehood.',
    },
    {
      id: 'neighbors-united', name: 'Neighbors United for DC Statehood', col: 'community',
      scope: 'local', url: 'https://www.the51st.org/',
      blurb: 'Neighbors United',
      desc: 'A grassroots group of D.C. residents building the statehood movement neighborhood by neighborhood — hosting statehood talks in living rooms and with civic groups, recruiting friends and neighbors, and lobbying members of Congress directly.',
    },
    {
      id: 'representdc', name: 'RepresentDC', col: 'community',
      scope: 'local', url: 'https://www.representdc.org',
      blurb: 'RepresentDC',
      desc: "This site — an independent, volunteer-run advocacy platform. Alongside this page, RepresentDC runs a real-time Bill Tracker (billtracker.representdc.org) tracking anti-D.C. legislation, and a Statehood Candidate Questionnaire (candidates.representdc.org) tracking 2026 D.C. candidates' statehood commitments.",
    },
    {
      id: 'statehood-pledge', name: 'Statehood Pledge', col: 'community',
      scope: 'national', url: 'https://www.dcstatehoodpledge.org/',
      blurb: 'Statehood Pledge',
      desc: 'Tracks candidate and elected-official pledge signers nationally — U.S. Senate, state lieutenant governor, and state senate candidates across multiple states. One of three tools run by the same single volunteer, with no formal org name.',
    },
    {
      id: 'statehood-compact', name: 'Statehood Compact', col: 'community',
      scope: 'national', url: 'https://www.dcstatehoodcompact.org/',
      blurb: 'Statehood Compact',
      desc: 'Tracks state legislatures introducing resolutions backing D.C. statehood — an interstate-compact approach. Sibling tool to Statehood Pledge and Statehood Scorecard, same volunteer operator.',
    },
    {
      id: 'statehood-scorecard', name: 'Statehood Scorecard', col: 'community',
      scope: 'national', url: 'https://www.dcstatehoodscorecard.org/',
      blurb: 'Statehood Scorecard',
      desc: 'A searchable, legislator-by-legislator scorecard tracking votes and interference, filterable by name, party, jurisdiction, and rating. Sibling tool to Statehood Pledge and Statehood Compact, same volunteer operator.',
    },
    {
      id: 'dc-dems-statehood', name: 'DC Democratic Party Statehood Committee', col: 'party',
      scope: 'local', url: 'https://www.dcdemocraticparty.org/dcstatehood',
      blurb: 'DC Dems Statehood Cmte.',
      desc: "An officially affiliated committee of the D.C. Democratic Party dedicated to securing full democracy and self-determination for D.C. Its party affiliation is stated plainly here as a fact about the org, not a RepresentDC stance — the party itself has a broader platform; this committee doesn't.",
    },
    {
      id: 'students-for-statehood', name: 'Students for DC Statehood', col: 'student',
      scope: 'national', url: 'http://studentsfordcstatehood.com/',
      blurb: 'Students for DC Statehood',
      desc: 'A national student organization with eight active university chapters in D.C. (including Georgetown, American University, and Trinity Washington), mobilizing the 100,000+ college students who call the city home to canvass, contact legislators, and track statehood developments.',
    },
    {
      id: 'statehood-pac', name: 'DC Statehood PAC', col: 'funding',
      scope: 'national', url: 'https://www.dcstatehoodpac.com/',
      blurb: 'Statehood PAC',
      desc: "An FEC-registered hybrid PAC (“Carey committee”) whose mission is full voting representation for D.C. via statehood. Raised roughly $56,000 in the 2021–2022 election cycle.",
    },
    {
      id: 'together-for-dc', name: 'Together for DC', col: 'coalition',
      scope: 'national', url: 'https://togetherfordc.org/',
      blurb: 'Together for DC',
      desc: 'Launched June 2026, a national solidarity infrastructure recruiting out-of-state and national allies to apply pressure D.C. residents alone can’t. Steering committee includes League of Women Voters DC, Public Citizen, and the Taskforce for Democracy.',
    },
  ],
  middle: [
    {
      id: 'free-dc', name: 'Free DC', col: 'community',
      scope: 'local', url: 'https://freedcproject.org/',
      blurb: 'Free DC',
      desc: 'Founded in 1997, a grassroots, nonpartisan 501(c)(3) protecting D.C. home rule — full local budget control with no congressional review, locally elected or appointed judges, and full voting representation. Fuzzy inner/middle boundary: home-rule defense and statehood advocacy overlap heavily.',
    },
    {
      id: 'lwv-dc', name: 'League of Women Voters of DC', col: 'national',
      scope: 'local', url: 'https://www.lwvdc.org/',
      blurb: 'LWV DC',
      desc: 'The D.C. chapter of the national nonpartisan League of Women Voters — voter education and civic engagement, with statehood as one of its standing positions, including hosted events. Also on the Together for DC steering committee above.',
    },
    {
      id: 'aclu-dc', name: 'ACLU of DC', col: 'national',
      scope: 'local', url: 'https://www.acludc.org/',
      blurb: 'ACLU DC',
      desc: 'Statehood is one of ACLU-DC’s four major issue areas, backed by a dedicated “DC Statehood Now” campaign and staff position, run in partnership with ACLU affiliates nationwide.',
    },
  ],
  outer: [
    {
      id: 'dc-appleseed', name: 'DC Appleseed', col: 'policy',
      scope: 'local', url: 'https://www.dcappleseed.org/',
      blurb: 'DC Appleseed',
      desc: 'A public-interest law and governance organization — the primary legal architect behind D.C.’s voting-rights litigation strategy, including a 2018 federal lawsuit. 30+ years of sustained statehood/voting-rights advocacy; possibly closer to Middle layer than Outer.',
    },
    {
      id: 'dcfpi', name: 'DC Fiscal Policy Institute', col: 'policy',
      scope: 'local', url: 'https://www.dcfpi.org/',
      blurb: 'DCFPI',
      desc: 'Budget and tax policy research for low- and moderate-income D.C. residents; published “The High Cost of Denying Statehood to the District of Columbia” (2021) connecting statehood to fiscal outcomes.',
    },
    {
      id: 'anacostia-cc', name: 'Anacostia Coordinating Council', col: 'community',
      scope: 'local', url: 'https://www.anacostiacc.org/',
      blurb: 'Anacostia Coord. Council',
      desc: 'Since 1983, a volunteer consortium of 80+ partner organizations revitalizing Anacostia and the wider East-of-the-River community; ran an “East of the River Youth Voices for Statehood” student project.',
    },
    {
      id: 'naacp-dc', name: 'NAACP (DC Branch)', col: 'national',
      scope: 'national', url: 'https://naacp.org/',
      blurb: 'NAACP (DC)',
      desc: 'The national NAACP has reaffirmed support for D.C. statehood by resolution repeatedly since 1978; the D.C. Branch has signed on to public letters backing statehood as part of the NAACP’s broader civil-rights platform.',
    },
  ],
}

const SOURCES = [
  { name: 'DC Council, statehood.dc.gov', url: 'https://statehood.dc.gov/' },
  { name: 'DC Vote', url: 'https://www.dcvote.org/mission/' },
  { name: 'Neighbors United for DC Statehood', url: 'https://www.the51st.org/' },
  { name: 'Students for DC Statehood', url: 'http://studentsfordcstatehood.com/' },
  { name: 'DC Democratic Party', url: 'https://www.dcdemocraticparty.org/dcstatehood' },
  { name: 'Statehood Pledge', url: 'https://www.dcstatehoodpledge.org/' },
  { name: 'Statehood Compact', url: 'https://www.dcstatehoodcompact.org/' },
  { name: 'Statehood Scorecard', url: 'https://www.dcstatehoodscorecard.org/' },
  { name: 'DC Statehood PAC (FEC filing)', url: 'https://www.fec.gov/data/committee/C00800227/' },
  { name: 'Together for DC', url: 'https://togetherfordc.org/' },
  { name: 'League of Women Voters of DC', url: 'https://www.lwvdc.org/' },
  { name: 'ACLU of DC', url: 'https://www.acludc.org/press-releases/aclu-endorses-statehood-district-columbia/' },
  { name: 'Free DC', url: 'https://freedcproject.org/history' },
  { name: 'DC Appleseed', url: 'https://www.dcappleseed.org/mission' },
  { name: 'DC Fiscal Policy Institute', url: 'https://www.dcfpi.org/' },
  { name: 'Anacostia Coordinating Council', url: 'https://www.anacostiacc.org/' },
  { name: 'NAACP', url: 'https://naacp.org/resources/naacp-reaffirms-support-statehood-and-democratic-right-self-determination-people-district' },
]

function buildGrid() {
  const grid = {}
  CATEGORIES.forEach((c) => {
    grid[c.key] = {}
    LAYERS.forEach((l) => { grid[c.key][l.key] = [] })
  })
  LAYERS.forEach((l) => {
    DATA[l.key].forEach((org) => { grid[org.col][l.key].push(org) })
  })
  return grid
}

function StatehoodPartnerMap() {
  const grid = buildGrid()

  return (
    <div className="app">
      <Nav />

      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Meet the movement</span>
          <h1>The Statehood Partner Map</h1>
          <p>Who's actually working on this, what kind of work they do, and how central statehood is to their mission.</p>
        </div>
      </header>

      <section className="impact-section">
        <div className="container spm-intro">
          <p className="section-intro spm-lead">
            D.C. statehood isn't the work of one campaign or one office — it's a genuinely
            broad effort. An official D.C. government commission, national civil-rights
            organizations, grassroots neighborhood groups, student chapters, a political
            party committee, volunteer-run tracking tools, and a dedicated PAC are all
            pulling in the same direction, alongside a coalition of 100+ additional
            organizations. This page maps who's who.
          </p>
          <div className="spm-howto">
            <div className="spm-howto-item">
              <h3>Layer</h3>
              <p>How central statehood is to an org's mission — <strong>Inner</strong> (their
                whole reason for existing), <strong>Middle</strong> (a named, core priority
                within a broader mission), or <strong>Outer</strong> (on record in support,
                without being a sustained focus).</p>
            </div>
            <div className="spm-howto-item">
              <h3>Type</h3>
              <p>What kind of work they do — research, organizing, funding, coalition-building,
                and so on. The table below shows both at once.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section spm-matrix-section">
        <div className="container">
          <h2 className="section-title">At a glance</h2>
          <div className="spm-matrix-card">
            <div className="spm-matrix-scroll">
              <table className="spm-matrix">
                <thead>
                  <tr>
                    <th className="spm-corner"></th>
                    {LAYERS.map((l) => (
                      <th key={l.key} className={`spm-layer-head spm-layer-${l.key}`}>
                        <span className="spm-col-label">{l.label}</span>
                        <span className="spm-col-sub">{l.sub}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIES.map((c) => (
                    <tr key={c.key}>
                      <th>
                        <span className="spm-row-label">{c.label}</span>
                      </th>
                      {LAYERS.map((l) => (
                        <td key={l.key} className="spm-cell">
                          {grid[c.key][l.key].length > 0 && (
                            <div className="spm-chip-stack">
                              {grid[c.key][l.key].map((org) => (
                                <a
                                  key={org.id}
                                  href={`#${org.id}`}
                                  className={`spm-chip spm-layer-${l.key} spm-scope-${org.scope}`}
                                >
                                  {org.blurb}
                                </a>
                              ))}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="spm-matrix-note">
            Empty cells are informative, not missing data — e.g. no org is both
            Party-affiliated and Outer-layer. Click any chip to jump to its full entry
            below.
          </p>
        </div>
      </section>

      <section className="impact-section">
        <div className="container">
          <h2 className="section-title">Full directory</h2>
          {LAYERS.map((l) => (
            <div className="spm-layer-block" key={l.key}>
              <h3 className={`spm-layer-heading spm-layer-${l.key}`}>
                <span className="spm-layer-dot"></span>{l.label} layer
              </h3>
              <p className="spm-layer-desc">{l.desc}</p>
              <div className="spm-card-grid">
                {DATA[l.key].map((org) => (
                  <div className="spm-org-card" id={org.id} key={org.id}>
                    <div className="spm-org-card-head">
                      <h4>{org.name}</h4>
                      <a href={org.url} target="_blank" rel="noopener noreferrer" aria-label={`${org.name} website`}>
                        <Icon name="external-link" size={15} />
                      </a>
                    </div>
                    <div className="spm-org-tags">
                      <span className="spm-tag">{CATEGORIES.find((c) => c.key === org.col)?.label}</span>
                      <span className="spm-tag spm-tag-scope">{org.scope === 'national' ? 'National' : 'D.C.-local'}</span>
                    </div>
                    <p>{org.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="sources-block">
            <h4>Sources</h4>
            <div className="sources-list">
              {SOURCES.map((s) => (
                <span key={s.url}>
                  {s.name}—<a href={s.url} target="_blank" rel="noopener noreferrer">{s.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default StatehoodPartnerMap
