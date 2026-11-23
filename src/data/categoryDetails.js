/**
 * Detailed information about each category of anti-DC congressional action
 * Historical patterns and egregious examples to educate visitors
 */

// `billTrackerCategory` keys the talking points. `trackerQuery` is the bill tracker's own
// filter for the same topic (its category ids differ, and it has no budget category,
// so that card opens the whole list). The tracker reads it in src/lib/urlFilters.js.
export const categoryDetails = [
  {
    id: 'criminal-justice',
    icon: 'scale',
    title: 'Criminal Justice Reform',
    summary: 'Local police accountability measures targeted for repeal',
    billTrackerCategory: 'crime',
    trackerQuery: 'category=crime',
    description: `For decades, Congress has overridden DC's efforts at criminal justice reform, from mandatory minimums in the 1980s to blocking the revised criminal code in 2023. Despite DC voters electing officials who support police accountability and bail reform, Congress has repeatedly intervened to impose harsher policies rejected by local residents.

One egregious example: In 2023, Congress used a disapproval resolution to block DC's entire revised criminal code from taking effect, the result of more than 15 years of work by prosecutors, defense attorneys and community advocates. It was the first time in more than 30 years Congress blocked a DC law from taking effect by a disapproval resolution.

DC's incarceration rate is the highest in the nation, driven partly by congressional interventions that override local preferences for reform and restorative justice approaches.`
  },
  {
    id: 'healthcare',
    icon: 'heart-pulse',
    title: 'Healthcare Decisions',
    summary: 'Abortion funding blocked; death with dignity and insurance regulations targeted',
    billTrackerCategory: 'health',
    trackerQuery: 'category=healthcare',
    description: `Since 1988, Congress has blocked DC from using even its own local tax dollars for abortion services through the Dornan Amendment. This pattern extends beyond abortion: Congress has also tried to repeal DC's death with dignity law and has blocked needle exchange programs and medical marijuana regulations, treating DC residents as test subjects for social policy experiments.

One egregious example: The Dornan/Harris Amendment (renewed annually since 1988) prohibits DC from using any funds, even locally-raised tax revenue, for abortion services for low-income residents (now in Public Law 119-75). No state faces this restriction. In 2011, Congress nearly forced DC to shut down its entire government because the city's budget included funding for abortion services.

DC residents face unique healthcare restrictions that exist nowhere else in America, creating a two-tiered system where constitutional rights depend on your zip code.`
  },
  {
    id: 'voting',
    icon: 'vote',
    title: 'Voting Rights',
    summary: 'Local voting laws and electoral reforms challenged',
    billTrackerCategory: 'elections',
    trackerQuery: 'category=elections',
    description: `Congress has repeatedly targeted DC's voting and election laws, from a proposed ban on ranked-choice voting to a House-passed repeal of a local voter eligibility expansion. While DC voters have no say in Congress, Congress claims absolute authority over who can vote in local DC elections, including for school board and neighborhood commissions.

One egregious example: In June 2025, the House passed H.R. 884, which would repeal DC's locally-passed law allowing non-citizen residents, including green card holders, to vote in local elections for mayor, council, and school board. The Senate has not voted on it, so DC's law still stands. The House voted to repeal DC's law on who can vote in DC elections, while DC voters have no voting representation in Congress itself.

Congress claims the power to decide who can vote in DC's local elections while denying those same DC voters representation in Congress, a circular disenfranchisement unique in American democracy.`
  },
  {
    id: 'traffic',
    icon: 'car-front',
    title: 'Traffic Safety',
    summary: 'Traffic cameras and turn-on-red laws targeted by both Congress and the executive branch',
    billTrackerCategory: 'transportation',
    trackerQuery: 'category=transportation',
    description: `Congressional interference in DC's traffic laws reached absurd levels in recent years, with members of Congress micromanaging everything from speed cameras to right-turn rules. Despite DC experiencing traffic violence at rates far exceeding most jurisdictions, Congress and the executive branch are working to dismantle the city's Vision Zero safety initiatives based on complaints from suburban commuters who don't live in the city.

Most egregious recent actions: In September 2025, Rep. Scott Perry introduced H.R. 5525 (the "Stop DC CAMERA Act"), which would eliminate DC's automated traffic enforcement cameras. A House committee approved it in March 2026 and sent it to the full House in November 2026. These cameras generated $267 million in revenue in FY2025 (funds used for local services) and enforce safety laws for speed limits, red lights, stop signs, bus lanes, and school zones. Additionally, in January 2026, the Department of Transportation proposed eliminating DC's traffic cameras as part of the upcoming surface transportation bill, calling the program a "revenue trap" rather than a safety measure.

The dual attack from both Congress and the executive branch demonstrates extraordinary federal overreach into local traffic safety policy. DC has one of the highest pedestrian fatality rates among major cities, yet studies show automated cameras reduce speeding by 70% and cut fatal crashes by 30% near schools. Congress and DOT are trying to block proven safety measures to protect drivers passing through from other states, prioritizing convenience over DC residents' lives.`
  },
  {
    id: 'budget',
    icon: 'banknote',
    title: 'Local Budget',
    summary: '$1+ billion cut from D.C.\'s locally-funded budget',
    billTrackerCategory: 'budget',
    trackerQuery: '',
    description: `For decades, DC has been denied control over its own locally-raised tax dollars, the only city in America whose budget requires Congressional approval under the Home Rule Act. This fundamental restriction has led to repeated crises, shutdowns, and forced spending cuts.

One egregious example: In March 2025, the House passed a continuing resolution that, unlike past CRs, omitted the routine language allowing DC to spend under its already-approved FY 2025 local budget. This omission created a hole in DC's budget by blocking access to about $1.1 billion of locally raised funds and forcing the city to operate at last year's spending level midway through the fiscal year.

The $1.1 billion gap required cuts to planned spending: money from DC residents and businesses, not federal aid. This generates no savings for the federal government while restricting what DC can do with its own tax dollars. To avoid mass layoffs, Mayor Bowser imposed hiring freezes, suspended raises and overtime, and targeted contracts for cuts affecting schools, public safety, and human services.

The Senate passed the District of Columbia Local Funds Act (S. 1077) to restore DC's authority, and the White House publicly urged the House to approve it. The House never voted on it, and fiscal year 2025 ended on September 30, 2025.

DC taxpayers pay more federal taxes per capita than any state, yet Congress treats DC's local budget as a political football, forcing spending decisions that override local priorities and democratic accountability.`
  },
  {
    id: 'marijuana',
    icon: 'leaf',
    title: 'Marijuana Policy',
    summary: 'Recreational marijuana commercialization blocked despite voter approval',
    billTrackerCategory: 'cannabis',
    trackerQuery: 'category=marijuana',
    description: `Despite DC voters approving marijuana legalization with 70% support in 2014, Congress has blocked the city from implementing voter-approved marijuana policies for over a decade. The annual "Harris Rider" budget provision prevents DC from spending any money, federal or local, to regulate or tax marijuana sales, creating a dangerous unregulated "gifting" market.

One egregious example: The Harris Rider, first attached to DC's budget in 2014 and renewed every year since (now in Public Law 119-75), blocks DC from creating the legal marijuana market that voters explicitly approved. This forces DC residents into a gray market where marijuana is "gifted" with purchase of other items, completely unregulated, untaxed, and dangerous. Meanwhile, 24 states and neighboring Virginia have legal regulated markets.

DC is the only jurisdiction where Congress has overridden voter-approved marijuana legalization, creating public safety risks and denying DC tens of millions in potential tax revenue, while surrounding states profit from legal markets.`
  },
  {
    id: 'civic-spaces',
    icon: 'landmark',
    title: 'Civic Spaces & Local Autonomy',
    summary: 'Bills in Congress would rename DC streets and plazas, overriding local values and decisions',
    billTrackerCategory: 'civic-spaces',
    trackerQuery: 'category=civic-spaces',
    description: `Congress regularly seeks to exercise authority over DC's civic spaces, with bills to rename streets, plazas, and monuments, in ways that contradict local values and decisions. These bills use DC as a battleground for national culture wars, treating the city's public spaces as federal property rather than community assets that belong to DC residents.

One egregious example: In December 2025, Rep. Nancy Mace (R-SC) introduced the Charlie Kirk Freedom of Speech Plaza Act to redesignate Black Lives Matter Plaza, named by DC to honor the racial justice movement, as "Charlie Kirk Freedom of Speech Plaza." This would force DC to install new street signs and update all official records, overriding a local naming decision that reflects DC community values.

While some street renaming bills are routine, others are intentionally provocative, using DC's lack of autonomy to make political statements that contradict what DC residents have chosen for their own community. No state would tolerate Congress renaming its state capital's streets and plazas to impose political messages rejected by local residents. DC's civic spaces should reflect DC values, not be tools for congressional culture wars.`
  }
]
