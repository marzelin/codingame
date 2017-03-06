import {
  findDirection,
  getIndexStackWhereSmallestDiskIs,
  getOtherStacksIndexes,
  getToMoveIndex,
  moveDisk,
  moveOtherDisk,
  moveSmallestDisk
} from '../moves'

describe('getToMoveIndex', function () {
  it('should return index to the left if there\'s odd number of disks', function () {
    getToMoveIndex(0, -1).should.equal(2)
  })
  it('should return index to the right if there\'s even number of disks', function () {
    getToMoveIndex(2, 1).should.equal(0)
  })
})

describe('findDirection', function () {
  it('should return -1 (left) is the number of disks is odd', function () {
    const stacks = [
      [1],
      [2, 3],
      []
    ]
    findDirection(stacks).should.equal(-1)
  })
  it('should return 1 (right) if the number of disks is even', function () {
    const stacks = [
      [2, 3],
      [4],
      [1]
    ]
    findDirection(stacks).should.equal(1)
  })
})

describe('getIndexStackWhereSmallestDiskIs', function () {
  it('should get the index where the smallest disk currently is', function () {
    const stacks = [
      [2, 3],
      [1],
      []
    ]
    getIndexStackWhereSmallestDiskIs(stacks).should.equal(1)
  })
})

describe('moveSmallestDisk', function () {
  it('should move the smallest disk to the right if the number of disks is even', function () {
    const stacks = [
      [1, 2, 3, 4],
      [],
      []
    ]
    const expected = [
      [2, 3, 4],
      [1],
      []
    ]
    moveSmallestDisk(stacks).should.deep.equal(expected)
  })
  it('should move the smallest disk to the left if the number of disks is odd', function () {
    const stacks = [
      [1, 2, 3],
      [],
      []
    ]
    const expected = [
      [2, 3],
      [],
      [1]
    ]
    moveSmallestDisk(stacks).should.deep.equal(expected)
  })
})

describe('moveOtherDisk', function () {
  it('should move second to smallest disk into another stack', function () {
    const stacks = [
      [2, 3],
      [],
      [1]
    ]
    const expected = [
      [3],
      [2],
      [1]
    ]
    moveOtherDisk(stacks).should.deep.equal(expected)
  })
})

describe('getOtherStacksIndexes', function () {
  it('should return indexes of all stacs apart from where the samllest disk is sorted from by the top disk ascending', function () {
    const stacks = [
      [3, 4],
      [2],
      [1]
    ]
    const expected = [1, 0]
    getOtherStacksIndexes(stacks).should.deep.equal(expected)
  })
  it('if the stack is empty it should treat it as if there was Infinite disk at the top (it should always be ordered as second)', function () {
    const stacks = [
      [2, 3],
      [],
      [1]
    ]
    const expected = [0, 1]
    getOtherStacksIndexes(stacks).should.deep.equal(expected)
  })
})

describe('moveDisk', function () {
  it('should move a disk from one stack to the other', function () {
    const stacks = [
      [1, 2, 3],
      [],
      []
    ]
    const expected = [
      [2, 3],
      [],
      [1]
    ]
    moveDisk(0, 2, stacks).should.deep.equal(expected)
  })
  it('should add disk at first position (prepend it)', function () {
    const stacks = [
      [3],
      [2],
      [1]
    ]
    const expected = [
      [3],
      [1, 2],
      []
    ]
    moveDisk(2, 1, stacks).should.deep.equal(expected)
  })
})