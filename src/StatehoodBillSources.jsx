import { ordinal } from './data/statehoodBill'

// One consolidated sources block (DESIGN-GUARDRAILS: sources at the bottom, never per
// fact). Bill links come from the tracker's data so they follow the bills each Congress.
const link = (href, text) => (
  <a href={href} target="_blank" rel="noopener noreferrer">{text}</a>
)

// Sources for the "what the bill is" paragraph; same URLs and labels as /myths.
const EXPLAINER = [
  {
    label: 'Constitution Annotated, Art. IV, § 3, cl. 1 (New States Clause), via Cornell LII',
    href: 'https://www.law.cornell.edu/constitution-conan/article-4/section-3/clause-1',
    host: 'law.cornell.edu',
  },
  {
    label: 'Congressional Research Service R47101, "DC Statehood: Constitutional Considerations for Proposed Legislation"',
    href: 'https://www.everycrsreport.com/reports/R47101.html',
    host: 'everycrsreport.com',
  },
]

const PROCEDURE = [
  {
    // Same CRS report as congress.gov/crs-product/98-988, which blocks automated link checks.
    label: 'Congressional Research Service, "Voting and Quorum Procedures in the House of Representatives" (March 2023)',
    href: 'https://www.everycrsreport.com/reports/98-988.html',
    host: 'everycrsreport.com',
  },
  {
    label: 'U.S. Senate, "About Voting"',
    href: 'https://www.senate.gov/about/powers-procedures/voting.htm',
    host: 'senate.gov',
  },
  {
    label: 'U.S. Senate, "About Filibusters and Cloture"',
    href: 'https://www.senate.gov/about/powers-procedures/filibusters-cloture.htm',
    host: 'senate.gov',
  },
]

function StatehoodBillSources({ bills, history, congress, explainer }) {
  const earlier = (history ?? []).filter((r) => r.congress !== congress)
  return (
    <div className="sources-block">
      <h2 className="sources-heading">Sources</h2>
      <div className="sources-list">
        {bills.filter((b) => b.complete).map((b) => (
          <span key={b.chamber}>
            Congress.gov, {b.billNumber} ({ordinal(b.congress)} Congress), cosponsors—
            {link(`${b.congressGovUrl.replace(/\/+$/, '')}/cosponsors`, 'congress.gov')}
          </span>
        ))}
        {congress && (
          <span>
            Congress.gov, members of the {ordinal(congress)} Congress—
            {link(`https://www.congress.gov/members?q=${encodeURIComponent(JSON.stringify({ congress }))}`, 'congress.gov')}
          </span>
        )}
        {earlier.flatMap((r) => [r.house, r.senate].filter((s) => s?.url).map((s) => (
          <span key={s.url}>
            GovInfo, bill status of {s.billNumber} ({ordinal(r.congress)} Congress)—{link(s.url, 'govinfo.gov')}
          </span>
        )))}
        {explainer && EXPLAINER.map((p) => (
          <span key={p.href}>{p.label}—{link(p.href, p.host)}</span>
        ))}
        {bills.length > 0 && PROCEDURE.map((p) => (
          <span key={p.href}>{p.label}—{link(p.href, p.host)}</span>
        ))}
      </div>
    </div>
  )
}

export default StatehoodBillSources
