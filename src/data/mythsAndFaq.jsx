import { Link } from 'react-router-dom'
import Cite from '../components/Cite'

// Content for /myths-and-faq. The question set is adapted from the51st.org's
// FAQ, but every figure below is cited to a primary source (Census, IRS, NPS,
// D.C. Code, CRS) rather than to an advocacy group's summary of it. If a claim
// can't be tied to a live, direct URL from a neutral source, it doesn't belong
// on this page.
//
// One entry from the the51st.org source FAQ is intentionally omitted here: a
// comparison naming a specific political figure's criminal conviction, which
// doesn't fit this page's non-partisan, source-agnostic tone.

// Single URL map so an inline citation and its Sources entry can't drift apart.
const SRC = {
  census: 'https://www.census.gov/data/tables/time-series/demo/popest/2020s-state-total.html',
  censusArea: 'https://www.census.gov/geographies/reference-files/2010/geo/state-area.html',
  irs: 'https://www.irs.gov/statistics/soi-tax-stats-gross-collections-by-type-of-tax-and-state-irs-data-book-table-5',
  dataUsa: 'https://datausa.io/profile/geo/washington-dc/',
  delegates: 'https://www.everycrsreport.com/reports/R48063.html',
  constitutionality: 'https://www.everycrsreport.com/reports/R47101.html',
  districtClause: 'https://www.law.cornell.edu/constitution-conan/article-1/section-8/clause-17',
  budgetReview: 'https://code.dccouncil.gov/us/dc/council/code/sections/1-204.46',
  lawReview: 'https://code.dccouncil.gov/us/dc/council/code/sections/1-206.02',
  wards: 'https://code.dccouncil.gov/us/dc/council/code/sections/1-1011.01',
  dcboe: 'https://electionresults.dcboe.org/election_results/2016-General-Election',
  tennesseePlan:
    'https://news.ballotpedia.org/2025/04/24/on-this-day-in-1956-alaska-voters-passed-the-tennessee-plan-to-gain-statehood-how-is-that-plan-being-used-today/',
  dcConstitution: 'https://statehood.dc.gov/publication/constitution-state-washington-dc',
  shadowDelegation: 'https://code.dccouncil.gov/us/dc/council/code/sections/1-123',
  newStatesClause: 'https://www.law.cornell.edu/constitution-conan/article-4/section-3/clause-1',
}

