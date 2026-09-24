/**
 * Vetted closing sentences for the news digest.
 *
 * The model never writes this sentence. It picks a key; `closerFor()` returns the text
 * below verbatim. That is the whole point: the two worst errors the old prompt shipped
 * were free-written legal claims ("Congress ... deploy federal troops", 2026-08-25 and
 * 2026-09-10), and Congress does not command the D.C. Guard — the President does.
 *
 * Every sentence is tied to a primary source, verified live on 2026-09-12 with a browser
 * User-Agent (code.dccouncil.gov and everycrsreport.com both serve bare curl fine; see
 * CLAUDE.md's citation standard). Re-verify whenever a sentence changes.
 */

export const CLOSERS = {
  // D.C. Code § 1-206.02(c)(1): an act takes effect at the end of the 30-day period
  // beginning on the day it is "transmitted by the Chairman to the Speaker of the House
  // of Representatives and the President of the Senate ... unless during such 30-day
  // period, there has been enacted into law a joint resolution disapproving such act."
  // Subsection (c)(2) sets a 60-day period for acts amending Titles 22, 23 or 24
  // (criminal law and procedure). Congress has used this power: see the section's
  // "Congressional Disapproval of Acts of the Council" note, most recently Pub. L. 118-1.
  // https://code.dccouncil.gov/us/dc/council/code/sections/1-206.02
  //
  // NOTE — worded carefully on 2026-09-12. An earlier draft said "every law the District
  // passes is sent to Congress before it can take effect", which the statute contradicts:
  // (c)(1) opens "Except acts of the Council which are submitted to the President ... [and]
  // any act which the Council determines ... should take effect immediately because of
  // emergency circumstances". Emergency acts take effect without waiting out the layover,
  // so "every" and "before it can take effect" were both wrong. This matters more than the
  // other three: it is the fallback sentence, and the judge never sees closers.
  laws: {
    text:
      "Without statehood, Congress reviews the District's laws and can vote to repeal " +
      'them.',
    source: 'https://code.dccouncil.gov/us/dc/council/code/sections/1-206.02',
    sourceName: 'D.C. Code § 1-206.02(c)',
  },

  // D.C. Code § 1-204.46(c)(1): "no amount may be obligated or expended by any officer
  // or employee of the District of Columbia government unless ... such amount has been
  // approved by an act of the Council ... and such act has been transmitted by the
  // Chairman to the Congress and has completed the review process."
  //
  // NOTE — this sentence was rewritten on 2026-09-12. The old prompt's example ("D.C.
  // cannot spend its own local tax revenue until Congress approves its budget") is
  // outdated: under the Local Budget Autonomy Act, D.C. has enacted its own local budget
  // since FY2017, subject to the congressional review period rather than an
  // appropriation. What remains true is the review requirement and Congress's continued
  // use of appropriations riders over local funds — CRS R48609 (March 10, 2026):
  // "Congress has continued to exercise its authority to approve, modify, or disapprove
  // the DC budget, including planned expenditures of locally generated revenues,
  // through the regular federal appropriations process."
  // https://code.dccouncil.gov/us/dc/council/code/sections/1-204.46
  // https://www.everycrsreport.com/reports/R48609.html
  budget: {
    text:
      "Without statehood, the District's budget must clear a congressional review " +
      'period before it can be spent, and Congress can still attach conditions on how ' +
      'D.C. uses its own local tax revenue.',
    source: 'https://code.dccouncil.gov/us/dc/council/code/sections/1-204.46',
    sourceName: 'D.C. Code § 1-204.46(c); CRS R48609',
  },

  // D.C. Code § 49-409: "The President of the United States shall be the
  // Commander-in-Chief of the militia of the District of Columbia." § 49-103 shows the
  // chain in practice: to use the Guard against unrest, the Mayor must "call on the
  // Commander-in-Chief", who then "shall thereupon order out so much ... of the militia
  // as he may deem necessary."
  //
  // NOTE — the old closer's second half ("cannot refuse the deployment of other states'
  // troops within its borders") is NOT carried over: no source was found for it during
  // the 2026-09-12 sourcing pass. Per CLAUDE.md, a claim without a live objective source
  // gets cut rather than hedged.
  // https://code.dccouncil.gov/us/dc/council/code/sections/49-409
  guard: {
    text:
      "Without statehood, the District's National Guard answers to the President, not " +
      'to the officials D.C. residents elect.',
    source: 'https://code.dccouncil.gov/us/dc/council/code/sections/49-409',
    sourceName: 'D.C. Code § 49-409',
  },

  // CRS In Focus IF11443, District of Columbia Voting Representation in Congress: "DC
  // residents may vote in federal elections for presidential electors (under the 23rd
  // Amendment) and for one nonvoting delegate in the House of Representatives. DC does
  // not have a representative in the Senate." Delegates "may not vote in, or preside
  // over, the House" (see also CRS R40555).
  // https://www.everycrsreport.com/reports/IF11443.html
  // NOTE — the population figure ("700,000 residents") was removed on 2026-09-13. These
  // four sentences are standing text on a page that runs unattended, and the judge never
  // sees them, so a number that drifts would go uncorrected indefinitely. CLAUDE.md bars
  // hardcoded fast-moving figures in exactly this kind of copy.
  representation: {
    text:
      'Without statehood, D.C. residents have no senators, and their one delegate to ' +
      'the House cannot vote on the House floor.',
    source: 'https://www.everycrsreport.com/reports/IF11443.html',
    sourceName: 'CRS IF11443',
  },
};

/** The fallback when headlines don't map cleanly to one power. */
export const DEFAULT_CLOSER_KEY = 'laws';

export const CLOSER_KEYS = Object.keys(CLOSERS);

/**
 * Returns the vetted sentence for a key. Unknown keys fall back rather than throwing:
 * a model typo should not cost the whole run its summary, and G1 records the fallback.
 */
export function closerFor(key) {
  // Object.hasOwn, not a truthiness test: CLOSERS['constructor'] inherits a function from
  // Object.prototype, so a model returning that word would have been treated as a valid
  // key and published `undefined` as the closing sentence.
  const known = typeof key === 'string' && Object.hasOwn(CLOSERS, key);
  const resolvedKey = known ? key : DEFAULT_CLOSER_KEY;
  return { ...CLOSERS[resolvedKey], key: resolvedKey, fellBack: !known };
}

/** Prompt-facing description of the choices, so the list lives in exactly one place. */
export function closerMenu() {
  return CLOSER_KEYS.map((key) => `- ${key}: ${CLOSERS[key].text}`).join('\n');
}
