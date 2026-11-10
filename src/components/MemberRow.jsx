import Icon from './Icon'
import { formatDate, memberTitle, seatLabel } from '../data/statehoodBill'

const PARTY_NAMES = { R: 'Republican', D: 'Democrat', I: 'Independent' }

// Neutral party badge: the letter carries the meaning (never colour alone), the full word
// is there for screen readers.
export function PartyBadge({ party }) {
  if (!party) return null
  return (
    <span className={`party-badge party-badge--${party.toLowerCase()}`}>
      <span aria-hidden="true">{party}</span>
      <span className="sr-only">{PARTY_NAMES[party]}</span>
    </span>
  )
}

/** "Rep. First Last" with badge and seat, shared by the sponsor line and member rows. */
export function MemberName({ chamber, member }) {
  return (
    <span className="member-name">
      <PartyBadge party={member.party} />
      <span>
        {memberTitle(chamber, member.state, member.votingMember)} {member.name}
        <span className="member-seat">, {seatLabel(chamber, member.state, member.district)}</span>
      </span>
    </span>
  )
}

const STATUS = {
  sponsor: () => 'Sponsor',
  signed: (date) => `Signed on ${formatDate(date, 'short')}`,
  'not-yet': () => 'Not yet',
}

export function MemberRow({ member }) {
  return (
    <li className={`member-row member-row--${member.status}`}>
      <MemberName chamber={member.chamber} member={member} />
      <span className="member-status">{STATUS[member.status](member.date)}</span>
      {member.officialWebsiteUrl ? (
        <a className="member-link" href={member.officialWebsiteUrl} target="_blank" rel="noopener noreferrer">
          Official website<span className="sr-only"> of {member.name}</span> <Icon name="external-link" size={14} />
        </a>
      ) : (
        <span className="member-link" />
      )}
    </li>
  )
}
