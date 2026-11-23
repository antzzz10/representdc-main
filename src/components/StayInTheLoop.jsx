import { Link } from 'react-router-dom'
import Icon from './Icon'
import { EMAIL_WAY } from '../data/followWays'

// Closing block for the pages a reader reaches from the home page picker, so no path ends
// without a next step. Goes last on the page, but before a Sources block where there is
// one: sources stay last. The sentence is the Follow page's email card and the button is
// the menu's label. The heading is this block's own (the footer link and the Follow page
// title, which used to share it, now read "Follow"). The click is recorded as follow_page_opened by the
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
