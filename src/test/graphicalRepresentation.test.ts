import {
  graphicalRepresentation,
  joinStackLevels,
  mirrorItToCreateLeftSideOfADisk,
  padRight,
  prependWithZerosIfLengthLessThan,
  toHashes,
  trimRight
} from '../graphicalRepresentation'

describe('graphicalRepresentation', function () {
  it('should return (textual) graphical representation of a given state of hanoi tower', function () {
    const stacks = [
      [1],
      [],
      [2, 3]
    ]
    const expected = [
      '   |       |       |',
      '   |       |     #####',
      '  ###      |    #######'
    ]
    graphicalRepresentation(stacks).should.deep.equal(expected)
  })
  it('should return (textual) graphical representation of a given state of hanoi tower', function () {
    const stacks = [
      [],
      [],
      [1, 2, 3, 4]
    ]
    const expected = [
      '    |         |        ###',
      '    |         |       #####',
      '    |         |      #######',
      '    |         |     #########'
    ]
    graphicalRepresentation(stacks).should.deep.equal(expected)
  })
})

describe('prependWithZerosIfLengthLessThan', function () {
  it('should add zeros to the beginning of the array if the array is less than desired length', function () {
    prependWithZerosIfLengthLessThan(3)([1]).should.deep.equal([0, 0, 1])
  })
})

describe('toHashes', function () {
  it('should return `|` if a number is 0', function () {
    toHashes(0).should.equal('|')
  })
  it('should return n + 1 hashes', function () {
    toHashes(3).should.equal('####')
  })
})

describe('padRight', function () {
  it('should append spaces to the desired string length', function () {
    padRight(3)('|').should.equal('|  ')
    padRight(4)('##').should.equal('##  ')
  })
})

describe('mirrorItToCreateLeftSideOfADisk', function () {
  it('should mirror right side as left side', function () {
    mirrorItToCreateLeftSideOfADisk('##  ').should.equal('  ###  ')
  })
})

describe('joinStackLevels', function () {
  it('should join stack levels into one line', function () {
    const levels = [
      '  |  ',
      '  |  ',
      '  |  ',
    ]
    const stack = [
      '  |  ',
      '  |  ',
      ' ### '
    ]
    const expected = [
      '  |     |  ',
      '  |     |  ',
      '  |    ### ',
    ]
    joinStackLevels(levels, stack).should.deep.equal(expected)
  })
})

describe('trimRight', function () {
  it('should remove spacing on the right side', function () {
    trimRight('  ##  ').should.equal('  ##')
  })
})