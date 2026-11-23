/**
 * Detailed information about each category of anti-D.C. congressional action
 * Historical patterns and examples
 */

// `billTrackerCategory` keys the talking points. `trackerQuery` is the bill tracker's own
// filter for the same topic (its category ids differ, and it has no budget category,
// so that card opens the whole list). The tracker reads it in src/lib/urlFilters.js.
export const categoryDetails = [
  {
    id: 'criminal-justice',
    icon: 'scale',
    title: 'Criminal justice reform',
    summary: 'Local police accountability measures targeted for repeal',
    billTrackerCategory: 'crime',
    trackerQuery: 'category=crime',
    description: `For decades, Congress has overridden D.C.'s efforts at criminal justice reform, from mandatory minimums in the 1980s to blocking the revised criminal code in 2023. Despite D.C. voters electing officials who support police accountability and bail reform, Congress has repeatedly intervened to impose harsher policies rejected by local residents.

One egregious example: In 2023, Congress used a disapproval resolution to block D.C.'s entire revised criminal code from taking effect, the result of 16 years of work by judges, prosecutors, and community advocates. It was the first time in more than 30 years Congress blocked a D.C. law from taking effect by a disapproval resolution.`
  },
  {
    id: 'healthcare',
    icon: 'heart-pulse',
    title: 'Healthcare decisions',
    summary: 'Abortion funding blocked; death with dignity and insurance regulations targeted',
    billTrackerCategory: 'health',
    trackerQuery: 'category=healthcare',
    description: `Since 1988, Congress has blocked D.C. from using even its own local tax dollars for abortion services through the Dornan Amendment. This pattern extends beyond abortion: Congress has also tried to repeal D.C.'s death with dignity law and has blocked needle exchange programs and medical marijuana regulations, treating D.C. residents as test subjects for social policy experiments.

One egregious example: The Dornan/Harris Amendment (renewed annually since 1988) prohibits D.C. from using any funds, even locally-raised tax revenue, for abortion services for low-income residents (now in Public Law 119-75). No state faces this restriction. In 2011, Congress nearly forced D.C. to shut down its entire government because the city's budget included funding for abortion services.`
  },
  {
    id: 'voting',
    icon: 'vote',
    title: 'Voting rights',
    summary: 'Local voting laws and electoral reforms challenged',
    billTrackerCategory: 'elections',
    trackerQuery: 'category=elections',
    description: `Congress has repeatedly targeted D.C.'s voting and election laws, from a proposed ban on ranked-choice voting to a House-passed repeal of a local voter eligibility expansion.

One egregious example: In June 2025, the House passed H.R. 884, which would repeal D.C.'s locally-passed law allowing non-citizen residents, including green card holders, to vote in local elections for mayor, council, and school board. The Senate has not voted on it, so D.C.'s law still stands. The House voted to repeal D.C.'s law on who can vote in D.C. elections, while D.C. voters have no voting representation in Congress itself.`
  },
  {
    id: 'traffic',
    icon: 'car-front',
    title: 'Traffic safety',
    summary: 'Traffic cameras and turn-on-red laws targeted',
    billTrackerCategory: 'transportation',
    trackerQuery: 'category=transportation',
    description: `Members of Congress have micromanaged everything from speed cameras to right-turn rules. Despite D.C. experiencing traffic violence at rates far exceeding most jurisdictions, Congress and the executive branch are working to dismantle the city's Vision Zero safety initiatives based on complaints from suburban commuters who don't live in the city.

Most egregious recent actions: In September 2025, Rep. Scott Perry introduced H.R. 5525 (the "Stop DC CAMERA Act"), which would eliminate D.C.'s automated traffic enforcement cameras. A House committee approved it in March 2026 and sent it to the full House in November 2026. These cameras generated $267 million in revenue in fiscal 2025 (funds used for local services) and enforce safety laws for speed limits, red lights, stop signs, bus lanes, and school zones. Additionally, in January 2026, the Department of Transportation proposed eliminating D.C.'s traffic cameras as part of the upcoming surface transportation bill, calling the program a "revenue trap" rather than a safety measure.

Congress and DOT are trying to block proven safety measures to protect drivers passing through from other states, prioritizing convenience over D.C. residents' lives.`
  },
  {
    id: 'budget',
    icon: 'banknote',
    title: 'Local budget',
    summary: '$1+ billion cut from D.C.\'s locally-funded budget',
    billTrackerCategory: 'budget',
    trackerQuery: '',
    description: `For decades, D.C. has been denied control over its own locally-raised tax dollars, the only city in America whose budget requires Congressional approval under the Home Rule Act. This fundamental restriction has led to repeated crises, shutdowns, and forced spending cuts.

In March 2025, the House passed a continuing resolution that, unlike past ones, omitted the routine language allowing D.C. to spend under its already-approved fiscal 2025 local budget. This omission created a roughly 16 percent hole in D.C.'s budget by blocking access to about $1.1 billion of locally raised funds and forcing the city to operate at last year's spending level midway through the fiscal year.

The $1.1 billion gap requires cutting 16% of planned spending: money from D.C. residents and businesses, not federal aid. This generates no savings for the federal government while restricting what D.C. can do with its own tax dollars. To avoid mass layoffs, Mayor Bowser imposed hiring freezes, suspended raises and overtime, and targeted contracts for cuts affecting schools, public safety, and human services.

The Senate passed the District of Columbia Local Funds Act (S. 1077) to restore D.C.'s authority, and the White House publicly urged the House to approve it. The House never voted on it, and fiscal year 2025 ended on September 30, 2025.`
  },
  {
    id: 'marijuana',
    icon: 'leaf',
    title: 'Marijuana policy',
    summary: 'Recreational marijuana commercialization blocked despite voter approval',
    billTrackerCategory: 'cannabis',
    trackerQuery: 'category=marijuana',
    description: `Despite D.C. voters approving marijuana legalization with 70% support in 2014, Congress has blocked the city from implementing voter-approved marijuana policies for over a decade. The annual "Harris Rider" budget provision prevents D.C. from spending any money, federal or local, to regulate or tax marijuana sales, creating a dangerous unregulated "gifting" market.

One egregious example: The Harris Rider, first attached to D.C.'s budget in 2014 and renewed every year since (now in Public Law 119-75), blocks D.C. from creating the legal marijuana market that voters explicitly approved. This forces D.C. residents into a gray market where marijuana is "gifted" with purchase of other items, completely unregulated, untaxed, and dangerous. Meanwhile, 24 states and neighboring Virginia have legal regulated markets.`
  },
  {
    id: 'civic-spaces',
    icon: 'landmark',
    title: 'Civic spaces & local autonomy',
    summary: 'Bills in Congress would rename D.C. streets and plazas, overriding local values and decisions',
    billTrackerCategory: 'civic-spaces',
    trackerQuery: 'category=civic-spaces',
    description: `Congress regularly seeks to exercise authority over D.C.'s civic spaces, with bills to rename streets, plazas, and monuments, in ways that contradict local values and decisions.

In December 2025, Rep. Nancy Mace (R-SC) introduced the Charlie Kirk Freedom of Speech Plaza Act to redesignate Black Lives Matter Plaza, named by D.C. to honor the racial justice movement, as "Charlie Kirk Freedom of Speech Plaza." This would force D.C. to install new street signs and update all official records, overriding a local naming decision that reflects D.C. community values.

While some street renaming bills are routine, others are intentionally provocative, using D.C.'s lack of autonomy to make political statements that contradict what D.C. residents have chosen for their own community.`
  }
]
