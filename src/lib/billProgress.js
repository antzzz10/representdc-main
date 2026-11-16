// The split shown under the headline bill count, in words that stay true.
//
// Decided 2026-11-15 (Andria): every surface leads with the same headline, the count of
// every tracked anti-DC measure (stats.totalBills), and gives the split as context.
// "Pending" is not used for any group: a bill that passed one chamber is pending too.
// The wording mirrors dc-bills-tracker/src/lib/progressSplit.js, which publishes the
// counts in stats.json as `progress`.

const isCount = value => Number.isInteger(value) && value >= 0

/**
 * Read `progress` from stats.json. Returns null unless every count is present and the
 * three add up to the headline, so a page never shows a split that contradicts it.
 */
export function readProgress(data) {
  const progress = data?.progress
  if (!progress) return null
  const { law, clearedChamber, clearedChamberWhere, notPassedEitherChamber } = progress
  if (![law, clearedChamber, notPassedEitherChamber].every(isCount)) return null
  if (law + clearedChamber + notPassedEitherChamber !== data.totalBills) return null
  const where = ['house', 'senate'].includes(clearedChamberWhere) ? clearedChamberWhere : 'mixed'
  return { law, moving: clearedChamber, movingWhere: where, notPassed: notPassedEitherChamber }
}

const one = n => n === 1

/** "passed the House and await the Senate", agreeing with the count. */
export function movingPhrase(n, where) {
  if (where === 'house') return `passed the House and ${one(n) ? 'awaits' : 'await'} the Senate`
  if (where === 'senate') return `passed the Senate and ${one(n) ? 'awaits' : 'await'} the House`
  return `cleared at least one chamber and ${one(n) ? 'is' : 'are'} not yet law`
}

/**
 * ["4 are law", "10 passed the House and await the Senate", "60 have not passed either chamber"].
 * Groups with nothing in them are left out.
 */
export function contextParts(progress) {
  if (!progress) return []
  const { law, moving, movingWhere, notPassed } = progress
  return [
    law > 0 && `${law} ${one(law) ? 'is' : 'are'} law`,
    moving > 0 && `${moving} ${movingPhrase(moving, movingWhere)}`,
    notPassed > 0 && `${notPassed} ${one(notPassed) ? 'has' : 'have'} not passed either chamber`,
  ].filter(Boolean)
}

/** The same three groups as number + label pairs, for stat tiles. */
export function progressTiles(progress) {
  if (!progress) return []
  const { law, moving, movingWhere, notPassed } = progress
  return [
    law > 0 && { number: law, label: one(law) ? 'is law' : 'are law' },
    moving > 0 && { number: moving, label: movingPhrase(moving, movingWhere) },
    notPassed > 0 && { number: notPassed, label: `${one(notPassed) ? 'has' : 'have'} not passed either chamber` },
  ].filter(Boolean)
}

/** "threats to D.C. home rule": the one headline label, used with totalBills everywhere. */
export const headlineNoun = count => `${count === 1 ? 'threat' : 'threats'} to D.C. home rule`