export const ITEMS = [
  {
    id: 'myth-1',
    type: 'myth',
    tag: 'Myth 1',
    q: '"Most D.C. residents work for the government or military."',
    a: (
      <>
        Federal employment is one slice of a working city of roughly{' '}
        <Cite href={SRC.census}>694,000 residents</Cite>. The District's largest single
        industry isn't government at all—it's{' '}
        <Cite href={SRC.dataUsa}>professional, scientific, and technical services</Cite>.
      </>
    ),
    fact: {
      value: '18%',
      label: 'work in public administration',
      detail: 'Management, business, and legal roles employ far more.',
    },
  },
  {
    id: 'myth-2',
    type: 'myth',
    tag: 'Myth 2',
    q: '"D.C. doesn\'t pay U.S. taxes but gets lots of federal money."',
    a: (
      <>
        The IRS collected more federal tax per person in D.C. than in any state in fiscal 2025.
        Residents also pay local taxes—on a budget{' '}
        <Cite href={SRC.budgetReview}>Congress must clear</Cite> before the District is allowed
        to spend its own money.
      </>
    ),
    fact: {
      value: '$60,067',
      label: 'in federal tax collected per D.C. resident',
      detail: 'Highest in the nation—2.4× second-place Massachusetts (FY2025).',
    },
  },
  {
    id: 'myth-3',
    type: 'myth',
    tag: 'Myth 3',
    q: '"D.C. residents have the same rights as other Americans."',
    a: (
      <>
        They pay federal taxes, serve in the military, and sit on federal juries—but their sole
        member of the House <Cite href={SRC.delegates}>cannot vote on final passage</Cite> of a
        bill, they have no senators, and{' '}
        <Link to="/how-congress-controls-dc">
          Congress must approve every local law and budget
        </Link>
        , unlike any state.
      </>
    ),
    fact: {
      value: '499',
      label: 'D.C. residents died in WWI service',
      detail: 'Commemorated on the National Mall.',
    },
  },
  {
    id: 'myth-4',
    type: 'myth',
    tag: 'Myth 4',
    q: '"Proximity to the Capitol gives D.C. residents influence."',
    a: (
      <>
        Proximity isn't accountability. Not one voting member of Congress is elected by D.C.
        residents, so not one answers to them at the ballot box—while Congress retains{' '}
        <Cite href={SRC.lawReview}>a veto over the laws they do pass</Cite> locally.
      </>
    ),
  },
  {
    id: 'myth-5',
    type: 'myth',
    tag: 'Myth 5',
    q: '"D.C. is too small to have representation."',
    a: (
      <>
        D.C.'s <Cite href={SRC.censusArea}>61 square miles</Cite> of land hold{' '}
        <Cite href={SRC.census}>more people than Wyoming or Vermont</Cite>—and every state gets
        two senators regardless of size.
      </>
    ),
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
    a: (
      <>
        The monumental core is a fraction of the District. The rest is where nearly{' '}
        <Cite href={SRC.census}>694,000 people</Cite> live, across{' '}
        <Cite href={SRC.wards}>eight wards</Cite>—and congressional control extends over all of
        it, not just the federal buildings.
      </>
    ),
    fact: {
      value: '1 of 54',
      label: 'National Guard that reports to the President',
      detail: "Every other state and territory's answers to its own governor instead.",
    },
  },
  {
    id: 'myth-7',
    type: 'myth',
    tag: 'Myth 7',
    q: '"D.C. statehood would be unconstitutional."',
    a: (
      <>
        The Constitution caps the federal district at{' '}
        <Cite href={SRC.districtClause}>"ten Miles square"</Cite> but sets no minimum size and
        doesn't fix its borders. The nonpartisan Congressional Research Service reads the text
        the same way—the Framers "chose to set a maximum size for the Federal District, but no
        other size-related restrictions." Whether Congress can admit the rest as a state by
        ordinary legislation is{' '}
        <Cite href={SRC.constitutionality}>genuinely contested among scholars</Cite>, with little
        case law either way. What it isn't is settled against statehood.
      </>
    ),
  },
  {
    id: 'myth-8',
    type: 'myth',
    tag: 'Myth 8',
    q: '"D.C. is too small and too subsidized to be a state."',
    a: (
      <>
        D.C. has <Cite href={SRC.census}>more residents than Wyoming or Vermont</Cite> and, in
        fiscal 2025, generated{' '}
        <Cite href={SRC.irs}>more federal tax revenue than 20 states did</Cite>.
      </>
    ),
    fact: {
      value: '250',
      label: 'public schools operate in D.C.',
      detail: 'One traditional district plus 66 charter LEAs (SY 2025–26).',
    },
  },
  {
    id: 'myth-9',
    type: 'myth',
    tag: 'Myth 9',
    q: '"D.C. isn\'t anywhere close to becoming a state."',
    a: (
      <>
        D.C. has already worked through the{' '}
        <Cite href={SRC.tennesseePlan}>Tennessee Plan</Cite>—the route eight states used to join
        the Union. It has <Cite href={SRC.dcConstitution}>ratified a state constitution</Cite>,
        drawn the proposed borders, approved statehood in a{' '}
        <Cite href={SRC.dcboe}>2016 referendum</Cite> by about 86% of the votes cast, and{' '}
        <Cite href={SRC.shadowDelegation}>elected a shadow congressional delegation</Cite> since
        1990. What's left is the vote in Congress.
      </>
    ),
    fact: {
      value: '8',
      label: 'states joined via the Tennessee Plan',
      detail: 'Tennessee, Michigan, Iowa, California, Oregon, Kansas, Minnesota, Alaska.',
    },
  },
  {
    id: 'myth-10',
    type: 'myth',
    tag: 'Myth 10',
    q: '"Statehood for D.C. is far-fetched."',
    a: (
      <>
        <Link to="/the-case">Thirty-seven states have joined</Link> since the original 13, most
        admitted from territory by{' '}
        <Cite href={SRC.newStatesClause}>an ordinary act of Congress</Cite> and a presidential
        signature—no constitutional amendment has ever been required. The bills before Congress
        would admit the land outside a shrunken federal district on that same footing.
      </>
    ),
  },
]

