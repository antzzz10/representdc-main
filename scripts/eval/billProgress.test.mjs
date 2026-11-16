// Checks for the split shown under the headline bill count (src/lib/billProgress.js).
import test from 'node:test'
import assert from 'node:assert/strict'
import { readProgress, contextParts, isHeadlineCount, headlineNoun } from '../../src/lib/billProgress.js'

const stats = (totalBills, progress) => ({ totalBills, progress })
const block = (law, clearedChamber, notPassedEitherChamber, clearedChamberWhere = 'house') =>
  ({ law, clearedChamber, clearedChamberWhere, notPassedEitherChamber })

test('a split that adds up to the headline is shown in the agreed words', () => {
  const progress = readProgress(stats(74, block(4, 10, 60)))
  assert.deepEqual(contextParts(progress),
    ['4 are law', '10 passed the House and await the Senate', '60 have not passed either chamber'])
})

test('a split that does not add up, or is malformed, is not shown', () => {
  assert.equal(readProgress(stats(74, block(4, 10, 61))), null)
  assert.equal(readProgress(stats(74, block(4, '10', 60))), null)
  assert.equal(readProgress(stats(74, block(-1, 15, 60))), null)
  assert.equal(readProgress(stats('74', block(4, 10, 60))), null)
  assert.equal(readProgress(stats(74, undefined)), null)
  assert.equal(readProgress({}), null)
  assert.deepEqual(contextParts(null), [])
})

test('a chamber is named only when the tracker says so', () => {
  const mixed = readProgress(stats(3, block(0, 2, 1, 'mixed')))
  assert.equal(contextParts(mixed)[0], '2 cleared at least one chamber and are not law')
  const unknown = readProgress(stats(3, block(0, 2, 1, 'somewhere')))
  assert.equal(contextParts(unknown)[0], '2 cleared at least one chamber and are not law')
  const senate = readProgress(stats(1, block(0, 1, 0, 'senate')))
  assert.deepEqual(contextParts(senate), ['1 passed the Senate and awaits the House'])
})

test('singular forms and empty groups', () => {
  assert.deepEqual(contextParts(readProgress(stats(1, block(1, 0, 0, null)))), ['1 is law'])
  assert.deepEqual(contextParts(readProgress(stats(1, block(0, 0, 1, null)))), ['1 has not passed either chamber'])
  assert.deepEqual(contextParts(readProgress(stats(0, block(0, 0, 0, null)))), [])
  assert.equal(headlineNoun(1), 'threat to D.C. home rule')
  assert.equal(headlineNoun(74), 'threats to D.C. home rule')
})

test('only a whole number, zero or more, counts as a headline', () => {
  for (const bad of [undefined, null, '74', -1, 7.5, NaN, Infinity]) assert.equal(isHeadlineCount(bad), false)
  assert.equal(isHeadlineCount(0), true)
  assert.equal(isHeadlineCount(74), true)
})

test('no group is ever called "pending"', () => {
  for (const where of ['house', 'senate', 'mixed']) {
    const parts = contextParts(readProgress(stats(6, block(1, 2, 3, where))))
    assert.ok(!parts.some(part => /pending/i.test(part)))
  }
})
