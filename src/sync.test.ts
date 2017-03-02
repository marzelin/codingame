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
        id              : 2,
        owner           : OwnBy.me,
        production      : 2,
        availableCyborgs: 5,
        frozenDays      : 0,
        isBombTarget    : false,
        eventsAtDay     : { }
      }
    }

    const expected = {
      2: {
        id              : 2,
        owner           : OwnBy.me,
        production      : 2,
        availableCyborgs: 5,
        frozenDays      : 0,
        isBombTarget    : false,
        eventsAtDay: {
          3: {
            day: 3,
            incomingTroopSize: 5,
            troopOwner: OwnBy.me
          }
        }
      }
    }

    processTroop(inputArgs, factories).should.deep.equal(expected)
  })
  
  it('should add troop sizes if the owner is the same', function () {
    const owner           = '-1'
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
        id              : 2,
        owner           : OwnBy.enemy,
        production      : 2,
        availableCyborgs: 5,
        frozenDays      : 0,
        isBombTarget    : false,
        eventsAtDay     : {
          3: {
            day:               3,
            incomingTroopSize: 1,
            troopOwner:        OwnBy.enemy
          }
        }
      }
    }

    const expected = {
      2: {
        id              : 2,
        owner           : OwnBy.enemy,
        production      : 2,
        availableCyborgs: 5,
        frozenDays      : 0,
        isBombTarget    : false,
        eventsAtDay: {
          3: {
            day:               3,
            incomingTroopSize: 6,
            troopOwner:        OwnBy.enemy
          }
        }
      }
    }

    processTroop(inputArgs, factories).should.deep.equal(expected)
  })
  it('should subtract troops if owners are different and the owner should stay the same if previous troop is bigger in size', function () {
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
        id              : 2,
        owner           : OwnBy.enemy,
        production      : 2,
        availableCyborgs: 5,
        frozenDays      : 0,
        isBombTarget    : false,
        eventsAtDay     : {
          3: {
            day:               3,
            incomingTroopSize: 11,
            troopOwner:        OwnBy.enemy
          }
        }
      }
    }

    const expected = {
      2: {
        id              : 2,
        owner           : OwnBy.enemy,
        production      : 2,
        availableCyborgs: 5,
        frozenDays      : 0,
        isBombTarget    : false,
        eventsAtDay: {
          3: {
            day:               3,
            incomingTroopSize: 6,
            troopOwner:        OwnBy.enemy
          }
        }
      }
    }

    processTroop(inputArgs, factories).should.deep.equal(expected)
  })
  it('should subtract troops and change owner if incoming troops are bigger in size', function () {
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
        id              : 2,
        owner           : OwnBy.enemy,
        production      : 2,
        availableCyborgs: 5,
        frozenDays      : 0,
        isBombTarget    : false,
        eventsAtDay     : {
          3: {
            day:               3,
            incomingTroopSize: 1,
            troopOwner:        OwnBy.enemy
          }
        }
      }
    }

    const expected = {
      2: {
        id              : 2,
        owner           : OwnBy.enemy,
        production      : 2,
        availableCyborgs: 5,
        frozenDays      : 0,
        isBombTarget    : false,
        eventsAtDay: {
          3: {
            day:               3,
            incomingTroopSize: 4,
            troopOwner:        OwnBy.me
          }
        }
      }
    }

    processTroop(inputArgs, factories).should.deep.equal(expected)
  })
  it('should not modify bomb explosion', function () {
    const owner           = '1'
    const sourceFactoryId = '1'
    const targetFactoryId = '2'
    const numberOfCyborgs = '8'
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
        id              : 2,
        owner           : OwnBy.enemy,
        production      : 2,
        availableCyborgs: 5,
        frozenDays      : 0,
        isBombTarget    : false,
        eventsAtDay     : {
          3: {
            day:               3,
            incomingTroopSize: 1,
            troopOwner:        OwnBy.enemy,
            isBombExploding: true
          }
        }
      }
    }

    const expected = {
      2: {
        id              : 2,
        owner           : OwnBy.enemy,
        production      : 2,
        availableCyborgs: 5,
        frozenDays      : 0,
        isBombTarget    : false,
        eventsAtDay: {
          3: {
            day:               3,
            incomingTroopSize: 7,
            troopOwner:        OwnBy.me,
            isBombExploding: true
          }
        }
      }
    }

    processTroop(inputArgs, factories).should.deep.equal(expected)
  })
})

describe('cyborgsAfterBombExplosion', function () {
  const cyborgsAfterBombExplosion = sync.cyborgsAfterBombExplosion
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
  const getFuture = sync.getFuture
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