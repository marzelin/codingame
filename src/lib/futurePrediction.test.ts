import {
  cyborgsAfterBombExplosion,
  getFuture
} from './futurePrediction'
import {
  OwnBy
} from './interfaces'

describe('cyborgsAfterBombExplosion', function () {
  it('should exist', function () {
    cyborgsAfterBombExplosion.should.be.a('function')
  })
  it('should decrease the number of troops if the number of troops is over 20', function () {
    const cyborgCount = 33
    const expected = 17
    cyborgsAfterBombExplosion(cyborgCount).should.equal(expected)
  })
  it('should return 10 if the number of cyborgs is below or equal to 20', function () {
    const cyborgCount = 17
    const expected = 7
    cyborgsAfterBombExplosion(cyborgCount).should.equal(expected)
  })
})

describe('getFuture', function () {
  it('should exist', function () {
    getFuture.should.be.a('function')
  })
  it('should return proper number of frozen turns when bomb explodes', function() {
    const inputFactory = {
      id              : 2,
      owner           : OwnBy.enemy,
      production      : 2,
      availableCyborgs: 5,
      frozenDays      : 0,
      isBombTarget    : false,
      eventsAtDay     : {
        3: {
          day:               3,
          isBombExploding: true
        }
      }
    }

    const expected = {
      id              : 2,
      owner           : OwnBy.enemy,
      production      : 2,
      availableCyborgs: 0,
      frozenDays      : 4,
      isBombTarget    : false,
      eventsAtDay     : {
        3: {
          day:               3,
          isBombExploding: true
        }
      }
    }
    getFuture(inputFactory, 4).should.deep.equal(expected)
  })
})