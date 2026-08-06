// Single source of truth for the Statehood Partner Map (/statehood-partner-map).
// Edit org info directly here — StatehoodPartnerMap.jsx just renders this data.
// No separate doc duplicates this; see STAKEHOLDER-MAP.md for decision history only.
//
// CATEGORIES: the "type" of org — matrix rows, and the neutral tag on each card.
// LAYERS: how central statehood is to the org's mission — matrix columns, and the
//   colored tag on each card. key must be 'inner' | 'middle' | 'outer' (labeled
//   Core / Local Allies / National Allies on the page).
// DATA: orgs grouped by layer key. Each org: id (used as the anchor/DOM id — must
//   be unique across all orgs), name (card heading), col (a CATEGORIES key),
//   scope ('local' or 'national' — shown as a plain-text tag), url (linked from
//   "Visit site"), blurb (short label shown in the matrix chip), desc (card body
//   text — verify factual claims against a primary source before editing).
//   self: true (optional) marks RepresentDC's own entry — adds the red "this is us"
//   outline to its chip and card. Only one org should ever carry this.
// SOURCES: the aggregated source list at the bottom of the page.

export const CATEGORIES = [
  { key: 'gov', label: 'Official government' },
  { key: 'policy', label: 'DC Policy' },
  { key: 'community', label: 'DC Community Advocacy' },
  { key: 'national', label: 'National Advocacy' },
  { key: 'party', label: 'Party-affiliated' },
  { key: 'funding', label: 'Funding / PAC' },
  { key: 'coalition', label: 'DC Community Coalition' },
]

export const LAYERS = [
  { key: 'inner', label: 'Core', sub: '100% statehood', desc: '100% statehood.' },
  { key: 'middle', label: 'Local Allies', sub: 'Broader mandate that includes statehood', desc: 'Broader mandate that includes statehood.' },
  { key: 'outer', label: 'National Allies', sub: 'Support through national platforms and resolutions', desc: 'Support through national platforms and resolutions.' },
]

