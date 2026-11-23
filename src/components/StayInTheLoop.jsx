import { Link } from 'react-router-dom'
import Icon from './Icon'
import { EMAIL_WAY } from '../data/followWays'

// Closing block for the pages a reader reaches from the home page picker, so no path ends
// without a next step. Goes last on the page, but before a Sources block where there is
// one: sources stay last. All three strings are reused, not written here: the heading is
// the footer's label for the same page, the sentence is the Follow page's email card, and
// the button is the menu's label. The click is recorded as follow_page_opened by the
// site-wide link listener (src/lib/analytics.js), with no extra properties.
function StayInTheLoop() {
  return (
    <aside className="stay-loop">
      <h2>Stay in the loop</h2>
      <p>{EMAIL_WAY.body}</p>
      <Link className="cta-primary" to="/follow">
        <span>Follow</span> <Icon name="arrow-right" />
      </Link>
    </aside>
  )
}

export default StayInTheLoop
