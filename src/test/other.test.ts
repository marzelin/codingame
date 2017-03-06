import {
  allDisks,
  gameIsNotFinished,
  initialStacksState
} from '../other'

describe('allDisks', function () {
  it('should return an array with numbers from 1 to a given number', function () {
    allDisks(4).should.deep.equal([1, 2, 3, 4])
  })
})

describe('initialStacksState', function () {
  it('should return initial state of hanoi stacks', function () {
    initialStacksState(3).should.deep.equal([
      [1, 2, 3],
      [],
      []
    ])
  })
})

describe('gameIsNotFinished', function () {
  it('should return true if there are still disks on first and second stack', function () {
    const stacks = [
      [1, 2, 3],
      [],
      []
    ]
    gameIsNotFinished(stacks).should.be.true
  })
  it('should return false if all disks are on the last stack', function () {
    const stacks = [
      [],
      [],
      [1, 2, 3]
    ]
    gameIsNotFinished(stacks).should.be.false
  })
})