import runCode from './index'
import {
  hanoiTower
} from './index'

describe('runCode', function () {
  it('should be a function', function () {
    runCode.should.be.a('function')
  })
})

describe('hanoiTower', function () {
  it('should return the number of turns needed to complete hanoi tower', function () {
    const expected = {
      stacksAtGivenTurn: [
        [1],
        [],
        [2, 3]
      ],
      turnsToCompleteGame: 7
    }
    hanoiTower(3, 6).should.deep.equal(expected)
  })
  it('should return the state of the tower at a given time and the number of turns needed to complete hanoi tower', function () {
    const result = hanoiTower(4, 15)
    const expected = {
      stacksAtGivenTurn: [
        [], [], [1, 2, 3, 4]
      ],
      turnsToCompleteGame: 15
    }
    result.should.deep.equal(expected)
  })
})