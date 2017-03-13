import {
  createSandpile
} from '../src/createSandpile'

describe('createSandpile', function () {
  it('should return an array of arrays containing the number of grains in a given sandpile field', function () {
    const size = 2
    const lines = [
      '12',
      '34'
    ]
    const expected = [
      [1, 2],
      [3, 4]
    ]
    createSandpile(lines).should.deep.equal(expected)
  })
})