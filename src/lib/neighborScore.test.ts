import {
  Iscores
} from './interfaces'
import {
  byNeighborScore
} from './neighborScore'

describe('byNeighborScore', function () {
  it('should sort a list of elements by a given score list descending', function () {
    const scores: Iscores = {
      2: -1,
      1: 5,
      3: 3
    }
    const factoriesIds = [1, 2, 3]
    const expected = [1, 3, 2]
    factoriesIds.sort(byNeighborScore(scores)).should.deep.equal(expected)
  })
})