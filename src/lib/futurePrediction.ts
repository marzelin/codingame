import {
  arriveUntil
} from './filterPredicates'
import {
  Ifactory,
  OwnBy
} from './interfaces'
import {
  eventsToList
} from './utilities'

const getFuture = (factory: Ifactory, day: number) => {
  const events = eventsToList(factory.eventsAtDay)
    .filter(arriveUntil(day))

  if (events.length === 0) { // there's no incoming troops
    if (factory.owner === OwnBy.nobody) {
      return factory // return unchanged factory because neutral factories do not produce cyborgs
    }
    const initialfrozenDays = factory.frozenDays
    const remainingFrozenDays = Math.max(initialfrozenDays - day, 0)
    const newAvailableCyborgs = factory.availableCyborgs + factory.production * Math.max(day - initialfrozenDays, 0)
    const updatedFactory = [factory]
      .map((factory) => ({...factory, availableCyborgs: newAvailableCyborgs}))
      .map((factory) => ({...factory, frozenDays: remainingFrozenDays}))[0]
    return updatedFactory
  }

  let futureFactory = factory
  let previousArrivalDay = 0
  for (let event of events) {
    let futureOwner         = futureFactory.owner
    let troopSize           = event.incomingTroopSize
    let newOwner            = futureFactory.owner
    let production          = futureFactory.production
    let arrivalDay          = event.day
    let newAvailableCyborgs = futureFactory.availableCyborgs
    let isBombExploding     = event.isBombExploding
    let newFrozenDays       = futureFactory.frozenDays

    if (newOwner !== OwnBy.nobody) {
      newAvailableCyborgs =  newAvailableCyborgs + production * Math.max(arrivalDay - previousArrivalDay - newFrozenDays, 0)
    }

    newFrozenDays = Math.max(newFrozenDays - (arrivalDay - previousArrivalDay), 0)

    if (isBombExploding) {
      newAvailableCyborgs = cyborgsAfterBombExplosion(newAvailableCyborgs) 
      newFrozenDays = 5
    }
    
    if (troopSize !== undefined) {
      switch (futureOwner) {
        case OwnBy.me:
          if (event.troopOwner === OwnBy.me) { // my own troops coming
            newAvailableCyborgs = newAvailableCyborgs + troopSize
          } else { // enemy troops coming
            newAvailableCyborgs = newAvailableCyborgs - troopSize
            if (newAvailableCyborgs < 0) {
              newOwner = OwnBy.enemy // change owner
              newAvailableCyborgs = newAvailableCyborgs * -1 // make cyborg count a positive number
            }
          }
          break
        case OwnBy.enemy:
          if (event.troopOwner === OwnBy.me) { // my own troops coming
            newAvailableCyborgs = newAvailableCyborgs - troopSize
            if (newAvailableCyborgs < 0) {
              newOwner = OwnBy.me // change owner
              newAvailableCyborgs = newAvailableCyborgs * -1 // make cyborg count a positive number
            }
          } else { // enemy troops coming
            newAvailableCyborgs = newAvailableCyborgs + troopSize
          }
          break
        case OwnBy.nobody:
          if (event.troopOwner === OwnBy.me) { // my own troops coming
            newAvailableCyborgs = newAvailableCyborgs - troopSize
            if (newAvailableCyborgs < 0) {
              newOwner = OwnBy.me
              newAvailableCyborgs = newAvailableCyborgs * -1
            }
          } else { // enemy troops coming
            newAvailableCyborgs = newAvailableCyborgs - troopSize
            if (newAvailableCyborgs < 0) {
              newOwner = OwnBy.enemy
              newAvailableCyborgs = newAvailableCyborgs * -1
            }
          }
      }
    }
    
    futureFactory = [futureFactory]
      .map( (factory) => ({...factory, availableCyborgs: newAvailableCyborgs}))
      .map( (factory) => ({...factory, owner: newOwner}))
      .map( (factory) => ({...factory, frozenDays: newFrozenDays}))[0]

    previousArrivalDay = arrivalDay
  }

  if (futureFactory.owner !== OwnBy.nobody) {
    let newAvailableCyborgs = futureFactory.availableCyborgs +
      futureFactory.production * Math.max(day - previousArrivalDay - futureFactory.frozenDays, 0)

    futureFactory = ({...futureFactory, availableCyborgs: newAvailableCyborgs})
  }
  
  const newFrozenDays = Math.max(futureFactory.frozenDays - (day - previousArrivalDay), 0)
  futureFactory = {...futureFactory, frozenDays: newFrozenDays}

  return futureFactory
}

const cyborgsAfterBombExplosion = (cyborgCount: number) => {
  const destroyedCyborgs = Math.max(Math.floor(cyborgCount / 2), 10)
  return Math.max(cyborgCount - destroyedCyborgs, 0)
}

export {
  cyborgsAfterBombExplosion,
  getFuture
}