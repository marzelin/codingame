import {
  printable
} from '../src/printable'

describe('printable', function () {
  it('should convert sandpile into an output string', function () {
    const sandpile = [
      [1, 2],
      [0, 3]
    ]
    const expected = '12\n03'
    printable(sandpile).should.equal(expected)
  })
})