export const DATA = {
  inner: [
    {
      id: 'office-senior-advisor', name: 'Office of the Senior Advisor', col: 'gov',
      scope: 'local', url: 'https://osa.dc.gov/page/pathway-dc-statehood',
      blurb: 'Office of the Senior Advisor',
      desc: "A mayoral office advising on policy, federal, and regional affairs. Its Office of Federal and Regional Affairs coordinates the District government's statehood push alongside the DC Shadow Delegation and New Columbia Statehood Commission below.",
    },
    {
      id: 'dc-shadow-delegation', name: 'DC Shadow Delegation', col: 'gov',
      scope: 'local', url: 'https://statehood.dc.gov/page/dc-governance',
      blurb: 'DC Shadow Delegation',
      desc: "Two shadow Senators and one shadow Representative, elected by D.C. voters since 1990 to lobby Congress for statehood and defend home rule. Unpaid, non-voting positions with no formal congressional standing. Its shadow Senators also sit on the New Columbia Statehood Commission below.",
    },
    {
      id: 'new-columbia-statehood-commission', name: 'New Columbia Statehood Commission', col: 'gov',
      scope: 'local', url: 'https://statehood.dc.gov/page/new-columbia-statehood-commission',
      blurb: 'New Columbia Statehood Commission',
      desc: "Created in 2014 to coordinate D.C.'s statehood initiatives. Members: the Mayor, the Council Chairman, and D.C.'s two shadow Senators — a separate body from the Shadow Delegation above, though membership overlaps.",
    },
    {
      id: 'dc-vote', name: 'DC Vote', col: 'policy',
      scope: 'local', url: 'https://www.dcvote.org/',
      blurb: 'DC Vote',
      desc: 'Founded in 1998, a citizen engagement and advocacy organization focused on full democracy for D.C. — budget and legislative autonomy free of congressional interference, and equal representation in the House and Senate. A member of the National Coalition for Statehood.',
    },
    {
      id: 'representdc', name: 'RepresentDC', col: 'community',
      scope: 'local', url: 'https://www.representdc.org', self: true,
      blurb: 'RepresentDC',
      desc: "This site — an independent advocacy platform. Alongside this page, RepresentDC runs a real-time Bill Tracker (billtracker.representdc.org) tracking anti-D.C. legislation, and a Statehood Candidate Questionnaire (candidates.representdc.org) tracking 2026 D.C. candidates' statehood commitments.",
    },
    {
      id: 'neighbors-united', name: 'Neighbors United for DC Statehood', col: 'community',
      scope: 'local', url: 'https://www.the51st.org/',
      blurb: 'Neighbors United',
      desc: 'A grassroots network organizing D.C. residents for statehood neighborhood by neighborhood — hosting community conversations, partnering with civic groups, and lobbying members of Congress directly.',
    },
    {
      id: 'statehood-pledge', name: 'DC Statehood Pledge', col: 'community',
      scope: 'national', url: 'https://www.dcstatehoodpledge.org/',
      blurb: 'DC Statehood Pledge',
      desc: 'Tracks candidate and elected-official pledge signers nationally, spanning federal and state races — from the U.S. presidency and Congress to governors, state legislatures, and local offices. One of three sibling tools tracking statehood commitments nationwide.',
    },
    {
      id: 'statehood-compact', name: 'DC Statehood Compact', col: 'community',
      scope: 'national', url: 'https://www.dcstatehoodcompact.org/',
      blurb: 'DC Statehood Compact',
      desc: 'Tracks state legislatures introducing resolutions backing D.C. statehood — an interstate-compact approach. Sibling tool to DC Statehood Pledge and DC Statehood Scorecard.',
    },
    {
      id: 'statehood-scorecard', name: 'DC Statehood Scorecard', col: 'community',
      scope: 'national', url: 'https://www.dcstatehoodscorecard.org/',
      blurb: 'DC Statehood Scorecard',
      desc: 'A searchable, legislator-by-legislator scorecard tracking votes and interference, filterable by name, party, jurisdiction, and rating. Sibling tool to DC Statehood Pledge and DC Statehood Compact.',
    },
    {
      id: 'dc-dems-statehood', name: 'DC Democratic Party Statehood Committee', col: 'party',
      scope: 'local', url: 'https://www.dcdemocraticparty.org/dcstatehood',
      blurb: 'DC Dems Statehood Cmte.',
      desc: "An officially affiliated committee of the D.C. Democratic Party dedicated to securing full democracy and self-determination for D.C.",
    },
    {
      id: 'students-for-statehood', name: 'Students for DC Statehood', col: 'community',
      scope: 'national', url: 'http://studentsfordcstatehood.com/',
      blurb: 'Students for DC Statehood',
      desc: 'A national student organization with eight active university chapters in D.C. (including Georgetown, American University, and Trinity Washington), mobilizing the 100,000+ college students who call the city home to canvass, contact legislators, and track statehood developments.',
    },
    {
      id: 'statehood-pac', name: 'DC Statehood PAC', col: 'funding',
      scope: 'national', url: 'https://www.dcstatehoodpac.com/',
      blurb: 'DC Statehood PAC',
      desc: "An FEC-registered hybrid PAC (“Carey committee”). In its own words: “We support candidates and elected officials who support DC Statehood, and we oppose those who don’t.”",
    },
    {
      id: 'together-for-dc', name: 'Together for DC', col: 'coalition',
      scope: 'national', url: 'https://togetherfordc.org/',
      blurb: 'Together for DC',
      desc: 'Launched June 2026, national solidarity infrastructure recruiting out-of-state and national allies to build pressure on Congress alongside D.C. residents. Steering committee includes League of Women Voters DC, Public Citizen, and the Taskforce for Democracy.',
    },
  ],
  middle: [
    {
      id: 'dc-mayor', name: 'DC Mayor', col: 'gov',
      scope: 'local', url: 'https://mayor.dc.gov/',
      blurb: 'DC Mayor',
      desc: "The District's chief executive, and a member of the New Columbia Statehood Commission above. The Mayor's official site features a running count of D.C. residents without a congressional vote, linking directly to the District's statehood campaign.",
    },
    {
      id: 'dc-council', name: 'DC Council', col: 'gov',
      scope: 'local', url: 'https://dccouncil.gov/',
      blurb: 'DC Council',
      desc: 'The District\'s legislative body. Voted unanimously in 2016 to place a statehood referendum before D.C. voters, who approved it with 86% support — the referendum whose proposed constitution and boundaries the New Columbia Statehood Commission above coordinates.',
    },
    {
      id: 'dc-delegate', name: 'DC Delegate to Congress', col: 'gov',
      scope: 'local', url: 'https://norton.house.gov/',
      blurb: 'DC Delegate to Congress',
      desc: "D.C.'s one official, elected voice in Congress — distinct from the unofficial Shadow Delegation above. Can introduce legislation and vote in committee, though not on the House floor. Has introduced the Washington, D.C. Admission Act (H.R. 51) in every recent Congress, currently with well over 100 House cosponsors.",
    },
    {
      id: 'dc-attorney-general', name: 'DC Attorney General', col: 'gov',
      scope: 'local', url: 'https://oag.dc.gov/',
      blurb: 'DC Attorney General',
      desc: "The District's chief legal officer, an elected office since 2014. Has sued the federal government multiple times to defend D.C.'s Home Rule Act autonomy against federal overreach, and a prior Attorney General filed a court brief arguing D.C. residents are directly harmed by the lack of congressional representation.",
    },
    {
      id: 'dc-democratic-party', name: 'DC Democratic Party', col: 'party',
      scope: 'local', url: 'https://www.dcdemocraticparty.org/',
      blurb: 'DC Democratic Party',
      desc: "The D.C. Democratic Party — a broader mandate than its own Statehood Committee, but statehood organizing has been a consistent activist priority within the party for decades.",
    },
    {
      id: 'free-dc', name: 'Free DC', col: 'community',
      scope: 'local', url: 'https://freedcproject.org/',
      blurb: 'Free DC',
      desc: 'Founded in 1997, a grassroots, nonpartisan 501(c)(3) protecting D.C. home rule — full local budget control with no congressional review, locally elected or appointed judges, and full voting representation.',
    },
    {
      id: 'dc-appleseed', name: 'DC Appleseed', col: 'policy',
      scope: 'local', url: 'https://www.dcappleseed.org/',
      blurb: 'DC Appleseed',
      desc: 'A public-interest law and governance organization — the primary legal architect behind D.C.’s voting-rights litigation strategy, including a 2018 federal lawsuit. 30+ years of sustained statehood/voting-rights advocacy.',
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
      desc: 'Since 1983, a consortium of 80+ partner organizations revitalizing Anacostia and the wider East-of-the-River community; ran an “East of the River Youth Voices for Statehood” student project.',
    },
    {
      id: 'fair-budget-coalition', name: 'Fair Budget Coalition', col: 'coalition',
      scope: 'local', url: 'https://fairbudget.org/',
      blurb: 'Fair Budget Coalition',
      desc: 'A coalition of D.C. organizations advocating for a budget that supports racial justice and low-income communities, citing D.C.’s autonomy and statehood as deeply intertwined with achieving an equitable budget.',
    },
    {
      id: 'lwv-dc', name: 'LWV DC', col: 'national',
      scope: 'local', url: 'https://www.lwvdc.org/',
      blurb: 'LWV DC',
      desc: 'The D.C. chapter of the national nonpartisan League of Women Voters — voter education and civic engagement, with statehood as one of its standing positions, including hosted events. Also on the Together for DC steering committee above.',
    },
    {
      id: 'aclu-dc', name: 'ACLU DC', col: 'national',
      scope: 'local', url: 'https://www.acludc.org/',
      blurb: 'ACLU DC',
      desc: 'Statehood is one of ACLU-DC’s four major issue areas, backed by a dedicated “DC Statehood Now” campaign and staff position, run in partnership with ACLU affiliates nationwide.',
    },
  ],
  outer: [
    {
      id: 'senate-bill-sponsors', name: 'Senate Statehood Bill Sponsors', col: 'gov',
      scope: 'national', url: 'https://www.congress.gov/bill/119th-congress/senate-bill/51/cosponsors',
      blurb: 'Senate Bill Sponsors',
      desc: 'S. 51, the Washington, D.C. Admission Act, introduced in the Senate for the 119th Congress with several dozen original cosponsors — real, voting senators from other states putting their name behind D.C. statehood.',
    },
    {
      id: 'house-bill-sponsors', name: 'House Statehood Bill Sponsors', col: 'gov',
      scope: 'national', url: 'https://www.congress.gov/bill/119th-congress/house-bill/51/cosponsors',
      blurb: 'House Bill Sponsors',
      desc: "H.R. 51, the Washington, D.C. Admission Act, introduced in the House for the 119th Congress with well over 100 cosponsors — introduced by D.C.'s Delegate to Congress (Local Allies above) in every recent Congress.",
    },
    {
      id: 'dnc', name: 'DNC', col: 'party',
      scope: 'national', url: 'https://democrats.org/',
      blurb: 'DNC',
      desc: "The Democratic National Committee's national platform has included support for D.C. statehood since 2016, reaffirmed at the 2024 convention.",
    },
    {
      id: 'lwv', name: 'LWV', col: 'national',
      scope: 'national', url: 'https://www.lwv.org/',
      blurb: 'LWV',
      desc: 'The national League of Women Voters (LWVUS) has publicly urged Congress to pass D.C. statehood, including a statement submitted to the U.S. Senate and a statement commending the House’s passage of D.C. statehood legislation — framed as a full-representation and civil-rights issue.',
    },
    {
      id: 'aclu', name: 'ACLU', col: 'national',
      scope: 'national', url: 'https://www.aclu.org/',
      blurb: 'ACLU',
      desc: 'The national ACLU officially scored Congress’s June 2020 vote on H.R. 51, the Washington, D.C. Admission Act, in its congressional scorecard, urging a “yes” vote as a matter of “liberty, justice, and democracy.”',
    },
    {
      id: 'naacp', name: 'NAACP', col: 'national',
      scope: 'national', url: 'https://naacp.org/',
      blurb: 'NAACP',
      desc: 'The national NAACP has backed D.C. statehood by resolution since 1978, most recently reaffirmed in 2025, calling it “the only means to ensure full and equal representation in Congress” for D.C. residents.',
    },
  ],
}

