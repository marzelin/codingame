import {
  OwnBy
} from './interfaces'
import {
  processTroop
} from './processTroop'

describe('processTroop', function () {
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