export const SOURCES = [
  {
    label: 'U.S. Census Bureau, "State Population Totals and Components of Change: 2020–2025"',
    href: SRC.census,
    display: 'census.gov',
  },
  {
    label: 'U.S. Census Bureau, "State Area Measurements and Internal Point Coordinates"',
    href: SRC.censusArea,
    display: 'census.gov',
  },
  {
    label: 'IRS Data Book Table 5, "Gross Collections, by Type of Tax and State," FY2025',
    href: SRC.irs,
    display: 'irs.gov',
  },
  {
    label: 'U.S. Census Bureau occupation and industry data for D.C., via Data USA',
    href: SRC.dataUsa,
    display: 'datausa.io',
  },
  {
    label: 'National Park Service, "District of Columbia War Memorial"',
    href: 'https://home.nps.gov/places/000/district-of-columbia-war-memorial.htm',
    display: 'nps.gov',
  },
  {
    label: 'DC Action, "DC KIDS COUNT: Demographics"',
    href: 'https://wearedcaction.org/dc-kids-count/key-measures/demographics/',
    display: 'wearedcaction.org',
  },
  {
    label: 'OSSE EdScape, "Number of LEAs and Schools"',
    href: 'https://edscape.dc.gov/page/number-leas-and-schools',
    display: 'edscape.dc.gov',
  },
  {
    label: 'D.C. National Guard, "About the DCNG"',
    href: 'https://dcng.dc.gov/page/about-7',
    display: 'dcng.dc.gov',
  },
  {
    label: 'D.C. Code § 49–409, "President to be Commander-in-Chief"',
    href: 'https://code.dccouncil.gov/us/dc/council/code/sections/49-409',
    display: 'code.dccouncil.gov',
  },
  {
    label: 'Home Rule Act § 1–204.46 (budget) and § 1–206.02 (congressional review of D.C. laws)',
    href: SRC.budgetReview,
    display: 'code.dccouncil.gov',
  },
  {
    label: 'D.C. Code § 1–1011.01, ward boundaries',
    href: SRC.wards,
    display: 'code.dccouncil.gov',
  },
  {
    label:
      'Congressional Research Service R48063, "Delegates and the Resident Commissioner: Parliamentary Rights and Practice"',
    href: SRC.delegates,
    display: 'everycrsreport.com',
  },
  {
    label:
      'Congressional Research Service R47101, "DC Statehood: Constitutional Considerations for Proposed Legislation"',
    href: SRC.constitutionality,
    display: 'everycrsreport.com',
  },
  {
    label: 'Constitution Annotated, Art. I, § 8, cl. 17 (District Clause), via Cornell LII',
    href: SRC.districtClause,
    display: 'law.cornell.edu',
  },
  {
    label: 'D.C. Board of Elections, certified results, 2016 General Election',
    href: SRC.dcboe,
    display: 'electionresults.dcboe.org',
  },
  {
    label: 'D.C. Statehood, "Constitution of the State of Washington, DC"',
    href: SRC.dcConstitution,
    display: 'statehood.dc.gov',
  },
  {
    label: 'D.C. Code § 1–123, election of Senators and Representative for the new state',
    href: SRC.shadowDelegation,
    display: 'code.dccouncil.gov',
  },
  {
    label: 'Constitution Annotated, Art. IV, § 3, cl. 1 (New States Clause), via Cornell LII',
    href: SRC.newStatesClause,
    display: 'law.cornell.edu',
  },
  {
    label: 'Ballotpedia News, "Alaska voters passed the Tennessee Plan to gain statehood"',
    href: SRC.tennesseePlan,
    display: 'ballotpedia.org',
  },
  {
    label: 'Neighbors United for DC Statehood, "FAQs"',
    href: 'https://www.the51st.org/faqs',
    display: 'the51st.org/faqs',
  },
]
