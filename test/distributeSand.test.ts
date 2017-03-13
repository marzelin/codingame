import {
  distributeSand
} from '../src/distributeSand'

describe('distributeSand', function () {
  it('should distribute sand to neighbors', function () {
    const fromPosition = [0,0]
    const sandpile = [
      [5, 2],
      [0, 3]
    ]
    const expected = [
      [1, 3],
      [1, 3]
    ]
    distributeSand(fromPosition, sandpile).should.deep.equal(expected)
  })
})