export const SOURCES = [
  { name: 'DC Government, statehood.dc.gov', url: 'https://statehood.dc.gov/' },
  { name: 'Office of the Senior Advisor — Pathway to DC Statehood', url: 'https://osa.dc.gov/page/pathway-dc-statehood' },
  { name: 'DC Mayor', url: 'https://mayor.dc.gov/' },
  { name: 'DC Council', url: 'https://dccouncil.gov/' },
  { name: 'DC Council 2016 statehood referendum vote', url: 'https://statehood.dc.gov/release/unanimous-dc-council-vote-marks-historic-day-fight-statehood' },
  { name: 'DC Delegate to Congress', url: 'https://norton.house.gov/' },
  { name: 'DC Delegate — DC statehood bill introduction', url: 'https://norton.house.gov/media/press-releases/norton-van-hollen-announce-introduction-dc-statehood-bill' },
  { name: 'DC Attorney General', url: 'https://oag.dc.gov/' },
  { name: 'DC Attorney General — court brief on lack of congressional representation', url: 'https://oag.dc.gov/release/ag-racine-files-court-brief-arguing-dc-residents' },
  { name: 'S. 51 (119th Congress) cosponsors', url: 'https://www.congress.gov/bill/119th-congress/senate-bill/51/cosponsors' },
  { name: 'H.R. 51 (119th Congress) cosponsors', url: 'https://www.congress.gov/bill/119th-congress/house-bill/51/cosponsors' },
  { name: 'DC Shadow Delegation (DC Governance)', url: 'https://statehood.dc.gov/page/dc-governance' },
  { name: 'New Columbia Statehood Commission', url: 'https://statehood.dc.gov/page/new-columbia-statehood-commission' },
  { name: 'DC Vote', url: 'https://www.dcvote.org/mission/' },
  { name: 'Neighbors United for DC Statehood', url: 'https://www.the51st.org/' },
  { name: 'Students for DC Statehood', url: 'http://studentsfordcstatehood.com/' },
  { name: 'DC Democratic Party', url: 'https://www.dcdemocraticparty.org/dcstatehood' },
  { name: 'DNC 2024 Party Platform', url: 'https://democrats.org/where-we-stand/party-platform/' },
  { name: 'DNC platform history (2016 addition)', url: 'https://dcist.com/story/16/06/27/dems-include-support-for-statehood/' },
  { name: 'DC Statehood Pledge', url: 'https://www.dcstatehoodpledge.org/' },
  { name: 'DC Statehood Compact', url: 'https://www.dcstatehoodcompact.org/' },
  { name: 'DC Statehood Scorecard', url: 'https://www.dcstatehoodscorecard.org/' },
  { name: 'DC Statehood PAC', url: 'https://www.dcstatehoodpac.com/' },
  { name: 'DC Statehood PAC (FEC filing)', url: 'https://www.fec.gov/data/committee/C00800227/' },
  { name: 'Together for DC', url: 'https://togetherfordc.org/' },
  { name: 'Fair Budget Coalition', url: 'https://fairbudget.org/' },
  { name: 'Fair Budget Coalition (statehood statement)', url: 'https://x.com/FairBudgetDC/status/1964026321421369593' },
  { name: 'League of Women Voters of DC', url: 'https://www.lwvdc.org/' },
  { name: 'League of Women Voters (national)', url: 'https://www.lwv.org/elections/lwvus-urges-congress-support-dc-statehood' },
  { name: 'ACLU of DC', url: 'https://www.acludc.org/press-releases/aclu-endorses-statehood-district-columbia/' },
  { name: 'ACLU (national)', url: 'https://www.aclu.org/press-releases/aclu-urges-house-representatives-vote-yes-dc-statehood' },
  { name: 'DC statehood supporters list (DC gov)', url: 'https://statehood.dc.gov/page/dc-statehood-supporters' },
  { name: 'Free DC', url: 'https://freedcproject.org/history' },
  { name: 'DC Appleseed', url: 'https://www.dcappleseed.org/mission' },
  { name: 'DC Fiscal Policy Institute', url: 'https://www.dcfpi.org/' },
  { name: 'Anacostia Coordinating Council', url: 'https://www.anacostiacc.org/' },
  { name: 'NAACP', url: 'https://naacp.org/resources/naacp-reaffirms-support-statehood-and-democratic-right-self-determination-people-district' },
]
