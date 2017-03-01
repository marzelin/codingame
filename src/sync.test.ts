import sync = require('./sync')
const OwnBy = sync.OwnBy

describe('addDistance', function () {
  const addDistance = sync.addDistance
  it('should be a function', function () {
    addDistance.should.be.a('function')
  })
  it('should add distance to the array', function () {
    addDistance(5, 6, 1)({}).should.deep.equal({
      '5:6': 1,
    })
  })
})

describe('processTroop', function () {
  const processTroop = sync.processTroop
  it('should be a function', function () {
    processTroop.should.be.a('function')
  })
  it('should add new event if theres no event at the day of arrival', function () {
    const owner           = '1'
    const sourceFactoryId = '1'
    const targetFactoryId = '2'
    const numberOfCyborgs = '5'
    const daysToArrive    = '3'
    
    const inputArgs       = [
      owner,
      sourceFactoryId,
      targetFactoryId,
      numberOfCyborgs,
      daysToArrive,
    ]

    const factories = {
      2: {
        id: 2,
        owner: OwnBy.me,
        production: 2,
        availableCyborgs: 5,
        frozenDays: 0,
        isBombTarget: false,
        eventsAtDay: {
        }
      }
    }

    const expected = {
      2: {
        eventsAtDay: {
          3: {
            day: 3,
            incomingTroopSize: 5,
            troopOwner: OwnBy.me
          }
        }
      }
    }

    processTroop(inputArgs, factories)
  })
})