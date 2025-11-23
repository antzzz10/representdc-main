/**
 * Detailed information about each category of anti-DC congressional action
 * Sources and examples for the main page impact section
 */

export const categoryDetails = [
  {
    id: 'criminal-justice',
    icon: '⚖️',
    title: 'Criminal Justice Reform',
    summary: 'Local police accountability measures blocked or restricted',
    billTrackerCategory: 'crime',
    examples: [
      {
        number: 'H.R. 5172',
        name: 'Strong Sentences for Safer D.C. Streets Act',
        description: 'Increased mandatory detention and expanded cash bail in DC',
        impact: 'Higher pretrial incarceration, especially for nonviolent offenses',
        status: 'passed-law',
        statusLabel: 'Passed into Law',
        url: 'https://www.congress.gov/bill/119th-congress/house-bill/5172'
      },
      {
        number: 'H.R. 5107',
        name: 'CLEAN DC Act',
        description: 'Rolled back accountability, transparency, and oversight measures',
        impact: 'Reduced police oversight, limits on discipline and accountability',
        status: 'passed-house',
        statusLabel: 'Passed House',
        url: 'https://www.congress.gov/bill/119th-congress/house-bill/5107'
      },
      {
        number: 'H.R. 4922',
        name: 'DC CRIMES Act of 2025',
        description: 'Lowers "youth" age, mandates adult trial for 18+, limits judicial discretion',
        impact: 'Tougher sentences for youth, more prosecuted as adults',
        status: 'passed-house',
        statusLabel: 'Passed House',
        url: 'https://www.congress.gov/bill/119th-congress/house-bill/4922'
      }
    ]
  },
  {
    id: 'healthcare',
    icon: '🏥',
    title: 'Healthcare Decisions',
    summary: 'Abortion access, death with dignity, and insurance regulations overturned',
    billTrackerCategory: 'health',
    examples: [
      {
        number: 'H.R. 7',
        name: 'No Taxpayer Funding for Abortion Act',
        description: 'Prohibits DC from spending any federal/local funds on abortion or abortion insurance',
        impact: 'Severe restrictions on abortion access for DC residents',
        status: 'passed-law',
        statusLabel: 'Passed into Law',
        url: 'https://www.congress.gov/bill/119th-congress/house-bill/7'
      },
      {
        number: 'Budget Reconciliation',
        name: 'Medicaid Restrictions for DC',
        description: 'Narrows Medicaid and health eligibility for DC via federal reconciliation',
        impact: 'Reduced coverage, health access for low-income residents',
        status: 'enacted',
        statusLabel: 'Enacted',
        url: 'https://www.kff.org/medicaid/tracking-the-medicaid-provisions-in-the-2025-budget-bill/'
      }
    ]
  },
  {
    id: 'voting',
    icon: '🗳️',
    title: 'Voting Rights',
    summary: 'Local voting laws and electoral reforms challenged',
    billTrackerCategory: 'elections',
    examples: [
      {
        number: 'H.R. 884',
        name: 'DC Noncitizen Voting Ban',
        description: 'Repeals DC law allowing noncitizens to vote in local elections',
        impact: 'Federal control over local elections, disenfranchisement',
        status: 'passed-law',
        statusLabel: 'Passed into Law',
        url: 'https://www.congress.gov/bill/119th-congress/house-bill/884'
      },
      {
        number: 'H.R. 3877',
        name: 'Washington, D.C. Residents Voting Act',
        description: 'Congress reviews/vetoes DC Council voter eligibility expansions',
        impact: 'Prevents home rule expansions on voting',
        status: 'pending',
        statusLabel: 'Pending',
        url: 'https://www.congress.gov/bill/119th-congress/house-bill/3877'
      }
    ]
  },
  {
    id: 'traffic',
    icon: '🚦',
    title: 'Traffic Safety',
    summary: 'Even traffic cameras and turn-on-red laws targeted by Congress',
    billTrackerCategory: 'transportation',
    examples: [
      {
        number: 'Appropriations Rider',
        name: 'Automated Traffic Enforcement Funding Ban',
        description: 'Prevents DC funds from supporting traffic safety cameras/devices',
        impact: 'Halt to camera expansion, fewer safety resources',
        status: 'enacted',
        statusLabel: 'Enacted',
        url: 'https://www.axios.com/local/washington-dc/2025/07/21/dc-interventions-congress-house-appropriations'
      },
      {
        number: 'H.R. 5525',
        name: 'Stop DC CAMERA Act',
        description: 'Prohibits DC from using red light and speed cameras for enforcement',
        impact: 'Less automated enforcement, higher accident risk',
        status: 'passed-house',
        statusLabel: 'Passed House',
        url: 'https://www.congress.gov/bill/119th-congress/house-bill/5525'
      }
    ]
  },
  {
    id: 'budget',
    icon: '💰',
    title: 'Local Budget',
    summary: '$1+ billion cut from D.C.\'s locally-funded budget',
    billTrackerCategory: 'budget',
    examples: [
      {
        number: 'S. 1077',
        name: 'Local Funds Act',
        description: 'Restores DC ability to spend local-raised funds after House block',
        impact: 'Prevented critical service disruptions',
        status: 'passed-law',
        statusLabel: 'Passed into Law',
        url: 'https://www.congress.gov/bill/119th-congress/senate-bill/1077'
      },
      {
        number: 'Budget Resolution',
        name: 'Local Spending Cuts',
        description: '$1 billion reduction, reverted DC to previous year\'s budget',
        impact: 'Major cuts to city agencies and programs',
        status: 'enacted',
        statusLabel: 'Enacted',
        url: 'https://www.dcfpi.org/all/congress-set-to-force-1-billion-in-spending-cuts-for-dc/'
      }
    ]
  },
  {
    id: 'marijuana',
    icon: '🌱',
    title: 'Marijuana Policy',
    summary: 'Recreational marijuana commercialization blocked despite voter approval',
    billTrackerCategory: 'cannabis',
    examples: [
      {
        number: 'Harris Rider',
        name: 'DC Marijuana Commercialization Ban',
        description: 'Blocks DC from using funds for regulated retail market',
        impact: 'No legal retail market, ongoing black market',
        status: 'enacted',
        statusLabel: 'Enacted (Annual Rider)',
        url: 'https://www.cannabisregulations.ai/cannabis-and-hemp-regulations-compliance-ai-blog/dc-2025-harris-rider-gifting-enforcement-outlook'
      },
      {
        number: 'Committee Action',
        name: 'Marijuana Expungements Law Repeal',
        description: 'Repeals DC law expanding expungements for marijuana possession',
        impact: 'More criminal records, less justice reform impact',
        status: 'passed-committee',
        statusLabel: 'Passed Committee',
        url: 'https://www.marijuanamoment.net/congressional-committee-votes-to-repeal-marijuana-expungements-law-in-washington-d-c/'
      }
    ]
  }
]
