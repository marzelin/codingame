import {
  expect
} from 'chai'
import {
  findOverloadedField
} from '../src/findOverloadedField'

describe('findOverloadedField', function () {
  it('should return null if there\'s no field with value greater than 3', function () {
    const sandpile = [
      [1, 3],
      [2, 0]
    ]
    expect(findOverloadedField(sandpile)).to.be.null
  })
  it('should return [rowIndex, cellIndex] of a field where value is greater than 3', function () {
    const sandpile = [
      [1, 2],
      [4, 1]
    ]
    const expected = [1, 0]
    findOverloadedField(sandpile).should.deep.equal(expected)
  })
})
