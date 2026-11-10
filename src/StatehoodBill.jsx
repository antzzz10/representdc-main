import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import MemberLookup from './components/MemberLookup'
import { MemberName } from './components/MemberRow'
import { useStatehoodBillData } from './hooks/useStatehoodBillData'
import { formatCheckedInstant } from './utils/formatCheckedInstant'
import { formatDate, historyWithLive, ordinal, signedThisMonth } from './data/statehoodBill'
import StatehoodBillSources from './StatehoodBillSources'
import './App.css'
import './StatehoodBill.css'

// /statehood-bill — who has cosponsored the Washington, D.C. Admission Act. Every number
// comes from the tracker's files (useStatehoodBillData); nothing renders until they load.
// Public sentences are the approved drafts in dc-bills-tracker's PRD § 7
// (docs/2026-11-10-cosponsor-page-and-120th-overview-prd.md).

// Andria writes this paragraph (PRD § 9 Q2). Until then the dev server shows a marked
// placeholder and production builds omit the paragraph rather than ship placeholder copy.
const WHAT_IT_IS = null

const CHAMBER_NAME = { house: 'House', senate: 'Senate' }

function ExternalLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} <Icon name="external-link" size={14} />
    </a>
  )
}

function NotLinkedNote({ bill }) {
  return <p className="bill-transition">No confirmed {ordinal(bill.congress + 1)}-Congress bill linked yet.</p>
}

function ChamberRow({ bill }) {
  return (
    <div className="bill-row">
      {!bill.current && <NotLinkedNote bill={bill} />}
      <p className="bill-row-head">
        <span className="bill-number">{bill.billNumber}</span>
        <span className="bill-chamber">{CHAMBER_NAME[bill.chamber]}{!bill.current && ` · ${ordinal(bill.congress)} Congress`}</span>
      </p>
      <dl className="bill-facts">
        <div><dt>Sponsor</dt><dd><MemberName chamber={bill.chamber} member={bill.sponsor} /></dd></div>
        <div><dt>Introduced</dt><dd>{formatDate(bill.introducedDate)}</dd></div>
        <div>
          <dt>Latest action</dt>
          <dd>{bill.latestAction.text} <span className="mono-date">({formatDate(bill.latestAction.actionDate)})</span></dd>
        </div>
        <div><dt>Official record</dt><dd><ExternalLink href={bill.congressGovUrl}>Congress.gov</ExternalLink></dd></div>
      </dl>
    </div>
  )
}

function CountCard({ bill }) {
  const { cosponsors, nonVoting } = bill.totals
  return (
    <div className="count-card">
      <p className="count-label">
        {CHAMBER_NAME[bill.chamber]} · {bill.billNumber}{!bill.current && ` · ${ordinal(bill.congress)} Congress`}
      </p>
      <p className="count-number">
        {cosponsors}
        <span className="count-unit">{cosponsors === 1 ? ' cosponsor' : ' cosponsors'}</span>
      </p>
      {nonVoting > 0 && (
        <p className="count-note">Including {nonVoting} non-voting {nonVoting === 1 ? 'member' : 'members'}.</p>
      )}
      <p className="count-checked">Last checked {formatCheckedInstant(bill.checkedAt)}</p>
    </div>
  )
}

function RecentSignOns({ bills }) {
  const recent = signedThisMonth(bills)
  if (!recent) return null
  if (recent.rows.length === 0) {
    return recent.latestDate ? <p className="section-note">No new cosponsors since {formatDate(recent.latestDate)}.</p> : null
  }
  return (
    <ul className="recent-list">
      {recent.rows.map((c) => (
        <li key={`${c.chamber}-${c.bioguideId}`} className="recent-row">
          <MemberName chamber={c.chamber} member={c} />
          <span className="mono-date">{c.billNumber} · {formatDate(c.sponsorshipDate, 'short')}</span>
        </li>
      ))}
    </ul>
  )
}

const congressYears = (row) => `${row.startYear}–${row.endYear ? String(row.endYear).slice(2) : ''}`

function HistoryTable({ rows }) {
  return (
    <div className="history-scroll" tabIndex={0} role="region" aria-labelledby="history-caption">
      <table className="history-table">
        <caption id="history-caption">
          Cosponsors at the end of each Congress; for a Congress still in session, the latest count.
        </caption>
        <thead>
          <tr>
            <th scope="col">Congress</th>
            <th scope="col">House bill</th>
            <th scope="col" className="num">House cosponsors</th>
            <th scope="col">Senate bill</th>
            <th scope="col" className="num">Senate cosponsors</th>
            <th scope="col">Furthest step</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.congress}>
              <th scope="row">{ordinal(r.congress)} ({congressYears(r)})</th>
              <td className="mono-date">{r.house?.billNumber ?? ''}</td>
              <td className="num">{r.house?.cosponsors ?? ''}</td>
              <td className="mono-date">{r.senate?.billNumber ?? ''}</td>
              <td className="num">{r.senate?.cosponsors ?? ''}</td>
              {/* The tracker publishes null when the bill got no further than introduction. */}
              <td>{r.furthestAction ? `${r.furthestAction.text}${r.furthestAction.date ? `, ${formatDate(r.furthestAction.date)}` : ''}` : 'Introduced'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatehoodBill() {
  const { cosponsors, members, history } = useStatehoodBillData()
  const bills = cosponsors.data
  const shown = bills ? [bills.house, bills.senate].filter(Boolean) : []
  const counted = shown.filter((b) => b.complete)
  const congress = shown.length ? Math.max(...shown.map((b) => b.congress)) : null
  const historyRows = history.data ? historyWithLive(history.data, bills?.house, bills?.senate) : null

  return (
    <div className="app">
      <Nav />
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow">Statehood bill{congress && ` · ${ordinal(congress)} Congress`}</p>
          <h1>Who is behind the Washington, D.C. Admission Act</h1>
          <p className="hero-subtitle">
            {bills?.house && bills?.senate
              ? `Cosponsors of ${bills.house.billNumber} and ${bills.senate.billNumber}, from Congress.gov, checked daily.`
              : ' '}
          </p>
        </div>
      </header>

      <main className="impact-section statehood-bill">
        <div className="container sb-container">
          <section aria-labelledby="sb-what">
            <h2 id="sb-what">What the bill is and where it stands</h2>
            {WHAT_IT_IS
              ? <p>{WHAT_IT_IS}</p>
              : import.meta.env.DEV && (
                <p className="draft-placeholder">
                  [Placeholder for Andria, not public copy: two or three sentences on what the
                  Admission Act does and how statehood is granted, drafted from /the-case. Production
                  builds omit this paragraph until it is written.]
                </p>
              )}
            {shown.map((b) => <ChamberRow key={b.chamber} bill={b} />)}
            {shown.length > 0 && (
              <p className="section-note">
                Cosponsoring is a statement of support, not a vote. Passing the House ordinarily takes a
                majority of members voting; passing the Senate a majority, and ending debate there
                ordinarily takes 60 votes.
              </p>
            )}
          </section>

          {counted.length > 0 && (
            <section aria-labelledby="sb-counts">
              <h2 id="sb-counts">Recorded cosponsors</h2>
              <div className="count-grid">
                {counted.map((b) => <CountCard key={b.chamber} bill={b} />)}
              </div>
            </section>
          )}

          {counted.length > 0 && (
            <section aria-labelledby="sb-recent">
              <h2 id="sb-recent">Signed on this month</h2>
              <RecentSignOns bills={counted} />
            </section>
          )}

          {bills && members.data && (
            <section aria-labelledby="sb-lookup">
              <h2 id="sb-lookup">Members who have not yet signed on</h2>
              <MemberLookup bills={bills} roster={members.data} />
            </section>
          )}

          {historyRows && (
            <section aria-labelledby="sb-history">
              <h2 id="sb-history">The same bill in earlier Congresses</h2>
              <HistoryTable rows={historyRows} />
            </section>
          )}

          <StatehoodBillSources bills={shown} history={historyRows} congress={congress} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default StatehoodBill
